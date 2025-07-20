// config.js

// Tweak these!
const H_STEP     = 200;  // Horizontal spacing between steps
const FLOW_GAP_Y = 250;  // Vertical gap between the two flows
const START_X    = 100;
const START_Y1   = 100;                           // y of top flow
const START_Y2   = START_Y1 + FLOW_GAP_Y*1.45;    // y of bottom flow
const DIV_Y      = START_Y1 + FLOW_GAP_Y / 2;     // y-coordinate of divider

export const initialNodes = [
    // ─── Titles ──────────────────────────────────────────────────────────────
    {
        id: 'title-top',
        type: 'title',
        draggable: false,
        selectable: false,
        data: { label: 'Standard APIKey Storage (Vulnerable)' },
        position: { x: START_X + H_STEP, y: START_Y1 - 200 },
    },
    {
        id: 'title-bot',
        type: 'title',
        draggable: false,
        selectable: false,
        data: { label: 'Bluvo MPC‑Backed Key Storage' },
        position: { x: START_X + H_STEP, y: START_Y2 - 200 },
    },

    // ─── Top Flow: Classic Storage ────────────────────────────────────────────
    {
        id: 'service',
        type: 'icon',
        data: { label: 'Service' },
        position: { x: START_X,            y: START_Y1 }
    },
    {
        id: 'loader',
        type: 'icon',
        data: { label: 'Loader Function' },
        position: { x: START_X + H_STEP,   y: START_Y1 }
    },
    {
        id: 'db',
        type: 'icon',
        data: { label: 'APIKey DB' },
        position: { x: START_X + H_STEP*2, y: START_Y1 }
    },
    {
        id: 'middleman',
        type: 'icon',
        data: { label: 'Malicious Actor', color: '#EF4444' },
        position: { x: START_X + H_STEP, y: START_Y1 - 125 }
    },
    {
        id: 'http_call_top',
        type: 'icon',
        data: { label: 'Exchange', color: '#10B981' },
        position: { x: START_X + H_STEP*4, y: START_Y1 }
    },

    // ─── Divider (horizontal) ─────────────────────────────────────────────────
    {
        id: 'div_left',
        type: 'invisible',
        data: {},
        position: { x: START_X - 50,           y: DIV_Y }
    },
    {
        id: 'div_right',
        type: 'invisible',
        data: {},
        position: { x: START_X + H_STEP*4 + 50, y: DIV_Y }
    },

    // ─── Bottom Flow: Bluvo MPC ───────────────────────────────────────────────
    {
        id: 'service_b',
        type: 'icon',
        data: { label: 'Service', color: '#F97316' },
        position: { x: START_X,            y: START_Y2 }
    },
    {
        id: 'signer',
        type: 'icon',
        data: { label: 'Signer Node', color: '#F97316' },
        position: { x: START_X + H_STEP,   y: START_Y2 }
    },
    // MPC cluster (4 nodes in a square)
    {
        id: 'mpc1',
        type: 'icon',
        data: { label: 'MPC Node A', color: '#F97316' },
        position: { x: START_X + H_STEP*2, y: START_Y2 - 100 }
    },
    {
        id: 'mpc2',
        type: 'icon',
        data: { label: 'MPC Node B', color: '#F97316' },
        position: { x: START_X + H_STEP*3, y: START_Y2 - 100 }
    },
    {
        id: 'mpc3',
        type: 'icon',
        data: { label: 'MPC Node C', color: '#F97316' },
        position: { x: START_X + H_STEP*2, y: START_Y2 + 100 }
    },
    {
        id: 'mpc4',
        type: 'icon',
        data: { label: 'MPC Node D', color: '#F97316' },
        position: { x: START_X + H_STEP*3, y: START_Y2 + 100 }
    },
    {
        id: 'middleman_b',
        type: 'icon',
        data: { label: 'Malicious Actor', color: '#EF4444' },
        position: { x: START_X + H_STEP, y: START_Y2 - 125 }
    },
    {
        id: 'http_call_bot',
        type: 'icon',
        data: { label: 'Exchange', color: '#10B981' },
        position: { x: START_X + H_STEP*4, y: START_Y2 }
    },
];

export const initialEdges = [
    // ─── Top Flow Edges ───────────────────────────────────────────────────────
    {
        id: 'e1',
        source: 'service',
        target: 'loader',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        label: 'load keys'
    },
    {
        id: 'e2',
        source: 'loader',
        target: 'db',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        label: 'store'
    },
    {
        id: 'e3',
        source: 'middleman',
        target: 'loader',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'animatedSVG',
        label: 'steal',
        data: { color: '#EF4444', reverse: true }
    },
    {
        id: 'e4',
        source: 'middleman',
        target: 'db',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'animatedSVG',
        label: 'steal',
        data: { color: '#EF4444', reverse: true }
    },
    {
        id: 'e_http_top',
        source: 'service',
        target: 'http_call_top',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        label: 'HTTP call with keys',
        data: { color: '#10B981' }
    },

    // ─── Divider Edge ─────────────────────────────────────────────────────────
    {
        id: 'divider',
        source: 'div_left',
        target: 'div_right',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'dashedAnimated',
        data: { color: '#6B7280' }
    },

    // ─── Bottom Flow Edges ────────────────────────────────────────────────────
    {
        id: 'e1_b',
        source: 'service_b',
        target: 'signer',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        label: 'sign request',
        data: { color: '#F97316' }
    },
    // Signer to each MPC node
    {
        id: 'e2_b',
        source: 'signer',
        target: 'mpc1',
        sourceHandle: 'top',
        targetHandle: 'bottom',
        type: 'animatedSVG',
        label: 'request share',
        data: { color: '#F97316', reverse: true }
    },
    {
        id: 'e3_b',
        source: 'signer',
        target: 'mpc2',
        sourceHandle: 'top',
        targetHandle: 'bottom',
        type: 'animatedSVG',
        label: 'request share',
        data: { color: '#F97316', reverse: true }
    },
    {
        id: 'e4_b',
        source: 'signer',
        target: 'mpc3',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'animatedSVG',
        label: 'request share',
        data: { color: '#F97316', reverse: true }
    },
    {
        id: 'e5_b',
        source: 'signer',
        target: 'mpc4',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'animatedSVG',
        label: 'request share',
        data: { color: '#F97316', reverse: true }
    },
    // MPC cluster intra-communication (square cycle)
    {
        id: 'e6_b',
        source: 'mpc1',
        target: 'mpc2',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#F97316', reverse: true }
    },
    {
        id: 'e7_b',
        source: 'mpc3',
        target: 'mpc4',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#F97316', reverse: true }
    },
    {
        id: 'e8_b',
        source: 'mpc4',
        target: 'mpc3',
        sourceHandle: 'left',
        targetHandle: 'right',
        type: 'animatedSVG',
        data: { color: '#F97316', reverse: true }
    },
    {
        id: 'e9_b',
        source: 'mpc3',
        target: 'mpc1',
        sourceHandle: 'top',
        targetHandle: 'bottom',
        type: 'animatedSVG',
        data: { color: '#F97316', reverse: true }
    },
    // Middleman attempting to steal (fails)
    {
        id: 'e_middleman_b',
        source: 'middleman_b',
        target: 'signer',
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'animatedSVG',
        label: 'attempt to steal',
        data: { color: '#EF4444', error: true }
    },
    // HTTP call to Exchange
    {
        id: 'e_http_bot',
        source: 'service_b',
        target: 'http_call_bot',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        label: 'HTTP call with signature',
        data: { color: '#10B981' }
    },
];