export interface BambooConfig {
    url: string;
    login: string;
    password: string;
    connected: boolean;
    project: string;
    plan: string;
}

export const urls = {
    bambooConnect: "/bamboo-connect",
    bambooSelectProject: "/bamboo-select-project",
    bambooSelectPlan: "/bamboo-select-plan",
    bambooConfig: "/bamboo-config",
    bambooProjects: "/bamboo-projects",
    bambooPlans: "/bamboo-plans"
};

export const connect = (
    bambooProjectUrl: string,
    login: string,
    password: string
) =>
    new Promise((res, rej) => {
        fetch(`${API_HOST}${urls.bambooConnect}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bambooProjectUrl, login, password })
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
    new Promise<string[]>(result => {
        fetch(`${API_HOST}${urls.bambooProjects}`).then(res =>
            result(res.json())
        );
    });

export const getBambooPlans = () =>
    new Promise<string[]>(result => {
        fetch(`${API_HOST}${urls.bambooPlans}`).then(res => result(res.json()));
    });
