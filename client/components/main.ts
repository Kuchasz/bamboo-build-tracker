import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    template: ` <div><h3>Main component here!!</h3><router-link to="/config">Show config</router-link></div>`
})
export class MainComponent extends Vue{
 
}