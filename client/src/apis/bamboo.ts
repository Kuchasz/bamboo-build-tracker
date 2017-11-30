import {delay} from "./common";

let fakeBambooProjectConfig = {
    url: 'bamboo.sample.net',
    login: 'john.doe',
    password: '******',
    connected: true,
    project: '',
    plan: ''
};

const projects = ['Aspen', 'Medivio', 'Silvermedic', 'WCA', 'KGHM'];
const plans = ['dev', 'test', 'beta'];

export interface BambooConfig {
    url: string;
    login: string;
    password: string;
    connected: boolean;
    project: string;
    plan: string;
}

export const connect = (bambooProjectUrl: string, login: string, password: string) => delay().then(() => new Promise<void>((res, rej) => {
    if (fakeBambooProjectConfig.url !== bambooProjectUrl) rej();
    if (fakeBambooProjectConfig.login !== login) rej();
    if (fakeBambooProjectConfig.password !== password) rej();
    res();
}));

export const selectProject = (project: string) => delay().then(() => {
    fakeBambooProjectConfig = {...fakeBambooProjectConfig, project, plan: ''};
});

export const selectPlan = (plan: string) => delay().then(() => fakeBambooProjectConfig = {...fakeBambooProjectConfig, plan});

export const getBambooConfig = () => delay().then(() => ({...fakeBambooProjectConfig}));

export const getBambooProjects = () => delay().then(() => projects);

export const getBambooPlans = (project: string) => delay().then(() => plans.map(p => `${project}-${p}`));