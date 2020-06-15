export default {
    data() {
        return {
            menushow: true,
            hideIcon: 'ios-arrow-back',
            viewStyl: 'width: calc(100% - 260px); flex-grow: 1',
            widthStyle: '@keyframes myFirst { from {width: 260px;} to {width: 60px;} }; animation: myFirst 1s;',
            hideClass: 'hide-menu-main hide-menu-main-close'
        }
    },
    methods: {
        hideMenu() {
            if (this.menushow) {
                this.menushow = !this.menushow
                this.hideClass = 'hide-menu-main hide-menu-main-close'
            } else {
                this.hideClass = 'hide-menu-main hide-menu-main-open'
                setTimeout(() => {
                    this.menushow = !this.menushow
                }, 500)
            }
            this.$nextTick(() => {
                this.hideIcon = this.hideClass == 'hide-menu-main hide-menu-main-open' ? 'ios-arrow-back' : 'ios-arrow-forward'
                // this.viewStyl = this.hideClass == 'hide-menu-main hide-menu-main-open' ? 'width: calc(100% - 260px)' : 'width: calc(100% - 60px)'
                document.title = '九划临床思维训练'
            })
        }
    },
    mounted() {
        document.title = '九划临床思维训练'
    },
}
