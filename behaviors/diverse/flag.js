class ScratchFlagPawn {
    setup() {
        this.addEventListener("pointerDown", "go");
    }

    go() {
        console.log("scratchGo");
        this.say("scratchGo");
    }
}

export default {
    modules: [
        {
            name: "ScratchFlag",
            pawnBehaviors: [ScratchFlagPawn]
        }
    ]
}

/* globals Microverse */
