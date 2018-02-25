import * as express from "express";
import * as bodyParser from "body-parser";
import * as request from "request";
import {
    urls as networkUrls,
    Network,
    NetworkConnectionStatus
} from "./src/apis/networks";
import { urls as bambooUrls } from "./src/apis/bamboo";

type ServerSideNetwork = Network & { password?: string };

const fixedSSIDs = [
    "Niania",
    "Forfang AP",
    "K00by'acky",
    "Merlin CCP",
    "LoToS",
    "BerkSterm Cycles",
    "GOLD",
    "Kotlyn",
    "Zalandoo Net",
    "XONE.PS4",
    "Saturn Ennergy",
    "LoosLey",
    "DM.Jyoan",
    "Jeronimo",
    "LeaDPro WIFI"
];

let bambooConfig = {
    url: "",
    login: "",
    password: "",
    connected: false,
    project: "",
    plan: ""
};

const fixedNetworks: ServerSideNetwork[] = fixedSSIDs.map(ssid => ({
    ssid,
    password: "1234",
    isSecured: Math.random() > 0.33
}));

let connectedNetworkSSID: string = "";
const app = express();

app.use(express.static("../server/main/data"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get(networkUrls.networks, (_req, res) => {
    res.send(JSON.stringify(fixedNetworks));
});

app.get(networkUrls.networkConfig, (_req, res) => {
    res.send(
        JSON.stringify({
            ssid: connectedNetworkSSID,
            password: Array.from(Array(4)).reduce(s => `${s}*`, ""),
            status: NetworkConnectionStatus.Connected,
            ip: "10.110.12.12",
            mac: "a4:17:31:4b:97:f1"
        })
    );
});

app.post(networkUrls.networkConnect, (req, res) => {
    const { ssid, password } = req.body;

    const networkCandidates = fixedNetworks.filter(n => n.ssid === ssid);
    if (networkCandidates.length !== 1) {
        res.send(JSON.stringify({ result: 0 }));
        return;
    }

    const networkToConnect = networkCandidates[0];
    if (networkToConnect.isSecured && networkToConnect.password !== password) {
        res.send(JSON.stringify({ result: 0 }));
        return;
    }

    connectedNetworkSSID = networkToConnect.ssid;
    res.send(JSON.stringify({ result: 1 }));
});

app.post(networkUrls.networkDisconnect, (_req, res) => {
    connectedNetworkSSID = "";
    res.send(JSON.stringify({ result: 1 }));
});

app.post(bambooUrls.bambooConnect, (req, res) => {
    const { url, login, password } = req.body;

    const auth = new Buffer(`${login}:${password}`).toString("base64");

    request({
        url: `${url}/rest/api/latest/currentUser.json?os_authType=basic`,
        headers: { Authorization: `Basic ${auth}` }
    }).on("response", resp => {
        if (resp.statusCode === 200) {
            bambooConfig = {
                ...bambooConfig,
                ...{
                    login,
                    password,
                    url: url
                },
                connected: true
            };
            res.send(JSON.stringify({ result: 1 }));
        } else {
            res.send(JSON.stringify({ result: 0 }));
        }
    });
});

app.post(bambooUrls.bambooSelectProject, (req, res) => {
    const { project } = req.body;
    bambooConfig = { ...bambooConfig, ...{ project } };
    res.send(JSON.stringify({ result: 1 }));
});

app.post(bambooUrls.bambooSelectPlan, (req, res) => {
    const { plan } = req.body;
    bambooConfig = { ...bambooConfig, ...{ plan } };
    res.send(JSON.stringify({ result: 1 }));
});

app.get(bambooUrls.bambooConfig, (_req, res) => {
    res.send(JSON.stringify(bambooConfig));
});

app.get(bambooUrls.bambooProjects, (_req, res) => {
    const auth = new Buffer(
        `${bambooConfig.login}:${bambooConfig.password}`
    ).toString("base64");

    request(
        {
            url: `${
                bambooConfig.url
            }/rest/api/latest/project.json?os_authType=basic&max-result=1000`,
            headers: { Authorization: `Basic ${auth}` }
        },
        (_err, resp, body) => {
            if (resp.statusCode === 200) {
                const projects = JSON.parse(body).projects.project.map(
                    ({ name, key }: any) => ({ name, key })
                );
                res.send(JSON.stringify(projects));
            } else {
            }
        }
    );
});

app.get(bambooUrls.bambooPlans, (_req, res) => {
    const { project } = bambooConfig;
    const auth = new Buffer(
        `${bambooConfig.login}:${bambooConfig.password}`
    ).toString("base64");

    request(
        {
            url: `${
                bambooConfig.url
            }/rest/api/latest/project/${project}.json?os_authType=basic&expand=plans&max-result=1000`,
            headers: { Authorization: `Basic ${auth}` }
        },
        (_err, resp, body) => {
            if (resp.statusCode === 200) {
                const plans = JSON.parse(body).plans.plan.map(
                    ({ name, key }: any) => ({ name, key })
                );
                res.send(JSON.stringify(plans));
            } else {
            }
        }
    );
});

app.listen(80);