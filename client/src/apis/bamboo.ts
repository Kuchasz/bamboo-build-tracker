import {delay} from "./common";

const fakeBambooServer = {
    url: "bamboo.company.com",
    login: 'admin@company.com',
    password: 'admin'
};

let fakeBambooProjectConfig = {
    url: '',
    login: '',
    password: '',
    connected: false,
    project: '',
    plan: ''
};

const projects = ['Ascesulfam', 'Terbinafina', 'Ziaja', 'Dell', 'Verbatim', 'Energizer', 'BH', 'PLANET-X'];
const plans = ['dev', 'test', 'beta'];

export interface BambooConfig {
    url: string;
    login: string;
    password: string;
    connected: boolean;
    project: string;
    plan: string;
}

export const connect = (bambooProjectUrl: string, login: string, password: string) =>
    delay()
        .then(() => new Promise<void>((res, rej) => {
            if (fakeBambooServer.url !== bambooProjectUrl) rej();
            if (fakeBambooServer.login !== login) rej();
            if (fakeBambooServer.password !== password) rej();

            fakeBambooProjectConfig = {...fakeBambooProjectConfig, ...fakeBambooServer, connected: true};
            res();
        }));

export const selectProject = (project: string) =>
    delay()
        .then(() => {
            fakeBambooProjectConfig = {...fakeBambooProjectConfig, project, plan: ''};
        });

export const selectPlan = (plan: string) =>
    delay()
        .then(() => fakeBambooProjectConfig = {
            ...fakeBambooProjectConfig,
            plan
        });

export const getBambooConfig = () =>
    delay()
        .then(() => ({...fakeBambooProjectConfig}));

export const getBambooProjects = () =>
    delay()
        .then(() => projects);

export const getBambooPlans = (project: string) =>
    delay()
        .then(() => plans.map(p => `${project}-${p}`));