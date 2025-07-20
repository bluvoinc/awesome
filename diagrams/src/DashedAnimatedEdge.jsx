// DashedAnimatedEdge.jsx
import React from 'react';
import { getStraightPath } from '@xyflow/react';

export function DashedAnimatedEdge({
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    data,
}) {
    const [edgePath] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    const edgeColor = data?.color || '#4A5568';

    return (
        <g className="dashed-animated-edge">
            <path
                id={id}
                d={edgePath}
                fill="none"
                stroke={edgeColor}
                strokeWidth={2}
                strokeDasharray="8,8" // 8px dash, 8px gap
                opacity={0.6}
            >
                <animate
                    attributeName="stroke-dashoffset"
                    values="0;-16" // 8 + 8
                    dur="1s"
                    repeatCount="indefinite"
                />
            </path>
        </g>
    );
}