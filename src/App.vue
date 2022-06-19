<template>
  <home-button />
  <router-view></router-view>
</template>

<script setup>
import { RouterView } from "vue-router";
import HomeButton from "@/components/HomeButton.vue";
</script>
