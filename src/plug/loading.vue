<template>
  <div class="load-container" v-show="show">
  <div class="loadSpinner">
    <Icon type="ios-loading" size=24 class="loadingIcon demo-spin-icon-load"></Icon>
    <p class="loadText">{{message}}</p>
  </div>
  </div>
</template>

<script>
export default {
   data() {
    return {
      show: false,
      message: "加载中，请稍后"
    };
  },
  watch:{
    show(_new){
      this.show = _new
    }
  },
  methods:{
     close(){
      this.$emit("close");
    }
  }
};
</script>

<style leng="less" scoped>
.load-container {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 99999;
  background-color: #fff;
  opacity: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap
}
.loadSpinner{
    width: 100%;
    text-align: center;
    position: absolute;
}
.loadingIcon{
  vertical-align: baseline;
  display: inline-block;
}
.loadText{
    margin: 3px 0;
    font-size: 14px;
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
</style>