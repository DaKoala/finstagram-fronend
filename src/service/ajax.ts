import axios from 'axios';
import BASE_URL from './config';

axios.defaults.withCredentials = true;

interface AjaxData {
    [key: string]: any;
}

interface AjaxConfig {
    method?: string;
    url: string;
    data?: AjaxData,
    headers?: AjaxData,
    params?: AjaxData,
}

function ajax(config: AjaxConfig): Promise<any> {
    let params;
    let bodyData;
    if (config.method === undefined || config.method.toLowerCase() === 'get') {
        params = config.data;
    } else {
        bodyData = config.data;
    }
    return axios({
        method: config.method || 'get',
        url: `${BASE_URL}${config.url}`,
        data: bodyData,
        params,
        headers: config.headers,
    });
}

export default ajax;
