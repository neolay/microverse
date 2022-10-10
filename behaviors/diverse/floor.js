class FloorPawn {
    setup() {
        let THREE = Microverse.THREE;

        if (this.floor) {
            this.shape.remove(this.floor);
            this.floor.dispose();
        }

        this.floor = new THREE.Mesh(
            new THREE.BoxGeometry(100, 0.1, 100, 1, 1, 1),
            new THREE.MeshStandardMaterial({color: 0xcccccc}));
        this.floor.receiveShadow = true;
        this.shape.add(this.floor);
        this.cleanupColliderObject()
        if (this.actor.layers && this.actor.layers.includes("walk")) {
            this.constructCollider(this.floor);
        }
    }
}

export default {
    modules: [
        {
            name: "Floor",
            pawnBehaviors: [FloorPawn],
        }
    ]
}

/* globals Microverse */
