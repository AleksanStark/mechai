import { createApp } from "vue";
import App from "./App.vue";
import "./styles/main.css";
import { router } from "./providers/routes/index";

createApp(App).use(router).mount("#app");
