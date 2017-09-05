import Vue from 'vue';
import Component from 'vue-class-component';

const template: string = `
<span @click="onSelect" class="network-component" :class="{ connected: isConnected }">
    <i class="material-icons">{{ isSecured===true ? 'signal_wifi_4_bar_lock' : 'signal_wifi_4_bar' }}</i><span>{{name}}</span>
</span>`;

@Component<NetworkComponent>({
    template,
    props: ['name', 'isSecured', 'onSelect', 'isConnected']
})
export class NetworkComponent extends Vue{
    name: string;
    isSecured: boolean;
    isConnected: boolean;
    onSelect: () => void;

    constructor(){
        super();
    }
}