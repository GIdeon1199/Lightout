console.log("SCENES.JS FILE LOADED"); // DEBUG CHECK

const SCENES = {
    wheatley_classroom: {
        id: "wheatley_classroom",
        name: "Wheatley Classroom",
        image: "scenes/wheatley_classroom.jpg",
        description: "You wake up in a dark Wheatley classroom. Its pitch black.",
        totalFragments: 3,
        fragments: [
            { id: "wc_frag_1", value: "7", pitch: "Tape over a desk label" },
            { id: "wc_frag_2", value: "3", pitch: "On a monitor bezel" },
            { id: "wc_frag_3", value: "9", pitch: "On the whiteboard near the projector" },
        ],
        finalCode: "937",
        hotspots: [
            { fragmentId: "wc_frag_1", pitch: 5, yaw: 25 },
            { fragmentId: "wc_frag_2", pitch: 2, yaw: 130 },
            { fragmentId: "wc_frag_3", pitch: -10, yaw: -45 },
        ],
        nextScene: "wheatley_atrium"
    },
    wheatley_atrium: {
        id: "wheatley_atrium",
        name: "Wheatley Atrium",
        image: "scenes/wheatley_atrium.jpg",
        description: "lets help the others find the code. no one one seems to know what happened.",
        totalFragments: 4,
        fragments: [
            { id: "wa_frag_1", value: "4", pitch: "Near the cafe entrance" },
            { id: "wa_frag_2", value: "1", pitch: "On the stairs railing" },
            { id: "wa_frag_3", value: "5", pitch: "By the elevator doors" },
            { id: "wa_frag_4", value: "2", pitch: "On the hanging banner" },
        ],
        finalCode: "1452",
        hotspots: [
            { fragmentId: "wa_frag_1", pitch: 7.5, yaw: 0 },
            { fragmentId: "wa_frag_2", pitch: 10, yaw: 90 },
            { fragmentId: "wa_frag_3", pitch: 10, yaw: -90 },
            { fragmentId: "wa_frag_4", pitch: 70, yaw: 180 },
        ],
        nextScene: "scaife"
    },
    scaife: {
        id: "scaife",
        name: "Scaife Hall",
        image: "scenes/scaife_hall.jpg",
        description: "The hallway stretches infinitely in the dark.",
        totalFragments: 4,
        fragments: [
            { id: "sc_frag_1", value: "2", pitch: "On a bulletin board" },
            { id: "sc_frag_2", value: "8", pitch: "by the trashcan" },
            { id: "sc_frag_3", value: "6", pitch: "Floor tile marking" },
            { id: "sc_frag_4", value: "9", pitch: "Fire extinguisher label" },
        ],
        finalCode: "8269",
        hotspots: [
            { fragmentId: "sc_frag_1", pitch: 0, yaw: 45 },
            { fragmentId: "sc_frag_2", pitch: -24.86, yaw: -101.91 },
            { fragmentId: "sc_frag_3", pitch: 3.97, yaw: 8.22 },
            { fragmentId: "sc_frag_4", pitch: -1.32, yaw: 166.00 },
        ],
        nextScene: "johnjay_inside"
    },
    johnjay_inside: {
        id: "johnjay_inside",
        name: "John Jay Center ",
        image: "scenes/john_jay_inside.jpg",
        description: "Not a single soul in sight. I must get out of here!",
        totalFragments: 5,
        fragments: [
            { id: "jj_frag_1", value: "0", pitch: "Trophy case reflection" },
            { id: "jj_frag_2", value: "5", pitch: "Vending machine light" },
            { id: "jj_frag_3", value: "3", pitch: "Reception desk" },
            { id: "jj_frag_4", value: "8", pitch: "Gym entrance sign" },
            { id: "jj_frag_5", value: "1", pitch: "Ceiling light fixture" },
        ],
        finalCode: "30581",
        hotspots: [
            { fragmentId: "jj_frag_1", pitch: 0, yaw: -45 },
            { fragmentId: "jj_frag_2", pitch: 5, yaw: 45 },
            { fragmentId: "jj_frag_3", pitch: -10, yaw: 180 },
            { fragmentId: "jj_frag_4", pitch: 0, yaw: -90 },
            { fragmentId: "jj_frag_5", pitch: 45, yaw: 0 },
        ],
        nextScene: "johnjay_outside"
    },
    johnjay_outside: {
        id: "johnjay_outside",
        name: "John Jay Center (Outside)",
        image: "scenes/john_jay_outside.jpg",
        description: "The sun is setting but its really cold. The path splits here.",
        totalFragments: 5,
        fragments: [
            { id: "jo_frag_1", value: "9", pitch: "On a lamp post" },
            { id: "jo_frag_2", value: "2", pitch: "Bench seat" },
            { id: "jo_frag_3", value: "7", pitch: "Pavement crack" },
            { id: "jo_frag_4", value: "4", pitch: "Tree trunk grafitti" },
            { id: "jo_frag_5", value: "0", pitch: "Distant window" },
        ],
        finalCode: "92740",
        hotspots: [
            { fragmentId: "jo_frag_1", pitch: 0.01, yaw: -2.27 },
            { fragmentId: "jo_frag_2", pitch: -10, yaw: 90 },
            { fragmentId: "jo_frag_3", pitch: -25, yaw: -90 },
            { fragmentId: "jo_frag_4", pitch: 0, yaw: 180 },
            { fragmentId: "jo_frag_5", pitch: 5, yaw: 45 },
        ],
        // Special property for branching
        nextScene: "BRANCH_DECISION",
        branchOptions: [
            { label: "Go to Hale Café", nextScene: "hale_cafe" },
            { label: "Head to Nicholson Rotunda", nextScene: "nicholson_rotunda" }
        ]
    },
    hale_cafe: {
        id: "hale_cafe",
        name: "Hale Café",
        image: "scenes/hale_cafe.jpg", // Optional scene
        description: "I am glad I came here. Someone left notes on how to get out of here.",
        totalFragments: 6,
        fragments: [
            { id: "hc_frag_1", value: "1", pitch: "vending machine" },
            { id: "hc_frag_2", value: "1", pitch: "Hale sign" },
            { id: "hc_frag_3", value: "8", pitch: "Ceiling" },
            { id: "hc_frag_4", value: "3", pitch: "Cutlery ddispenser" },
            { id: "hc_frag_5", value: "7", pitch: "Light fixture" },
            { id: "hc_frag_6", value: "2", pitch: "table" },
        ],
        finalCode: "118372",
        hotspots: [
            { fragmentId: "hc_frag_1", pitch: 0, yaw: 30 },
            { fragmentId: "hc_frag_2", pitch: -15, yaw: -60 },
            { fragmentId: "hc_frag_3", pitch: 10, yaw: 120 },
            { fragmentId: "hc_frag_4", pitch: -20, yaw: 0 },
            { fragmentId: "hc_frag_5", pitch: 0, yaw: 90 },
            { fragmentId: "hc_frag_6", pitch: -25, yaw: 180 },
        ],
        nextScene: "nicholson_rotunda"
    },
    nicholson_rotunda: {
        id: "nicholson_rotunda",
        name: "Nicholson Rotunda",
        image: "scenes/nicholson_rotunda.jpg",
        description: "The heart of the campus. Almost there.",
        totalFragments: 6,
        fragments: [
            { id: "nr_frag_1", value: "6", pitch: "Fountain edge" },
            { id: "nr_frag_2", value: "4", pitch: "Column base" },
            { id: "nr_frag_3", value: "2", pitch: "Garden sign" },
            { id: "nr_frag_4", value: "9", pitch: "Dome ceiling" },
            { id: "nr_frag_5", value: "5", pitch: "Stone pathway" },
            { id: "nr_frag_6", value: "1", pitch: "Statue plaque" },
        ],
        finalCode: "462951",
        hotspots: [
            { fragmentId: "nr_frag_1", pitch: -42.37, yaw: 128.65 },
            { fragmentId: "nr_frag_2", pitch: 3.03, yaw: 127.7 },
            { fragmentId: "nr_frag_3", pitch: 0, yaw: -90 },
            { fragmentId: "nr_frag_4", pitch: 45, yaw: 0 },
            { fragmentId: "nr_frag_5", pitch: -25, yaw: 180 },
            { fragmentId: "nr_frag_6", pitch: 0, yaw: 45 },
        ],
        nextScene: "library"
    },
    library: {
        id: "library",
        name: "The Library",
        image: "scenes/library.jpg",
        description: "The final door.",
        totalFragments: 7,
        fragments: [
            { id: "lb_frag_1", value: "5", pitch: "Book return slot" },
            { id: "lb_frag_2", value: "5", pitch: "Window reflection" },
            { id: "lb_frag_3", value: "5", pitch: "Door keypad" },
            { id: "lb_frag_4", value: "3", pitch: "Security gate" },
            { id: "lb_frag_5", value: "8", pitch: "Help desk monitor" },
            { id: "lb_frag_6", value: "2", pitch: "Study pod wall" },
            { id: "lb_frag_7", value: "0", pitch: "Floor near entrance" },
        ],
        finalCode: "5553820",
        hotspots: [
            { fragmentId: "lb_frag_1", pitch: 0, yaw: 45 },
            { fragmentId: "lb_frag_2", pitch: 10, yaw: -45 },
            { fragmentId: "lb_frag_3", pitch: 0, yaw: 180 },
            { fragmentId: "lb_frag_4", pitch: 0, yaw: 0 },
            { fragmentId: "lb_frag_5", pitch: 5, yaw: 90 },
            { fragmentId: "lb_frag_6", pitch: 0, yaw: -90 },
            { fragmentId: "lb_frag_7", pitch: -81, yaw: 37.04 }, // Moved from ceiling to floor for visibility
        ],
        nextScene: null // End of game
    }
};
