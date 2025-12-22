import React, { useEffect, useState } from 'react';
import NavBar from '../components/navBar';
import { getUserData, logoutUser, updateProfile, deleteAccount } from '../firebase/firebase';
import { toast } from 'react-toastify';
import uploadMedia from '../../cloudinary/cloudinary';

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userImage, setUserImage] = useState(null);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [Username, setUsername] = useState("");
    const [UserId, setUserId] = useState("");
    const [fileToUpload, setFileToUpload] = useState(null); 
    const [previewURL, setPreviewURL] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData();
                if (data) {
                    setUserData(data);
                    setUserImage(data.avatar || null);
                    setName(data.name || "");
                    setBio(data.bio || "");
                    setEmail(data.email || "");
                    setUsername(data.username || "");
                    setUserId(data.userId || "");
                }
            } catch {
                toast.error("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const logoutUserAccount = async () => {
        try {
            await logoutUser();
            toast.success("LoggedOut Successfully.");
        } catch {
            toast.error("Error Loggingout.");
        }
    }

    const deleteUserAccount = async () => {
        try {
            await deleteAccount();
            toast.success("Account Deleted Successfully.");
            setTimeout(() => window.location.reload(), 2000);
        } catch {
            toast.error("Error Deleting Account!\nTry again after logout and login.");
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileToUpload(file);
            setPreviewURL(URL.createObjectURL(file));
        } else {
            setFileToUpload(null);
            setPreviewURL(null);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const finalName = name.trim();
        if (!userData) {
            toast.error("No user found.");
            return;
        }
        if (!finalName) {
            toast.error("Name cannot be empty.");
            return;
        }
        
        try {
            let imageUrl = userImage;
            
            if (fileToUpload) {
                imageUrl = await uploadMedia(fileToUpload, 'image');
            }
            
            await updateProfile(name, bio, imageUrl);
            setUserImage(imageUrl); 
            setFileToUpload(null);
            setPreviewURL(null); 

            toast.success("Profile updated successfully!");
            setTimeout(() => window.location.reload(), 2000); 
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong with the update or image upload!");
        }
    };

    if (loading) {
        return (
            <>
                <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100">
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
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <div className='flex justify-center items-center min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-black text-gray-100 p-4'>
                <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-2xl">
                    <form onSubmit={handleUpdate} className='flex flex-col gap-6'>
                        
                        <div className="relative w-28 h-28 self-center">
                            <img
                                src={previewURL || userImage || "https://placehold.co/112x112/2d3748/a0aec0?text=Avatar"}
                                alt="Profile Avatar"
                                className="w-28 h-28 object-cover rounded-full border-4 border-indigo-600 shadow-lg"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/112x112/2d3748/a0aec0?text=Avatar"; }}
                            />
                            <label
                                htmlFor="photo"
                                className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-full cursor-pointer border-2 border-gray-800 hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                title="Change Photo"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                                <input
                                    type="file"
                                    id="photo"
                                    accept="image/*"
                                    onChange={handleFileChange} 
                                    className="hidden"
                                />
                            </label>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-700 p-3 rounded-lg overflow-hidden text-ellipsis">
                                <span className="font-semibold text-gray-400">Username: </span> {Username}
                            </div>
                            <div className="bg-gray-700 p-3 rounded-lg overflow-hidden text-ellipsis">
                                <span className="font-semibold text-gray-400">Email: </span> {email}
                            </div>
                            <div className="bg-gray-700 p-3 rounded-lg col-span-1 md:col-span-2 overflow-hidden text-ellipsis">
                                <span className="font-semibold text-gray-400">User ID: </span> {UserId}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="font-semibold">Name</label>
                            <input
                                id="name"
                                type="text"
                                className='w-full bg-gray-700 text-white p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="bio" className="font-semibold">Bio</label>
                            <textarea
                                id="bio"
                                value={bio}
                                placeholder='Tell us about yourself...'
                                className='w-full min-h-3 bg-gray-700 text-white p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
                        >
                            Update Profile
                        </button>
                    </form>

                    <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col gap-4">
                        <button 
                            onClick={logoutUserAccount} 
                            className='w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors'
                        >
                            Logout
                        </button>
                        
                        <div className="mt-4 text-center">
                            <p className="text-sm text-red-400 mb-4">
                                Warning: Deleting your account is permanent and cannot be undone.
                            </p>
                            <button 
                                onClick={deleteUserAccount} 
                                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage;
