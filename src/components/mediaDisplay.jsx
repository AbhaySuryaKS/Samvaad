import React from 'react';

function MediaDisplay({ url, type }) {
    if (!url || !type) return null;

    if (type === 'image') {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="block max-w-full">
                <img 
                    src={url} 
                    alt="Chat media" 
                    className="max-w-full max-h-64 w-auto h-auto rounded-lg object-contain cursor-pointer transition-transform hover:scale-[1.01]" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/256x256/FF0000/FFFFFF?text=Image+Load+Error"; }}
                />
            </a>
        );
    }
    
    if (type === 'video') {
        return (
            <video 
                src={url} 
                controls 
                className="max-w-full max-h-96 w-full rounded-lg bg-black"
            >
                Your browser does not support the video tag.
            </video>
        );
    }

    if (type === 'raw') {
        return (
            <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors bg-gray-600/50 p-1 rounded-lg w-full"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                <span className="truncate text-sm font-medium">Download File: {url.substring(url.lastIndexOf('/') + 1)}</span>
            </a>
        );
    }

    return null;
}

export default MediaDisplay;