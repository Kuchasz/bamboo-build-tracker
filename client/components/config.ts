import Vue from 'vue';
import Component from 'vue-class-component';
import { NetworksConfigComponent } from "./networks-config";

@Component({
    template: `<div><router-link to="/">Home</router-link><networks-config-component/></div>`,
    components: {
        'networks-config-component': NetworksConfigComponent
    }
})
export class ConfigComponent extends Vue{

}