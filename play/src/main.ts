import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

import { GmScroll } from "@/assets/es/index.js";

import "@/assets/styles/scroll.css";

const app = createApp(App);

app.use(GmScroll);

app.use(createPinia());
app.use(router);

app.mount("#app");
