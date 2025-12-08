import { Navigate, Route, Router, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AuthPage from "./pages/authPage.jsx";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./routes/protectedRoute.jsx";
import RedirectIfAuth from "./routes/redirectifAuth.jsx";
function App() {
    return (
        <>
            <ToastContainer />
            <Routes>
                <Route 
                    path='/chat' 
                    element={
                        <ProtectedRoute>
                            <ChatPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path='/profile' 
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path='/auth' 
                    element={
                        <RedirectIfAuth>
                            <AuthPage />
                        </RedirectIfAuth>
                    } 
                />
                <Route path='*' element={<Navigate to="/chat"/> } />
                <Route path='/' element={<Navigate to="/chat"/> } />
            </Routes>
        </>
    )
}

export default App
