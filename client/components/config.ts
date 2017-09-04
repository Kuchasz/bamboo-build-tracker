import Vue from 'vue';
import Component from 'vue-class-component';
import { NetworksConfigComponent } from "./networks-config";
import { BambooConfigComponent } from './bamboo-config';

const template: string = `
<div>
    <router-link to="/">Home</router-link>
    <br/>
    <br/>
    <div>
        <label>Networks Config</label>
        <networks-config-component/>
    </div>
    <br/>
    <div>
        <label>Bamboo Config</label>
        <bamboo-config-component/>
    </div>
</div>`;

@Component({
    template,
    components: {
        'networks-config-component': NetworksConfigComponent,
        'bamboo-config-component' :BambooConfigComponent
    }
})
export class ConfigComponent extends Vue{

}