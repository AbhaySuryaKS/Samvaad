export function formatFirebaseMessage(message = "") {
    if (!message) return "Something went wrong.";
    const msg = message.toLowerCase();
    if (msg.includes("auth/invalid-email")) 
        return "The email address is not valid.";
    if (msg.includes("auth/email-already-in-use")) 
        return "This email is already registered.";
    if (msg.includes("auth/user-not-found")) 
        return "No account found with this email.";
    if (msg.includes("auth/wrong-password")) 
        return "Incorrect password. Try again.";
    if (msg.includes("auth/invalid-credential"))
        return "Invalid email or password.";
    if (msg.includes("auth/missing-password"))
        return "Please enter your password.";
    if (msg.includes("auth/weak-password"))
        return "Your password is too weak. Use at least 6 characters.";
    if (msg.includes("auth/network-request-failed"))
        return "Network error. Check your internet connection.";
    if (msg.includes("auth/popup-closed-by-user"))
        return "Google sign-in was closed before completion.";
    if (msg.includes("auth/popup-blocked"))
        return "Popup blocked. Allow popups for this site.";
    if (msg.includes("auth/too-many-requests"))
        return "Too many attempts. Try again later.";
    return "Something went wrong. Please try again.";
}
