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
    // 1. login
    { id: 'e1', source: 'user',      target: 'oauth', type: 'animatedSVG', label: 'login' },
    // 2. get token
    { id: 'e2', source: 'oauth',     target: 'client', type: 'animatedSVG', label: 'token' },
    // 3. pick coin & 2FA
    { id: 'e3', source: 'user',      target: 'depositUI', type: 'animatedSVG', label: 'pick & 2FA' },
    // 4. submit deposit/withdraw
    { id: 'e4', source: 'depositUI', target: 'tx',      type: 'animatedSVG', label: 'submit' },
    // 5. tx → success/failure
    { id: 'e5', source: 'tx',        target: 'success', type: 'animatedSVG', label: '✓' },
    { id: 'e6', source: 'tx',        target: 'failure', type: 'animatedSVG', label: '✖' },
    // 6. notify UI
    { id: 'e7', source: 'success',   target: 'depositUI', type: 'animatedSVG', label: 'notify' },
    { id: 'e8', source: 'failure',   target: 'depositUI', type: 'animatedSVG', label: 'notify' },
];
