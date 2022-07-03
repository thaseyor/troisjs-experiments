<template>
  <Menu>
    <div class="flex space-between">
      <span>box size</span>
      <input type="range" min="1" max="10" v-model="BOX_SIZE" />
    </div>
    <div class="flex space-between">
      <span>flow power</span>
      <input type="range" min="1" max="10" v-model="FLOW_POWER" />
    </div>
    <div class="flex space-between">
      <span>flow tenuity</span>
      <input type="range" min="2" max="8" v-model="FLOW_TENUITY" />
    </div>
    <div class="flex space-between">
      <span>pseudo 3d</span>
      <input type="checkbox" v-model="PSEUDO_3D" />
    </div>
  </Menu>
  <Renderer
    antialias
    shadow
    :orbit-ctrl="{ enableDamping: true }"
    resize="window"
    ref="renderer"
  >
    <Camera :position="{ z: 4, x: -0.5 }" />
    <Scene>
      <LineSegments>
        <EdgesGeometry :size="Number(BOX_SIZE)"></EdgesGeometry>
      </LineSegments>
      <LineSegments>
        <CustomGeometry :points="points" :colors="colors"></CustomGeometry>
        <LineBasicMaterial
          :props="{ vertexColors: true, transparent: true }"
        ></LineBasicMaterial>
      </LineSegments>
    </Scene>
  </Renderer>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, shallowRef } from "vue";
import { Camera, Renderer, Scene } from "troisjs";
import { Vector4, MathUtils } from "three";

import type { ShallowRef, ComputedRef } from "vue";

import Menu from "@/components/Menu.vue";
import { LineSegments } from "@/components/meshes";
import { LineBasicMaterial } from "@/components/materials";
import { EdgesGeometry, CustomGeometry } from "@/components/geometries";

import { Perlin } from "@/utils/perlin";

const { randFloatSpread: rndFS } = MathUtils;
const { random, PI, cos, sin, trunc, min, max } = Math;

const perlin = new Perlin(random());
const perlin2 = new Perlin(random());

const frame = ref(0);
const iteration = ref(0);
const renderer = ref();

const BOX_SIZE = ref(2);
const FLOW_POWER = ref(4);
const FLOW_TENUITY = ref(6);
const PSEUDO_3D = ref(true);

const SCALE = 0.5;
const AMOUNT = 5000;
const LENGTH = 0.02;
const SMOOTHNESS = 0.75;

let prevPoints: Vector4[] = [];

const points: ShallowRef<Vector4[]> = shallowRef([]);

const colors: ComputedRef<number[]> = computed(() => {
  const coef = Number(FLOW_POWER.value) / 1000;
  return points.value.flatMap(({ w }) => [1, 1, 1, min(w * coef, 1)]);
});

const start = () => {
  prevPoints = [];
  iteration.value = 0;
  const getCord = () => rndFS(BOX_SIZE.value);
  for (let i = 0; i < AMOUNT; i++) {
    const point = new Vector4(getCord(), getCord(), getCord(), 0);
    prevPoints.push(point);
  }
};

watch(BOX_SIZE, () => {
  start();
});

const isBeyondLimit = (axis: number) => {
  const size = BOX_SIZE.value / 2;
  return axis > size || axis < -size;
};

const getThetaOnPoint = (x: number, y: number, z: number, t: number) => {
  const point = new Vector4(x / SCALE, y / SCALE, z / SCALE, t * 0.0005);
  return (perlin.get4(point) - 0.5) * 4 * PI;
};

const getPhiOnPoint = (x: number, y: number, z: number, t: number) => {
  const point = new Vector4(x / SCALE, y / SCALE, z / SCALE, t * 0.001);
  return (perlin2.get4(point) - 0.5) * 4 * PI;
};

const render = (t = 0) => {
  prevPoints = prevPoints.filter(
    ({ x, y, z }) => !(isBeyondLimit(x) || isBeyondLimit(y) || isBeyondLimit(z))
  );

  const len = prevPoints.length;
  const n = AMOUNT - prevPoints.length;

  if (!prevPoints.length) start();
  if (n > 0) {
    const halfBox = BOX_SIZE.value / 2;
    for (let i = 0; i < n; i++) {
      const randomOne = trunc(random() * len);
      const { x, y, z } = prevPoints[randomOne];
      const getShift = () =>
        (random() - 0.5) * LENGTH * Number(FLOW_TENUITY.value);
      const point = new Vector4(
        max(min(x + getShift(), halfBox), -halfBox),
        max(min(y + getShift(), halfBox), -halfBox),
        max(min(z + getShift(), halfBox), -halfBox),
        0
      );

      prevPoints.push(point);
    }
  }

  const isPseudo3D = PSEUDO_3D.value;
  const newPoints: Vector4[] = prevPoints.map((p) => {
    const { x, y, z, w } = p;
    const theta = getThetaOnPoint(x, y, z, t);

    let dx = cos(theta) * LENGTH;
    let dy = sin(theta) * LENGTH;
    let dz = cos(theta) * LENGTH;

    if (!isPseudo3D) {
      // spherical trigonometry
      const phi = getPhiOnPoint(x, y, z, t);
      const cosPhi = cos(phi);
      const sinPhi = sin(phi);

      dz = sinPhi * LENGTH;
      dy *= cosPhi;
      dx *= cosPhi;
    }

    const nx = x + dx;
    const ny = y + dy;
    const nz = z + dz;

    return new Vector4(nx, ny, nz, w + 1 / SMOOTHNESS);
  });

  points.value = Array.from({ length: AMOUNT * 2 }, (_, i): Vector4 => {
    if (i % 2 === 0) return prevPoints[i / 2];
    return newPoints[(i - 1) / 2];
  });

  prevPoints = newPoints.map((p, i) => {
    const { x, y, z, w } = p;
    const prevPoint = prevPoints[i];

    const nx = prevPoint.x + (x - prevPoint.x) / SMOOTHNESS;
    const ny = prevPoint.y + (y - prevPoint.y) / SMOOTHNESS;
    const nz = prevPoint.z + (z - prevPoint.z) / SMOOTHNESS;

    const partiallyMovedPoint = new Vector4(nx, ny, nz, w);

    return partiallyMovedPoint;
  });
};

onMounted(() => {
  start();
  renderer.value.onBeforeRender(() => {
    frame.value = frame.value + 1;
    if (frame.value % 2 !== 0) return;
    iteration.value = iteration.value + 1;

    render(iteration.value);
  });
});
</script>
