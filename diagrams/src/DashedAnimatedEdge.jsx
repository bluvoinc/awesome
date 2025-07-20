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
                strokeDasharray="8,4"
                opacity={0.6}
            >
                <animate
                    attributeName="stroke-dashoffset"
                    values="0;12"
                    dur="0.5s"
                    repeatCount="indefinite"
                />
            </path>
        </g>
    );
}