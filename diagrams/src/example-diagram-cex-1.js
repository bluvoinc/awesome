// config.js
export const initialNodes = [
    { id: 'user',      type: 'icon', data: { label: 'User' },        position: { x: 50,  y: 50 } },
    { id: 'oauth',     type: 'icon', data: { label: 'OAuth2' },      position: { x: 250, y: 50 } },
    { id: 'client',    type: 'icon', data: { label: 'Client App' }, position: { x: 450, y: 50 } },
    { id: 'depositUI', type: 'icon', data: { label: 'Deposit UI' }, position: { x: 250, y: 200 } },
    { id: 'tx',        type: 'icon', data: { label: 'Tx Service' }, position: { x: 450, y: 200 } },
    { id: 'success',   type: 'icon', data: { label: 'Success ✔' },  position: { x: 350, y: 350 } },
    { id: 'failure',   type: 'icon', data: { label: 'Failure ✖' },  position: { x: 550, y: 350 } },
];

export const initialEdges = [
    // 1. login (user → oauth: horizontal, user is left)
    { id: 'e1', source: 'user',      target: 'oauth',     sourceHandle: 'right', targetHandle: 'left',   type: 'animatedSVG', label: 'login' },
    // 2. get token (oauth → client: horizontal, oauth is left)
    { id: 'e2', source: 'oauth',     target: 'client',    sourceHandle: 'right', targetHandle: 'left',   type: 'animatedSVG', label: 'token' },
    // 3. pick coin & 2FA (user → depositUI: vertical, user is above)
    { id: 'e3', source: 'user',      target: 'depositUI', sourceHandle: 'bottom', targetHandle: 'top',   type: 'animatedSVG', label: 'pick & 2FA' },
    // 4. submit deposit/withdraw (depositUI → tx: horizontal, depositUI is left)
    { id: 'e4', source: 'depositUI', target: 'tx',        sourceHandle: 'right', targetHandle: 'left',   type: 'animatedSVG', label: 'submit' },
    // 5. tx → success (horizontal, tx is left)
    { id: 'e5', source: 'tx',        target: 'success',   sourceHandle: 'bottom', targetHandle: 'top',    type: 'animatedSVG', label: '✓' },
    // 6. tx → failure (horizontal, tx is left)  
    { id: 'e6', source: 'tx',        target: 'failure',   sourceHandle: 'right', targetHandle: 'left',   type: 'animatedSVG', label: '✖' },
    // 7. success notify (success → depositUI: vertical/horizontal combo)
    { id: 'e7', source: 'success',   target: 'depositUI', sourceHandle: 'left', targetHandle: 'bottom',  type: 'animatedSVG', label: 'notify' },
    // 8. failure notify (failure → depositUI: vertical/horizontal combo)
    { id: 'e8', source: 'failure',   target: 'depositUI', sourceHandle: 'bottom', targetHandle: 'right', type: 'animatedSVG', label: 'notify' },
];
