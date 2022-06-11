<template>
  <Menu>
    <div class="flex space-between">
      <span>box size</span>
      <input type="range" min="1" max="10" v-model="BOX_SIZE" />
    </div>
    <div class="flex space-between">
      <span>max angle</span>
      <input type="range" min="5" max="45" v-model="spreadAngle" step="5" />
    </div>
    <div class="flex space-between">
      <span>equal branch size</span>
      <input type="checkbox" v-model="equalSize" />
    </div>
    <button @click="start">restart</button>
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
      <Points>
        <BoxGeometry
          :widthSegments="3"
          :heightSegments="3"
          :depthSegments="3"
          :width="Number(BOX_SIZE)"
          :height="Number(BOX_SIZE)"
          :depth="Number(BOX_SIZE)"
        />
        <PointsMaterial :props="{ size: 0.02 }" />
      </Points>
      <LineSegments>
        <EdgesGeometry
          :width="Number(BOX_SIZE)"
          :height="Number(BOX_SIZE)"
          :depth="Number(BOX_SIZE)"
        ></EdgesGeometry>
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

import {
  Camera,
  Renderer,
  Scene,
  Points,
  BoxGeometry,
  PointsMaterial,
} from "troisjs";

import Menu from "@/components/Menu.vue";
import LineSegments from "@/components/LineSegments";
import EdgesGeometry from "@/components/EdgesGeometry";
import LineBasicMaterial from "@/components/LineBasicMaterial";
import CustomGeometry from "@/components/CustomGeometry";

const { randFloat: rnd, randFloatSpread: rndFS } = MathUtils;
const { random } = Math;

const renderer = ref();
const frame = ref(0);
const iteration = ref(0);
const init = ref(3);
const BOX_SIZE = ref(4);
const stopped = ref(true);
const equalSize = ref(false);
const tree = ref([]);
const spreadAngle = ref(20);

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

const mainAxis = Math.floor(rnd(0, 3)); // 0:x 1:y 2:z

const genCoordinates = (sign, axis = mainAxis) => {
  const size = AXIS_LIMIT.value;
  const temp = [rndFS(size), rndFS(size), rndFS(size)];
  temp[axis] = Math.sign(sign) * size;
  return new Vector3(...temp);
};

const genVector = (sign, axis = mainAxis) => {
  const temp = [0, 0, 0];
  const length = equalSize.value ? 0.07 : 0.04;
  temp[axis] = -Math.sign(sign) * length;
  return new Vector3(...temp);
};

let steps = [];
let prevSteps = [];

const deviateVector = (vector, angle) => {
  const length = Math.tan(angle) * vector.length() * random();

  const perpendicular = vector
    .clone()
    .cross(new Vector3(rndFS(1), rndFS(1), rndFS(1)))
    .setLength(length);

  const deviated = vector.clone().add(perpendicular);

  if (equalSize.value) deviated.setLength(0.07 * random());

  return deviated;
};

const isBeyondLimit = (axis) =>
  axis > AXIS_LIMIT.value || axis < -AXIS_LIMIT.value;

const step = (pos, vector) => {
  const newPos = pos.clone().add(vector);

  const coordinates = Object.values(newPos);
  if (coordinates.find((axis) => isBeyondLimit(axis))) return;

  tree.value = [...tree.value, pos, newPos];

  const isSafe = iteration.value <= init.value;

  if (isSafe || random() > 0.5)
    steps.push(() => step(newPos, deviateVector(vector, radiansAngle.value)));
  if (isSafe || random() > 0.5)
    steps.push(() => step(newPos, deviateVector(vector, radiansAngle.value)));
};

const start = () => {
  tree.value = [];
  prevSteps = [];
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
    if (frame.value % 7 !== 0) return;
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
