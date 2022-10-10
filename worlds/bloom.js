export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite", "madhatter", "marchhare", "queenofhearts", "cheshirecat", "alice"
    ];

    Constants.UserBehaviorDirectory = "behaviors/diverse";
    Constants.UserBehaviorModules = [
        "sound.js", "throb.js", "urlLink.js", "bounce.js", "simpleSpin.js", "text3D.js", "script.js", "flag.js", "pixel.js", "floor.js", "bloompass.js", "bloomlight.js"
    ];

    Constants.DefaultCards = [
        {
            card: {
                name: "entrance",
                type: "object",
                translation: [0, 0.4, -1],
                spawn: "default",
            }
        },
        {
            card: {
                name: "world model",
                behaviorModules: ["Floor"], // "BloomPass"
                layers: ["walk"],
                type: "object",
                translation: [0, -2, 0],
                shadow: true,
            }
        },
        {
            card: {
                name: "light",
                layers: ["light"],
                type: "lighting",
                behaviorModules: ["Light"],
            }
        },
        // {
        //     card: {
        //         name: "mbit display",
        //         behaviorModules: ["MbitDisplay"],
        //         layers: ["pointer"],
        //         type: "object",
        //         translation: [-5, 0.6, -16.87],
        //         // rotation: [0, -Math.PI / 2, 0],
        //         shadow: true,
        //         scale: [3.1, 3.1, 3.1],
        //         pixelX: 5,
        //         pixelY: 5,
        //     },
        // },
        {
            card: {
                name: "bag display",
                behaviorModules: ["BagDisplay"],
                layers: ["pointer"],
                type: "object",
                translation: [5.5, 0.6, -16.87],
                // rotation: [0, -Math.PI / 2, 0],
                shadow: true,
                scale: [1, 1, 1],
                pixelX: 16,
                pixelY: 16,
            },
        },
        {
            card: {
                name: "pixel display",
                behaviorModules: ["PixelDisplay"],
                layers: ["pointer"],
                type: "object",
                translation: [-5, 0.6, -16.87],
                // rotation: [0, -Math.PI / 2, 0],
                shadow: true,
                scale: [1.75, 1.75, 1.75],
                pixelX: 9,
                pixelY: 9,
            },
        },
        {
            card: {
                name: "strip display",
                behaviorModules: ["StripDisplay"],
                layers: ["pointer"],
                type: "object",
                translation: [-0.05, -1.55, -16.87],
                // rotation: [0, -Math.PI / 2, 0],
                shadow: true,
                scale: [1, 1, 1],
                pixelX: 120,
                pixelY: 1,
                ledWidth: 0.15,
                ledHeight: 0.15,
            },
        },
    ];
}
