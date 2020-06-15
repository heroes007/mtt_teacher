<template>
    <div class='side-menu'>
        <Row class="head-img-row" type='flex' justify='center' align='middle'>
            <div class='head-img'>
                <img :src='userHeader'>
            </div>
            <!-- <Poptip trigger="hover" class="poptip-role-1" placement="right">
                <Button class='setting'>
                    <Icon class="icon-setting" type="md-settings"/>
                    <div class='hover-glow'></div>
                </Button>
                <div class="setting-data" slot="content">
                    <Button type='text' class='quit' @click='logout'>
                        退出登录
                    </Button>
                </div>
            </Poptip> -->
        </Row>
        <Row class='user-name'>
            <div class="user-name-title" >{{organizationTitle}}</div>
            <div class="user-name-icon">
                <img class="user-name-i" src="../assets/img/security.png" />
                <span v-if="userInfo&&userInfo.role_id">{{$config.status(userInfo.role_id)}}</span>
            </div>
        </Row>
        <Row class="menu-list">
            <Col>
                <Menu ref="side_menu" class="slider-menu" @on-open-change="openChange" @on-select="selectItem"
                      :active-name='activeIndex' :open-names="menuOpenName">
                    <div v-for="(it,index) in menuList" :key="index">
                        <Submenu v-if="it&&it.list" :name="it.name">
                            <template class="menu-padding" slot="title">
                                <div class="menu-item">
                                    <Icon :type="it.icon" size="20"/>
                                    <span style="margin-left: 10px;font-size: 16px">{{it.title}}</span></div>
                            </template>
                            <div v-for="(t, index) in it.list" :key="index">
                                <MenuItem :name="t.name" class="sub-item-title">
                                    <span>{{t.title}}</span>
                                </MenuItem>
                            </div>
                        </Submenu>
                        <MenuItem v-else :name="it.name">
                            <Icon :type="it.icon" size="20"/>
                            <span style="margin-left: 10px; font-size: 16px">{{it.title}}</span>
                        </MenuItem>
                    </div>
                </Menu>
            </Col>
        </Row>
    </div>
</template>
<script>
    import api from '../api/modules/config'
    import defaultHeader from '../assets/img/logos.png'
    import {MenuList, cleanHtmlLabel} from './Util'
    import postData from '../api/postData'
    import {async, Promise, resolve, reject} from 'q';

    export default {
        data() {
            return {
                use_router: true,
                activeIndex: "user-manage",
                menuOpenName: [],
                menuList: [],
                png: '.png',
                name: '',
            }
        },
        computed: {
            userInfo() {
                return this.$store.state.auth.userInfo
            },
            organizationInfo(){
                return this.userInfo&&this.userInfo.hasOwnProperty('organization_info')&&this.userInfo.organization_info
            },
            organizationTitle(){
                return this.userInfo.role_id == 1 ? '九划机构' : this.organizationInfo.title
            },
            userHeader() {
                return this.userInfo&&this.organizationInfo&&this.organizationInfo.logo_img ? this.organizationInfo.logo_img: defaultHeader
            },
        },
        methods: {
            openChange(name) {
                sessionStorage.setItem('menuOpenName', JSON.stringify(name));
                this.menuOpenName = name;
            },
            selectItem(index) {
                sessionStorage.setItem('menuActiveIndex', index);
                this.$router.push({name: index});
                this.activeIndex = index
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
            setMenuActive() {
                let roleId = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id;
                this.menuList = roleId == 4 ? [MenuList[4]] : MenuList
                if(roleId == 4) {
                    let init = sessionStorage.getItem('menuActiveIndex')
                    this.activeIndex = init&&init != 'user-manage' ? init : 'case-warehouse'
                    this.menuOpenName = ['case-manage']
                }else{
                    let menuActive = sessionStorage.getItem('menuActiveIndex') || 'user-manage'
                    this.activeIndex = menuActive
                    // this.$router.push({name: menuActive});
                    if (sessionStorage.getItem('menuOpenName')) this.menuOpenName = JSON.parse(sessionStorage.getItem('menuOpenName'))
                }
                if (this.$refs.side_menu) {
                    this.$nextTick(() => {
                        this.$refs.side_menu.updateOpened();
                        this.$refs.side_menu.updateActiveName();
                    })
                }
            },
            handleMenuList() {
                let roleId = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id;
                if (sessionStorage.getItem('PERMISSIONS')) {
                    let d = Base64.decode(sessionStorage.getItem('PERMISSIONS'));
                    let d1 = JSON.parse(d.slice(4))
                    if (d1 && d1.length > 0) {
                        d1.forEach(t => {
                            let num = +t.permission_code.slice(0, 2)
                            let p1 = () => {
                                if (num != 4 && num != 5) {
                                    if (num == 6) this.menuList.push(MenuList[3])
                                    else this.menuList.push(MenuList[num - 1])
                                }
                            }
                            let p2 = () => {
                                if (num == 5) this.menuList.push(MenuList[4])
                            }
                            let p3 = () => {
                                if (num == 4) {
                                    if (roleId != 1) {
                                        MenuList[5].list.splice(1, 1)
                                        MenuList[5].list.splice(1, 1)
                                    }
                                    this.menuList.push(MenuList[5])
                                }
                            }
                            (async () => {
                                await p1()
                                await p2()
                                await p3()
                            })()
                        });
                    }
                }
            },
        },
        mounted() {
            // new Promise((resolve,reject) => {
            //      this.handleMenuList()
            //      resolve()
            //  }).then(() => {
                 this.setMenuActive()
            //  })
        }
    }
</script>
<style lang="less" scoped>
    .slider-menu{
        margin-bottom: 50px;
    }
    /deep/ .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after {
        /*background: #292929;*/
    }

    /deep/ .setting-data {
        display: flex;
        flex-direction: column;
    }

    .sub-item-title {
        padding-top: 14px !important;
        padding-bottom: 14px !important;
    }

    /deep/ .ivu-icon-ios-settings {
        position: relative;
        top: -2px;
        margin-right: 5px;
    }

    /deep/ .ivu-menu-vertical .ivu-menu-submenu-title-icon {
        position: absolute;
        top: 20px;
        right: 10px;
        clear: both;
    }

    /deep/ .sub-item-title {
        padding-left: 112px !important;
    }

    /deep/ .ivu-menu {
        background-color: #364073;
        width: 100% !important;
    }

    /deep/ .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
        background: #242E63 !important;
    }

    /deep/ .ivu-menu-item {
        display: flex;
        align-items: center;
    }

    /deep/ .ivu-menu-item, /deep/ .ivu-menu-submenu-title {
        text-align: left;
        color: #fff;
        padding-left: 78px;
    }

    /deep/ .ivu-menu-vertical.ivu-menu-light:after {
        content: none !important
    }

    /deep/ .ivu-menu-item-active {
        /*background-color: #292929;*/

        .ivu-menu-item {
            /*background-color: #292929;*/
        }
    }

    /deep/ .ivu-poptip-body {
        padding: 0
    }

    .poptip-role-1 {
        /deep/ .ivu-poptip-popper {
            top: 85px !important
        }
    }

    /deep/ .ivu-btn-text, /deep/ .ivu-btn {
        border: none
    }

    /deep/ .ivu-btn:focus {
        box-shadow: none
    }

    .side-menu {
        padding: 27px 0;
        height: 100%;
        .head-img-row {
            position: relative;

            .head-img {
                width: 150px;
                height: 150px;
                margin-bottom: 18px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
        }

        .setting, .setting:hover {
            position: absolute;
            top: 0px;
            right: 0px;
            width: 26px;
            height: 26px;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            border-color: #3DAAFF;
            background-color: #3DAAFF;
            color: #ffffff;
            text-align: center;
            line-height: 10px;

            .icon-setting {
                font-size: 18px;
            }

            cursor: pointer;

            .hover-glow {
                width: 34px;
                height: 34px;
                position: absolute;
                top: -4px;
                left: -4px;
                background-color: rgba(61, 170, 255, 0.2);
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
            &-title{
                font-family: PingFangSC-Regular;
                font-size: 20px;
                display: -webkit-box;
                white-space: normal;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 1;
                margin-bottom: 10px;
            }
            &-icon{
                display: -webkit-box;
                white-space: normal;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 1;
                height: 24px;
                line-height: 24px;
                width: 109px;
                height: 26px;
                border-radius: 55px;
                background: #242E63;
                margin: auto;
                .user-name-i{
                    position: relative;
                    top: 2px;
                    width: 12px;
                    height: 13px;
                    opacity: 0.5;
                }
                span{
                    margin-left: 2px;
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #8D96C2;
                    letter-spacing: 0.17px;
                }
            }

            margin-bottom: 50px;
        }

        .menu-list {
            height: calc(100% - 240px);
            overflow: hidden;
            overflow-y: auto;
        }
    }
    .slider-menu{
        margin: 10px 0;
    }
</style>
