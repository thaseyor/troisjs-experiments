<template>
  <Renderer
    ref="rendererC"
    antialias
    shadow
    :orbit-ctrl="{ enableDamping: true }"
    resize="window"
  >
    <Camera ref="camera" :position="{ z: 12 }" />
    <Scene>
      <AmbientLight color="#ffffff" :intensity="0.35" />
      <CannonWorld :gravity="{ x: 0, y: 0, z: 0 }" @before-step="onBeforeStep">
        <InstancedMesh ref="imesh" :count="BODIES_N" @created="initIMesh">
          <SphereGeometry
            :radius="0.1"
            :width-segments="16"
            :height-segments="16"
          />
          <PhongMaterial :props="{ emissive: '#FDB813' }" />
        </InstancedMesh>
        <!-- <Plane
          :width="25"
          :height="25"
          :rotation="{ z: Math.PI / 2, x: -Math.PI / 2 }"
          :position="{ y: -6 }"
        >
          <ToonMaterial :props="{ side: 2 }" />
        </Plane> -->
      </CannonWorld>
      <EffectComposer>
        <RenderPass />
        <UnrealBloomPass :strength="0.6" />
      </EffectComposer>
    </Scene>
  </Renderer>
</template>

<script setup>
import { ref } from "vue";
import CannonWorld from "troisjs/src/components/physics/CannonWorld.js";
import { Color, MathUtils, Object3D } from "three";

import {
  InstancedMesh,
  // Plane,
  SphereGeometry,
  Camera,
  PhongMaterial,
  // ToonMaterial,
  AmbientLight,
  Renderer,
  Scene,
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "troisjs";

const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;

const rendererC = ref();
const imesh = ref();
const camera = ref();

const BODIES_N = ref(5);
const G = 6.6743 * 10 ** -5;

const colors = ["#FDB813", "#FF0000", "#0000FF", "#FFFFFF"];

function initIMesh(mesh) {
  imesh.value = mesh;

  const dummy = new Object3D();
  const color = new Color();

  const scales = new Array(BODIES_N.value);
  const masses = new Array(BODIES_N.value);
  const velocities = new Array(BODIES_N.value);
  for (let i = 0; i < BODIES_N.value; i++) {
    dummy.position.set(rndFS(10), rndFS(10), rndFS(10));
    const scale = rnd(1, 4);

    scales[i] = scale;
    masses[i] = scale * scale * 10;
    velocities[i] = { x: rndFS(0.75), y: rndFS(0.75), z: rndFS(0.75) };

    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    mesh.setColorAt(i, color.set(colors[Math.floor(rnd(0, colors.length))]));
  }

  mesh.instanceMatrix.needsUpdate = true;

  mesh.userData.scales = scales;
  mesh.userData.masses = masses;
  mesh.userData.velocities = velocities;
  // mesh.userData.damping = 0.04;
}

const onBeforeStep = ({ world }) => {
  // if (world.stepnumber % 10 !== 0) return;
  const bodies = imesh.value.userData.bodies;
  bodies.forEach((body, curr) => {
    const position = Object.values(body.position);
    const velocity = Object.values(body.velocity);
    const accelerations = [];
    for (let i = 0; i < BODIES_N.value; i++) {
      if (i === curr) continue; // ignore itself

      const otherBody = bodies[i];
      const otherPosition = Object.values(otherBody.position);
      const M = imesh.value.userData.masses[i];

      const distanceVectors = [
        otherPosition[0] - position[0],
        otherPosition[1] - position[1],
        otherPosition[2] - position[2],
      ];

      // scalar distance
      const R = Math.sqrt(
        distanceVectors[0] ** 2 +
          distanceVectors[1] ** 2 +
          distanceVectors[2] ** 2
      );

      const generalAcceleration = (G * M) / R ** 2;
      const acceleration = distanceVectors.map(
        (vector) => generalAcceleration * (vector / R)
      );
      accelerations.push(acceleration);
    }
    // if (world.stepnumber % 60 === 0 && curr === 0) console.log(velocity);

    const resultantAcceleration = accelerations.reduce(
      (acc, curr) => acc.map((a, i) => a + curr[i]),
      [0, 0, 0]
    );

    body.velocity.set(
      velocity[0] + resultantAcceleration[0],
      velocity[1] + resultantAcceleration[1],
      velocity[2] + resultantAcceleration[2]
    );
  });
};
</script>

<style>
canvas {
  display: block;
}
</style>
