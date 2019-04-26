import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faHeart as faHeartSolid,
    faTag,
    faComment,
} from '@fortawesome/free-solid-svg-icons';
import {
    faHeart as faHeartRegular,
} from '@fortawesome/free-regular-svg-icons';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';

library.add(
    faTag,
    faHeartSolid,
    faHeartRegular,
    faComment,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

declare module 'vue/types/vue' {
    interface Vue {
        $message: (params: { message: string, type?: string }) => void;
        $prompt: (inputHint: string, title: string, custom: {
            confirmButtonText: string,
            cancelButtonText: string,
            inputPattern?: string,
            inputErrorMessage?: string,
        }) => Promise<{ value: string }>;
        $error: any;
    }
}

Vue.prototype.$error = function errorMessage(data: { msg: string }) {
    this.$message({
        message: data.msg,
        type: 'error',
    });
};

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
