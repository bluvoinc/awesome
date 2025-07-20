// config.js

// tweak these!
const H_GAP = 300;  // horizontal gap between columns
const V_GAP = 135;  // vertical gap between steps
const LEFT_X  = 100;
const RIGHT_X = LEFT_X + H_GAP*1.5;
const START_Y = 50;

// Calculate center positions for titles
const LEFT_CENTER = LEFT_X;  // Center of left diagram group
const RIGHT_CENTER = RIGHT_X;  // Center of right diagram group

export const initialNodes = [
    // --- OAuth2 CEX (left) ---
    { id: 'user',      type: 'icon', data: { label: 'User' },        position: { x: LEFT_X,  y: START_Y + V_GAP * 0 } },
    { id: 'oauth',     type: 'icon', data: { label: 'OAuth2' },      position: { x: LEFT_X,  y: START_Y + V_GAP * 1 } },
    { id: 'client',    type: 'icon', data: { label: 'Client App' },  position: { x: LEFT_X,  y: START_Y + V_GAP * 2 } },
    { id: 'depositUI', type: 'icon', data: { label: 'Deposit UI' },  position: { x: LEFT_X,  y: START_Y + V_GAP * 3 } },
    { id: 'tx',        type: 'icon', data: { label: 'Tx Service' },  position: { x: LEFT_X,  y: START_Y + V_GAP * 4 } },
    // branch out success/failure
    { id: 'success',   type: 'icon', data: { label: 'Success ✔' },   position: { x: LEFT_X - H_GAP / 3,  y: START_Y + V_GAP * 5 } },
    { id: 'failure',   type: 'icon', data: { label: 'Failure ✖' },   position: { x: LEFT_X + H_GAP / 3,  y: START_Y + V_GAP * 5 } },

    // --- Bluvo Widget (right) (Those nodes should be orange) ---
    { id: 'user_b',    type: 'icon', data: { label: 'User', color: '#F97316' },         position: { x: RIGHT_X, y: START_Y + V_GAP * 0 } },
    { id: 'widget',    type: 'icon', data: { label: 'Bluvo Widget', color: '#F97316' }, position: { x: RIGHT_X, y: START_Y + V_GAP * 1 } },
    // branch out success/failure
    { id: 'success_b', type: 'icon', data: { label: 'Success ✔', color: '#F97316' },    position: { x: RIGHT_X - H_GAP / 3, y: START_Y + V_GAP * 2 } },
    { id: 'failure_b', type: 'icon', data: { label: 'Failure ✖', color: '#F97316' },    position: { x: RIGHT_X + H_GAP / 3, y: START_Y + V_GAP * 2 } },

    // --- Invisible nodes for vertical divisor ---
    { id: 'divisor_top',    type: 'invisible', data: {}, position: { x: LEFT_X + H_GAP * 0.75, y: START_Y - 20 } },
    { id: 'divisor_bottom', type: 'invisible', data: {}, position: { x: LEFT_X + H_GAP * 0.75, y: START_Y + V_GAP * 5.5 + 20 } },

    // --- Title nodes ---
    {
        id: 'title-left',
        type: 'title',
        draggable: false,
        selectable: false,
        data: {
            label: 'CEX Deposits OAuth2 Flow',
        },
        position: { x: LEFT_CENTER - 90, y: START_Y - 80 },
    },
    {
        id: 'title-right',
        type: 'title',
        draggable: false,
        selectable: false,
        data: {
            label: 'CEX Deposit with Bluvo',
        },
        position: { x: RIGHT_CENTER - 75, y: START_Y - 80 },
    },
];

export const initialEdges = [
    // --- OAuth2 CEX (vertical) ---
    { id: 'e1', source: 'user',      target: 'oauth',     sourceHandle: 'bottom', targetHandle: 'top',    type: 'animatedSVG', label: 'login'      },
    { id: 'e2', source: 'oauth',     target: 'client',    sourceHandle: 'bottom', targetHandle: 'top',    type: 'animatedSVG', label: 'token'      },
    { id: 'e3', source: 'client',    target: 'depositUI', sourceHandle: 'bottom', targetHandle: 'top',    type: 'animatedSVG', label: 'pick & 2FA' },
    { id: 'e4', source: 'depositUI', target: 'tx',        sourceHandle: 'bottom', targetHandle: 'top',    type: 'animatedSVG', label: 'submit'     },
    // branch
    { id: 'e5', source: 'tx',        target: 'success',   sourceHandle: 'bottom', targetHandle: 'top',    type: 'animatedSVG', label: '✓'          },
    { id: 'e6', source: 'tx',        target: 'failure',   sourceHandle: 'right',  targetHandle: 'left',   type: 'animatedSVG', label: '✖'          },
    // notifications back
    { id: 'e7', source: 'success',   target: 'depositUI', sourceHandle: 'right',  targetHandle: 'left',   type: 'animatedSVG', label: 'notify'     },
    { id: 'e8', source: 'failure',   target: 'depositUI', sourceHandle: 'bottom', targetHandle: 'left',   type: 'animatedSVG', label: 'notify'     },

    // --- Bluvo Widget (vertical) ---
    { id: 'e1_b', source: 'user_b',   target: 'widget',    sourceHandle: 'bottom', targetHandle: 'top',    type: 'animatedSVG', label: 'pick & 2FA', data: { color: '#F97316' } },
    // branch
    { id: 'e2_b', source: 'widget',   target: 'success_b', sourceHandle: 'bottom', targetHandle: 'top',    type: 'animatedSVG', label: '✓',          data: { color: '#F97316' } },
    { id: 'e3_b', source: 'widget',   target: 'failure_b', sourceHandle: 'right',  targetHandle: 'left',   type: 'animatedSVG', label: '✖',          data: { color: '#F97316' } },

    // --- Vertical Divisor ---
    { id: 'divisor', source: 'divisor_top', target: 'divisor_bottom', sourceHandle: 'bottom', targetHandle: 'top', type: 'dashedAnimated', data: { color: '#6B7280' } },
];
