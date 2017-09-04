import Vue from 'vue';
import Component from 'vue-class-component';
import {connect} from '../apis/bamboo';

const template: string = `
<div>
    <div>
        <label>Bamboo project url</label>
        <input v-model="projectUrl"></input>
    </div>
    <div>
        <label>Username</label>
        <input v-model="login"></input>
    </div>
    <div>
        <label>Password</label>
        <input v-model="password"></input>
    </div>
    <div>
        <button @click="loginBamboo">Login</button>
    </div>
</div>
`;

@Component({
    template
})
export class BambooConfigComponent extends Vue{
    projectUrl: string = "";
    login: string = "";
    password: string = "";

    loginBamboo(){
        connect(this.projectUrl, this.login, this.password).then(()=>{
            console.log('logged-in');
        }).catch(()=>{
            console.log('not-logged-in');
        });
    }
}