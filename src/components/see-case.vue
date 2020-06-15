<template>
  <Modal v-model="show" title="查看" :width="(type==3 || type==5 || type==6) ? 1000 : 620" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
      <div :class="(type==3 || type==5 || type == 6) ? '' : 'modal-body'">
      <div class="problem" v-if="type==1">
          <div class="item-problem item-problem-left">{{detailData.question}}</div>
          <div class="item-problem item-problem-right">{{detailData.answer}}</div>
      </div>
      <div v-if="type==2">
        <p class="item-text">检查项目：{{detailData.source_name_part_1}}</p>
        <!-- <p class="item-text">检查工具：听诊器</p> -->
        <p class="item-text" v-if="detailData.source_name_part_2">检查部位：{{detailData.source_name_part_2}}</p>
        <p class="item-text">检查结果：{{physical&&physical.result_text}}</p>
        <div v-if="physical.result_media_type=='Picture'&&physical.physical_details.length>0" class="item-media">
            <img v-for="(t,i) in physical.physical_details" :key="i" :src="mediaUrl+t.result_media_url" alt="检查结果图片" />
        </div>
        <div v-if="physical.result_media_type=='Video'" class="item-media">
                <!--autoplay muted -->
            <video v-for="(t,i) in physical.physical_details" :key="i" :src="mediaUrl+t.result_media_url" class="item-video" controls width="100%" height="100%" ></video>
        </div>
        <div v-if="physical.result_media_type=='Audio'" class="item-media">
            <img @click="play" class="item-img" src="../assets/case/audio.png" />
            <!-- autoplay -->
            <audio v-for="(t,i) in physical.physical_details" :key="i" :src="mediaUrl+t.result_media_url" id="typeAudiosId" class="item-audio" controls />
        </div>
      </div>
      <div v-if="type==4">
        <p class="item-text">检查项目：{{detailData.name}}</p>
        <p class="item-text">检查结果：{{detailData.result_text}}</p>
        <div v-if="detailData.result_media_type=='Audio'&&detailData.detail.length>0" class="item-media">
            <img @click="play" class="item-img" src="../assets/case/audio.png" />
            <!-- autoplay -->
            <audio v-for="(t,i) in detailData.detail" :key="i" :src="mediaUrl+t.result_media_url" id="typeAudiosId" class="item-audio" controls />
        </div>
        <div v-if="detailData.result_media_type=='Picture'&&detailData.detail.length>0" class="item-media">
            <img v-for="(t,i) in detailData.detail" :key="i" :src="mediaUrl+t.result_media_url" alt="检查结果图片" />
        </div>
        <div v-if="detailData.result_media_type=='Video'&&detailData.detail.length>0" class="item-media">
                <!--autoplay muted -->
            <video v-for="(t,i) in detailData.detail" :key="i" :src="mediaUrl+t.result_media_url" class="item-video" controls width="100%" height="100%" ></video>
        </div>
      </div>
      <div v-if="type==3" :class="assistant&&assistant.type=='ExaminationReport' ? 'examination-report':''">
        <div class="assistant-item">
            <p class="item-text2">辅助检查项：{{detailData.source_name_part_1}}
                <span v-if="detailData.source_name_part_2"> > {{detailData.source_name_part_2}}</span>
                <span class="item-right" v-if="costs">检查费用：¥{{costs}}</span>
            </p>
        </div>
        <div v-if="assistant&&assistant.type=='ExaminationReport'&&assistant.assistant_details&&assistant.assistant_details.length>0">
            <ExaminationReport :tableHeight="640" :tableData="assistant.assistant_details"></ExaminationReport>
        </div>
        <div class="assistant" v-if="assistant&&assistant.type=='ImageData'&&assistant.assistant_details&&assistant.assistant_details.length>0">
            <div  class="image-data">
                <!-- assistant.assistant_details[0].report -->
                <iframe  class="image-data-iframe" :src='officeappsUrl+assistant.assistant_details[0].report' width='100%' height='100%' frameborder='1' />
            </div>
        </div>
      </div>
      <div v-if="type==5 || type==6" :class="detailData&&detailData.type=='ExaminationReport' ? 'examination-report':''">
        <div class="assistant-item" v-if="type==5">
            <p class="item-text2">辅助检查项：{{detailData.name}}
                <span class="item-right" v-if="costsDiary">检查费用：¥{{costsDiary}}</span>
            </p>
        </div>
        <div v-if="detailData.type=='ExaminationReport'&&detailData.detail.length>0">
            <ExaminationReport :tableHeight="640" :tableData="detailData.detail"></ExaminationReport>
        </div>
        <div class="assistant" v-if="detailData.type=='ImageData'&&detailData.detail.length>0">
            <div  class="image-data">
                <!-- assistant.assistant_details[0].report -->
                <iframe  class="image-data-iframe" :src='officeappsUrl+detailData.detail[0].report' width='100%' height='100%' frameborder='1' />
            </div>
        </div>
      </div>
      </div>
  </Modal>
</template>

<script>
import mediaUrl from '../../config/media'
import officeappsUrl from '../../config/officeapps'
import tableMixins from './examination-report/table-mixins'

export default {
   mixins: [tableMixins],
    props:{
        type: {
            type: Number,
            default: 2,
        },
        showModal: {
            type: Boolean,
            default: false
        },
        detailData: {
          type: Object,
          default: () => {}
        }
    },
    data (){
        return{
            show: false,
            audioPlay: true,
            mediaUrl, officeappsUrl
        }
    },
    watch:{
        showModal(_new){
            this.show = _new
            console.log(this.detailData,'detailData')
        },
    },
    computed:{
        physical(){
            return this.detailData&&this.detailData.physical
        },
        assistant(){
            return this.detailData&&this.detailData.assistant
        },
        costsDiary(){
            let c = null
            if(this.detailData&&this.detailData.detail.length>0){
                if(this.detailData.type=='ExaminationReport'){
                    this.detailData.detail.forEach(it => { c += it.cost });
                }
                if(this.detailData.type=='ImageData'){ c = this.detailData.detail[0].cost }
            }
            return c
        },
        costs(){
            let c = null
            if(this.assistant&&this.assistant.assistant_details.length>0){
                if(this.assistant.type=='ExaminationReport'){
                    this.assistant.assistant_details.forEach(it => { c += it.cost });
                }
                if(this.assistant.type=='ImageData'){ c = this.assistant.assistant_details[0].cost }
            }
            return c
        },
    },
    methods: {
        closeModal(){
            this.show = false;
            let aud = document.querySelector('#typeAudiosId');
            if(aud) aud.pause();
            this.$emit("close-modal")
        },
        play(){
            let aud = document.querySelector('#typeAudiosId');
            if(aud) {
                if(this.audioPlay){
                    aud.play()
                    this.audioPlay = false
                }else {
                    aud.pause()
                    this.audioPlay = true
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
@media screen and (min-height: 840px) {
    /deep/.ivu-modal-wrap{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    /deep/ .ivu-modal-content{
        width: inherit;
    }
}
/deep/ .ivu-modal{
    top: 0
}
/deep/ .ivu-modal-header{background: #fff !important; padding: 0 !important;}
/deep/ .ivu-modal-close .ivu-icon-ios-close{ color:#9397AD !important; }
/deep/ .ivu-modal-header-inner{
    font-family: PingFangSC-Regular !important;
    font-size: 20px !important;
    color: #474C63 !important;
    height: 70px;
    line-height: 70px;
}
.examination-report{
    padding-bottom: 50px;
}
.assistant{
    position: relative;
    height: 635px;
    top: -30px;
}
.assistant-item{
    padding: 20px;
    background: #F6F7FB;
}
.modal-body{
    padding: 29px 50px 50px 50px;
}
/deep/ .ivu-modal-body{
    padding: 0;
}
.problem{
    width: 100%;
}
.item-problem{
    font-family: PingFangSC-Medium;
    font-size: 22px;
    letter-spacing: 1.08px;
    line-height: 34px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 420px;
}
.item-problem-left{
    color: #474C63;
    background-image: url('../assets/case/problem-left.png');
    padding: 8px 16px 8px 25px;
}
.item-problem-right{
    position: relative;
    right: -100px;
    color: #fff;
    background-image: url('../assets/case/problem-right.png');
    padding: 11px 25px 11px 16px;
    margin-top: 40px;
}
.item-text{
    margin-bottom: 20px;
}
.item-text,.item-text2{
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #474C63;
    position: relative;
    .item-right{
        position: absolute;
        right: 10px;
    }
}
.item-media{
    width: 520px;
    height: 315px;
    img{
        width: 100%;
        height: 100%;
    }
    .item-img{
        margin: 90px 245px 50px 236px ;
        width: 79px;
        height: 99px;
    }
}
.item-video{
    &:focus{
         outline-style: none
    }
}
.item-audio{
    width: 100%;
    &:focus{
         outline-style: none
    }
}
.image-data{
  position: absolute;
  top: 37px;
  width: 100%;
  height: 640px;
  overflow: hidden;
}
.image-data-iframe{
  position: relative;
  top: -55px;
  left: -2px;
}
</style>
