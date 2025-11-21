import React, { useState } from 'react';


interface CopyButtonProps {
    textToCopy: string;
    label?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, label = 'Copy' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
            onClick={handleCopy}
            aria-label={copied ? 'Copied to clipboard' : `Copy ${textToCopy} to clipboard`}
        >
            {copied ? 'Copied!' : label}
        </button>
    );
};

export default CopyButton;
