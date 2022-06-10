<template>
  <div class="full-screen list">
    <router-link :to="{ name: 'body-system' }">N Body System</router-link>
    <router-link :to="{ name: 'tree' }">Tree</router-link>
  </div>
</template>

<script setup>
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
</style>
