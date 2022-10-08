export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite", "madhatter", "marchhare", "queenofhearts", "cheshirecat", "alice"
    ];

    Constants.UserBehaviorDirectory = "behaviors/diverse";
    Constants.UserBehaviorModules = [
        "lights.js", "sound.js", "throb.js", "urlLink.js", "bounce.js", "simpleSpin.js", "text3D.js", "script.js", "flag.js", "pixel.js"
    ];

    Constants.DefaultCards = [
        // {
        //     card: {
        //         name: "entrance",
        //         type: "object",
        //         translation: [0, 0.4, 2],
        //         spawn: "default",
        //     }
        // },
        {
            card: {
                name: "world model",
                type: "3d",
                dataLocation: "./assets/3D/artgallery_042122.glb.zip",
                dataScale: [1, 1, 1],
                singleSided: true,
                shadow: true,
                layers: ["walk"],
                translation: [0, -1.7, 0],
                placeholder: true,
                placeholderSize: [100, 0.01, 100],
                placeholderColor: 0xcccccc,
                placeholderOffset: [0, -1.7, 0],
            }
        },
        {
            card: {
                name: "light",
                layers: ["light"],
                type: "lighting",
                behaviorModules: ["Light"],
                dataLocation: "./assets/sky/shanghai_riverside_2k.exr",
                dataType: "exr",
            }
        },
        {
            card: {
                name: "pixel1",
                behaviorModules: ["Pixel"],
                layers: ["pointer"],
                type: "object",
                translation: [-5, 0.6, -16.87],
                // rotation: [0, -Math.PI / 2, 0],
                shadow: true,
                scale: [3, 3, 3],
                pixelX: 5,
                pixelY: 5,
            },
        },
        {
            card: {
                name: "pixel2",
                behaviorModules: ["Pixel"],
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
    ];
}
