import { useState } from "react";
import { continueWithGoogle, findUserDB, login, setupUserDB, signup, resetPassword, deleteAccount } from "../firebase/firebase";
import { formatFirebaseMessage } from "../firebase/firebaseError";
import { toast } from "react-toastify";

function AuthPage() {
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === "login") {
                await login(email, password);
                toast.success("Login successful");
            } else if (mode === "signup") {
                if (password !== confirmPassword) {
                    toast.error("Passwords do not match");
                    setLoading(false);
                    return;
                }
                const user = await signup(email, password).user;
                await setupUserDB(user);
                toast.success("Account created successfully");
            } else if (mode === "forgot") {
                await resetPassword(email);
                toast.success("Password reset email sent successfully");
            }
        } catch (err) {
            await deleteAccount();
            toast.error(formatFirebaseMessage(err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const user = (await continueWithGoogle()).user;
            const exists = await findUserDB(user);
            if (!exists) {
                await setupUserDB(user);
                toast.success("Account created successfully");
            } else {
                toast.success("Login successful");
            }
        } catch (err) {
            await deleteAccount();
            toast.error(formatFirebaseMessage(err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-black text-gray-100 px-4">
            <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-8 space-y-4">
                <div>
                    <img src="/AppLogo.jpg" alt="Samvaad Logo" className="w-16 h-16 mx-auto" />
                    <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">
                        Samvaad
                    </h1>
                </div>
                <div>
                    {mode === "login" && ( <h2 className="text-2xl font-extrabold text-center text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">Welcome Back!</h2> )}
                    {mode === "signup" && ( <h2 className="text-2xl font-extrabold text-center text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">Create a new account</h2> )}
                    {mode === "forgot" && ( <h2 className="text-2xl font-extrabold text-center text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">Reset your password</h2> )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                    />
        
                    {mode !== "forgot" && (
                        <>
                            {mode === "login" ? (
                                <div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your password"
                                    />
                                    <div className="text-right mt-2">
                                        <button
                                          type="button"
                                          onClick={() => setMode("forgot")}
                                          className="text-sm text-blue-400 hover:text-blue-300"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-4">
                                  <input
                                      type="password"
                                      required
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Password"
                                  />
                                  <input
                                      type="password"
                                      required
                                      value={confirmPassword}
                                      onChange={(e) => setConfirmPassword(e.target.value)}
                                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Confirm Password"
                                  />
                              </div>
                            )}
                        </>
                    )}
        
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 font-semibold rounded-md bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md transition-all disabled:opacity-50"
                    >
                      {loading
                          ? "Processing..."
                          : mode === "login"
                          ? "Login"
                          : mode === "signup"
                          ? "Create Account"
                          : "Send Reset Link"}
                    </button>
                </form>
      
                {mode !== "forgot" && (
                    <>
                        <div className="flex items-center gap-2 my-4">
                            <div className="grow h-px bg-gray-700"></div>
                            <span className="text-sm text-gray-400">or</span>
                            <div className="grow h-px bg-gray-700"></div>
                        </div>
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 w-full py-2 border border-gray-600 bg-gray-700/50 hover:bg-gray-700 rounded-md text-gray-100 font-medium transition-all disabled:opacity-50"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6" />
                            Continue with Google
                        </button>
                    </>
                )}
      
                {mode === "login" && (
                    <p className="text-center text-sm text-gray-400 mt-4">
                        Don{"'"}t have an account?
                        <button
                            onClick={() => setMode("signup")}
                            className="text-blue-400 hover:text-blue-300 ml-1"
                        >
                            Sign up
                        </button>
                    </p>
                )}
                {mode === "signup" && (
                    <p className="text-center text-sm text-gray-400 mt-4">
                        Already have an account?
                        <button
                          onClick={() => setMode("login")}
                          className="text-blue-400 hover:text-blue-300 ml-1"
                        >
                            Login
                        </button>
                    </p>
                )}
                {mode === "forgot" && (
                    <p className="text-center text-sm text-gray-400 mt-4">
                        Do you remember your password?
                        <button
                            onClick={() => setMode("login")}
                            className="text-blue-400 hover:text-blue-300 ml-1"
                        >
                            Login
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
}

export default AuthPage;