import { useState, useEffect } from "react";
import { getUserData } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function NavBar() {
    const [seen, setSeen] = useState(false);
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserData();
            setUserData(data); 
        };

        fetchUserData(); 
    }, []);
    
    const userImage = userData ? userData.avatar : "https://placehold.net/avatar.svg";

    return (
        <div className="relative w-full h-fit flex justify-between bg-gray-800 backdrop-blur-md border border-gray-700 px-4 py-2">
            <img src="/AppLogo.jpg" alt="Samvaad Logo" className="h-10 w-10 inline-block mr-2" />
            <img src={userImage} onClick={() => setSeen(!seen)} alt="User Icon" className="h-10 w-10 inline-block rounded-full" />
            {seen && (
                <div className="absolute top-1 right-20 w-fit bg-gray-900/60 border border-gray-600 rounded-md shadow-lg text-white overflow-hidden z-50">
                    <ul className="flex flex-row">
                        <li 
                            className="px-4 py-2 hover:bg-gray-800 cursor-pointer" 
                            onClick={() => {
                                setSeen(false);
                                navigate("/chat");
                            }}
                        >
                            Home
                        </li>
                        <li 
                            className="px-4 py-2 hover:bg-gray-800 cursor-pointer" 
                            onClick={() => {
                                setSeen(false);
                                navigate("/profile");
                            }}
                        >
                            Profile
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default NavBar;