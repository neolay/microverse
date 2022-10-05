class PixelActor {
    setup() {
        const pixelX = this._cardData.pixelX || 5;
        const pixelY = this._cardData.pixelY || 5;
        const spacingCol = this._cardData.spacingCol || 0.05;
        const spacingRow = this._cardData.spacingRow || 0.05;
        const ledWidth = this._cardData.ledWidth || 0.2;
        const ledHeight = this._cardData.ledHeight || 0.2;
        const boardWidth = this._cardData.width ||= ledWidth * pixelX + spacingCol * (pixelX + 1);
        const boardHeight = this._cardData.height ||= ledHeight * pixelY + spacingRow * (pixelY + 1);
        const boardDepth = this._cardData.depth ||= 0.05;

        for (let i = 0; i < pixelX; i++) {
            for (let j = 0; j < pixelY; j++) {
                this.createCard({
                    translation: [(2 * i + 1) / 2 * ledWidth + spacingCol * (i + 1) - boardWidth / 2,
                        -(2 * j + 1) / 2 * ledHeight - spacingRow * (j + 1) + boardHeight / 2, 0],
                    name: `led-${i}-${j}`,
                    behaviorModules: ["LED"],
                    parent: this,
                    type: "object",
                    width: ledWidth,
                    height: ledHeight,
                    coordinate: [i, j],
                });
            }
        }
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

        const led = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, 0.1, 2, 2, 2),
            new THREE.MeshStandardMaterial({color: 0xEEEEEE, emissive: 0xEEEEEE}));

        this.shape.add(led);
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
