// IconNode.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Handle, Position } from '@xyflow/react';
import {Icon_map, ICON_TITLES} from "./icon_map.jsx";

export default function IconNode({ id, edges, data }) {
    // Calculate which handles have connections
    const connectedHandles = new Set();
    
    if (edges) {
        edges.forEach(edge => {
            if (edge.source === id) {
                connectedHandles.add(edge.sourceHandle);
            }
            if (edge.target === id) {
                connectedHandles.add(edge.targetHandle);
            }
        });
    }
    
    // Use color from data prop or fallback to default colors
    const getNodeColors = (nodeId, nodeData) => {
        if (nodeData?.color) {
            return {
                border: nodeData.color,
                handle: nodeData.color
            };
        }
        
        // Fallback to legacy behavior
        // if (nodeId.includes('success')) {
        //     return {
        //         border: '#10B981', // green-500
        //         handle: '#10B981'
        //     };
        // } else if (nodeId.includes('failure')) {
        //     return {
        //         border: '#EF4444', // red-500
        //         handle: '#EF4444'
        //     };
        // }
        return {
            border: '#0FB8F9', // default blue
            handle: '#0FB8F9'
        };
    };
    
    const colors = getNodeColors(id, data);
    return (
        <>
            {/* Top and Bottom Handles */}
            <Handle type="target" position={Position.Top}    id="top"    style={{ background: colors.handle, opacity: connectedHandles.has('top') ? 1 : 0 }} />
            <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: colors.handle, opacity: connectedHandles.has('bottom') ? 1 : 0 }} />

            {/* Left and Right Handles */}
            <Handle type="target" position={Position.Left}  id="left"  style={{ background: colors.handle, opacity: connectedHandles.has('left') ? 1 : 0 }} />
            <Handle type="source" position={Position.Right} id="right" style={{ background: colors.handle, opacity: connectedHandles.has('right') ? 1 : 0 }} />

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
                        boxShadow: '0 4px 12px rgba(0,0,0,0.85)',
                        border: `2px solid ${colors.border}`,
                    }}
                >
                    {Icon_map[id]}
                </motion.div>
                <span style={{ color: '#EDF2F7', marginTop: 4, position:'absolute', fontSize: 14, textAlign: 'center' }}>
                    {ICON_TITLES[id]}
                </span>
            </div>
        </>
    );
}
