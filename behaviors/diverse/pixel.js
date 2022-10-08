class PixelActor {
    setup() {
        this.leds = [];
        const pixelX = this._cardData.pixelX || 5;
        const pixelY = this._cardData.pixelY || 5;
        const spacingCol = this._cardData.spacingCol || 0.05;
        const spacingRow = this._cardData.spacingRow || 0.05;
        const ledWidth = this._cardData.ledWidth || 0.2;
        const ledHeight = this._cardData.ledHeight || 0.2;
        const boardWidth = this._cardData.width ||= ledWidth * pixelX + spacingCol * (pixelX + 1);
        const boardHeight = this._cardData.height ||= ledHeight * pixelY + spacingRow * (pixelY + 1);
        const boardDepth = this._cardData.depth ||= 0.05;

        for (let x = 0; x < pixelX; x++) {
            for (let y = 0; y < pixelY; y++) {
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

        this.state = this.initialState();
    }

    initialState() {
        return [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];
    }

    setPixel(x, y, color) {
        this.state[x][y] = color;
        this.render();
        console.log("setPixel", this.state);
    }

    render() {
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                const on = this.state[x][y];
                const led = this.leds[x * 5 + y];
                if (on) {
                    const color = this.state[x][y];
                    this.publish(led.id, "ledOn", color);
                } else {
                    this.publish(led.id, "ledOff");
                }
            }
        }
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    getRandomColor() {
        return new Microverse.THREE.Color(Math.random(), Math.random(), Math.random());
    }
}

class PixelPawn {
    setup() {
        const THREE = Microverse.THREE;
        const boardWidth = this.actor._cardData.width;
        const boardHeight = this.actor._cardData.height;
        const boardDepth = this.actor._cardData.depth;

        const board = new THREE.Mesh(
            new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth, 2, 2, 2),
            new THREE.MeshBasicMaterial({color: 0x000000}),
        );

        this.shape.add(board);
    }
}

class LEDActor {
    setup() {

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
        this.light = new THREE.PointLight(0x000000, 0, 3);
        this.led.add(this.light);

        this.shape.add(this.led);

        this.subscribe(this.actor.id, "ledOn", "ledOn");
        this.subscribe(this.actor.id, "ledOff", "ledOff");
    }

    ledOn(color) {
        console.log("subscribe ledOn", this.actor.id, this.led, color);
        this.led.material.color.set(color);
        this.light.color.set(color);
        this.light.intensity = 1;
    }

    ledOff() {
        this.led.material.color.set(0x000000);
        this.light.intensity = 0;
    }
}

export default {
    modules: [
        {
            name: "Pixel",
            actorBehaviors: [PixelActor],
            pawnBehaviors: [PixelPawn]
        },
        {
            name: "LED",
            actorBehaviors: [LEDActor],
            pawnBehaviors: [LEDPawn]
        }
    ]
}

/* globals Microverse */
