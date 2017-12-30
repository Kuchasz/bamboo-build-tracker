import { delay } from "./common";

let fakeBambooProjectConfig = {
    url: "",
    login: "",
    password: "",
    connected: false,
    project: "",
    plan: ""
};

export interface BambooConfig {
    url: string;
    login: string;
    password: string;
    connected: boolean;
    project: string;
    plan: string;
}

const fakeConnect = (
    bambooProjectUrl: string,
    login: string,
    password: string
) =>
    delay().then(
        () => {
            console.log(bambooProjectUrl, login, password);
        }
        // new Promise<void>((res, rej) => {
        //     if (fakeBambooServer.url !== bambooProjectUrl) rej();
        //     if (fakeBambooServer.login !== login) rej();
        //     if (fakeBambooServer.password !== password) rej();

        //     fakeBambooProjectConfig = {
        //         ...fakeBambooProjectConfig,
        //         ...fakeBambooServer,
        //         connected: true
        //     };
        //     res();
        // })
    );

const remoteConnect = (
    bambooProjectUrl: string,
    login: string,
    password: string
) => {
    console.log(bambooProjectUrl, login, password);
};

export const connect = API_TYPE === "MOCK" ? fakeConnect : remoteConnect;

const fakeSelectProject = (project: string) =>
    delay().then(() => {
        fakeBambooProjectConfig = {
            ...fakeBambooProjectConfig,
            project,
            plan: ""
        };
    });

const remoteSelectProject = (project: string) => {
    console.log(project);
};

export const selectProject =
    API_TYPE === "MOCK" ? fakeSelectProject : remoteSelectProject;

const fakeSelectPlan = (plan: string) =>
    delay().then(
        () =>
            (fakeBambooProjectConfig = {
                ...fakeBambooProjectConfig,
                plan
            })
    );

const remoteSelectPlan = (plan: string) => {
    console.log(plan);
};

export const selectPlan =
    API_TYPE === "MOCK" ? fakeSelectPlan : remoteSelectPlan;

const fakeGetBambooConfig = () =>
    delay().then(() => ({ ...fakeBambooProjectConfig }));

const remoteGetBambooConfig = () => ({});

export const getBambooConfig =
    API_TYPE === "MOCK" ? fakeGetBambooConfig : remoteGetBambooConfig;

const fakeGetBambooProjects = () => delay().then(() => ({}));

const remoteGetBambooProjects = () => ({});

export const getBambooProjects =
    API_TYPE === "MOCK" ? fakeGetBambooProjects : remoteGetBambooProjects;

const fakeGetBambooPlans = (project: string) =>
    delay().then(() => ({ project }));

const remoteGetBambooPlans = (project: string) => ({ project });

export const getBambooPlans =
    API_TYPE === "MOCK" ? fakeGetBambooPlans : remoteGetBambooPlans;
