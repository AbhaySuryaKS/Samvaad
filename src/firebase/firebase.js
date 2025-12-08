import { v4 as uuid } from "uuid";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, deleteUser, signOut} from "firebase/auth";
import { doc, getFirestore, setDoc, getDoc, updateDoc, onSnapshot, collection, query, where, getDocs, serverTimestamp, arrayUnion } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

async function setupUserDB(user) {
    await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        userId: uuid().replaceAll("-", ""),
        username: user.email.split("@")[0],
        email: user.email,
        name: user.displayName || "Samvaad User",
        avatar: user.photoURL, 
        bio: "Hey, I am using Samvaad!",
        lastSeen: Date.now(),
    });
    await setDoc(doc(db, "userChats", user.uid), {
        chatData: [],
    });
 
}

async function findUserDB(user) {
    const userDocSnap = await getDoc(doc(db, "users", user.uid));
    return userDocSnap.exists();
}

async function login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
}

async function signup(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password);
}

async function resetPassword(email) {
    return await sendPasswordResetEmail(auth, email);
}

async function continueWithGoogle() {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
} 

async function deleteAccount() {
    const user = auth.currentUser;
    return await deleteUser(user);
}

async function logoutUser() {
    await signOut(auth);
}

async function getUserData() {
    const user = getAuth().currentUser;
    if (!user) {
        console.log("No user is logged in.");
        return null; 
    }
    const db = getFirestore();
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        const docData = userDocSnap.data();
        const data = {
            userId: docData.userId,
            name: docData.name,
            avatar: docData.avatar,
            bio: docData.bio,
            username: docData.username,
            email: docData.email,
            lastSeen: docData.lastSeen,
        };
        return data;
    } else {
        await setupUserDB(user);
        return getUserData();
    }
}

async function updateProfile(name, bio, imageUrl) {
    const user = auth.currentUser;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
        name: name,
        bio: bio,
        avatar: imageUrl
    });
}

async function streamUserChats(userId, onChatsUpdate) {
  const chatRef = doc(db, 'userChats', userId);

  const unSub = onSnapshot(chatRef, async (res) => {
    if (!res.exists()) {
      onChatsUpdate([]);
      return;
    }
    const chatItems = res.data().chatData || [];
    const tempData = [];
    for (const item of chatItems) {
      const userRef = doc(db, 'users', item.rId); 
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
          const userData = userSnap.data();
          tempData.push({ ...item, userData });
      } else {
          tempData.push({ ...item, userData: { name: "Deleted User" } });
      }
    }
    const sortedData = tempData.sort((a, b) => b.updatedAt - a.updatedAt);
    onChatsUpdate(sortedData);
  });
  return unSub;
};

async function searchUserFromDB(username, currentUserId) {
    const userRef = collection(db, 'users');
    const q = query(userRef, where("username", "==", username.toLowerCase()));
    const querySnap = await getDocs(q);
    if (!querySnap.empty && querySnap.docs[0].data().id!= currentUserId) {
        return querySnap.docs[0].data();
    } else {
        return null;
    }
};

async function addChatToDB(currentUserId, targetUserId) {
    const chatsRef = collection(db, "userChats");
    const messagesRef = collection(db, "messages");
    const userChatsSnapshot = await getDoc(doc(chatsRef, currentUserId));
    
    if (userChatsSnapshot.exists()) {
        const chatData = userChatsSnapshot.data().chatData || [];
        const existingChat = chatData.find(c => c.rId === targetUserId);
        if (existingChat) {
            return existingChat;
        }
    }
    const newMessageRef = doc(messagesRef);
    await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: []
    });
    const newMessageId = newMessageRef.id;
    await updateDoc(doc(chatsRef, currentUserId), {
        chatData: arrayUnion({
            chatId: newMessageId, 
            lastMessage: "",
            rId: targetUserId,
            updatedAt: Date.now(),
            isUnread: false
        })
    });
    await updateDoc(doc(chatsRef, targetUserId), {
        chatData: arrayUnion({
            chatId: newMessageId, 
            lastMessage: "",
            rId: currentUserId,
            updatedAt: Date.now(),
            isUnread: false
        })
    });
    return {
        chatId: newMessageId, 
        lastMessage: "",
        rId: targetUserId,
        updatedAt: Date.now(),
        isUnread: false,
        userData: { id: targetUserId } 
    };
};

function subscribeToMessages(messagesId, setMessage) {
    if (!messagesId) return () => {}; 

    const messagesDocRef = doc(db, 'messages', messagesId);

    const unsubscribe = onSnapshot(messagesDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setMessage(data.messages); 
        } else {
            setMessage([]);
        }
    }, (error) => {
        return error;
    });

    return unsubscribe;
};

async function sendMessage(currentUserId, otherUserId, messagesId, input, mediaType) {
    if (!input || !messagesId) return; 
    
    const timestamp = Date.now(); 
    
    await updateDoc(doc(db, 'messages', messagesId), {
        messages: arrayUnion({
            senderId: currentUserId,
            text: mediaType ? null : input, 
            mediaURL: mediaType ? input : null, 
            mediaType: mediaType || null,
            createdAt: timestamp
        })
    });
    
    const userIds = [currentUserId, otherUserId];
    const lastMessageText = mediaType ? `[${mediaType.toUpperCase()} sent]` : input.slice(0, 50); 
    
    for (const id of userIds) {
        const userChatsRef = doc(db, 'userChats', id);
        const userChatsSnapShot = await getDoc(userChatsRef);

        if (userChatsSnapShot.exists()) {
            const userChatData = userChatsSnapShot.data();
            
            const chatIndex = userChatData.chatData.findIndex((c) => c.chatId === messagesId); 
            
            if (chatIndex > -1) {
                userChatData.chatData[chatIndex].lastMessage = lastMessageText; 
                userChatData.chatData[chatIndex].updatedAt = timestamp;
                
                userChatData.chatData[chatIndex].isUnread = (id !== currentUserId);
                
                await updateDoc(userChatsRef, {
                    chatData: userChatData.chatData
                });
            }
        }
    }
}

export { app, 
    auth, 
    deleteAccount, 
    getAuth, 
    signup, 
    login, 
    resetPassword, 
    continueWithGoogle, 
    setupUserDB, 
    findUserDB, 
    onAuthStateChanged,
    getUserData, 
    logoutUser, 
    updateProfile, 
    streamUserChats, 
    searchUserFromDB,
    addChatToDB,
    subscribeToMessages,
    sendMessage 
};