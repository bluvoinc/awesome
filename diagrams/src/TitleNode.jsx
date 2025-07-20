// TitleNode.jsx
import React from 'react';

export default function TitleNode({ data }) {
    return (
        <div style={{
            background: 'transparent',
            color: '#EDF2F7',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            background: 'rgba(26, 32, 44, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            pointerEvents: 'none',
        }}>
            {data.label}
        </div>
    );
}