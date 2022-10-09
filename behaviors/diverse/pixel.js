class MbitDisplayActor {
    setup() {
        this.generateLed();
        this.state = this.initialState(this.pixelX, this.pixelY);
        this.image = {
            HEART: [
                [0, 1, 0, 1, 0],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [0, 1, 1, 1, 0],
                [0, 0, 1, 0, 0],
            ],
            HEART_SMALL: [
                [0, 0, 0, 0, 0],
                [0, 1, 0, 1, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0]
            ],
            HAPPY: [
                [0, 0, 0, 0, 0],
                [0, 1, 0, 1, 0],
                [0, 0, 0, 0, 0],
                [1, 0, 0, 0, 1],
                [0, 1, 1, 1, 0],
            ]
        }
        // this.show(this.image.HEART);
        this.throb();
    }

    generateLed() {
        this.leds = [];
        this.pixelX = this._cardData.pixelX || 5;
        this.pixelY = this._cardData.pixelY || 5;
        const spacingCol = this._cardData.spacingCol || 0.05;
        const spacingRow = this._cardData.spacingRow || 0.05;
        const ledWidth = this._cardData.ledWidth || 0.2;
        const ledHeight = this._cardData.ledHeight || 0.2;
        const boardWidth = this._cardData.width ||= ledWidth * this.pixelX + spacingCol * (this.pixelX + 1);
        const boardHeight = this._cardData.height ||= ledHeight * this.pixelY + spacingRow * (this.pixelY + 1);
        const boardDepth = this._cardData.depth ||= 0.05;

        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const led = this.createCard({
                    translation: [(2 * x + 1) / 2 * ledWidth + spacingCol * (x + 1) - boardWidth / 2,
                        -(2 * y + 1) / 2 * ledHeight - spacingRow * (y + 1) + boardHeight / 2, 0],
                    name: `led-${x}-${y}`,
                    behaviorModules: ["LED"],
                    parent: this,
                    type: "object",
                    width: ledWidth,
                    height: ledHeight,
                    coordinate: [x, y],
                });
                this.leds.push(led);
            }
        }
    }

    initialState(x, y) {
        return new Array(x).fill(0).map(() => new Array(y).fill(0));
    }

    setPixel(x, y) {
        this.state[x][y] = 1;
        console.log("setPixel", this.state);
    }

    show(image) {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                this.state[x][y] = image[y][x];
            }
        }
        this.say("render");
        // console.log(this.state);
    }

    throb() {
        const delay = 500;
        this.show(this.image.HEART);
        this.future(delay).show(this.image.HEART_SMALL);
        this.future(delay * 2).throb();
    }
}

class MbitDisplayPawn {
    setup() {
        this.generateBoard();
        this.render();
        this.listen("render", "render");
    }

    generateBoard() {
        const THREE = Microverse.THREE;
        this.pixelX = this.actor._cardData.pixelX;
        this.pixelY = this.actor._cardData.pixelY;
        const boardWidth = this.actor._cardData.width;
        const boardHeight = this.actor._cardData.height;
        const boardDepth = this.actor._cardData.depth;

        const board = new THREE.Mesh(
            new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth, 2, 2, 2),
            new THREE.MeshBasicMaterial({color: 0x000000}),
        );

        this.shape.add(board);
    }

    render() {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const on = this.actor.state[x][y];
                const led = this.actor.leds[x * this.pixelY + y];
                if (on) {
                    this.publish(led.id, "ledOn", {color: 0xFF0000, intensity: 1});
                } else {
                    this.publish(led.id, "ledOff", {color: 0x000000, intensity: 0});
                }
            }
        }
    }
}

class BagDisplayActor {
    setup() {
        this.pixelX = this._cardData.pixelX || 16;
        this.pixelY = this._cardData.pixelY || 16;
        this.state = this.initialState(this.pixelX, this.pixelY);
        // this.subscribe("input", "xDown", "showSnowCrash");

        this.step();
    }

    // you may see the error: Send rate exceeded, when every led is a card
    step() {
        this.showSnowCrash();
        this.future(100).step();
    }

    initialState(x, y) {
        return new Array(x).fill(0).map(() => new Array(y).fill(0));
    }

    setPixel(x, y, color) {
        this.state[x][y] = color;
        // console.log("setPixel", this.state);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    getRandomColor() {
        return new Microverse.THREE.Color(Math.random(), Math.random(), Math.random());
    }

    showSnowCrash() {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                if (this.getRandomInt(2) === 1) {
                    this.setPixel(x, y, 0xFFFFFF);
                } else {
                    this.setPixel(x, y, 0x000000);
                }
            }
        }
        this.say("render");
    }
}

class BagDisplayPawn {
    setup() {
        this.generatePixel();

        this.render();
        this.listen("render", "render");
    }

    generatePixel() {
        const THREE = Microverse.THREE;

        this.leds = [];
        this.pixelX = this.actor._cardData.pixelX || 16;
        this.pixelY = this.actor._cardData.pixelY || 16;
        const spacingCol = this.actor._cardData.spacingCol || 0.05;
        const spacingRow = this.actor._cardData.spacingRow || 0.05;
        const ledWidth = this.actor._cardData.ledWidth || 0.2;
        const ledHeight = this.actor._cardData.ledHeight || 0.2;
        const boardWidth = this.actor._cardData.width ||= ledWidth * this.pixelX + spacingCol * (this.pixelX + 1);
        const boardHeight = this.actor._cardData.height ||= ledHeight * this.pixelY + spacingRow * (this.pixelY + 1);
        const boardDepth = this.actor._cardData.depth ||= 0.05;

        const board = new THREE.Mesh(
            new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth, 2, 2, 2),
            new THREE.MeshBasicMaterial({color: 0x000000}),
        );

        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const led = new THREE.Mesh(
                    new THREE.BoxGeometry(ledWidth, ledHeight, 0.1, 2, 2, 2),
                    new THREE.MeshBasicMaterial({color: 0x000000}));
                const translation = [(2 * x + 1) / 2 * ledWidth + spacingCol * (x + 1) - boardWidth / 2,
                    -(2 * y + 1) / 2 * ledHeight - spacingRow * (y + 1) + boardHeight / 2, 0];
                led.position.set(translation[0], translation[1], translation[2]);
                board.add(led);
                this.leds.push(led);
            }
        }

        this.shape.add(board);
    }

    render() {
        for (let x = 0; x < this.pixelX; x++) {
            for (let y = 0; y < this.pixelY; y++) {
                const on = this.actor.state[x][y];
                const led = this.leds[x * this.pixelY + y];
                if (on) {
                    const color = this.actor.state[x][y];
                    led.material.color.set(color);
                } else {
                    led.material.color.set(0x000000);
                }
            }
        }
    }
}

class LEDActor {
    setup() {
        this.subscribe(this.id, "ledOn", "updateLed");
        this.subscribe(this.id, "ledOff", "updateLed");
    }

    updateLed({color, intensity}) {
        this.say("updateLed", {color, intensity});
    }
}

class LEDPawn {
    setup() {
        const THREE = Microverse.THREE;
        const width = this.actor._cardData.width;
        const height = this.actor._cardData.height;

        this.led = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, 0.1, 2, 2, 2),
            new THREE.MeshBasicMaterial({color: 0x000000}));

        // if you try to increase the number of lights (change pixelX or pixelY), you may see the error:
        // Program Info Log: FRAGMENT shader uniforms count exceeds MAX_FRAGMENT_UNIFORM_VECTORS(1024)
        // so comment out temporarily
        this.light = new THREE.PointLight(0x000000, 0, 3);
        this.led.add(this.light);

        this.shape.add(this.led);

        this.listen("updateLed", "updateLed");
    }

    updateLed({color, intensity}) {
        this.led.material.color.set(color);
        this.light.color.set(color);
        this.light.intensity = intensity;
    }
}

export default {
    modules: [
        {
            name: "MbitDisplay",
            actorBehaviors: [MbitDisplayActor],
            pawnBehaviors: [MbitDisplayPawn]
        },
        {
            name: "BagDisplay",
            actorBehaviors: [BagDisplayActor],
            pawnBehaviors: [BagDisplayPawn]
        },
        {
            name: "LED",
            actorBehaviors: [LEDActor],
            pawnBehaviors: [LEDPawn]
        }
    ]
}

/* globals Microverse */
