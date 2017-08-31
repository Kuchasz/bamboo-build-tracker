import Vue from "vue";
import VueRouter from 'vue-router';
import { MainComponent } from "./components/main";
import { ConfigComponent } from "./components/config";

let router = new VueRouter({
  routes: [
    { path: '/', component: MainComponent },
    { path: '/config', component: ConfigComponent }
  ]
});

Vue.use(VueRouter);

new Vue({
  el: '#app-root',
  router
});