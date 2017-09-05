import Vue from 'vue';
import Component from 'vue-class-component';

const template: string = `
<div>
    <h3>An welcome screen is here.</h3>
</div>`;

@Component({
    template
})
export class MainComponent extends Vue {

}