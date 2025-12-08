import React from 'react';

function ChatterProfile({ chatterData, onClose }) {
    if (!chatterData || !chatterData.id) return null;

    const { username, name, bio, avatar, id } = chatterData;

    return (
        <div className="fixed inset-0 z-50 bg-gray-950 backdrop-blur-sm flex justify-end transition-opacity duration-300">
            <div className="w-full md:w-96 bg-gray-950 h-full shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out translate-x-0">
                <div className="p-4 flex justify-between items-center border-b border-gray-700 bg-gray-950 sticky top-0">
                    <h2 className="text-xl font-bold text-white">Profile Details</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-100 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                        title="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center text-center">
                    <img
                        src={avatar || `https://placehold.co/120x120/1f2937/d1d5db?text=${name?.[0] || "U"}`}
                        alt={`${username}'s avatar`}
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-xl mb-4"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/120x120/1f2937/d1d5db?text=U"; }}
                    />
                    <p className="text-2xl font-bold text-white">{name || username}</p>
                    <p className="text-sm text-indigo-400 mb-6">@{username}</p>
                    <div className="w-full bg-gray-900 p-4 rounded-xl shadow-inner text-left mb-6">
                        <h3 className="text-md font-semibold text-gray-400 mb-2">Bio</h3>
                        <p className="text-gray-300 text-sm italic">{bio || "This user hasn't set a bio yet."}</p>
                    </div>
                    <div className="w-full bg-gray-900 p-4 rounded-xl shadow-inner text-left mb-6">
                        <h3 className="text-md font-semibold text-gray-400 mb-2">User ID:</h3> 
                        <p className="text-gray-300 text-sm italic">{id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatterProfile;