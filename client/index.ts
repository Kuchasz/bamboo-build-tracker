import Vue from "vue";
import VueRouter from 'vue-router';
import { StatusComponent } from "./components/status";
import { ConfigComponent } from "./components/config";

import "./style.scss";


let router = new VueRouter({
  routes: [
    { path: '/', component: StatusComponent },
    { path: '/config', component: ConfigComponent }
  ]
});

Vue.use(VueRouter);

new Vue({
  el: '#app-root',
  router
});