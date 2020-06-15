<template>
  <Modal v-model="show" :title="title+'评分说明'" :width="590" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
     <p class="score-cescription">{{text}}</p>
     <p class="score-cescription">{{text2}}</p>
     <p class="score-cescription">{{text3}}</p>
  </Modal>
</template>

<script>
export default {
    props:{
        title: {
          type: String,
          default: ''
        },
        showModal: {
            type: Boolean,
            default: false
        }
    },
    data (){
        return{
            show: false,
            text2: `2.	考核方式为“随机完成1个病例”和“${this.title == "考试" ? "考生" : ""}自主选择病例”时，必须最少完成1个病例，考核总分为所做病例平均分。`,
            text3: `3.	必须完成所有病例评分后，才能获得${this.title}总分。`,
            text: `1.	考核方式为“完成所有病例”时，必须完成所有病例练习，未完成的记为0分，${this.title}总分为所有病例平均分。`
        }
    },
    watch:{
        showModal(_new){
            this.show = _new
        },
    },
    methods: {
        closeModal(){
            this.show = false;
            this.$emit("close")
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-modal-body{
    padding: 30px 45px 60px 35px;
}
.score-cescription{
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #333333;
    letter-spacing: 0;
    text-align: justify;
    line-height: 30px;
    margin-bottom: 30px;
}
</style>
