import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';

Vue.config.productionTip = false;

declare module 'vue/types/vue' {
    interface Vue {
        $message: (params: { message: string, type?: string }) => void;
    }
}

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
