import React, { useState, useEffect } from "react";
import NavBar from "../components/navBar";
import ChatList from "../components/chatList";
import Chatbox from "../components/chatbox";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100">
                <div className="relative flex justify-center items-center w-24 h-24">
                    <div className="absolute w-full h-full animate-spin-slow">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full blur-md"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-500 rounded-full blur-md"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full blur-md"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-sky-500 rounded-full blur-md"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-linear-to-br from-gray-900 via-gray-900 to-black text-gray-100 z-0"> 
            <NavBar />
            
            <div className="flex flex-1 overflow-hidden relative">
                <div className={`
                    ${selectedChat ? 'hidden' : 'flex'} 
                    md:flex md:w-1/3 lg:w-1/4 
                    w-full flex-col bg-gray-950 backdrop-blur-sm
                `}>
                    <ChatList 
                        currentUser={currentUser} 
                        onSelectChat={(chat) => {
                            setSelectedChat(chat);
                            setMessages([]);
                        }} 
                    />
                </div>
                <div className={`
                    ${selectedChat ? 'flex' : 'hidden'} 
                    md:flex flex-1 flex-col bg-gray-950
                    p-1
                `}>
                    {selectedChat ? (
                        <Chatbox 
                            chatUser={selectedChat} 
                            userData={currentUser} 
                            onBack={() => {
                                setSelectedChat(null);
                                setMessages([]); 
                            }} 
                            messagesId={selectedChat.chatId} 
                            messages={messages}
                            setMessage={setMessages}
                        />
                    ) : (
                        <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-100">
                            <p className="text-xl font-semibold">Select a chat to start messaging</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}