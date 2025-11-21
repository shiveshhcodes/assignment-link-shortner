import React from 'react';


const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                &copy; {new Date().getFullYear()} TinyLink. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
