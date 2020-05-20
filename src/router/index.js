import Vue from 'vue';
import VueRouter from 'vue-router';
import layout from '@/views/layout';
import login from '@/views/login';
import { getToken } from '@/utils/token';
import chart from '@/views/layout/chart';
import enterprise from '@/views/layout/enterprise';
import question from '@/views/layout/question';
import subject from '@/views/layout/subject';
import user from '@/views/layout/user';
Vue.use(VueRouter);

let router = new VueRouter({
    routes: [
        {
            path: '*',
            redirect: '/login'
        },
        {
            path: '/layout',
            component: layout, children: [
                {
                    path: 'chart',
                    component: chart
                },
                {
                    path: 'enterprise',
                    component: enterprise
                },
                {
                    path: 'question',
                    component: question
                },
                {
                    path: 'subject',
                    component: subject
                },
                {
                    path: 'user',
                    component: user
                }
            ]

        },
        {
            path: '/login',
            component: login
        }
    ]
});
//导航守卫
router.beforeEach((to, from, next) => {
    // console.log(getToken);

    // console.log(to);
    // console.log(from);
    if (to.path == '/login') {
        next()
    } else {
        let token = getToken();
        if (token) {
            next()
        } else {
            next('/login')
        }
    }


})
export default router