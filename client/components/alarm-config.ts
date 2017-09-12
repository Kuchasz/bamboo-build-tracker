import Vue from 'vue';
import Component from 'vue-class-component';

const template: string = `
<div>
    <div class="complex-input">
        <label>Light effects</label>
        <i class="material-icons">lightbulb_outline</i>
    </div>
    <div class="complex-input">
        <label>Sound effects</label>
        <i class="material-icons">volume_up</i>
    </div>
</div>`;

@Component({
    template
})
export class AlarmConfigComponent extends Vue{

}