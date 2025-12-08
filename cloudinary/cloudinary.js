async function uploadMedia(preview, mediaType) {
    const cloudinaryFolder = mediaType === 'raw' ? 'raw' : mediaType; 

    const formData = new FormData();
    formData.append("file", preview);
    formData.append("upload_preset", "Samvaad");
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/dp3slbcng/${cloudinaryFolder}/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    
    if (data.secure_url) {
        return data.secure_url;
    } else {
        console.error("Cloudinary upload failed:", data);
        throw new Error("Cloudinary upload failed.");
    }
}

export default uploadMedia;