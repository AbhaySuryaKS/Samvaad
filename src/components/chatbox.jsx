import React, { useEffect, useState, useRef } from "react";
import { getUserData, sendMessage, subscribeToMessages } from "../firebase/firebase";
import { toast } from "react-toastify";
import uploadMedia from "../../cloudinary/cloudinary"; 
import MediaDisplay from "./mediaDisplay"; 
import ChatterProfile from "../components/chatterProfile"; 

function Chatbox({ chatUser, onBack , userData, messagesId, messages, setMessage}) {
    const [input ,setInput] = useState('');
    const [me,setMe] = useState(null);
    const [showChatterProfile, setShowChatterProfile] = useState(false);
    const messagesEndRef = useRef(null);

    const otherUser = chatUser?.userData || { name: "User", avatar: null, id: null };
    const currentUserId = userData?.uid || userData?.id; 
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const convertTimeStamp = (timeStamp) => {
        if (!timeStamp || !timeStamp.toDate) return "";

        const date = timeStamp.toDate(); 
        const h = date.getHours();
        const m = date.getMinutes();
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedH = h % 12 || 12; 
        const formattedM = m < 10 ? '0' + m : m;

        return `${formattedH}:${formattedM} ${ampm}`;
    }
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData(currentUserId); 
                setMe(data); 
            } catch (error) {
                console.error("Error fetching current user data:", error);
            }
        };

        if (currentUserId) {
            fetchUserData(); 
        }
    }, [currentUserId]); 
    
    useEffect(() => {
        if(messagesId) {
            const unSub = subscribeToMessages(messagesId, setMessage);
            return () => unSub();
        }
    },[messagesId, setMessage]) 
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async() => {
        const text = input.trim();
        if (!text) return;

        try {
            await sendMessage(currentUserId, otherUser.id, messagesId, text, null);
            setInput(''); 
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Error sending message. Try again!");
        }
    }
    
    const sendMedia = async (e) => {
        const file = e.target.files[0]; 
        if (!file) return;

        let typeToSend;
        const mimeType = file.type;

        if (mimeType.startsWith('image/')) {
            typeToSend = 'image';
        } else if (mimeType.startsWith('video/')) {
            typeToSend = 'video';
        } else {
            typeToSend = 'raw'; 
        }
        
        try {
            const mediaurl = await uploadMedia(file, typeToSend);
            if (mediaurl) {
                await sendMessage(currentUserId, otherUser.id, messagesId, mediaurl, typeToSend);
            }
            e.target.value = null; 
            
        } catch(error) {
            console.error("Error sending media:", error);
            toast.error("Error sending Media. Try again!");
            e.target.value = null;
        }
    };

    return (
        <div className="flex flex-col h-full w-full rounded-xl overflow-hidden gap-2">
            <div 
                className="flex items-center p-4  h-16 cursor-pointer border border-gray-700 shrink-0 shadow-inner rounded-2xl"
                onClick={() => setShowChatterProfile(true)} 
            >
                <button 
                    onClick={(e) => {e.stopPropagation(); onBack();}} 
                    className="mr-3 text-gray-300 hover:text-white md:hidden p-1 hover:bg-gray-800 rounded-full transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5m7-7l-7 7 7 7" />
                    </svg>
                </button>
                <img
                    src={otherUser.avatar || `https://placehold.co/40x40/555/FFF?text=${otherUser.name?.[0] || "U"}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-600"
                />
                <h2 className="text-lg font-semibold text-white">{otherUser.name || "Chat"}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 border border-gray-700 shrink-0 shadow-inner rounded-2xl scrollbar-hide">
                {messages && messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const isSender = msg.senderId === currentUserId;
                        const msgAvatar = isSender ? me?.avatar : otherUser.avatar;
                        const avatarPlaceholder = `https://placehold.co/32x32/555/FFF?text=${isSender ? (me?.username?.[0] || "M") : (otherUser.name?.[0] || "U")}`;

                        return (
                            <div 
                                key={msg.id || index} 
                                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="flex items-end max-w-[75%]">
                                    {!isSender && (
                                        <img 
                                            className="w-8 h-8 rounded-full object-cover mr-2 shrink-0"
                                            src={msgAvatar || avatarPlaceholder} 
                                            alt="user pfp" 
                                        />
                                    )}
                                    <div 
                                        className={`${isSender ? 'bg-blue-700 rounded-br-none' : 'bg-teal-500 rounded-bl-none'} 
                                            p-3 max-w-full text-white text-sm md:text-base rounded-xl flex flex-col space-y-2`}
                                    >
                                        {msg.mediaURL && msg.mediaType && (
                                            <div className={`${msg.text ? "pb-0.5" : ""} border-b ${msg.text ? 'border-indigo-400/20' : 'border-none'}`}> 
                                                <MediaDisplay url={msg.mediaURL} type={msg.mediaType} />
                                            </div>
                                        )}
                                        {msg.text && (
                                            <p>
                                                {msg.text}
                                            </p>
                                        )}
                                        <div className={`text-[10px] opacity-70 pt-1 ${isSender ? 'text-right' : 'text-left'}`}>
                                            {msg.createdAt ? convertTimeStamp(msg.createdAt) : "Sending..."}
                                        </div>
                                    </div> 
                                    {isSender && (
                                        <img 
                                            className="w-8 h-8 rounded-full object-cover ml-2 shrink-0"
                                            src={msgAvatar || avatarPlaceholder} 
                                            alt="user pfp" 
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">Start the conversation!</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border border-gray-700 shrink-0 shadow-inner rounded-2xl">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 p-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer p-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.2a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                    </label>
                    <input 
                        type="file" 
                        id="file-upload" 
                        accept="image/*,video/*,application/pdf" 
                        onChange={sendMedia}
                        className="hidden"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
            {showChatterProfile && (
                <ChatterProfile 
                    chatterData={otherUser} 
                    onClose={() => setShowChatterProfile(false)} 
                />
            )}
        </div>
    );
}

export default Chatbox;