<template>
    <div class='side-menu-for-project'>
        <Row class='logo' type='flex' justify='center' align='middle'>
            <img class="logo-img" src='../assets/img/logo-white1.jpg'>
            <div class="logo-title">九划医教</div>
        </Row>
        <div class="elRow">
            <div class='head-img'>
                <img class="" v-if="detailImg" :src='detailImg'>
                <video v-if="detailVideo" :src="detailVideo"></video>
            </div>
            <div class="head-title">{{detail.title}}</div>
            <div class="head-list">
                <div>
                    <span class="w60">实际售价:</span><span>{{detail.price}}</span>
                </div>
                <div>
                    <span class="w60"><span>原</span><span>价:</span></span><span>{{detail.original_price}}</span>
                </div>
                <div>
                    <span class="w60">解锁方式:</span><span>{{$config.setLockType(detail.unlock_type)}}</span>
                </div>
                <Divider />
                <!-- <div>
                    <span class="w60">阅读人数:</span><span>{{detail.view_num}}</span>
                </div> -->
                <div>
                    <span class="w60">购买人数:</span><span>{{detail.pay_number}}</span>
                </div>
                <div>
                    <span class="w60">结业人数:</span><span>{{detail.honour}}</span>
                </div>
                 <Divider />
                <div style="margin-top: 30px;">
                    <span class="w73">创建用户ID:</span><span>{{detail.username}}</span>
                </div>
                <div>
                    <span class="w60">创建时间:</span><span>{{detail.create_time}}</span>
                </div>
            </div>
            <div class="head-btn">
                <Button type="default" @click="edit" ghost class="btn-content" style="top: 20%;">编辑</Button>
                <!--<Button type="default" ghost class="btn-content" style="top: 20%;">统计</Button>-->
                <Button type="default" ghost class="btn-content" style="top: 40%;" @click="handleDelete">注销</Button>
            </div>
        </div>
    </div>
</template>
<script>
  import api from '../api/modules/config'
  import defaultHeader from '../assets/img/side-menu/default-header.jpg'
  import postData from '../api/postData.js'
  import {Dialog} from "../views/dialogs";
  import { ADD_PRODUCTION } from "../views/dialogs/types";
  import {mapState} from 'vuex'
  export default {
    mixins: [Dialog],
    data() {
      return {
        use_router: true,
        activeIndex: '',
        detail: '',
        detailImg: '',
        detailVideo: ''
      }
    },
    methods: {
      getList(){
        postData('/product/product/get_detail',{product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id} ).then((res) => {
            this.detail = res.data[0]
            let d = JSON.parse(this.detail.url_arr);
            this.detailImg = d.default[0]
            if(d.default&&!this.detailImg) this.detailVideo = d.video
        })
      },
      edit(){
          this.handleSelModal(ADD_PRODUCTION,{type: 2,row: this.detail});
      },
      openChange(name) {
      },
      selectItem(index) {
        this.$router.push({name: index});
      },
      initMenu() {
        this.activeIndex = this.$route.name;
      },
      handleDelete() {
        this.$Modal.confirm({
          title: '提示',
          content: '注销后将永久删除，确认是否注销',
          onOk: () => {
            postData('product/product/change_state', {product_id: this.detail.id, state: -2}).then(res => {
              if(res.res_code == 1) {
                this.$Message.info('删除产品');
                window.close()
              }
            })
          },
          onCancel: () => {
            this.$Message.info('Clicked cancel');
          }
        });
      }
    },
    watch: {
      $route() {
        this.initMenu();
      },
      productState(_new){
        if(_new) this.getList()
      }
    },
    mounted() {
      this.getList();
      this.initMenu();
    },
    computed: {
      ...mapState({productState: state => state.production.edit_product_state}),
      userInfo() {
        return this.$store.state.auth.userInfo;
      },
      userHeader() {
        if (!this.userInfo) return defaultHeader;
        if (this.userInfo.head_img_url) return this.userInfo.head_img_url;
        else return defaultHeader;
      }
    }
  }
</script>
<style lang="less" scoped>
    /deep/ .ivu-menu {
        background-color: #333;
        width: 100% !important;
    }
    /deep/ .ivu-menu-item, .ivu-menu-item:hover {
        text-align: left;
        color: #3DAAFF !important;
    }
    /deep/ .ivu-menu-vertical.ivu-menu-light:after {
        content: none !important
    }
    /deep/ .ivu-menu-item-active {
        background-color: #333 !important;
    }
    /deep/ .ivu-menu-item-active:not(.ivu-menu-submenu):after {
        background-color: #333 !important;
    }
    .side-menu-for-project {
        padding: 27px 0;
        /*height: 100%;*/
        .logo {
            margin-bottom: 40px;
            img {
                width: 120px;
            }
        }
        .head-img {
            height: 100px;
            margin-bottom: 18px;
            img, video {
                width: 190px;
                height: 100px;
            }
        }
        .setting {
            position: absolute;
            top: 74px;
            right: 50px;
            width: 26px;
            height: 26px;
            padding: 0;
            border-radius: 50%;
            border-color: #3DAAFF;
            background-color: #3DAAFF;
            color: #ffffff;
            text-align: center;
            line-height: 26px;
            cursor: pointer;
            .hover-glow {
                width: 34px;
                height: 34px;
                position: absolute;
                top: -4px;
                left: -4px;
                background-color: rgba(252, 118, 67, 0.2);
                border-radius: 50%;
                border: 0;
                display: none;
            }
            &:hover {
                .hover-glow {
                    display: block;
                }
            }
        }
        .user-name {
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            white-space: nowrap;
            padding: 0 35px;
            i {
                color: #3DAAFF;
                margin-right: 10px;
            }
            p {
                display: -webkit-box;
                white-space: normal;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 1;
            }
            margin-bottom: 50px;
        }
    }
    .logo {
        margin-bottom: 40px;
    }
    .elRow {
        display: flex;
        flex-direction: column;
        padding: 35px;
        height: calc(100% - 100px);
        .head-title {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;
            text-align: justify;
            line-height: 26px;
        }
        .head-list {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            margin-top: 30px;
            div {
                margin-bottom: 10px;
                display: flex;
            }
        }
    }
    .w73,.w60{
       display: flex;
        justify-content: space-between;
        margin-right: 6px;
    }
    .w60 {
        width: 60px;
    }
    .w73 {
        width: 76px;
    }
    .head-btn {
        position: relative;
        flex: 1;
        width: 170px;
        padding-bottom: 40px;
        .btn-content {
            position: relative;
            left: 0;
            margin-top: 40px;
        }
    }
    /deep/ .ivu-btn {
        width: 190px;
        height: 40px;
    }
</style>
