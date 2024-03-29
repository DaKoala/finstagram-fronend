import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('./views/Dashboard.vue'),
        },
        {
            path: '/add-post',
            name: 'add-post',
            component: () => import('./views/AddPost.vue'),
        },
        {
            path: '/user/:username',
            name: 'user',
            component: () => import('./views/User.vue'),
        },
        {
            path: '/friend-groups',
            name: 'friend-groups',
            component: () => import('./views/FriendGroups.vue'),
        },
        {
            path: '/*',
            redirect: '/',
        },
    ],
});
