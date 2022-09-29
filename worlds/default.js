export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite", "madhatter", "marchhare", "queenofhearts", "cheshirecat", "alice"
    ];

    /* Alternatively, you can specify a card spec for an avatar,
       instead of a string for the partical file name, to create your own avatar.
       You can add behaviorModules here. Also, if the system detects a behavior module
       named AvatarEventHandler, that is automatically installed to the avatar.
        {
            type: "3d",
            modelType: "glb",
            name: "rabbit",
            dataLocation: "./assets/avatars/newwhite.zip",
            dataRotation: [0, Math.PI, 0],
            dataScale: [0.3, 0.3, 0.3],
        }
    */

    Constants.UserBehaviorDirectory = "behaviors/diverse";
    Constants.UserBehaviorModules = [
        "lights.js", "sound.js", "throb.js", "urlLink.js", "bounce.js", "simpleSpin.js", "text3D.js", "script.js", "flag.js"
    ];

    Constants.DefaultCards = [
        {
            card: {
                name: "entrance",
                type: "object",
                translation: [0, 0.4, 2],
                spawn: "default",
            }
        },
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
                name: "scratch cat",
                type: "3d",
                dataLocation: "./assets/3D/scratch_cat.glb.zip",
                layers: ["pointer"],
                translation: [4.3, -0.27, -8.5],
                dataScale: [2, 2, 2],
                shadow: true,
                sound: "./assets/sounds/Meow.wav",
                behaviorModules: ["SpriteSound", "Throb"],
                throbTimes: 1,
            }
        },
        {
            card: {
                name: "dynalab",
                translation: [0, 0.4, -10],
                scale: [4, 4, 4],
                type: "2d",
                textureType: "image",
                textureLocation: "35hx21Njx2Qq88GJL9vtaSGIhcAE1Ty9AlN52EAjdykUXUFBRUYPGhpTXFlQRhtARhtWR1pEQFBBG1xaGkAaT2BBQmV6T3NAemYEflxSeG9cAAYMTXNxcg0FBxpcWhtWR1pEQFBBG1hcVkdaQ1BHRlAbWVpWVFlRUENRUFNUQFlBGnRMQVBScQRYdn0FV1RGUVBBeHYEAwRiVkFbUmFNTQRscEUGRF8AbEBxAloaUVRBVBpgc0VXbGVnZnJGf2dsdmQGY35ScllXcGJqGAJ-Aw0YU1B_XUUHW3d_XANG",
                fullBright: true,
                frameColor: 0xcccccc,
                color: 0xbbbbbb,
                cornerRadius: 0.05,
                depth: 0.05,
                shadow: true,
                behaviorModules: ["URLLink"],
                // cardURL: "https://github.com/dynalab-live",
            }
        },
        {
            card: {
                name: "windmill",
                type: "3d",
                dataLocation: "./assets/3D/windmill.glb.zip",
                layers: ["pointer"],
                translation: [-4, 0.4, -10],
                dataScale: [0.7, 0.7, 0.7],
                shadow: true,
                behaviorModules: ["SimpleSpin"],
            }
        },
        {
            card: {
                name: "scratch cat flying",
                translation: [12, 0.70, -10.24],
                rotation: [0, -Math.PI / 2, 0],
                behaviorModules: ["Bounce"],
                scale: [3, 3, 3],
                width: 1,
                height: 1,
                layers: ["pointer"],
                type: "2d",
                dataLocation: "./assets/SVG/full-circle.svg",
                textureType: "dynamic",
                textureWidth: 1024,
                textureHeight: 1024,
                frameColor: 0x888888,
                color: 0xffffff,
                depth: 0.05,
                fullBright: true,
            }
        },
        {
            card: {
                name: "welcome message",
                text: "Welcome",
                color: 0xF0493E,
                frameColor: 0x444444,
                weight: 'bold',
                font: "helvetiker",
                fullBright: true,
                bevelEnabled: false,
                translation: [-8, -1, -10],
                rotation: [0, Math.PI / 4, 0],
                scale: [2, 2, 2],
                behaviorModules: ["Text3D", "Throb"],
                shadow: true,
                throbTimes: 3,
            }
        },
        {
            card: {
                name: "code editor",
                translation: [11.914606500892997, 0.4, 0.25],
                rotation: [0, -Math.PI / 2, 0],
                scale: [2, 2, 2],
                layers: ["pointer"],
                type: "code",
                behaviorModule: "Script.ScriptActor",
                margins: {left: 32, top: 32, right: 32, bottom: 32},
                // margins: {left: 16, top: 16, right: 16, bottom: 16},
                textScale: 0.001,
                width: 1.5,
                height: 2,
                depth: 0.05,
                fullBright: true,
                frameColor: 0x888888,
            }
        },
        {
            card: {
                name: "green flag",
                translation: [11.914606500892997, 2.55, -1.1],
                scale: [0.2, 0.2, 0.2],
                rotation: [0, -Math.PI / 2, 0],
                type: "2d",
                textureType: "image",
                textureLocation: "./assets/images/green-flag.jpg",
                fullBright: true,
                frameColor: 0xcccccc,
                color: 0xbbbbbb,
                cornerRadius: 0.05,
                depth: 0.05,
                shadow: true,
                behaviorModules: ["ScratchFlag", "Script"],
            }
        },
        // {
        //     card: {
        //         name: "scratch cat 2",
        //         type: "3d",
        //         dataLocation: "./assets/3D/scratch_cat.glb.zip",
        //         layers: ["pointer"],
        //         translation: [10.42596507350599, 0.4, 4.034355344818362],
        //         rotation: [0, -Math.PI / 2, 0],
        //         dataScale: [2, 2, 2],
        //         shadow: true,
        //         sound: "./assets/sounds/Meow.wav",
        //         behaviorModules: ["SpriteSound", "Throb"],
        //         throbTimes: 1,
        //     }
        // },
        {
            card: {
                name: "windmill2",
                type: "3d",
                dataLocation: "./assets/3D/windmill.glb.zip",
                layers: ["pointer"],
                translation: [10.42596507350599, 0.4, 4.034355344818362],
                dataScale: [0.7, 0.7, 0.7],
                shadow: true,
            }
        },
    ];
}
