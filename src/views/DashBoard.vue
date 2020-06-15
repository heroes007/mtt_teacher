<template>
    <div class='dashboard-view'>
        <div class="head">
            <img @click="back" class="logo-img" src='../assets/img/Group3.png'>
            <div @click="back" class="logo-title">九划临床思维训练</div>
            <div class="logo-type">教师版</div>
            <div class="logout">
                <Poptip class="logo-pop" trigger="hover" title="">
                    <template slot="content">
                      <div class="logout-btn">
                        <Button type='text' class='quit' @click='personalData'> 个人资料</Button>
                        <Button type='text' class='quit' @click='logout'>退出登录</Button>
                      </div>
                    </template>
                    <img class="head-img" :src="userHeader"/>
                </Poptip>
                <!-- <span class="head-title" v-text="userTitle"></span> -->
            </div>
        </div>
        <div v-if="viewMax" class='col-container'>
             <router-view :key="$route.fullPath" />
        </div>
        <Row v-else type='flex' class='col-container'>
            <Col v-if="menushow" :style="widthStyle" class='menu-bar'><side-menu/></Col>
            <Col v-if="!menushow" ><HideMenu :stateClasses="hideClass"/></Col>
            <Col class='sub-view' :style="viewStyl">
                <div class="hide-menu-btn" @click="hideMenu"><Icon class="hide-icon" :type="hideIcon" /></div>
                <router-view :key="$route.fullPath" />
            </Col>
        </Row>
    </div>
</template>
<script>
    import api from '../api/modules/config'
    import SideMenu from '../components/SideMenu'
    import hideMenuMixins from './mixins/hideMenuMixins'
    import HideMenu from '../components/HideMenu'
    import defaultHeader from '../assets/img/side-menu/default-header.jpg'
    export default{
        mixins: [hideMenuMixins],
        components:{ 'side-menu':SideMenu, HideMenu },
        computed: {
            user() {
                return this.$store.state.auth.userInfo
            },
            userTitle(){
                return this.user&&this.user.hasOwnProperty('realname') ? this.user.realname: ''
            },
            userHeader() {
                return this.user&&this.user.hasOwnProperty('head_img')&&this.user.head_img ? this.user.head_img: defaultHeader
            },
            viewMax(){
                let d = ['view-cases', 'view-trainees', 'view-reports', 'outline-content', 'case-message', 'case-content', 'case-check', 'case-contents', 'mentor-derails', 'distribution-outline', 'student-comparison']
                return d.includes(this.$route.name)
            }
        },
        methods: {
            back(){
                let name = sessionStorage.getItem('menuActiveIndex') ? sessionStorage.getItem('menuActiveIndex') : 'user-manage'
                this.$router.push({ name });
            },
            logout() {
                api.post('user/logout').then((res) => {
                    if (res.data.res_code === 1) {
                        let d = localStorage.getItem('login_user')
                        sessionStorage.clear()
                        this.$router.push({path: '/login'});
                        localStorage.setItem('login_user', d)
                    }
                });
            },
            personalData() {
                this.$router.push({path: '/dashboard/personal-data'})
            },
        },
    }
</script>
<style lang="less">
/deep/ .ivu-poptip-body{
    padding: 0;
}
.logo-pop{
    /deep/ .ivu-poptip-popper{
        min-width: 96px;
        // top: 58px !important;
    }
}
.dashboard-view {
    box-sizing:border-box;
    width: 100%;
    height: 100%;
    background-color:#ffffff;
    .head{
        height: 80px;
        display: flex;
        align-items: center;
        position: relative;
        background: #fff;
        padding: 0 99px;
        box-shadow: 0 0 10px 0 rgba(117,124,157,0.15);
        z-index: 998;
        .logo-img{
            cursor: pointer;
        }
        .logo-title{
            font-family: PingFangSC-Regular;
            font-size: 24px;
            color: #474C63;
            cursor: pointer;
        }
        .logout{
            position: absolute;
            right: 99px;
            &-btn{
                display: flex;
                flex-direction: column;
            }
        }
        .head-img{
            width: 50px;
            height: 50px;
            border-radius: 25px
        }
        .logo-type{
            width: 72px;
            height: 29px;
            background: #FFA003;
            border-radius: 3.2px;
            line-height: 29px;
            color: #fff;
            margin-left: 20px;
            font-size: 20px;
        }
        &-title{
            font-family: PingFangSC-Regular;
            margin-left: 5px;
            font-size: 18px;
            position: relative;
            top: -18px;
            color: #474C63
        }
    }
    .col-container {
        height: calc(100% - 80px);
        flex-wrap: nowrap !important;
        .menu-bar {
            height: 100%;
            max-width:260px;
            min-width:260px;
            background-color: #364073;
            box-shadow: 2px 0 10px 0 rgba(51,51,51,0.06);
        }
        .sub-view {
            background-color: #ffffff;
            position: relative;
            min-height: calc(100% - 80px);
            /*padding-bottom: 10px;*/
            .hide-menu-btn{
                z-index: 1000;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                margin: auto 0;
                height: 110px;
                width: 15px;
                padding: 0;
                background: #242E63;
                border-radius: 0 10px 10px 0;
                /*border-top-right-radius: 2px;*/
                /*border-bottom-right-radius: 2px;*/
                display: flex;
                align-items: center;
                cursor: pointer;
                .hide-icon{
                    font-size: 14px;
                    color: #fff
                }
            }
        }
    }
}
</style>
