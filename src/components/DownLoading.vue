<template>
    <div>
        <div v-for="(item, index) in formData" :key="index" @click="download(item)" class="download-content">
          <span class="download-text grey-regular2" v-if="text">{{index == 0 ? text : ''}}</span>
          <div class="content">
            <Icon style="margin-left: 20px;" type="ios-folder-outline" size="20"/>
            <div class="content-title">{{item.name}}</div>
            <Icon style="margin-left: 8px;" color="#4098ff" type="md-arrow-round-down" size="20"/>
          </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "DownLoading",
    data() {
      return {

      }
    },
    props: {
      formData: {
        type: Array ,
        default: []
      },
      text: {
        type: String ,
        default: ''
      },
    },
    methods: {
      download(item) {
        try{
          window.open(item.url,'_blank')
        }catch (e) {}
      }
    }
  }
</script>

<style scoped>
    .download-content{
      display: inline-flex;
    }
    .download-text{
      line-height: 60px;
      width: 35px;
    }
    .content{
        display: flex;
        align-items: center;
        border: 1px solid #C8CCDD;
        border-radius: 4px;
        height: 40px;
        width: 350px;
        margin: 10px;
        background-color: #fff;
    }
    .content-title{
        display: inline-block;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #474C63;
        letter-spacing: 0;
        margin-left: 15px;
        width: 250px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: left;
    }
</style>
