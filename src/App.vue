<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
  import api from './api/modules/config'
  export default {
    beforeCreate() {
      let vm = this;
      api.interceptors.request
        .use(function (config) {
          if (config.data) config.data.token = '' || sessionStorage.getItem('token')
          else config.data = {token: sessionStorage.getItem('token')}
          return config;
        }, function (error) {
          return Promise.reject(error);
        });
      api.interceptors.response
        .use(function (response) {
          if (response.data.res_code < 0) {
            let code = response.data.res_code;
            if (code >= -903 && code <= -900) {
              sessionStorage.clear();
              vm.$router.push({path: '/login'});
            }
          }
          return response;
        }, function (error) {
          return Promise.reject(error);
        });
    }
  }
</script>
<style lang="less">
    html { height: 100%; }
    body {
        height: 100%;
        width: 100%;
        margin: 0;
        min-width: 1200px;
        overflow: hidden;
    }
    #app {
        width: 100%;
        height: 100%;
        padding: 0;
        font-family: "Microsoft YaHei" !important;
        text-align: center;
        a { text-decoration: none; }
        overflow: hidden;
    }
    .head, .case-header{
        display: none !important;
    }
</style>
