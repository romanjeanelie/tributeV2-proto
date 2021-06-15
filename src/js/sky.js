import * as THREE from "three";

import fragment from "./shaders/sky/fragment.glsl";
import vertex from "./shaders/sky/vertex.glsl";

export default class Sky {
  constructor(options) {
    this.scene = options.scene;
    this.gui = options.gui;
    this.debugObject = {};

    this.positionX = 5000;
    this.positionY = 6000;
    this.positionZ = -8500;

    this.material = null;
  }

  init() {
    this.createSky();
  }

  createSky() {
    this.setColors();

    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        color1: { value: new THREE.Color(this.debugObject.color1) },
        color2: { value: new THREE.Color(this.debugObject.color2) },
        color3: { value: new THREE.Color(this.debugObject.color3) },
        color4: { value: new THREE.Color(this.debugObject.color4) },
        changeColor: { value: 0 },
        opacity: { value: 0 },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      //transparent: true,
      // depthWrite: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.scale.set(140000, 35000, 100);

    this.mesh.position.x = this.positionX;
    this.mesh.position.y = this.positionY;
    this.mesh.position.z = this.positionZ;

    this.mesh.rotation.z = Math.PI;

    this.scene.add(this.mesh);
  }

  setColors() {
    this.debugObject.color1 = "#f56a00";
    this.gui
      .addColor(this.debugObject, "color1")
      .onChange(() => (this.material.uniforms.color1.value = new THREE.Color(this.debugObject.color1)))
      .name("skyColor1");
    this.debugObject.color2 = "#223a56";
    this.gui
      .addColor(this.debugObject, "color2")
      .onChange(() => (this.material.uniforms.color2.value = new THREE.Color(this.debugObject.color2)))
      .name("skyColor2");
  }

  anim(time, progress) {
    this.material.uniforms.time.value = time;
    this.material.uniforms.progress.value = progress;
  }
}
