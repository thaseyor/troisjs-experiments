<template>
  <Renderer
    antialias
    shadow
    :orbit-ctrl="{ enableDamping: true }"
    resize="window"
  >
    <Camera :position="{ z: 14 }" />
    <Scene>
      <AmbientLight color="#ffffff" :intensity="0.35" />
      <CannonWorld :gravity="{ x: 0, y: 0, z: 0 }" @before-step="onBeforeStep">
        <InstancedMesh ref="imesh" :count="BODIES_N" @created="initIMesh">
          <SphereGeometry :width-segments="20" :height-segments="20" />
          <PhongMaterial :props="{ emissive: '#FDB813' }" />
        </InstancedMesh>
      </CannonWorld>

      <EffectComposer>
        <RenderPass />
        <UnrealBloomPass :strength="0.6" />
      </EffectComposer>
    </Scene>
  </Renderer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CannonWorld from "troisjs/src/components/physics/CannonWorld.js";
import { Color, MathUtils, Object3D } from "three";
import {
  scalarLength,
  getAcceleration,
  scaleFromMass,
  massFromScale,
} from "@/utils";
import {
  InstancedMesh,
  SphereGeometry,
  Camera,
  PhongMaterial,
  AmbientLight,
  Renderer,
  Scene,
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "troisjs";

const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;

const imesh = ref();

const BODIES_N = ref(5);
const G = 6.6743 * 10 ** -2;
const ACCRETION_DISTANCE = 1.3;

const colors = ["#FDB813", "#FF0000", "#0000FF", "#FFFFFF"];

function initIMesh(mesh) {
  imesh.value = mesh;

  const dummy = new Object3D();
  const color = new Color();

  const scales = new Array(BODIES_N.value);
  const masses = new Array(BODIES_N.value);
  const velocities = new Array(BODIES_N.value);
  for (let i = 0; i < BODIES_N.value; i++) {
    dummy.position.set(rndFS(8), rndFS(8), rndFS(8));
    const scale = rnd(1, 4) * 0.1;
    scales[i] = scale;
    masses[i] = massFromScale(scale);
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

const mergeBodies = (b1, b2, part = 1) => {
  const data = imesh.value.userData;

  if (data.masses[b2] < 0.0001) {
    data.masses[b2] = 0;
    data.scales[b2] = 0;
    data.bodies[b2].shapes = [];
    return;
  }

  const extractedMass = data.masses[b2] * part;
  data.masses[b1] += extractedMass;
  data.masses[b2] -= extractedMass;

  data.scales[b1] = scaleFromMass(data.masses[b1]);
  data.scales[b2] = scaleFromMass(data.masses[b2]);
};

const onBeforeStep = ({ world }) => {
  // if (world.stepnumber % 10 !== 0)
  const data = imesh.value.userData;
  const bodies = data.bodies;
  if (world.stepnumber === 0) {
    bodies.forEach((body) => (body.collisionResponse = false));
  }
  bodies.forEach((body, curr) => {
    if (!body.shapes[0]) return;
    const position: number[] = Object.values(body.position);
    const accelerations: number[][] = [];

    for (let i = 0; i < bodies.length; i++) {
      if (i === curr) continue; // ignore itself
      if (!bodies[i].shapes[0]) continue;

      const otherBody = bodies[i];
      const otherPosition: number[] = Object.values(otherBody.position);
      const M = data.masses[i];

      const distanceVectors = position.map((p, i) => otherPosition[i] - p);
      const R = scalarLength(distanceVectors);

      // check if body falls into the other body
      const bodyRadius = body.shapes[0].radius;
      if (R < bodyRadius * ACCRETION_DISTANCE) {
        const part =
          1 - (R - bodyRadius) / (ACCRETION_DISTANCE * bodyRadius - bodyRadius);
        const isBigger = body.mass > otherBody.mass;
        const biggerIndex = isBigger ? curr : i;
        const smallerIndex = isBigger ? i : curr;
        mergeBodies(biggerIndex, smallerIndex, part);
        return;
      }

      const a = getAcceleration(G, M, R);
      const acceleration = distanceVectors.map((vector) => a * (vector / R));

      accelerations.push(acceleration);
    }

    const resultantAcceleration = accelerations.reduce(
      (acc, curr) => acc.map((a, i) => a + curr[i]),
      [0, 0, 0]
    );

    const velocity: number[] = Object.values(body.velocity);
    body.velocity.set(...velocity.map((v, i) => v + resultantAcceleration[i]));
  });
};
</script>
