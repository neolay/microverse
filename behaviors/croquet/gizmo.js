class GizmoActor {
    setup() {
        console.log("actor", this.parent);
        this.listen("cycleModes", "cycleModes");
        this.cycleModes();
        this.addPropertySheetButton();
        this.subscribe(this.target.id, "translationSet", "translateTarget");
        this.subscribe(this.target.id, "rotationSet", "rotateTarget");
        this.subscribe(this.target.id, "scaleSet", "scaleTarget");
    }

    getScale(m) {
        let x = [m[0], m[1], m[2]];
        let y = [m[4], m[5], m[6]];
        let z = [m[8], m[9], m[10]];

        let length = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

        return [length(x), length(y), length(z)];
    }

    translateTarget() {
        let t = this.target.translation;
        let s = this.target.parent ? this.getScale(this.target.parent.global) : [1, 1, 1];
        this.set({translation: t, scale: [1 / s[0], 1 / s[1], 1 / s[2]]});
    }

    rotateTarget() {
        // in this case, gizmo itself should not rotate but the gyro should rotate so the three rings
        // show the euler angle of them in a sane way.

        if (this.gizmoMode === "move") {
            this.set({rotation: [0, 0, 0, 1]});
        } else {
            let r = this.target.rotation;
            this.set({rotation: r});
        }
    }

    scaleTarget() {}

    closestCorner(creatorId) {
        let avatar = [...this.service("ActorManager").actors].find(([_k, actor]) => {
            return actor.playerId === creatorId;
        });
        if (avatar) {
            avatar = avatar[1];
        }
        if (!avatar) {return;}
        let {m4_identity, v3_transform, v3_magnitude, v3_sub, v3_add} = Microverse;
        let target = this.target;
        let parentGlobal = target._parent ? target._parent.global : m4_identity();
        let t = target.translation;
        let g = v3_transform(t, parentGlobal);

        let a = avatar.translation;

        let offsets = [
            [ 2,  2,  2],
            [-2,  2,  2],
            [ 2, -2,  2],
            [-2, -2,  2],
            [ 2,  2, -2],
            [-2,  2, -2],
            [ 2, -2, -2],
            [-2, -2, -2]
        ];

        let locals = offsets.map((o) => v3_add(t, o));
        let parents = locals.map((l) => v3_transform(l, parentGlobal));

        let dist = Number.MAX_VALUE;
        let min = -1;

        for (let i = 0; i < parents.length; i++) {
            let thisDist = v3_magnitude(v3_sub(a, parents[i]));
            if (thisDist <= dist && parents[i][1] > g[1]) {
                dist = thisDist;
                min = i;
            }
        }
        return offsets[min];
    }

    addPropertySheetButton() {
        if (this.propertySheetButton) {
            this.propertySheetButton.destroy();
        }

        let t = this.closestCorner(this.creatorId);

        this.propertySheetButton = this.createCard({
            name: "property sheet button",
            behaviorModules: ["GizmoPropertySheetButton"],
            type: "object",
            parent: this,
            noSave: true,
            translation: t,
        });

        this.subscribe(this.propertySheetButton.id, "openPropertySheet", "openPropertySheet");
    }

    openPropertySheet(toWhom) {
        this.target.showControls(toWhom);
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
            let s = this.target.parent ? this.getScale(this.target.parent.global) : [1, 1, 1];
            this.set({rotation: [0, 0, 0, 1], scale: [1 / s[0], 1 / s[1], 1 / s[2]]});

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
            this.gizmoMode = "rotate";

            this.moveX.destroy();
            this.moveY.destroy();
            this.moveZ.destroy();

            if (this.propertySheetButton) {
                this.propertySheetButton.destroy();
            }

            let s = this.target.parent ? this.getScale(this.target.parent.global) : [1, 1, 1];
            this.set({rotation: this.target.rotation, scale: [1 / s[0], 1 / s[1], 1 / s[2]]});

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

        } else if (this.gizmoMode === "rotate") {
            this.gizmoMode = "scale";

            this.rotateX.destroy();
            this.rotateY.destroy();
            this.rotateZ.destroy();

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
    }
}

class GizmoAxisActor {
    setup() {
        this.subscribe(this.parent.id, "translateTarget", "translateTarget");
    }

    translateTarget(translation) {
        this.parent.target.set({translation});
    }
}

class GizmoAxisPawn {
    setup() {
        this.originalColor = this.actor._cardData.color;

        let isMine = this.parent?.actor.creatorId === this.viewId;

        this.shape.add(this.makeAxisHelper(isMine));

        this.dragStart = undefined;
        this.positionAtDragStart = undefined;

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
        let target = this.actor.parent.target;

        // avatar.addFirstResponder("pointerMove", {shiftKey: true}, this);
        avatar.addFirstResponder("pointerMove", {}, this);
        let {THREE, m4_invert,v3_transform, v3_normalize, v3_sub, m4_identity} = Microverse;

        this._parentGlobal = target._parent ? target._parent.global : m4_identity();
        this._parentInvert = target._parent ? m4_invert(target._parent.global) : m4_identity();
        this.positionAtDragStart = target.translation;
        this.dragStart = event.xyz;
        this.globalStart = v3_transform(target.translation, this._parentGlobal);

        // if we are dragging along the Y axis
        this.intersectionPlane = new Microverse.THREE.Plane();

        this.intersectionPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(...v3_sub([0, 0, 0], v3_normalize(event.ray.direction))),
            new Microverse.THREE.Vector3(...this.dragStart)
        );
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
            this.publish(this.parent.actor.id, "translateTarget", nextPosition);
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
        this.shape.children[0].setColor(this.actor._cardData.hoverColor);
    }

    pointerLeave() {
        this.shape.children[0].setColor(this.originalColor);
    }
}

class GizmoRotorActor {
    setup() {
        this.subscribe(this.parent.id, "rotateTarget", "rotateTarget");
    }

    rotateTarget(rotation) {
        this.parent.target.set({rotation})
    }
}

class GizmoRotorPawn {
    setup() {
        this.originalColor = this.actor._cardData.color;

        let isMine = this.parent?.actor.creatorId === this.viewId;
        this.shape.add(this.createCircle(isMine ? this.actor._cardData.color : 0xffffff, this.actor._cardData.axis));

        this.dragStart = undefined;
        this.rotationAtDragStart = undefined;
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

        if (axis[1] === 1) {
            geo.rotateX(Math.PI / 2);
        } else if (axis[0] === 1) {
            geo.rotateY(Math.PI / 2);
        }

        const mat = new Microverse.THREE.LineBasicMaterial({color, toneMapped: false, linewidth: 2});
        const circle = new Microverse.THREE.LineLoop(geo, mat);
        return circle;
    }

    localRotationAxis() {
        return Microverse.v3_rotate(this.actor._cardData.axis, this.rotationAtDragStart); // wrong?
    }

    rotationInteractionPlane(_event) {
        let {THREE} = Microverse;
        const interactionPlane = new THREE.Plane();

        interactionPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(...this.localRotationAxis()),
            new THREE.Vector3(...this.globalTranslationAtStart));

        /*
        if (window.planeHelper) {
            this.shape.parent.remove(window.planeHelper);
            window.planeHelper = undefined;
        }
        window.planeHelper = new Microverse.THREE.PlaneHelper( interactionPlane, 10, 0xffff00 )
        this.shape.parent.add(window.planeHelper);
        */
        return interactionPlane;
    }

    getGlobalRotation(target) {
        let {q_identity, q_multiply} = Microverse;
        let q = q_identity();

        let chain = [target];
        let parent = chain.parent;
        while (parent) {
            target = parent;
            parent = target.parent;
            chain.push(target);
        }

        for (let i = 0; i < chain.length; i++) {
            q = q_multiply(chain[i].rotation, q);
        }
        return q;
    }

    startDrag(event) {
        console.log("start on axis", event);
        let avatar = Microverse.GetPawn(event.avatarId);
        let target = this.parent.actor.target;

        // avatar.addFirstResponder("pointerMove", {shiftKey: true}, this);
        avatar.addFirstResponder("pointerMove", {}, this);

        let {THREE, v3_normalize, v3_transform, m4_getTranslation, m4_invert, m4_identity} = Microverse;

        this._parentGlobal = target._parent ? target._parent.global : m4_identity();
        this._parentInvert = target._parent ? m4_invert(target._parent.global) : m4_identity();
        this._invert = m4_invert(target.global);
        this.rotationAtDragStart = target.rotation;
        this.globalTranslationAtStart = m4_getTranslation(target.global);
        this.globalRotationAtStart = this.getGlobalRotation(target);

        let origin = new THREE.Vector3(...event.ray.origin);
        let direction = new THREE.Vector3(...event.ray.direction);
        let ray = new THREE.Ray(origin, direction);

        let dragPoint = ray.intersectPlane(
            this.rotationInteractionPlane(),
            new Microverse.THREE.Vector3()
        );

        if (dragPoint) {
            let localPoint = v3_transform(dragPoint.toArray(), this._invert);
            let dir = v3_normalize(localPoint);
            this.dragStart = dir;
        }

        console.log("dragStart", this.dragStart);
    }

    drag(event) {
        if (!this.dragStart) {return;}

        let {THREE, v3_transform, v3_normalize, v3_cross, v3_dot, q_multiply, q_axisAngle} = Microverse;

        let origin = new THREE.Vector3(...event.ray.origin);
        let direction = new THREE.Vector3(...event.ray.direction);
        let ray = new THREE.Ray(origin, direction);

        let newDragPoint;

        let dragPoint = ray.intersectPlane(
            this.rotationInteractionPlane(),
            new Microverse.THREE.Vector3()
        );

        if (dragPoint) {
            let localPoint = v3_transform(dragPoint.toArray(), this._invert);
            let dir = v3_normalize(localPoint);
            newDragPoint = dir;
        }

        if (!newDragPoint) {return;}

        let projStartDirection = this.dragStart;
        let projNewDirection = newDragPoint;
        let normal = this.localRotationAxis();

        let sign;
        if (this.actor._cardData.axis[0] === 1) {
            sign = normal[0] < 0 ? -1 : 1;
        } else if (this.actor._cardData.axis[1] === 1) {
            sign = normal[1] < 0 ? -1 : 1;
        } else if (this.actor._cardData.axis[2] === 1) {
            sign = normal[2] < 0 ? -1 : 1;
        }

        let angle = Math.atan2(v3_dot(v3_cross(projStartDirection, projNewDirection), normal), v3_dot(projStartDirection, projNewDirection)) * sign;

        let axisAngle = q_axisAngle(this.actor._cardData.axis, angle);
        const nextRotation = q_multiply(axisAngle, this.rotationAtDragStart);

        this.publish(this.parent.actor.id, "rotateTarget", nextRotation)
    }

    endDrag(event) {
        console.log("end on axis", event);
        this.dragStart = undefined;
        const avatar = Microverse.GetPawn(event.avatarId);
        // avatar.removeFirstResponder("pointerMove", {shiftKey: true}, this);
        avatar.removeFirstResponder("pointerMove", {}, this);
    }

    pointerEnter() {
        this.shape.children[0].material.color.set(this.actor._cardData.hoverColor);
    }

    pointerLeave() {
        this.shape.children[0].material.color.set(this.originalColor);
    }
}

class GizmoScalerActor {
    setup() {
        this.subscribe(this.parent.id, "scaleTarget", "scaleTarget");
    }

    scaleTarget(scale) {
        this.parent.target.set({scale});
    }
}

class GizmoScalerPawn {
    setup() {
        this.originalColor = this.actor._cardData.color;

        let isMine = this.parent?.actor.creatorId === this.viewId;

        let scale = this.parent.call("Gizmo$GizmoActor", "getScale", this.actor.parent.target.global);

        console.log(scale);
        this.shape.add(this.makeScaleHandles(isMine, 3));

        this.dragStart = undefined;
        this.positionAtDragStart = undefined;

        this.subscribe(this.actor.parent.target.id, "scaleSet", "targetScaleSet");

        if (isMine) {
            this.addEventListener("pointerDown", "startDrag");
            this.addEventListener("pointerMove", "drag");
            this.addEventListener("pointerUp", "endDrag");
            this.addEventListener("pointerEnter", "pointerEnter");
            this.addEventListener("pointerLeave", "pointerLeave");
        }
    }

    targetScaleSet(data) {
        let isMine = this.parent?.actor.creatorId === this.viewId;
        let max = Math.max(...data.v);
        this.shape.add(this.makeScaleHandles(isMine, 3 * max));
    }

    makeScaleHandles(isMine, globalLength = 3) {
        const points = [];
        let {THREE} = Microverse;

        if (this.handleGroup) {
            [...this.handleGroup.children].forEach((c) => {
                c.material.dispose();
                c.geometry.dispose();
                c.removeFromParent();
            });
            this.handleGroup.removeFromParent();
        }

        let group = new THREE.Group();
        this.handleGroup = group;

        points.push(new THREE.Vector3(0, 0, 0));
        points.push((new THREE.Vector3(...this.actor._cardData.axis)).multiplyScalar(globalLength));

        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let material = new THREE.LineBasicMaterial({color: isMine ? this.originalColor : 0xffffff, toneMapped: false});

        let line = new THREE.Line(geometry, material);

        let boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        let boxMaterial = new THREE.MeshBasicMaterial({color: isMine ? this.originalColor : 0xffffff, toneMapped: false});
        let box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.translateOnAxis(new THREE.Vector3(...this.actor._cardData.axis), globalLength);

        group.add(line);
        group.add(box);
        return group;
    }

    startDrag(event) {
        let avatar = Microverse.GetPawn(event.avatarId);
        let target = this.actor.parent.target;

        // avatar.addFirstResponder("pointerMove", {shiftKey: true}, this);
        avatar.addFirstResponder("pointerMove", {}, this);
        let {THREE, m4_invert,v3_transform, v3_normalize, v3_sub, m4_identity} = Microverse;

        this._parentGlobal = target._parent ? target._parent.global : m4_identity();
        this._parentInvert = target._parent ? m4_invert(target._parent.global) : m4_identity();
        this.scaleAtDragStart = target.scale;
        this.dragStart = event.xyz;
        this.globalStart = v3_transform(target.translation, this._parentGlobal);

        // if we are dragging along the Y axis
        this.intersectionPlane = new Microverse.THREE.Plane();

        this.intersectionPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(...v3_sub([0, 0, 0], v3_normalize(event.ray.direction))),
            new Microverse.THREE.Vector3(...this.dragStart)
        );
    }

    drag(event) {
        let {THREE, v3_scale, v3_sub, v3_divide} = Microverse;
        if (this.dragStart) {
            let origin = new THREE.Vector3(...event.ray.origin);
            let direction = new THREE.Vector3(...event.ray.direction);
            let ray = new THREE.Ray(origin, direction);
            let intersectionPoint = ray.intersectPlane(
                this.intersectionPlane,
                new Microverse.THREE.Vector3()
            );

            if (!intersectionPoint) {return;}

            let globalHere = intersectionPoint.toArray();
            let globalStart = this.dragStart;

            let localHere = Microverse.v3_transform(globalHere, this._parentInvert);
            let localStart = Microverse.v3_transform(globalStart, this._parentInvert);
            let localOrigin = this.globalStart;

            let ns = v3_divide(v3_sub(localHere, localOrigin), v3_sub(localStart, localOrigin));

            let nextScale = [...this.scaleAtDragStart];

            let s;

            if (this.actor._cardData.axis[0] === 1) {
                s = ns[0];
            } else if (this.actor._cardData.axis[1] === 1) {
                s = ns[1];
            } else if (this.actor._cardData.axis[2] === 1) {
                s = ns[2];
            }

            nextScale = v3_scale(nextScale, s);
            this.publish(this.parent.actor.id, "scaleTarget", nextScale);
        }
    }

    endDrag(event) {
        console.log("end on axis", event);
        this.dragStart = undefined;
        let avatar = Microverse.GetPawn(event.avatarId);
        // avatar.removeFirstResponder("pointerMove", {shiftKey: true}, this);
        avatar.removeFirstResponder("pointerMove", {}, this);
    }

    pointerEnter() {
        this.shape.children[0].children.forEach(child => child.material.color.set(this.actor._cardData.hoverColor));
    }

    pointerLeave() {
        this.shape.children[0].children.forEach(child => child.material.color.set(this.originalColor));
    }
}

class GizmoPropertySheetButtonPawn {
    setup() {
        let isMine = this.parent?.actor.creatorId === this.viewId;

        this.makeButton();
        if (isMine) {
            this.addEventListener("pointerMove", "nop");
            this.addEventListener("pointerEnter", "hilite");
            this.addEventListener("pointerLeave", "unhilite");
            this.addEventListener("pointerDown", "openPropertySheet");
        }
    }

    makeButton() {
        [...this.shape.children].forEach((c) => this.shape.remove(c));

        let geometry = new Microverse.THREE.SphereGeometry(0.15, 16, 16);
        let material = new Microverse.THREE.MeshStandardMaterial({color: 0xcccccc, metalness: 0.8});
        let button = new Microverse.THREE.Mesh(geometry, material);
        this.shape.add(button);
        this.setColor();
    }

    setColor() {
        let baseColor = this.entered ? 0xeeeeee : 0xcccccc;
        if (this.shape.children[0] && this.shape.children[0].material) {
            this.shape.children[0].material.color.setHex(baseColor);
        }
    }

    hilite() {
        this.entered = true;
        this.setColor();
    }

    unhilite() {
        this.entered = false;
        this.setColor();
    }

    openPropertySheet(event) {
        let avatar = Microverse.GetPawn(event.avatarId);
        this.publish(this.actor.id, "openPropertySheet", {avatar: event.avatarId, distance: avatar.targetDistance});
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
        },
        {
            name: "GizmoPropertySheetButton",
            pawnBehaviors: [GizmoPropertySheetButtonPawn],
        }
    ]
}

/* globals Microverse */
