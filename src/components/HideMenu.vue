<template>
    <div :class="stateClasses">
        <img class="hide-menu-img" :src="userHeader"/>
    </div>
</template>

<script>
    import hideMenuMixins from '../views/mixins/hideMenuMixins'
    import defaultHeader from '../assets/img/logos.png'


    export default {
        props: {
            stateClasses: {type: String}
        },
        mixins: [hideMenuMixins],
        computed: {
            userInfo() {
                return this.$store.state.auth.userInfo
            },
            organizationInfo(){
                return this.userInfo&&this.userInfo.hasOwnProperty('organization_info')&&this.userInfo.organization_info
            },
            userHeader() {
                return this.userInfo&&this.organizationInfo&&this.organizationInfo.logo_img ? this.organizationInfo.logo_img: defaultHeader
            },
        },
        mounted: function () {
            document.title = this.text;
        }
    }
</script>
<style lang="less" scoped>
    .hide-menu-main {
        @keyframes myFirst {
            from {
                width: 260px
            }
            to {
                width: 60px
            }
        };
        @keyframes mySecond {
            from {
                width: 60px
            }
            to {
                width: 260px
            }
        };
        height: 100%;
        background: #364073;
        box-shadow: 2px 0 10px 0 rgba(51, 51, 51, 0.06);
    }
    .hide-menu-main-open{
        animation: mySecond 0.5s ease-out;
        -webkit-animation: mySecond 0.5s ease-out;
        -moz-animation: mySecond 0.5s ease-out;
        -o-animation: mySecond 0.5s ease-out;
        -ms-animation: mySecond 0.5s ease-out;
        width: 260px;
    }
    .hide-menu-main-close{
        animation: myFirst 0.5s ease-out;
        -webkit-animation: myFirst 0.5s ease-out;
        -moz-animation: myFirst 0.5s ease-out;
        -o-animation: myFirst 0.5s ease-out;
        -ms-animation: myFirst 0.5s ease-out;
        width: 60px;
    }
    .hide-menu-img {
        margin-top: 30px;
        width: 40px;
        height: 39px;
        border-radius: 20px;
    }
</style>
