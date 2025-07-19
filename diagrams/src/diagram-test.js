// config.js
export const initialNodes  = [
    {
        "id": "state",
        "position": {
            "x": 247.0238394051109,
            "y": -31.745713012150624
        },
        "type": "icon"
    },
    {
        "id": "agent1",
        "position": {
            "x": 162.49937249267154,
            "y": 110.07946468370295
        },
        "type": "icon"
    },
    {
        "id": "agent2",
        "position": {
            "x": 333.53241338080966,
            "y": 111.07151821533265
        },
        "type": "icon"
    },
    {
        "id": "tool",
        "position": {
            "x": 250,
            "y": 254.8808029744456
        },
        "type": "icon"
    },
    {
        "id": "cond",
        "position": {
            "x": 249.00794646837028,
            "y": 404.6424089233368
        },
        "type": "icon"
    },
    {
        "id": "cont",
        "position": {
            "x": 168.84901710096443,
            "y": 571.268924909933
        },
        "type": "icon"
    },
    {
        "id": "end",
        "position": {
            "x": 346.03178587348117,
            "y": 570.2768713783034
        },
        "type": "icon"
    }
]

export const initialEdges = [
    { id: 'e1', source: 'state',  target: 'agent1', type: 'animatedSVG' },
    { id: 'e2', source: 'state',  target: 'agent2', type: 'animatedSVG' },
    { id: 'e3', source: 'agent1', target: 'tool',   type: 'animatedSVG' },
    { id: 'e4', source: 'agent2', target: 'tool',   type: 'animatedSVG' },
    { id: 'e5', source: 'tool',   target: 'cond',   type: 'animatedSVG' },
    { id: 'e6', source: 'cond',   target: 'cont',   type: 'animatedSVG', label: 'retry' },
    { id: 'e7', source: 'cond',   target: 'end',    type: 'animatedSVG', label: 'done' },
];