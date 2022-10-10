class BloomPassPawn {
    setup() {
        const THREE = Worldcore.THREE;
        const {renderer, composer} = this.service("ThreeRenderManager");

        // tweak these values to get a different looking bloom effect
        const params = {
            exposure: 0.48,
            bloomThreshold: 0.24,
            bloomStrength: 0.56,
            bloomRadius: 0.28,
            // exposure: 0.80,
            // bloomThreshold: 0.27,
            // bloomStrength: 0.63,
            // bloomRadius: 0.29,
            // exposure: 0.48,
            // bloomThreshold: 0.26,
            // bloomStrength: 0.70,
            // bloomRadius: 0.28,
        };

        this.teardown();

        this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), 0, 0, 0);
        composer.addPass(this.bloomPass);

        renderer.toneMappingExposure = params.exposure;
        this.bloomPass.threshold = params.bloomThreshold;
        this.bloomPass.strength = params.bloomStrength;
        this.bloomPass.radius = params.bloomRadius;

        this.subscribe("input", "sDown", this.showWidget);
        this.subscribe("input", "dDown", this.destroyWidget);
    }

    showWidget() {
        if (this.ui) {
            return;
        }

        const {renderer} = this.service("ThreeRenderManager");

        this.ui = new Microverse.Widget3({parent: this.rootWidget});

        this.sliderExposure = new Microverse.SliderWidget3({
            name: "slider",
            parent: this.ui,
            anchor: [1, 1],
            pivot: [1, 1],
            translation: [-10.23, 10, -16.87],
            step: 0,
            size: [0.2, 3],
            percent: renderer.toneMappingExposure / 2,
            opacity: 1,
            rotation: Microverse.q_euler(0, 0, -Math.PI / 2),
        });

        this.ptExposure = new Microverse.TextWidget3({
            parent: this.ui,
            translation: [-12, 9, -16.87],
            point: 96,
            text: "exposure " + renderer.toneMappingExposure,
            font: "sans-serif",
            size: [4, 1],
            anchor: [1, 1],
            pivot: [1, 1],
        });

        this.ptExposure.subscribe(this.sliderExposure.id, "percent", p => {
            this.ptExposure.text = "exposure " + (p * 2).toFixed(2);
            renderer.toneMappingExposure = (p * 2).toFixed(2);
        });

        this.sliderBloomThreshold = new Microverse.SliderWidget3({
            name: "slider",
            parent: this.ui,
            anchor: [1, 1],
            pivot: [1, 1],
            translation: [-10.23, 8, -16.87],
            step: 0,
            size: [0.2, 3],
            percent: this.bloomPass.threshold,
            opacity: 1,
            rotation: Microverse.q_euler(0, 0, -Math.PI / 2),
        });

        this.ptBloomThreshold = new Microverse.TextWidget3({
            parent: this.ui,
            translation: [-12, 7, -16.87],
            point: 96,
            text: "bloomThreshold " + this.bloomPass.threshold,
            font: "sans-serif",
            size: [4, 1],
            anchor: [1, 1],
            pivot: [1, 1],
        });

        this.ptBloomThreshold.subscribe(this.sliderBloomThreshold.id, "percent", p => {
            this.ptBloomThreshold.text = "bloomThreshold " + (p * 1).toFixed(2);
            this.bloomPass.threshold = (p * 1).toFixed(2);
        });

        this.sliderBloomStrength = new Microverse.SliderWidget3({
            name: "slider",
            parent: this.ui,
            anchor: [1, 1],
            pivot: [1, 1],
            translation: [-10.23, 6, -16.87],
            step: 0,
            size: [0.2, 3],
            percent: this.bloomPass.strength / 10,
            opacity: 1,
            rotation: Microverse.q_euler(0, 0, -Math.PI / 2),
        });

        this.ptBloomStrength = new Microverse.TextWidget3({
            parent: this.ui,
            translation: [-12, 5, -16.87],
            point: 96,
            text: "bloomStrength " + this.bloomPass.strength,
            font: "sans-serif",
            size: [4, 1],
            anchor: [1, 1],
            pivot: [1, 1],
        });

        this.ptBloomStrength.subscribe(this.sliderBloomStrength.id, "percent", p => {
            this.ptBloomStrength.text = "bloomStrength " + (p * 10).toFixed(2);
            this.bloomPass.strength = (p * 10).toFixed(2);
        });

        this.sliderBloomRadius = new Microverse.SliderWidget3({
            name: "slider",
            parent: this.ui,
            anchor: [1, 1],
            pivot: [1, 1],
            translation: [-10.23, 4, -16.87],
            step: 0,
            size: [0.2, 3],
            percent: this.bloomPass.radius,
            opacity: 1,
            rotation: Microverse.q_euler(0, 0, -Math.PI / 2),
        });

        this.ptBloomRadius = new Microverse.TextWidget3({
            parent: this.ui,
            translation: [-12, 3, -16.87],
            point: 96,
            text: "bloomRadius " + this.bloomPass.radius,
            font: "sans-serif",
            size: [4, 1],
            anchor: [1, 1],
            pivot: [1, 1],
        });

        this.ptBloomRadius.subscribe(this.sliderBloomRadius.id, "percent", p => {
            this.ptBloomRadius.text = "bloomRadius " + (p * 1).toFixed(2);
            this.bloomPass.radius = (p * 1).toFixed(2);
        });
    }

    destroyWidget() {
        if (this.ui) {
            this.ui.destroy();
            delete this.ui;
        }
    }

    teardown() {
        if (this.bloomPass) {
            this.service("ThreeRenderManager").composer.removePass(this.bloomPass);
            this.bloomPass = null;
        }
    }
}

export default {
    modules: [
        {
            name: "BloomPass",
            actorBehaviors: [],
            pawnBehaviors: [BloomPassPawn]
        }
    ]
}

/* globals Microverse */
