import Vue from 'vue';
import Component from 'vue-class-component';

@Component<NetworkComponent>({
    template: `<span>{{name}}<i v-if="isSecured">&#x1f512;</i></span>`,
    props: ['name', 'isSecured']
})
export class NetworkComponent extends Vue{
    name: string;
    isSecured: boolean;

    constructor(){
        super();
    }
}