// AnimatedSVGEdge.jsx
import React from 'react';
import { getBezierPath } from '@xyflow/react';

export function AnimatedSVGEdge({
                                    id,
                                    sourceX,
                                    sourceY,
                                    sourcePosition,
                                    targetX,
                                    targetY,
                                    targetPosition,
                                    data,
                                }) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // Use color from data prop or default blue
    const edgeColor = data?.color || '#0FB8F9';
    const strokeColor = `rgba(${parseInt(edgeColor.slice(1, 3), 16)}, ${parseInt(edgeColor.slice(3, 5), 16)}, ${parseInt(edgeColor.slice(5, 7), 16)}, 0.75)`;
    const fillColor = `rgba(${parseInt(edgeColor.slice(1, 3), 16)}, ${parseInt(edgeColor.slice(3, 5), 16)}, ${parseInt(edgeColor.slice(5, 7), 16)}, 0.2)`;

    return (
        <g className="animated-edge">
            <path
                id={id}
                d={edgePath}
                fill="none"
                stroke={fillColor}
                strokeWidth={3}
            />
            <circle r={5} fill={strokeColor}>
                <animateMotion dur="2s" repeatCount="indefinite">
                    <mpath xlinkHref={`#${id}`} />
                </animateMotion>
            </circle>
        </g>
    );
}
