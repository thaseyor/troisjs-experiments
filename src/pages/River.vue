<template>
  <Menu>
    <div class="flex space-between">
      <span>box size</span>
      <input type="range" min="1" max="10" v-model="BOX_SIZE" />
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
      </LineSegments>
    </Scene>
  </Renderer>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { Camera, Renderer, Scene } from "troisjs";
import { Vector4, MathUtils } from "three";

import Menu from "@/components/Menu.vue";
import { LineSegments } from "@/components/meshes";
import { EdgesGeometry, CustomGeometry } from "@/components/geometries";

import { Perlin } from "@/utils/perlin";

const { randFloatSpread: rndFS } = MathUtils;
const { random, PI, cos, sin, trunc, min, max } = Math;
const perlin = new Perlin(random());

const frame = ref(0);
const iteration = ref(0);
const renderer = ref();
const BOX_SIZE = ref(2);

const SCALE = 0.5;
const AMOUNT = 1500;
const LENGTH = 0.03;

let prevPoints = [];
let newPoints = [];

const points = ref([]);
const colors = ref([]);

const start = () => {
  prevPoints = [];
  newPoints = [];
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

const isBeyondLimit = (axis) => {
  const size = BOX_SIZE.value / 2;
  return axis > size || axis < -size;
};

const getForceOnPoint = (x, y, z, t) => {
  const point = new Vector4(x / SCALE, y / SCALE, z / SCALE, t * 0.0005);
  return (perlin.get4(point) - 0.5) * 4 * PI;
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
      const getShift = () => (random() - 0.5) * LENGTH * 5;
      const point = new Vector4(
        max(min(x + getShift(), halfBox), -halfBox),
        max(min(y + getShift(), halfBox), -halfBox),
        max(min(z + getShift(), halfBox), -halfBox),
        0
      );

      prevPoints.push(point);
    }
  }
  const newColors = [];

  newPoints = [...prevPoints];
  for (let i = 0; i < newPoints.length; i++) {
    const { x, y, z, w } = newPoints[i];
    newColors.push(0, 0, 0, min(w * 0.1, 1));
    const rad = getForceOnPoint(x, y, z, t);
    const nx = x + cos(rad) * LENGTH;
    const ny = y + sin(rad) * LENGTH;
    const nz = z + cos(rad) * LENGTH;

    newPoints[i] = new Vector4(nx, ny, nz, w + 1);
  }

  points.value = [...new Array(AMOUNT * 2)].map((_, i) => {
    if (i % 2 === 0) return prevPoints[i / 2];
    return newPoints[(i - 1) / 2];
  });

  prevPoints = [...newPoints];

  colors.value = newColors;
};

onMounted(() => {
  start();
  renderer.value.onBeforeRender(() => {
    frame.value = frame.value + 1;

    if (frame.value % 3 !== 0) return;

    iteration.value = iteration.value + 1;

    render(iteration.value);
  });
});
</script>
