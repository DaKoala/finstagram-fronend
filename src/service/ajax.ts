import axios from 'axios';
import BASE_URL from './config';

axios.defaults.withCredentials = true;

interface AjaxData {
    [key: string]: string | number | boolean;
}

interface AjaxConfig {
    method?: string;
    url: string;
    data?: AjaxData,
    headers?: AjaxData,
}

function ajax(config: AjaxConfig): Promise<any> {
    return axios({
        method: config.method || 'get',
        url: `${BASE_URL}${config.url}`,
        data: config.data,
        headers: config.headers,
    });
}

export default ajax;
