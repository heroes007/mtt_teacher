<template>
    <div class="set-weight">
        <div class="we-line"></div>
        <div class="we-text">{{title}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,  //1 问诊 2 体格检查 3 辅助检查 4 诊疗详情
                default: '' 
            },
        },
    }
</script>

<style lang="less" scoped>
    .set-weight{
        display: flex;
        margin: 14px 0;
        height: 22px;
        align-items: center;
        .we-line{
            width: 5px;
            height: 22px;
            background: #4098FF;
        }
        .we-text{
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #2D3662;
            margin-left: 10px;
        }
    }
</style>