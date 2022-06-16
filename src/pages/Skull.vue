<template>
  <Renderer
    antialias
    :orbit-ctrl="{ enableDamping: true }"
    resize="window"
    shadow
  >
    <Camera :position="{ y: 200, z: 300 }" />
    <Scene>
      <DirectionalLight
        :position="{ x: 0, y: -200, z: 100 }"
        cast-shadow
        color="#ee1111"
        :shadow-camera="{ top: 180, bottom: -120, left: -120, right: 120 }"
      />

      <FbxModel
        :src="skull"
        @load="onLoad"
        :position="{ y: 30 }"
        :scale="{ x: 1.6, y: 1.6, z: 1.6 }"
      />
    </Scene>
  </Renderer>
</template>

<script setup>
import { Camera, DirectionalLight, FbxModel, Renderer, Scene } from "troisjs";
import skull from "@/assets/Skull.fbx";

const onLoad = (object) => {
  object.traverse((child) => {
    if (!child.isMesh) return;

    child.castShadow = true;
    child.receiveShadow = true;
  });
};
</script>
