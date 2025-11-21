import React from 'react';

export default function Home() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1>TinyLink Backend</h1>
                <p>API is running on port 8000</p>
                <p><a href="/healthz">Health Check</a></p>
            </div>
        </div>
    );
}
