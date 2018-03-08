export interface BambooConfig {
    url: string;
    login: string;
    password: string;
    connected: boolean;
    project: string;
    plan: string;
}

export interface BambooProject {
    key: string;
    name: string;
}

export interface Link {
    href: string;
    rel: string;
}

export interface Project {
    key: string;
    name: string;
    description: string;
    link: Link;
}

export interface Projects {
    project: Project[];
}

export interface RootObject {
    projects: Projects;
}



export interface BambooPlan {
    key: string;
    name: string;
}

export const urls = {
    bambooConnect: "/bamboo-connect",
    bambooSelectProject: "/bamboo-select-project",
    bambooSelectPlan: "/bamboo-select-plan",
    bambooConfig: "/bamboo-config",
    bambooProjects: "/bamboo-projects",
    bambooPlans: "/bamboo-plans"
};

export const connect = (url: string, login: string, password: string) =>
    new Promise((res, rej) => {
        fetch(`${API_HOST}${urls.bambooConnect}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, login, password })
        })
            .then(response => response.json())
            .then(response => {
                if (response.result === 1) res();
                else rej();
            });
    });

export const selectProject = (project: string) =>
    new Promise((res, rej) => {
        fetch(`${API_HOST}${urls.bambooSelectProject}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project })
        })
            .then(response => response.json())
            .then(response => {
                if (response.result === 1) res();
                else rej();
            });
    });

export const selectPlan = (plan: string) =>
    new Promise((res, rej) => {
        fetch(`${API_HOST}${urls.bambooSelectPlan}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan })
        })
            .then(response => response.json())
            .then(response => {
                if (response.result === 1) res();
                else rej();
            });
    });

export const getBambooConfig = () =>
    new Promise<BambooConfig>(result => {
        fetch(`${API_HOST}${urls.bambooConfig}`).then(res =>
            result(res.json())
        );
    });

export const getBambooProjects = () =>
    new Promise<BambooProject[]>(result => {
        fetch(`${API_HOST}${urls.bambooProjects}`).then(res => {
            res.json().then(root => result(root.projects.project.map((p: Project) => ({ ...p })))
            );
        }
        );
    });

export const getBambooPlans = () =>
    new Promise<BambooPlan[]>(result => {
        fetch(`${API_HOST}${urls.bambooPlans}`).then(res => result(res.json()));
    });
