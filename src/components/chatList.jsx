import React, { useEffect, useState } from "react";
import { streamUserChats, searchUserFromDB, addChatToDB } from "../firebase/firebase";
import { toast } from "react-toastify";

function ChatList({ currentUser, onSelectChat }) {
    
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            return streamUserChats(currentUser.uid, (data) => {
                setChats(data);
                setLoading(false);
            });
        }
    }, [currentUser]);

    const handleSearch = async (e) => {
        try {
            const searchUser = e.target.value;
            if (searchUser.trim()) {
                setShowSearch(true);
                const res = await searchUserFromDB(searchUser, currentUser.uid);
                
                if (res) {
                    setUser(res);
                } else {
                    setUser(null);
                }
            } else {
                setShowSearch(false);
                setUser(null);
            }
        } catch {
            setShowSearch(false);
            setUser(null);
        }
    };
    
    const handleAddChat = async () => {
        if (!user || !currentUser) return;
        
        try {
            const newChatData = await addChatToDB(currentUser.uid, user.id);
            onSelectChat({ ...newChatData, userData: user });
            
            setUser(null);
            setShowSearch(false);
        } catch(error) {
            console.error("Error adding chat:", error);
            toast.error("Error adding chat");
        }
    }

    return (
        <div className="flex flex-col h-full w-full bg-gray-950 shadow-xl">
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search username..."
                    onChange={handleSearch}
                    className="w-full p-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {loading ? (
                    <div className="p-4 text-center text-gray-500">Loading chats...</div>
                ) : showSearch ? (
                    <div className="p-4">
                        {user ? (
                            <div 
                                className="flex items-center gap-4 p-4 bg-gray-950 rounded-xl cursor-pointer hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                onClick={handleAddChat}
                            >
                                <img 
                                    src={user.avatar || "https://placehold.co/50x50/1f2937/d1d5db?text=U"} 
                                    alt='User pfp' 
                                    className="w-12 h-12 rounded-full object-cover border border-indigo-500"
                                />
                                <div>
                                    <p className="font-semibold text-white">{user.username}</p>
                                    <span className="text-sm text-indigo-400">Click to start a new message</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 mt-4">User not found</div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col scrollbar-hide gap-1 p-1">
                        {chats.length > 0 ? (
                            chats.map((chat) => (
                                <div 
                                    key={chat.chatId} 
                                    onClick={() => onSelectChat(chat)}
                                    className="flex items-center gap-4 p-4 border border-gray-700 shrink-0 shadow-inner rounded-2xl hover:bg-gray-800 cursor-pointer transition-all duration-200"
                                >
                                    <img 
                                        src={chat.userData?.avatar || "https://placehold.co/50x50/1f2937/d1d5db?text=U"} 
                                        alt="Avatar"
                                        className="w-12 h-12 rounded-full object-cover border border-gray-700"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <p className="font-semibold text-white truncate">
                                                {chat.userData?.name || chat.userData?.username}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-400 truncate mt-0.5">
                                            {chat.lastMessage || "Start a conversation"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">No recent chats. Search to connect!</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatList;