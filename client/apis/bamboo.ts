const fakeBambooProjectConfig = {
    url: 'bamboo.sample.net',
    login: 'john.doe',
    password: '******',
    connected: true,
    project: '',
    plan: ''
};

const projects = ['Aspen', 'Medivio', 'Silvermedic', 'WCA', 'KGHM'];
const plans = ['Innergy-dev', 'Innergy-test', 'Innergy-beta'];

export interface BambooConfig{
    url: string;
    login: string;
    password: string;
    connected: boolean;
    project: string;
    plan: string;
}

export const connect = (bambooProjectUrl: string, login: string, password: string) => new Promise<void>((res, rej)=>{
    setTimeout(() => {
        if (fakeBambooProjectConfig.url !== bambooProjectUrl) rej();
        if (fakeBambooProjectConfig.login !== login) rej();
        if (fakeBambooProjectConfig.password !== password) rej();
        res();
    }, 250);
});

export const selectProject = (project: string) => new Promise<void>(res => {
    setTimeout(() => {
        fakeBambooProjectConfig.project = project;
        if (project===project) res();
    }, 250);
});

export const selectPlan = (plan: string) => new Promise<void>(res => {
    setTimeout(()=>{
        fakeBambooProjectConfig.plan = plan;
        if (plan === plan) res();
    }, 250);
});

export const getBambooConfig = () => new Promise<BambooConfig>((res)=>{
    setTimeout(()=>{
        res(fakeBambooProjectConfig);
    }, 250);
});

export const getBambooProjects = () => new Promise<string[]>((res) => {
    setTimeout(()=>{
        res(projects)
    }, 250);
});

export const getBambooPlans = (project: string) => new Promise<string[]>((res)=>{
    setTimeout(()=>{
        res(plans.filter(()=>project===project));
    }, 250);
});