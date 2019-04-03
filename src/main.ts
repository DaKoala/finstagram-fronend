import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';

Vue.config.productionTip = false;

declare module 'vue/types/vue' {
    interface Vue {
        $message: (params: { message: string, type?: string }) => void;
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
