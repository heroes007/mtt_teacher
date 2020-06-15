<template>
    <div>
        <div v-for="(item, index) in list"  v-if="item.support == support" :key="index">
            <div class="box">
                <img class="img" :src="item.img" alt="">
                <div class="content">{{item.content}}</div>
            </div>
            <div class="rate">
                <RateStar @setStar="rateChange" :weight="rateWeight"/>
            </div>
        </div>
    </div>
</template>

<script>
    import supported from '../../../../../../../assets/case/correct2.png'
    import unsupported from '../../../../../../../assets/case/error2.png'
    import RateStar from '../../../../../../../components/rate-star'

    export default {
        props: {
            support: String,
            weight: Number,
        },
        components: { RateStar },
        data() {
            return {
                list: [
                    {
                        img: supported,
                        content: '支持依据',
                        support: 'supported'
                    },
                    {
                        img: unsupported,
                        content: '排除依据',
                        support: 'unsupported'
                    },
                ],
                rateWeight: this.weight || 0
            }
        },
        watch: {
            weight(val) {
                this.rateWeight = val
            }
        },
        methods: {
            rateChange(val) {
                this.$emit('rateChange', val)
            }
        },
        mounted() {
            this.rateWeight = this.weight
        },
    }
</script>

<style scoped>
    .box{
        display: flex;
        margin-left: 30px;
        align-items: center;
    }
    .img{
        width: 16px;
        height: 16px;
        margin-right: 8px;
    }
    .content{
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #474C63;
        line-height: 16px;
    }
    .rate{
        display: flex;
        margin-left: 54px;
        margin-top: 20px;
    }
</style>

