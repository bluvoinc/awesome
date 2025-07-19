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
                stroke="#0FB8F9"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
            />
            <circle r={5} fill="#0FB8F9">
                <animateMotion dur="2s" repeatCount="indefinite">
                    <mpath xlinkHref={`#${id}`} />
                </animateMotion>
            </circle>
        </g>
    );
}
