import Vue from 'vue';
import Component from 'vue-class-component';
import { NetworksConfigComponent } from "./networks-config";

@Component({
    template: ` <div><h3>Main component here!!</h3><router-link to="/config">Show config</router-link></div>`,
    components: {
        'network-config-component': NetworksConfigComponent
    }
})
export class MainComponent extends Vue{
 
}