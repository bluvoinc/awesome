// InvisibleNode.jsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function InvisibleNode() {
    return (
        <div style={{ 
            width: 1, 
            height: 1, 
            opacity: 0, 
            pointerEvents: 'none' 
        }}>
            <Handle type="target" position={Position.Top} id="top" style={{ opacity: 0 }} />
            <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
            <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
            <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
        </div>
    );
}