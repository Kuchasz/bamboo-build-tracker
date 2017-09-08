import Vue from "vue";
import VueRouter from 'vue-router';
import { StatusComponent } from "./components/status";
import {NetworksConfigComponent} from "./components/networks-config";
import {BambooConfigComponent} from "./components/bamboo-config";
import {AlarmConfigComponent} from "./components/alarm-config";

import "./style.scss";


let router = new VueRouter({
  routes: [
    { path: '/', component: StatusComponent },
    { path: '/config/alarm', component: AlarmConfigComponent },
    { path: '/config/networks', component: NetworksConfigComponent },
    { path: '/config/bamboo', component: BambooConfigComponent }
  ]
});

Vue.use(VueRouter);

new Vue({
  el: '#app-root',
  router
});