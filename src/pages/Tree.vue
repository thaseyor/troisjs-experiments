<template>
  <Menu>
    <div class="flex space-between">
      <span>box size</span>
      <input type="range" min="1" max="10" v-model="BOX_SIZE" />
    </div>
    <div class="flex space-between">
      <span>deviation angle</span>
      <input type="range" min="5" max="45" v-model="spreadAngle" step="5" />
    </div>
    <div class="flex space-between">
      <span>initial branches</span>
      <input type="range" min="2" max="7" v-model="init" />
    </div>
    <div class="flex space-between">
      <span>branch length</span>
      <input
        type="range"
        min="0.04"
        max="0.15"
        v-model="branchLength"
        step="0.005"
      />
    </div>
    <div class="flex space-between">
      <span>accelerating growth</span>
      <input type="checkbox" v-model="isAccelerating" />
    </div>
    <button @click="start" style="margin-top: 3px">restart</button>
  </Menu>
  <Renderer
    antialias
    shadow
    :orbit-ctrl="{ enableDamping: true }"
    resize="window"
    ref="renderer"
  >
    <Camera :position="{ z: 6, x: 3, y: 1 }" />
    <Scene>
      <LineSegments>
        <EdgesGeometry :size="Number(BOX_SIZE)"></EdgesGeometry>
        <LineBasicMaterial color="#00ffff"></LineBasicMaterial>
      </LineSegments>
      <LineSegments>
        <CustomGeometry :points="tree"> </CustomGeometry>
        <LineBasicMaterial color="#00ffff"></LineBasicMaterial>
      </LineSegments>
    </Scene>
  </Renderer>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { Vector3, MathUtils } from "three";

import { Camera, Renderer, Scene } from "troisjs";

import Menu from "@/components/Menu.vue";
import { LineSegments } from "@/components/meshes";
import { LineBasicMaterial } from "@/components/materials";
import { EdgesGeometry, CustomGeometry } from "@/components/geometries";

const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;
const { random } = Math;

const renderer = ref();
const frame = ref(0);
const iteration = ref(0);
const init = ref(4);
const BOX_SIZE = ref(4);
const stopped = ref(true);
const isAccelerating = ref(false);
const tree = ref([]);
const spreadAngle = ref(20);
const branchLength = ref(0.07);

const AXIS_LIMIT = computed(() => {
  return Number(BOX_SIZE.value / 2);
});
const radiansAngle = computed(() => {
  return (Number(spreadAngle.value) * Math.PI) / 180;
});

watch(BOX_SIZE, () => {
  stopped.value = true;
  tree.value = [];
});

let mainAxis; // 0:x 1:y 2:z

const genCoordinates = (sign, axis = mainAxis) => {
  const size = AXIS_LIMIT.value;
  const temp = [rndFS(size), rndFS(size), rndFS(size)];
  temp[axis] = Math.sign(sign) * size;
  return new Vector3(...temp);
};

const genVector = (sign, axis = mainAxis) => {
  const temp = [0, 0, 0];
  const len = Number(branchLength.value);
  const length = isAccelerating.value ? len / 2 : len;
  temp[axis] = -Math.sign(sign) * length;
  return new Vector3(...temp);
};

let steps = [];
let prevSteps = [];
let newBranches = [];

const deviateVector = (vector, angle) => {
  const length = Math.tan(angle) * vector.length() * random();

  const perpendicular = vector
    .clone()
    .cross(new Vector3().randomDirection())
    .setLength(length);

  const deviated = vector.clone().add(perpendicular);

  if (!isAccelerating.value)
    deviated.setLength(Number(branchLength.value) * random());

  return deviated;
};

const isBeyondLimit = (axis) =>
  axis > AXIS_LIMIT.value || axis < -AXIS_LIMIT.value;

const step = (pos, vector) => {
  const newPos = pos.clone().add(vector);

  const coordinates = Object.values(newPos);
  if (coordinates.find((axis) => isBeyondLimit(axis))) return;

  newBranches.push(pos, newPos);

  const isSafe = iteration.value <= Number(init.value);
  if (isSafe || random() > 0.5)
    steps.push(() => step(newPos, deviateVector(vector, radiansAngle.value)));
  if (isSafe || random() > 0.5)
    steps.push(() => step(newPos, deviateVector(vector, radiansAngle.value)));
};

const start = () => {
  tree.value = [];
  prevSteps = [];
  newBranches = [];
  mainAxis = Math.floor(rnd(0, 3));
  steps = [
    () => step(genCoordinates(1), genVector(1)),
    () => step(genCoordinates(-1), genVector(-1)),
  ];
  stopped.value = false;
  iteration.value = 0;
};

onMounted(() => {
  start();
  renderer.value.onBeforeRender(() => {
    if (stopped.value) return;

    frame.value = frame.value + 1;
    if (frame.value % 5 !== 0) return;

    tree.value = [...tree.value, ...newBranches];
    newBranches = [];

    iteration.value = iteration.value + 1;

    prevSteps = steps;
    steps = [];

    if (!prevSteps.length) {
      stopped.value = true;
      return;
    }

    prevSteps.forEach((i) => i());
  });
});
</script>
