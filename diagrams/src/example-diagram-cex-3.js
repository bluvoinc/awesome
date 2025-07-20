// config.js

// Spacing constants
const H_STEP    = 200;  // Horizontal spacing between nodes
const V_STEP    = 300;  // Vertical spacing between groups
const START_X   = 100;  // Starting x-coordinate
const START_Y1  = 100;  // y-coordinate for Group 1
const START_Y2  = START_Y1 + V_STEP;  // y-coordinate for Group 2
const START_Y3  = START_Y2 + V_STEP;  // y-coordinate for Group 3
const DIV_Y1    = (START_Y1 + START_Y2) / 2;  // y-coordinate for Divider 1
const DIV_Y2    = (START_Y2 + START_Y3) / 2;  // y-coordinate for Divider 2

export const initialNodes = [
    // --- Titles ---
    {
        id: 'title-group1',
        type: 'title',
        draggable: false,
        selectable: false,
        data: { label: 'CEX Connection via APIKeys - Long Living' },
        position: { x: START_X, y: START_Y1 - 75 },
    },
    {
        id: 'title-group2',
        type: 'title',
        draggable: false,
        selectable: false,
        data: { label: 'CEX Connection via OAuth2 - Short Living' },
        position: { x: START_X, y: START_Y2 - 75 },
    },
    {
        id: 'title-group3',
        type: 'title',
        draggable: false,
        selectable: false,
        data: { label: 'APIKey auto-gen via OAuth2 Flow - Long & Short Living' },
        position: { x: START_X, y: START_Y3 - 75 },
    },

    // --- Group 1: Long Living CEX Connection (Orange) ---
    {
        id: 'g1-user-navigate',
        type: 'icon',
        data: { label: 'User navigates to CEX Dashboard', color: '#F97316' },
        position: { x: START_X, y: START_Y1 },
    },
    {
        id: 'g1-generate-apikey',
        type: 'icon',
        data: { label: 'User generates APIKey & Secret', color: '#F97316' },
        position: { x: START_X + H_STEP, y: START_Y1 },
    },
    {
        id: 'g1-input-apikey',
        type: 'icon',
        data: { label: 'User inputs APIKey into Bluvo Widget', color: '#F97316' },
        position: { x: START_X + 2 * H_STEP, y: START_Y1 },
    },
    {
        id: 'g1-provide-walletid',
        type: 'icon',
        data: { label: 'Bluvo Widget provides walletId to Company', color: '#F97316' },
        position: { x: START_X + 3 * H_STEP, y: START_Y1 },
    },

    // --- Group 2: Short Living CEX Connection (Green) ---
    {
        id: 'g2-open-popup',
        type: 'icon',
        data: { label: 'Bluvo Widget opens popup with CEX login', color: '#10B981' },
        position: { x: START_X, y: START_Y2 },
    },
    {
        id: 'g2-user-login',
        type: 'icon',
        data: { label: 'User logs in to CEX', color: '#10B981' },
        position: { x: START_X + H_STEP, y: START_Y2 },
    },
    {
        id: 'g2-receive-jwt',
        type: 'icon',
        data: { label: 'Bluvo Widget receives JWT AccessToken', color: '#10B981' },
        position: { x: START_X + 2 * H_STEP, y: START_Y2 },
    },
    {
        id: 'g2-provide-walletid-jwt',
        type: 'icon',
        data: { label: 'Bluvo Widget provides walletId with JWT to Company', color: '#10B981' },
        position: { x: START_X + 3 * H_STEP, y: START_Y2 },
    },

    // --- Group 3: Long & Short Living CEX Connection (Green) ---
    {
        id: 'g3-open-popup',
        type: 'icon',
        data: { label: 'Bluvo Widget opens popup with CEX login', color: '#10B981' },
        position: { x: START_X, y: START_Y3 },
    },
    {
        id: 'g3-user-login',
        type: 'icon',
        data: { label: 'User logs in to CEX', color: '#10B981' },
        position: { x: START_X + H_STEP, y: START_Y3 },
    },
    {
        id: 'g3-receive-jwt',
        type: 'icon',
        data: { label: 'Bluvo Widget receives JWT AccessToken', color: '#10B981' },
        position: { x: START_X + 2 * H_STEP, y: START_Y3 },
    },
    {
        id: 'g3-generate-apikey',
        type: 'icon',
        data: { label: 'Bluvo Widget uses JWT to generate APIKey', color: '#10B981' },
        position: { x: START_X + 3 * H_STEP, y: START_Y3 },
    },
    {
        id: 'g3-provide-walletid-apikey',
        type: 'icon',
        data: { label: 'Bluvo Widget provides walletId with APIKey to Company', color: '#10B981' },
        position: { x: START_X + 4 * H_STEP, y: START_Y3 },
    },

    // --- Dividers ---
    {
        id: 'div1_left',
        type: 'invisible',
        data: {},
        position: { x: 50, y: DIV_Y1 },
    },
    {
        id: 'div1_right',
        type: 'invisible',
        data: {},
        position: { x: 950, y: DIV_Y1 }, // Spans width based on Group 3 (5 nodes)
    },
    {
        id: 'div2_left',
        type: 'invisible',
        data: {},
        position: { x: 50, y: DIV_Y2 },
    },
    {
        id: 'div2_right',
        type: 'invisible',
        data: {},
        position: { x: 950, y: DIV_Y2 },
    },
];

export const initialEdges = [
    // --- Group 1 Edges (Orange) ---
    {
        id: 'e1_g1',
        source: 'g1-user-navigate',
        target: 'g1-generate-apikey',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#F97316', speed: 0.25 },
    },
    {
        id: 'e2_g1',
        source: 'g1-generate-apikey',
        target: 'g1-input-apikey',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#F97316', speed: 0.25 },
    },
    {
        id: 'e3_g1',
        source: 'g1-input-apikey',
        target: 'g1-provide-walletid',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#F97316', speed: 0.25 },
    },

    // --- Group 2 Edges (Green, speed: 2) ---
    {
        id: 'e1_g2',
        source: 'g2-open-popup',
        target: 'g2-user-login',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#10B981', speed: 2 },
    },
    {
        id: 'e2_g2',
        source: 'g2-user-login',
        target: 'g2-receive-jwt',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#10B981', speed: 2 },
    },
    {
        id: 'e3_g2',
        source: 'g2-receive-jwt',
        target: 'g2-provide-walletid-jwt',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#10B981', speed: 2 },
    },

    // --- Group 3 Edges (Green, speed: 2) ---
    {
        id: 'e1_g3',
        source: 'g3-open-popup',
        target: 'g3-user-login',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#10B981', speed: 2 },
    },
    {
        id: 'e2_g3',
        source: 'g3-user-login',
        target: 'g3-receive-jwt',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#10B981', speed: 2 },
    },
    {
        id: 'e3_g3',
        source: 'g3-receive-jwt',
        target: 'g3-generate-apikey',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#10B981', speed: 2 },
    },
    {
        id: 'e4_g3',
        source: 'g3-generate-apikey',
        target: 'g3-provide-walletid-apikey',
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'animatedSVG',
        data: { color: '#10B981', speed: 2 },
    },

    // --- Divider Edges ---
    {
        id: 'divider1',
        source: 'div1_left',
        target: 'div1_right',
        type: 'dashedAnimated',
        data: { color: '#6B7280' },
    },
    {
        id: 'divider2',
        source: 'div2_left',
        target: 'div2_right',
        type: 'dashedAnimated',
        data: { color: '#6B7280' },
    },
];