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
import { AnimatedSVGEdge } from './AnimatedSVGEdge';
import {initialEdges, initialNodes} from "./example-diagram-cex-1.js";

const nodeTypes = { icon: IconNode };
const edgeTypes = { animatedSVG: AnimatedSVGEdge };

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const nodesRef = useRef(nodes);

    // Keep ref up to date with latest nodes
    useEffect(() => {
        nodesRef.current = nodes;
    }, [nodes]);

    // Log current node positions every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            const snapshot = nodesRef.current.map(({ id, position, type }) => ({ id, position, type }));
            console.log('initialNodes =', JSON.stringify(snapshot, null, 2));
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const onConnect = (params) =>
        setEdges((eds) => addEdge({ ...params, type: 'animatedSVG' }, eds));

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
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
