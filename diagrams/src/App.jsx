import React, { useEffect, useRef } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Background,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import IconNode from './IconNode';
import InvisibleNode from './InvisibleNode';
import TitleNode from './TitleNode';
import { AnimatedSVGEdge } from './AnimatedSVGEdge';
import { DashedAnimatedEdge } from './DashedAnimatedEdge';
import { initialEdges, initialNodes } from "./example-diagram-cex-2.js";
import { updateEdgesWithOptimalHandles } from './handleUtils.js';

const edgeTypes = { 
    animatedSVG: AnimatedSVGEdge,
    dashedAnimated: DashedAnimatedEdge 
};

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    
    const nodeTypes = { 
        icon: (props) => <IconNode {...props} edges={edges} />,
        invisible: InvisibleNode,
        title: TitleNode
    };
    const nodesRef = useRef(nodes);

    // Keep ref up to date with latest nodes
    useEffect(() => {
        nodesRef.current = nodes;
    }, [nodes]);

    // Update edges with optimal handles when nodes change position
    useEffect(() => {
        const updatedEdges = updateEdgesWithOptimalHandles(edges, nodes);
        // Only update if there are actual changes to prevent infinite loops
        const hasChanges = updatedEdges.some((edge, index) => {
            const currentEdge = edges[index];
            return edge.sourceHandle !== currentEdge.sourceHandle || 
                   edge.targetHandle !== currentEdge.targetHandle;
        });
        
        if (hasChanges) {
            setEdges(updatedEdges);
        }
    }, [nodes, setEdges]); // Removed edges from dependencies to prevent loops

    // Log current node positions every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            const snapshot = nodesRef.current.map(({ id, position, type }) => ({ id, position, type }));
            console.log('initialNodes =', JSON.stringify(snapshot, null, 2));
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const onConnect = (params) => {
        const newEdge = { ...params, type: 'animatedSVG' };
        // Calculate optimal handles for the new connection
        const sourceNode = nodes.find(n => n.id === params.source);
        const targetNode = nodes.find(n => n.id === params.target);
        if (sourceNode && targetNode) {
            const updatedEdgesWithNew = updateEdgesWithOptimalHandles([...edges, newEdge], nodes);
            const optimizedNewEdge = updatedEdgesWithNew[updatedEdgesWithNew.length - 1];
            setEdges((eds) => addEdge(optimizedNewEdge, eds));
        } else {
            setEdges((eds) => addEdge(newEdge, eds));
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
            {/* SVG definitions for arrowheads */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <marker
                        id="arrowhead"
                        markerUnits="strokeWidth"
                        markerWidth="6"
                        markerHeight="6"
                        refX="5"
                        refY="2.5"
                        orient="auto"
                    >
                        <path d="M0,0 L0,5 L5,2.5 Z" fill="rgba(15, 184, 249, 0.8)" />
                    </marker>

                </defs>
            </svg>
            
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background color="rgba(72, 84, 96,0.8)" gap={20} />
            </ReactFlow>
        </div>
    );
}
