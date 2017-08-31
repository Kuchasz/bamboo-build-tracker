import Vue from 'vue';
import Component from 'vue-class-component';
import { NetworkComponent } from "./network";


interface Network{
    name: string;
    isSecured: boolean;
}

@Component({
    template: `<div><div v-for="network in networks"><network-component :name="network.name" :isSecured="network.isSecured"/></div></div>`,
    components: {
        'network-component': NetworkComponent
    }
})
export class NetworksConfigComponent extends Vue{
    networks: Network[] = [
        {name: 'Gold', isSecured: true},
        {name: 'Profit', isSecured: true},
        {name: 'Kakadu', isSecured: true},
        {name: 'UPC-WiFi', isSecured: false},
        {name: 'Dellirium', isSecured: true},
        {name: 'Kondominium', isSecured: true}
    ]
}

