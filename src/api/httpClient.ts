import axios  from 'axios';
import config from "../config";


const httpClient = axios.create({
    baseURL: config.host,
    headers: {
        "Authorization": `OAuth ${config.token}`,
        "X-Org-Id": config.orgId,
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }
});


export default httpClient;