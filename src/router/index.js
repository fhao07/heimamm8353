import Vue from 'vue';
import VueRouter from 'vue-router';
import layout from '@/views/layout';
import login from '@/views/login'
Vue.use(VueRouter);

let router = new VueRouter({
    routes: [
        {
            path: '*',
            redirect: '/login'
        },
        {
            path: '/layout',
            component: layout
        },
        {
            path: '/login',
            component: login
        }
    ]
});
export default router