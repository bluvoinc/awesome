// handleUtils.js - Smart handle selection for optimal edge routing

/**
 * Calculate the best source and target handles for two nodes based on their positions
 * @param {Object} sourceNode - Source node with position
 * @param {Object} targetNode - Target node with position  
 * @returns {Object} - { sourceHandle, targetHandle }
 */
export function calculateOptimalHandles(sourceNode, targetNode) {
  const sourcePos = sourceNode.position;
  const targetPos = targetNode.position;
  
  // Calculate the horizontal and vertical distances
  const deltaX = targetPos.x - sourcePos.x;
  const deltaY = targetPos.y - sourcePos.y;
  
  // Use absolute values to determine which axis has the larger difference
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);
  
  let sourceHandle, targetHandle;
  
  // If horizontal distance is greater, use left/right handles
  if (absDeltaX > absDeltaY) {
    if (deltaX > 0) {
      // Target is to the right of source
      sourceHandle = 'right';
      targetHandle = 'left';
    } else {
      // Target is to the left of source  
      sourceHandle = 'left';
      targetHandle = 'right';
    }
  } else {
    // If vertical distance is greater, use top/bottom handles
    if (deltaY > 0) {
      // Target is below source
      sourceHandle = 'bottom';
      targetHandle = 'top';
    } else {
      // Target is above source
      sourceHandle = 'top';
      targetHandle = 'bottom';
    }
  }
  
  return { sourceHandle, targetHandle };
}

/**
 * Update edges with optimal handle selections based on current node positions
 * @param {Array} edges - Current edges array
 * @param {Array} nodes - Current nodes array
 * @returns {Array} - Updated edges with sourceHandle and targetHandle properties
 */
export function updateEdgesWithOptimalHandles(edges, nodes) {
  // Create a map for quick node lookup
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  
  return edges.map(edge => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    
    if (!sourceNode || !targetNode) {
      // Return edge unchanged if nodes are missing
      return edge;
    }
    
    const { sourceHandle, targetHandle } = calculateOptimalHandles(sourceNode, targetNode);
    
    return {
      ...edge,
      sourceHandle,
      targetHandle
    };
  });
}