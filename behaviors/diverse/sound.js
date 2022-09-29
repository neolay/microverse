class SpriteSoundActor {
    setup() {
        this.audio = new Audio(this._cardData.sound);
        this.listen("play", "playSound");
    }

    playSound() {
        if (this.audio) {
            this.audio.play();
        }
    }
}

class SpriteSoundPawn {
    setup() {
        this.addEventListener("pointerDown", "playSound");
    }

    playSound() {
        this.say("play");
    }
}

export default {
    modules: [
        {
            name: "SpriteSound",
            actorBehaviors: [SpriteSoundActor],
            pawnBehaviors: [SpriteSoundPawn]
        }
    ]
}

/* globals Microverse */
