<template>
  <Renderer
    antialias
    :orbit-ctrl="{ enableDamping: true }"
    resize="window"
    shadow
    ref="renderer"
  >
    <Camera :position="{ y: 200, z: 300 }" />
    <Scene>
      <Line>
        <CustomGeometry :points="points" />
      </Line>
    </Scene>
  </Renderer>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from "vue";
import { Camera, Renderer, Scene } from "troisjs";
import { CustomGeometry } from "@/components/geometries";
import { Line } from "@/components/meshes";

import { Vector3 } from "three";

const p = 28;
const a = 10;
const b = 8 / 3;

const renderer = ref();

const { random } = Math;

const initialPoint = new Vector3(random() * 25, random() * 25, random() * 25);
const points = shallowRef([initialPoint]);

onMounted(() => {
  renderer.value.onBeforeRender(() => {
    const dt = 0.01;

    const prevPoint = points.value[points.value.length - 1];
    const { x, y, z } = prevPoint;

    const dx = a * (y - x);
    const dy = x * (p - z) - y;
    const dz = x * y - b * z;

    const nx = x + dx * dt;
    const ny = y + dy * dt;
    const nz = z + dz * dt;

    const next = new Vector3(nx, ny, nz);

    if (!isFinite(next.x) || !isFinite(next.y) || !isFinite(next.z)) return;

    points.value = [...points.value, next];
  });
});
</script>
