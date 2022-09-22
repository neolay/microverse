class GizmoActor {
    setup() {
        console.log("actor", this.parent);

        this.listen("cycleModes", "cycleModes");
        this.cycleModes();
    }

    cycleModes() {
        console.log("cycling modes, before: ", this.gizmoMode);
        if (!this.gizmoMode || this.gizmoMode === "scale") {
            if (this.gizmoMode === "scale") {
                this.scaleX.destroy();
                this.scaleY.destroy();
                this.scaleZ.destroy();
            }

            this.gizmoMode = "move";

            this.moveX = this.createCard({
                translation: [0, 0, 0],
                name: 'gizmoAxisX',
                behaviorModules: ["GizmoAxis"],
                parent: this,
                type: "object",
                noSave: true,
                axis: [1, 0, 0],
                color: 0xff0000,
                hoverColor: 0xffff00
            });

            this.moveY = this.createCard({
                translation: [0, 0, 0],
                name: 'gizmoAxisY',
                behaviorModules: ["GizmoAxis"],
                parent: this,
                type: "object",
                noSave: true,
                axis: [0, 1, 0],
                color: 0x00ff00,
                hoverColor: 0xffff00
            });

            this.moveZ = this.createCard({
                translation: [0, 0, 0],
                name: 'gizmoAxisZ',
                behaviorModules: ["GizmoAxis"],
                parent: this,
                type: "object",
                noSave: true,
                axis: [0, 0, 1],
                color: 0x0000ff,
                hoverColor: 0xffff00
            });
        } else if (this.gizmoMode === "move") {
            this.moveX.destroy();
            this.moveY.destroy();
            this.moveZ.destroy();

            this.rotateX = this.createCard({
                translation: [0, 0, 0],
                name: 'gizmoRotorX',
                behaviorModules: ["GizmoRotor"],
                parent: this,
                type: "object",
                noSave: true,
                axis: [1, 0, 0],
                color: 0xff0000,
                hoverColor: 0xffff00
            });

            this.rotateY = this.createCard({
                translation: [0, 0, 0],
                name: 'gizmoRotorY',
                behaviorModules: ["GizmoRotor"],
                parent: this,
                type: "object",
                noSave: true,
                axis: [0, 1, 0],
                color: 0x00ff00,
                hoverColor: 0xffff00
            });

            this.rotateZ = this.createCard({
                translation: [0, 0, 0],
                name: 'gizmoRotorZ',
                behaviorModules: ["GizmoRotor"],
                parent: this,
                type: "object",
                noSave: true,
                axis: [0, 0, 1],
                color: 0x0000ff,
                hoverColor: 0xffff00
            });

            this.gizmoMode = "rotate";
        } else if (this.gizmoMode == "rotate") {
            this.gizmoMode = "scale";

            console.log("before destroy")

            this.rotateX.destroy();
            this.rotateY.destroy();
            this.rotateZ.destroy();

            console.log("after destroy")

            this.scaleX = this.createCard({
                translation: [0, 0, 0],
                name: 'gizmoScalerX',
                behaviorModules: ["GizmoScaler"],
                parent: this,
                type: "object",
                noSave: true,
                axis: [1, 0, 0],
                color: 0xff0000,
                hoverColor: 0xffff00
            });

            this.scaleY = this.createCard({
                translation: [0, 0, 0],
                name: 'gizmoScalerY',
                behaviorModules: ["GizmoScaler"],
                parent: this,
                type: "object",
                noSave: true,
                axis: [0, 1, 0],
                color: 0x00ff00,
                hoverColor: 0xffff00
            });

            this.scaleZ = this.createCard({
                translation: [0, 0, 0],
                name: 'gizmoScalerZ',
                behaviorModules: ["GizmoScaler"],
                parent: this,
                type: "object",
                noSave: true,
                axis: [0, 0, 1],
                color: 0x0000ff,
                hoverColor: 0xffff00
            });
        }
        console.log("cycled modes, now: ", this.gizmoMode);
    }
}

class GizmoPawn {
    setup() {
        console.log("pawn", this.parent)
    }
}

class GizmoAxisActor {
    setup() {
        this.listen("translateTarget", "translateTarget");
    }

    translateTarget(translation) {
        this.parent.parent.set({translation})
    }
}

class GizmoAxisPawn {
    setup() {
        this.originalColor = this.actor._cardData.color;

        let isMine = this.getMyAvatar().gizmoTargetPawn === this.parent.parent;

        const gyro = new Microverse.THREE.Gyroscope({rotationInvariant: true, scaleInvariant: true});
        this.shape.add(gyro);
        gyro.add(
            this.makeAxisHelper(isMine)
        );

        this.dragStart = undefined;
        this.positionAtDragStart = undefined;
        // this.movementEnabled = false;

        if (isMine) {
            this.addEventListener("pointerDown", "startDrag");
            this.addEventListener("pointerMove", "drag");
            this.addEventListener("pointerUp", "endDrag");
            this.addEventListener("pointerEnter", "pointerEnter");
            this.addEventListener("pointerLeave", "pointerLeave");
        }
    }

    makeAxisHelper(isMine) {
        return new Microverse.THREE.ArrowHelper(
            new Microverse.THREE.Vector3(...this.actor._cardData.axis),
            new Microverse.THREE.Vector3(0, 0, 0),
            3,
            isMine ? this.originalColor : 0xffffff
        )
    }

    startDrag(event) {
        let avatar = Microverse.GetPawn(event.avatarId);
        let target = this.actor.parent.parent;

        // avatar.addFirstResponder("pointerMove", {shiftKey: true}, this);
        avatar.addFirstResponder("pointerMove", {}, this);
        let {m4_invert,v3_transform, m4_identity} = Microverse;

        this._parentGlobal = target._parent ? target._parent.global : m4_identity();
        this._parentInvert = target._parent ? m4_invert(target._parent.global) : m4_identity();
        this.positionAtDragStart = target.translation;
        this.dragStart = event.xyz;
        this.globalStart = v3_transform(target.translation, this._parentGlobal);

        console.log("dragStart", this.positionAtDragStart, this.globalStart);

        // if we are dragging along the Y axis
        this.intersectionPlane = new Microverse.THREE.Plane();

        console.log(this.actor._cardData.axis);
        if (this.actor._cardData.axis[0] === 1 || this.actor._cardData.axis[1] === 1) {
            // intersect with the XY plane
            this.intersectionPlane.setFromNormalAndCoplanarPoint(
                new Microverse.THREE.Vector3(0, 0, 1),
                new Microverse.THREE.Vector3(...this.globalStart)
            );
        } else {
            // intersect with the YZ plane
            this.intersectionPlane.setFromNormalAndCoplanarPoint(
                new Microverse.THREE.Vector3(1, 0, 0),
                new Microverse.THREE.Vector3(...this.globalStart)
            );
        }
        console.log("intersectionPlane", this.intersectionPlane);
    }

    drag(event) {
        if (this.dragStart) {
            let origin = new Microverse.THREE.Vector3(...event.ray.origin);
            let direction = new Microverse.THREE.Vector3(...event.ray.direction);
            let ray = new Microverse.THREE.Ray(origin, direction);
            let intersectionPoint = ray.intersectPlane(
                this.intersectionPlane,
                new Microverse.THREE.Vector3()
            );

            // console.log("intersectionPoint", intersectionPoint);

            if (!intersectionPoint) {return;}

            let globalHere = intersectionPoint.toArray();
            let globalStart = this.dragStart;

            let localHere = Microverse.v3_transform(globalHere, this._parentInvert);
            let localStart = Microverse.v3_transform(globalStart, this._parentInvert);
            let delta3D = Microverse.v3_sub(localHere, localStart);

            let nextPosition = [...this.positionAtDragStart];
            if (this.actor._cardData.axis[0] === 1) {
                nextPosition[0] += delta3D[0];
            } else if (this.actor._cardData.axis[1] === 1) {
                nextPosition[1] += delta3D[1];
            } else if (this.actor._cardData.axis[2] === 1) {
                nextPosition[2] += delta3D[2];
            }
            // console.log(nextPosition);
            this.publish(this.actor.id, "translateTarget", nextPosition);
            // this.set({translation: nextPosition})
        }
    }

    endDrag(event) {
        console.log("end on axis", event);
        this.dragStart = undefined;
        const avatar = Microverse.GetPawn(event.avatarId);
        // avatar.removeFirstResponder("pointerMove", {shiftKey: true}, this);
        avatar.removeFirstResponder("pointerMove", {}, this);
    }

    pointerEnter() {
        console.log("hover");
        this.shape.children[0].children[0].setColor(this.actor._cardData.hoverColor);
    }

    pointerLeave() {
        this.shape.children[0].children[0].setColor(this.originalColor);
    }
}

class GizmoRotorActor {
    setup() {
        this.listen("rotateTarget", "rotateTarget");
    }

    rotateTarget(rotation) {
        console.log("rotating target", rotation);
        this.parent.parent.set({rotation})
    }
}

class GizmoRotorPawn {
    setup() {
        this.originalColor = this.actor._cardData.color;
        const gyro = new THREE.Gyroscope({scaleInvariant: true});
        let isMine = this.getMyAvatar().gizmoTargetPawn == this.parent.parent;
        this.shape.add(gyro);
        gyro.add(this.createCircle(isMine ? this.actor._cardData.color : 0xffffff, this.actor._cardData.axis));

        this.dragStart = undefined;
        this.rotationAtDragStart = undefined;
        this.movementEnabled = false;
        if (isMine) {
            this.addEventListener("pointerDown", "startDrag");
            this.addEventListener("pointerMove", "drag");
            this.addEventListener("pointerUp", "endDrag");
            this.addEventListener("pointerEnter", "pointerEnter");
            this.addEventListener("pointerLeave", "pointerLeave");
        }
    }

    createCircle(color, axis) {
        const curve = new Microverse.THREE.EllipseCurve(
            0.0, 0.0,            // Center x, y
            2.0, 2.0,          // x radius, y radius
            0.0, 2.0 * Math.PI,  // Start angle, stop angle
        );

        const pts = curve.getSpacedPoints(256);
        const geo = new Microverse.THREE.BufferGeometry().setFromPoints(pts);

        if (axis[1] == 1) {
            geo.rotateX(Math.PI / 2);
        } else if (axis[0] == 1) {
            geo.rotateY(Math.PI / 2);
        }

        console.log(geo);

        const mat = new Microverse.THREE.LineBasicMaterial({ color, toneMapped: false });
        const circle = new Microverse.THREE.LineLoop(geo, mat);
        return circle
    }

    localRotationAxis() {
        return Microverse.v3_rotate(this.actor._cardData.axis, this.rotationAtDragStart);
    }

    rotationInteractionPlane() {
        const interactionPlane = new Microverse.THREE.Plane();
        interactionPlane.setFromNormalAndCoplanarPoint(new Microverse.THREE.Vector3(...this.localRotationAxis()), new Microverse.THREE.Vector3(...this.actor.parent.parent._translation));
        // if (window.planeHelper) {
        //     this.shape.parent.remove(window.planeHelper);
        //     window.planeHelper = undefined;
        // }
        // window.planeHelper = new Microverse.THREE.PlaneHelper( interactionPlane, 10, 0xffff00 )
        // this.shape.parent.add(window.planeHelper);
        return interactionPlane;
    }

    startDrag(event) {
        console.log("start on axis", event);
        const avatar = Microverse.GetPawn(event.avatarId);
        // avatar.addFirstResponder("pointerMove", {shiftKey: true}, this);
        avatar.addFirstResponder("pointerMove", {}, this);
        this.rotationAtDragStart = [...(this.actor.parent.parent._rotation || Microverse.q_identity())];

        this.dragStart = event.ray.intersectPlane(
            this.rotationInteractionPlane(),
            new Microverse.THREE.Vector3()
        );

    }

    drag(event) {
        if (this.dragStart) {
            const newDragPoint = event.ray.intersectPlane(
                this.rotationInteractionPlane(),
                new Microverse.THREE.Vector3()
            );

            const startDirection = new Microverse.THREE.Vector3(...this.dragStart)
                .sub(new Microverse.THREE.Vector3(...this.actor.parent.parent._translation))
                .normalize();
            const newDirection = new Microverse.THREE.Vector3(...newDragPoint)
                .sub(new Microverse.THREE.Vector3(...this.actor.parent.parent._translation))
                .normalize();

            const normal = new Microverse.THREE.Vector3(...this.localRotationAxis());

            const angle = Math.atan2(startDirection.clone().cross(newDirection).dot(normal), startDirection.dot(newDirection))

            const nextRotation = Microverse.q_multiply(
                this.rotationAtDragStart,
                Microverse.q_axisAngle(this.localRotationAxis(), angle)
            );

            console.log("drag on axis", event, angle);
            this.publish(this.actor.id, "rotateTarget", nextRotation)
        }
    }

    endDrag(event) {
        console.log("end on axis", event);
        this.dragStart = undefined;
        const avatar = Microverse.GetPawn(event.avatarId);
        // avatar.removeFirstResponder("pointerMove", {shiftKey: true}, this);
        avatar.removeFirstResponder("pointerMove", {}, this);
    }

    pointerEnter() {
        console.log("hover");
        this.shape.children[0].children[0].material.color.set(this.actor._cardData.hoverColor);
    }

    pointerLeave() {
        this.shape.children[0].children[0].material.color.set(this.originalColor);
    }
}

class GizmoScalerActor {
    setup() {
        this.listen("scaleTarget", "scaleTarget");
    }

    scaleTarget(scale) {
        console.log("scale target", scale);
        this.parent.parent.set({scale})
    }
}

// TODO: lots of duplication here with GizmoAxisPawn until behaviour classes can reference/extend each other
class GizmoScalerPawn {
    setup() {
        this.originalColor = this.actor._cardData.color;

        let isMine = this.getMyAvatar().gizmoTargetPawn == this.parent.parent;

        const gyro = new THREE.Gyroscope({scaleInvariant: true});
        this.shape.add(gyro);
        gyro.add(
            this.makeAxisHelper(isMine)
        );

        this.dragStart = undefined;
        this.positionAtDragStart = undefined;
        this.movementEnabled = false;
        this.addEventListener("pointerDown", "startDrag");
        this.addEventListener("pointerMove", "drag");
        this.addEventListener("pointerUp", "endDrag");
        this.addEventListener("pointerEnter", "pointerEnter");
        this.addEventListener("pointerLeave", "pointerLeave");
    }

    makeAxisHelper(isMine) {
        const points = [];
        points.push(new Microverse.THREE.Vector3(0, 0, 0));
        points.push((new Microverse.THREE.Vector3(...this.actor._cardData.axis)).multiplyScalar(3));

        const geometry = new Microverse.THREE.BufferGeometry().setFromPoints( points );
        const material = new Microverse.THREE.LineBasicMaterial({color: isMine ? this.originalColor : 0xffffff, toneMapped: false});

        const line = new Microverse.THREE.Line(geometry, material);

        const boxGeometry = new Microverse.THREE.BoxGeometry(0.3, 0.3, 0.3);
        const boxMaterial = new Microverse.THREE.MeshBasicMaterial({color: isMine ? this.originalColor : 0xffffff, toneMapped: false});
        const box = new Microverse.THREE.Mesh(boxGeometry, boxMaterial);
        box.translateOnAxis(new Microverse.THREE.Vector3(...this.actor._cardData.axis), 3);

        const group = new Microverse.THREE.Group();
        group.add(line);
        group.add(box);
        return group;
    }

    localRotationAxis() {
        let orthAxis = this.actor._cardData.axis[0] == 1 ? [0, 0, 1] : this.actor._cardData.axis[1] == 1 ? [0, 0, 1] : [1, 0, 0];
        return Microverse.v3_rotate(orthAxis, this.actor.parent.parent._rotation || Microverse.q_identity());
    }

    rotationInteractionPlane() {
        const interactionPlane = new Microverse.THREE.Plane();
        interactionPlane.setFromNormalAndCoplanarPoint(new Microverse.THREE.Vector3(...this.localRotationAxis()), new Microverse.THREE.Vector3(...this.actor.parent.parent._translation));
        // if (window.planeHelper) {
        //     this.shape.parent.remove(window.planeHelper);
        //     window.planeHelper = undefined;
        // }
        // window.planeHelper = new Microverse.THREE.PlaneHelper( interactionPlane, 10, 0xffff00 )
        // this.shape.parent.add(window.planeHelper);
        return interactionPlane;
    }

    startDrag(event) {
        console.log("start on axis", event);
        const avatar = Microverse.GetPawn(event.avatarId);
        // avatar.addFirstResponder("pointerMove", {shiftKey: true}, this);
        avatar.addFirstResponder("pointerMove", {}, this);
        this.scaleAtDragStart = [...this.actor.parent.parent.scale];

        this.dragStart = event.ray.intersectPlane(
            this.rotationInteractionPlane(),
            new Microverse.THREE.Vector3()
        );
    }

    drag(event) {
        if (this.dragStart) {
            console.log("drag on axis", event);
            const newDragPoint = event.ray.intersectPlane(
                this.rotationInteractionPlane(),
                new Microverse.THREE.Vector3()
            );

            let distanceAtDragStart = new Microverse.THREE.Vector3(...this.dragStart).sub(new Microverse.THREE.Vector3(...this.actor.parent.parent._translation)).length();
            let distanceAtDragEnd = new Microverse.THREE.Vector3(...newDragPoint).sub(new Microverse.THREE.Vector3(...this.actor.parent.parent._translation)).length();

            const scale = distanceAtDragEnd / distanceAtDragStart;

            console.log("scale", scale);

            let nextScale = [...this.scaleAtDragStart];
            let scaledCoordinate = this.actor._cardData.axis.findIndex(a => a == 1);
            nextScale[scaledCoordinate] *= scale;

            this.publish(this.actor.id, "scaleTarget", nextScale);
        }
    }

    endDrag(event) {
        console.log("end on axis", event);
        this.dragStart = undefined;
        const avatar = Microverse.GetPawn(event.avatarId);
        // avatar.removeFirstResponder("pointerMove", {shiftKey: true}, this);
        avatar.removeFirstResponder("pointerMove", {}, this);
    }

    pointerEnter() {
        console.log("hover");
        this.shape.children[0].children[0].children.forEach(child => child.material.color.set(this.actor._cardData.hoverColor));
    }

    pointerLeave() {
        this.shape.children[0].children[0].children.forEach(child => child.material.color.set(this.originalColor));
    }
}

export default {
    modules: [
        {
            name: "Gizmo",
            actorBehaviors: [GizmoActor],
            pawnBehaviors: [GizmoPawn],
        },
        {
            name: "GizmoAxis",
            actorBehaviors: [GizmoAxisActor],
            pawnBehaviors: [GizmoAxisPawn],
        },
        {
            name: "GizmoRotor",
            actorBehaviors: [GizmoRotorActor],
            pawnBehaviors: [GizmoRotorPawn],
        },
        {
            name: "GizmoScaler",
            actorBehaviors: [GizmoScalerActor],
            pawnBehaviors: [GizmoScalerPawn],
        }
    ]
}

/* globals Microverse */
