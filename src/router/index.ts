import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { name: "home", path: "/", component: () => import("@/pages/Home.vue") },
  {
    name: "body-system",
    path: "/1",
    component: () => import("@/pages/BodySystem.vue"),
  },
  {
    name: "tree",
    path: "/2",
    component: () => import("@/pages/Tree.vue"),
  },
  {
    name: "sphere",
    path: "/3",
    component: () => import("@/pages/Sphere.vue"),
  },
  {
    name: "skull",
    path: "/4",
    component: () => import("@/pages/Skull.vue"),
  },
  {
    name: "river",
    path: "/5",
    component: () => import("@/pages/River.vue"),
  },
  {
    name: "lorenz",
    path: "/6",
    component: () => import("@/pages/Lorenz.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
