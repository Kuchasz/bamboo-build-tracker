const fakeBambooProjectConfig = {
    url: 'http://www.onet.pl',
    login: 'admin',
    password: 'admin'
};

export const connect = (bambooProjectUrl: string, login: string, password: string) => new Promise<void>((res, rej)=>{
    setTimeout(() => {
        if (fakeBambooProjectConfig.url !== bambooProjectUrl) rej();
        if (fakeBambooProjectConfig.login !== login) rej();
        if (fakeBambooProjectConfig.password !== password) rej();
        res();
    }, 250);
});