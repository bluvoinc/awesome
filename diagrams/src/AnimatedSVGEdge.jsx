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

    // Check if animation should be reversed
    const isReverse = data?.reverse === true;
    // Check if this is an error edge
    const isError = data?.error === true;
    // Get speed factor (default 1 if undefined)
    const speed = data?.speed || 1;
    // Calculate animation duration (base duration 1s divided by speed factor)
    const animationDuration = `${1 / speed}s`;

    return (
        <g className="animated-edge">
            <path
                id={id}
                d={edgePath}
                fill="none"
                stroke={fillColor}
                strokeWidth={3}
            />
            {isError ? (
                // Red X marker for error edges
                <g fill="#EF4444">
                    <animateMotion 
                        dur={animationDuration}
                        repeatCount="indefinite"
                        keyTimes={isReverse ? "0;1" : "0;1"}
                        keyPoints={isReverse ? "1;0" : "0;1"}
                    >
                        <mpath xlinkHref={`#${id}`} />
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="0;360"
                            dur={animationDuration}
                            repeatCount="indefinite"
                        />
                    </animateMotion>
                    {/* X shape made of two lines (2x bigger) */}
                    <line x1="-8" y1="-8" x2="8" y2="8" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                    <line x1="-8" y1="8" x2="8" y2="-8" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                </g>
            ) : (
                // Normal circle marker
                <circle r={5} fill={strokeColor}>
                    <animateMotion 
                        dur={animationDuration} 
                        repeatCount="indefinite"
                        keyTimes={isReverse ? "0;1" : "0;1"}
                        keyPoints={isReverse ? "1;0" : "0;1"}
                    >
                        <mpath xlinkHref={`#${id}`} />
                    </animateMotion>
                </circle>
            )}
        </g>
    );
}
