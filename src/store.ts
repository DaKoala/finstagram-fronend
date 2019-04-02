/* eslint no-param-reassign: 0 */
import Vue from 'vue';
import Vuex from 'vuex';
import BASE_URL from './service/config';

Vue.use(Vuex);

interface State {
    username: string,
    avatar: string,
}

export default new Vuex.Store({
    state: {
        username: '',
        avatar: '',
    },
    // @ts-ignore
    mutations: {
        updateInfo(state: State, payload: { username: string, avatar: string }) {
            state.username = payload.username;
            state.avatar = `${BASE_URL}/image/${payload.avatar}`;
        },
    },
    actions: {

    },
});
