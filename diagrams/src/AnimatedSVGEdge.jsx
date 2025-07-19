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
                                }) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <g className="animated-edge">
            <path
                id={id}
                d={edgePath}
                fill="none"
                stroke="rgba(15, 184, 249, 0.2)"
                strokeWidth={3}
            />
            <circle r={5} fill="rgba(15, 184, 249, 1)">
                <animateMotion dur="2s" repeatCount="indefinite">
                    <mpath xlinkHref={`#${id}`} />
                </animateMotion>
            </circle>
        </g>
    );
}
