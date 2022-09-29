class ScriptActor {

    // save it and go

    setup() {
        this.listen("scratchGo", "runScript")
        this.angle = 0; // the initial angle
        this.spinSpeed = 1; // how fast will we spin
        this.windmill = this.queryCards().filter((c) => c.name === "windmill2")[0];
    }

    runScript() {
        console.log("runScript");
        this.step();
    }

    step() {
        this.future(20).step();
        this.angle += this.spinSpeed / 100;
        this.windmill.set({rotation: Microverse.q_euler(this.angle, 0, 0)});
    }

}

export default {
    modules: [
        {
            name: "Script",
            actorBehaviors: [ScriptActor],
        },
    ]
}

/* globals Microverse */
