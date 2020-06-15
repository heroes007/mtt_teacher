<template>
  <div class="content">
    <div class="login" @keydown.enter="handleSubmit">
      <div class="login-title">
      <div class="login-title-c">欢迎进入九划思维训练</div>
      <div class="login-title-e">JiuHua Clinical Thinking Training System</div>
      </div>
      <div class="login-right">
        <img class="login-img" src="../assets/img/01-1.png" alt="">
      </div>
      <div class="login-con">
        <Card icon="log-in" :bordered="false">
          <Tabs>
            <TabPane style="font-size: 28px" label="用户登陆">
              <div class="form-con">
                <Form ref="loginForm" :model="form" :rules="rules">
                  <FormItem prop="userName" style="height: 60px; margin-bottom: 24px;">
                    <Input v-model="form.userName" placeholder="请输入手机号" class="inputFocus" clearable>
                    <span slot="prepend">
                        <img src="../assets/img/phone.png" class="phone-img" alt="">
                    </span>
                    </Input>
                  </FormItem>
                  <FormItem prop="password">
                    <Input type="password" v-model="form.password" placeholder="请输入密码" clearable>
                      <span slot="prepend">
                        <Icon :size="22" type="md-lock"></Icon>
                      </span>
                    </Input>
                  </FormItem>
                  <FormItem style="margin-top: 15px;">
                    <Checkbox @click.prevent.native="change" :indeterminate="indeterminate"><span style="margin-left: 10px;">记住密码</span></Checkbox>
                    <div class="form-forget" @click="forget">忘记密码</div>
                    <Modal v-model="modal" :footer-hide=true :closable=true>
                        <div class="modal-content">
                            <img class="modal-content-img" src="../assets/img/forget.png" alt="">
                            <div class="modal-content-title">忘记密码</div>
                            <div class="modal-content-content">请联系管理员</div>
                            <Button class="modal-content-btn" type="primary" @click="forget">确定</Button>
                        </div>
                    </Modal>
                  </FormItem>
                  <FormItem style="margin-top: 20px;">
                    <Button class="form-con-login" @click="handleSubmit" type="primary">登录</Button>
                  </FormItem>
                </Form>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Base64 } from 'js-base64'
let phone = process.env.NODE_ENV === 'development' ? '17615528863' : ''
import { login_pwd, user_info } from '../api/modules/auth';
import postData from 'src/api/postData'

export default {
  data() {
    return {
      form: {
        userName: phone,
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      indeterminate: false,
      modal: false,
    }
  },
  mounted(){
     if(localStorage.getItem('login_user')&&localStorage.getItem('login_user') != 'null'){
        let user = Base64.decode(localStorage.getItem('login_user'))
        let u = JSON.parse(user)
        this.form.password = u.pass
        this.form.userName = u.user
        this.indeterminate = u.indeterminate
    }
  },
  methods: {
    // 登录
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
            login_pwd(this.form.userName, this.form.password).then((res) => {
                if (res.data.res_code === 1) {
                    let d = res.data.data;
                    sessionStorage.setItem('organizationId',d.organization_id)
                    sessionStorage.setItem('PERSONALDETAILS',JSON.stringify(d))
                    // sessionStorage.setItem('PERMISSIONS',Base64.encode('学格科技' + JSON.stringify(d.permissions)))
                    sessionStorage.setItem('token',d.token)
                    this.$store.dispatch('get_user_info');
                     let d1 = {
                        user: this.form.userName,
                        indeterminate: this.indeterminate,
                        pass: ''
                    }
                    if(this.indeterminate) d1.pass = this.form.password
                    localStorage.setItem('login_user', Base64.encode(JSON.stringify(d1)))
                    let url = d.role_id == 4 ? '/dashboard/case-warehouse' : '/dashboard/user-manage'
                    this.$router.push({ path: url });
                } else this.$Message.warning(res.data.msg);
            });
        }
      })
    },
    change(){
      this.indeterminate = !this.indeterminate
    },
    forget(){
      this.modal = !this.modal
    }
  },
}
</script>
<style lang="less" scoped>
/deep/ .ivu-checkbox-wrapper{
    position: absolute;
    left: 0;
}
.content{
    width: 100%;
    height: 100%;
    background-color: #364073;
}
.login{
    //max-width: 1440px;
    min-width: 1000px;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    background-color: #364073;
    position: relative;
    min-height: 750px;
    &-con{
        width: 430px;
        //height: 400px;
        position: absolute;
        right: 6.3%;
        top: 40.5%;
        &-header{
            font-size: 16px;
            font-weight: 300;
            text-align: center;
            padding: 30px 0;
        }
        .form-con{
            padding: 10px 0 0;
            width: 350px;
        }
        .login-tip{
            font-size: 10px;
            text-align: center;
            color: #c3c3c3;
        }
        &-phone{
            height: 60px;
            width: 350px;
        }
        .form-con-login{
            width: 100%;
            height: 45px;
            font-size: 18px;
            border-radius: 100px;
        }
    }
    &-title{
        height: 27.3%;
    }
    &-title-c{
        width: 823px;
        margin: 0 auto;
        padding-top: 6.9%;
        font-size: 80px;
        color: #fff;
        text-align: center;
    }
    &-title-e{
        width: 823px;
        margin: 0 auto;
        font-size: 36px;
        color: #AFB5D4;
        text-align: center;
    }
    &-right{
            position: absolute;
            margin-left: 120px;
            top: 35.9%;
            height: 56%;
            width: 36.4%;
            .login-img{
                /*height: 100%;*/
              width: 100%;
              max-height: 580px;
              max-width: 619px;
            }
    }
    .form-forget{
        display: inline-block;
        float: right;
        font-size: 15px;
        color: #fff;
        cursor: pointer;
    }
}
.login-content{
    position: relative;
    max-width: 1440px;
    height: 100%;
    margin: 0 auto;
}
.phone-img{
    height: 21px;
    width: 22px;
}
.modal-content{
    text-align: center;
    font-size: 18px;

    &-img{
        width: 60px;
        height: 60px;
        margin-top: 21px;
    }
    &-title{
        font-family: PingFangSC-Medium;
        font-size: 24px;
        color: #474C63;
        letter-spacing: 2px;
        text-align: center;
        margin-top: 17px;
    }
    &-content{
        opacity: 0.8;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #474C63;
        letter-spacing: 0.64px;
        text-align: center;
        margin-top: 5px;
    }
    &-btn{
        width: 125px;
        height: 46px;
        margin-top: 20px;
        font-family: PingFangSC-Regular;
        font-size: 18px;
    }
}
/deep/ .ivu-card{
    height: 100%;
    background-color: rgb(103,110,146);
    background-color: rgba(255,255,255,.3);
}
/deep/ .nav-text{
    font-size: 24px;
    color: rgba(255,255,255,.5);
}
/deep/ .ivu-tabs-tab-active{
    color: #fff;
}
/deep/ .ivu-tabs-tab:hover{
    color: #fff;
}
/deep/ .ivu-tabs-bar{
    width: 350px;
    border: none;
    margin-bottom: 10px !important;
}
/deep/ .ivu-card-body{
    height: 100%;
    padding: 35px;
}
/deep/ .ivu-tabs-ink-bar{
    height: 3px;
    display: none;
}
/deep/ .ivu-input-group-prepend{
    background-color: #fff;
    color: #9397AD;
    border: 0;
    height: 60px;
    padding: 0 19px;
    border: none;
}
/deep/ .ivu-form-item{
    margin-bottom: 10px;
}
/deep/ .ivu-input{
    height: 60px;
    font-size: 18px;
    padding: 0;
    border: 0;
}
/deep/ .ivu-checkbox-inner{
    height: 19px;
    width: 19px;
    border: 0;
    border-radius: 50%;
    background: #BCC0D5;
}
/deep/ .ivu-checkbox-inner:after{
    width: 7px;
    height: 11px;
    top: 3px;
    left: 6px;
    border-color: rgb(103,110,146);
}
/deep/ .ivu-checkbox-wrapper{
    font-size: 15px;
    color: #FFFFFF;
}
/deep/ .ivu-input{
    -webkit-box-shadow: none;
}
/deep/ .ivu-tabs-nav-scroll{
    display: flex;
    justify-content: center;
}
/deep/ .ivu-tabs-tab-active{
    font-size: 28px;
}
/deep/ .ivu-checkbox{
    transform: rotate(45deg);
}
/deep/ .ivu-modal-header{
    border: none;
}
/deep/ .ivu-modal-footer{
    border: none;
}
/deep/ .ivu-modal-content{
    width: 400px;
    height: 275px;
}
/deep/ .ivu-modal{
    top: 28.3%;
    width: 275px !important;
}
/deep/ .ivu-input:focus{
    box-shadow: none
}
/deep/ .ivu-input-icon-clear{
    line-height: 60px;
}
@media screen and (max-height: 890px){
    .content{
      min-height: 640px;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .login{
      min-height: 600px;
      height: 600px;
      overflow: hidden;
      &-right{
        height: 61%;
        width: 39%;
        top: 30%;
      }
       .login-title{
         height: 6%;
         .login-title-c{
           font-size: 40px;
           padding-top: 3%;
         }
         .login-title-e{
           font-size: 24px
         }
       }
       .login-con{
         top: 30%;
       }
    }
}
</style>
