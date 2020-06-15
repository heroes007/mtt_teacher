<template>
    <Modal v-model="showContent" :title="title" :width="654" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
       <div class="exchange-content-title">
            <Input class="exchange-input" v-model="value" @on-change="changeVal" placeholder="搜索产品名称">
              <Icon type="md-search" slot="prefix" />
            </Input>
       </div>
       <div class="exchange-main">
          <div class="exchange-list" v-for="(t,i) in list" :key="i" @click="handleClick(t)">
            <span class="exchange-item">{{t.name}}</span>
            <img v-if="t.show" class="exchange-img" src="../assets/icons/icon/tick.png" />
          </div>
       </div>
        <div class="foot-btn">
             <Button class="btn-orange" type="primary" @click="handleSubmit">保存</Button>
        </div>
    </Modal>
</template>

<script>
  export default {
    props: {
        title:{ type: String },
        showModal: {
            type: Boolean,
            default: false
        },
        list: {
          type: Array,
          default: []
        }
    },
    watch:{
        showModal(_new){
            this.showContent = _new
        }
    },
    data(){
        return {
            value:'',
            showContent: false,
            selectChecked: null
        }
    },
    methods:{
        closeModal(){
            this.showContent = false
            this.$emit('close')
        },
        changeVal(v){},
        handleClick(v){
            this.list.map((t,k) => {
                if(t.id === v.id){
                    t.show = !t.show
                    this.list.splice(k,1,t)
                  if(t.show)  this.selectChecked = t
                  else this.selectChecked = null
                }else t.show = false
            })
        },
        handlieList(){
            this.list.map((t) => {
                t.show = false
            })
        },
        handleSubmit(){
           if(this.selectChecked){
               this.$emit('selectChecked', this.selectChecked)
               this.closeModal()
           }else{
               this.$Message.warning('请选择产品');
           }
        }
    },
    mounted() {
      this.handlieList()
    }
  }
</script>
<style lang='less' scoped>
.exchange-content-title{
    width: 100%;
    height: 60px;
    background: #F0F0F7;
    .exchange-input{
        margin-top: 12px;
        margin-left: 30px;
        width: 350px;
        height: 36px;
        border-radius: 18px;
        /deep/ .ivu-input{
            border-radius: 18px !important;
        }
        /deep/ .ivu-input-prefix{
            margin-left: 10px;
        }
        /deep/ .ivu-icon-md-search{
            font-size: 20px;
        }
    }
}
/deep/ .ivu-modal-body{ padding: 0 !important; padding-bottom: 40px;}
.exchange-main{
    height: 574px;
    overflow: hidden;
    overflow-y: auto;
    .exchange-list{
    height: 62px;
    border-bottom: 1px solid #E4E7F5;
    position: relative;
    line-height: 62px;
    .exchange-item{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        padding-left: 40px;
    }
    .exchange-img{
        position: absolute;
        top: 22px;
        right: 40px;
        width: 19px;
        height: 17px;
    }
}
}
.foot-btn{
    display: flex; justify-content: center;
    padding-top: 30px;
    height: 106px;
    .btn-orange{
       width: 200px;
       height: 36px;
    }
}

</style>
