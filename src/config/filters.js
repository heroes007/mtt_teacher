/**
 * Created by zhaiyunzhi on 2016/12/6.
 */
import Vue from 'vue'

Vue.filter('zonetime',(value) => {
    var date = new Date(value);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
});


//服务接口声明
export const LocalFilters = "";
