import Vue from 'vue';
import store from '../store';
import router from './router';
import { sync } from 'vuex-router-sync';
import LoadingY from '../plug/index';
import config from './config';
import postData from "../api/postData";
Vue.prototype.$config = config;
window.$OnLine = new Vue()
window.$MakeAppointment = new Vue()
window.$ActivePage = new Vue()
window.$CaseAdd = new Vue()
window.$CaseEdit = new Vue()
window.$CaseSuccessfulOperation = new Vue()
window.$CaseScoreDetails = new Vue()
window.$CaseScoreWeight = new Vue()
window.$CasePreservation = new Vue()
window.$AbilityAnalysis = new Vue()
Vue.use(LoadingY)
global.PostData = postData;
// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

import api from '../api/modules/config'
router.beforeEach((to, from, next) => {
    let toLogin = () => {
      if (to.name == 'login') next();
      else {
          sessionStorage.clear();
          next({path: '/login'});
      }
    }
    if(sessionStorage.getItem('token')){
        if(to.name === 'login'){
            next({name: 'user-manage'})
        }else if(to.name != 'login'){
             // postData('user/getUserPermission',{from:"web"}).then((res) => {
            //     if(res.res_code === 1 && res.data){
            //         sessionStorage.setItem('token',res.data.token)
            //         sessionStorage.setItem('PERMISSIONS',Base64.encode('学格科技' + JSON.stringify(res.data.permissions)));
                    api.post('user/getUserDetail',{token: sessionStorage.getItem('token')}).then((res) => {
                        if (res.data.res_code === 1) {
                            let d = res.data.data;
                            sessionStorage.setItem('organizationId',d.organization_id)
                            store.dispatch('set_user_info', d);
                            sessionStorage.setItem('PERSONALDETAILS',JSON.stringify(d))
                            next()
                        }else {
                            if (to.name !== 'login') next({ path: '/login' });
                            else toLogin();
                        }
                    })
            //     }else{
            //         Message.warning('暂无权限');
            //         toLogin()
            //     }
            // })
        }
    }else toLogin()
})
export default router;
