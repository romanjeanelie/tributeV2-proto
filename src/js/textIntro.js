import * as THREE from "three";
import gsap from "gsap";

import fragment from "./shaders/textIntro/fragment.glsl";
import vertex from "./shaders/textIntro/vertex.glsl";

export default class TextIntro {
  constructor(options) {
    this.scene = options.scene;

    this.loader = new THREE.FontLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.strengthValue = 1;

    this.textMaterial = null;

    this.materialsText = [];

    this.isLoaded = false;

    this.textGroup = new THREE.Group();

    this.index = 0;

    this.indexAnim = 0;
    this.animComplete = true;
  }

  init() {
    this.addText();
  }

  // animText(progress) {
  //   const steps = [0, 0.25, 0.5, 0.72, 0.95, 1.45];

  //   steps.forEach((step, i) => {
  //     if (progress > step && progress < steps[i + 1]) {
  //       const currentText = this.materialsText[i];
  //       const otherTexts = this.materialsText.filter((el) => el !== currentText);

  //       // FADE IN currentText
  //       gsap.to(currentText.uniforms.opacity, {
  //         duration: 0.1,
  //         value: 1,
  //       });

  //       // FADE OUT otherTexts
  //       otherTexts.forEach((text) => {
  //         gsap.to(text.uniforms.opacity, {
  //           value: 0,
  //         });
  //       });
  //     }

  //     // FADE OUT "please"
  //     if (progress > steps[steps.length - 1]) {
  //       const currentText = this.materialsText[this.materialsText.length - 1];
  //       gsap.to(currentText.uniforms.opacity, {
  //         value: 0,
  //       });
  //     }
  //   });
  // }

  animText(index) {
    this.animComplete = false;

    if (this.materialsText[index - 1]) {
      gsap.to(this.materialsText[index - 1].uniforms.progress, {
        value: 2.8,
        duration: 2,
      });
      gsap.to(this.materialsText[index - 1].uniforms.opacity, {
        value: 0,
        duration: 2,
      });
    }

    if (this.materialsText[index]) {
      gsap.to(this.materialsText[index].uniforms.opacity, {
        value: 1,
        duration: 2,
      });
      gsap.to(this.materialsText[index].uniforms.progress, {
        value: 1,
        duration: 2,
        onComplete: () => (this.animComplete = true),
      });
    }
  }

  addText() {
    const texts = [
      "HOW DO I FORGIVE MYSELF FOR MY OWN MISTAKES ?",
      "COULD YOU POSSIBLY HELP ME UNDERSTAND ?",
      "WOULD YOU EVEN HOLD MY HAND SPEAKING SOFTLY IN MY HEAR ?",
      "COULD YOU POSSIBLY HELP ME ?",
      "PLEASE",
    ];
    this.loader.load("/fonts/Oswald_Regular.json", (font) => {
      if (this.index > texts.length - 1) {
        this.textGroup.position.z = -10;
        this.scene.add(this.textGroup);
        return;
      }
      const text = texts[this.index];
      this.createText(text, font, this.index).then(() => {
        this.index++;
        this.addText();

        if (this.index === texts.length) {
          this.isLoaded = true;
        }
      });
    });
  }

  createText(text, font, index) {
    return new Promise((resolve, reject) => {
      const textGeometry = new THREE.TextGeometry(text, {
        font: font,
        size: 0.7,
        height: 0,
        curveSegments: 10,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uStrength: { value: 0 },
          time: { value: 0 },
          activeLines: { value: 0 },
          progress: { value: 0 },
          opacity: { value: 0 },
          uColor: { value: new THREE.Color("#93ADFF") },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
      });

      this.materialsText.push(textMaterial);

      const textMesh = new THREE.Mesh(textGeometry, this.materialsText[index]);

      textGeometry.center();

      this.textGroup.add(textMesh);

      if (textMesh) {
        resolve();
      }
    });
  }

  anim(progress, time) {
    this.materialsText.forEach((material) => {
      material.uniforms.time.value = time;
      // material.uniforms.progress.value = progress;
      // SPEED Volets
      const velocity = progress * 0.1;
      material.uniforms.activeLines.value = progress;
    });
  }
}
