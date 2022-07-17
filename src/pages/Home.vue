<template>
  <div class="full-screen list">
    <router-link :to="{ name: 'body-system' }">N Body System</router-link>
    <router-link :to="{ name: 'tree' }">Tree</router-link>
    <router-link :to="{ name: 'sphere' }">Sphere</router-link>
    <router-link :to="{ name: 'skull' }">Skull</router-link>
    <router-link :to="{ name: 'river' }">For the River</router-link>
    <router-link :to="{ name: 'lorenz' }">Lorenz System</router-link>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style>
.full-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.list {
  display: flex;
  flex-direction: column;
}
.list a {
  color: white;
}
</style>
