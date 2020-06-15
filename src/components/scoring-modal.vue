<template>
     <Modal v-model="show" :title="title" footer-hide :width="436" @on-cancel="closeModal"  :mask-closable=false>
       <div class="score">{{fraction}}分</div>
       <p class="text">评分后不可修改，是否评分？</p>
       <div class="foot">
            <Button class="btn" @click="closeModal">取消</Button>
            <Button class="btn2" @click="confirm" type="primary">确定</Button>
       </div>
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
        },
        fraction: {
          type: Number,
          default: 0
        }
    },
    data () {
        return {
            show: false
        }
    },
    watch: {
        showModal(_new){
            console.log(_new)
            this.show = _new
        }
    },
    methods: {
        confirm () {
            this.closeModal()
            this.$emit('confirm')
        },
        closeModal() {
            this.show = false
            this.$emit('close')
        }
    }
}
</script>
<style lang="less" scoped>
.size{
    width: 178px;
    height: 50px;
    border-radius: 5px;
}
.score{
    font-family: PingFangSC-Medium;
    font-size: 50px;
    color: #E50000;
    letter-spacing: 0;
}
.text{
    font-family: PingFangSC-Regular;
    font-size: 22px;
    color: #333333;
    margin-top: 26px;
    margin-bottom: 59px;
}
.foot{
    display: inline-flex;
    .btn{
        background: #fff;
        .size;
    }
    .btn2{
        background: #4098FF;
        .size;
        margin-left: 20px;
    }
}
/deep/ .ivu-modal-body{
    padding: 50px 30px 40px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>


