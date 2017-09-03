import Vue from 'vue';
import Component from 'vue-class-component';
import { NetworkComponent } from "./network";
import { Network, getNetworks, connectToNetwork } from "../apis/networks";

const template: string = `
<div>
    <button v-on:click="findNetworks">Find networks</button>
    <div v-for="network in networks">
        <network-component :isConnected="network.ssid === connectedNetwork" :on-select="() => selectNetwork(network)" :name="network.ssid" :isSecured="network.isSecured"/>
    </div>
    <div>
        <input v-model="password" placeholder="password"></input>
        <button v-on:click="connect">Connect</button>
    </div>
</div>`;

@Component({
    template,
    components: {
        'network-component': NetworkComponent
    }
})
export class NetworksConfigComponent extends Vue {
    networks: Network[] = [];
    connectedNetwork: string = "";
    selectedNetwork: string = "";
    password: string = "";

    findNetworks(){
        getNetworks().then(networks => this.networks = networks);
    }

    selectNetwork(network: Network){
        this.selectedNetwork = network.ssid;
    }

    connect(){
        console.log('connect!');
        connectToNetwork(this.selectedNetwork, this.password).then(()=>{
            this.connectedNetwork = this.selectedNetwork;
        }).catch(()=>{});
    }
}

