import Vue from 'vue';
import Component from 'vue-class-component';

const template: string = `
<span @click="onSelect" :class="{ connected: isConnected }">
    {{name}}<i v-if="isSecured">&#x1f512;</i>
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