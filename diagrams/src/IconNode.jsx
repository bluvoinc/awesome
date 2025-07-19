// IconNode.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Handle, Position } from '@xyflow/react';
import {Icon_map, ICON_TITLES} from "./icon_map.jsx";

export default function IconNode({ id }) {
    return (
        <>
            {/* Top and Bottom Handles */}
            <Handle type="target" position={Position.Top}    id="top"    style={{ background: '#0FB8F9' }} />
            <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#0FB8F9' }} />

            {/* Left and Right Handles */}
            <Handle type="target" position={Position.Left}  id="left"  style={{ background: '#0FB8F9' }} />
            <Handle type="source" position={Position.Right} id="right" style={{ background: '#0FB8F9' }} />

            {/* Node Content */}
            <div className="flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1,   opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: '#1A202C', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                        border: '2px solid #0FB8F9',
                    }}
                >
                    {Icon_map[id]}
                </motion.div>
                <span style={{ color: '#EDF2F7', marginTop: 4 }}>
          {ICON_TITLES[id]}
        </span>
            </div>
        </>
    );
}
