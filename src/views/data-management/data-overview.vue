<template>
    <div class="data-management-main">
        <div class="heads">
            <div class="time-view">
                <Icon :size="18" color="#8D96C2" type="ios-alert" />
                <span style="margin: 0 5px">数据统计截止到</span>
                <span class="time">{{$config.formatTime2(new Date())}}</span>
                <Button icon="ios-share" class="export-btn">数据导出</Button>
            </div>
            <div class="h-list">
                <div :class="i ? 'h-margin' : ''" class="h-item" v-for="(t,i) in hList" :key="i">
                    <img class="imgs" :src="t.img" />
                    <div class="h-conent">
                        <p class="h-num">{{t.num}}<span class="h-tit">{{i < 3 ? '人' : '人次'}}</span></p>
                        <p style="margin-top: 12px" class="h-tit">{{t.tit}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="sel-heads">
            <selects @dataPickerChange="dataPickerChange" @timeChange="timeChange" 
            @selectChange1="selectChange1" @selectChange2="selectChange2" 
            @selectChange3="selectChange3" @selectChange4="selectChange4" />
        </div>
    </div>
</template>

<script>
    import u1 from '../../assets/case/u33638.png'
    import u2 from '../../assets/case/u33657.png'
    import u3 from '../../assets/case/u33672.png'
    import u4 from '../../assets/case/u33685.png'
    import SellectsMixins from './sellects-mixins'
    export default {
        mixins: [SellectsMixins],
        name: '',
        data() {
            return {
                hList: [
                    {num: 12, tit: '老师', img: u1},
                    {num: 12, tit: '学员', img: u2},
                    {num: 12, tit: '学习人次', img: u3},
                    {num: 12, tit: '考试人次', img: u4},
                ]
            }
        },
        methods: {
            getList(){
                let d = {
                    ...this.timesDate
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-btn{
        flex-direction: row !important;
    }
    .heads{
        padding: 20px 40px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        .time-view{
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            position: relative;
            width: 100%;
            .export-btn{
                position: absolute;
                right: 0;
            }
        }
        .h-list{
            margin-top: 10px;
            display: flex;
            width: 100%;
            .h-margin{
                margin-left: 40px;
            }
            .h-item{
                flex: 1;
                display: flex;
                align-items: center;
                background-color: #e6e6cf;
                height: 130px;
                padding: 0 20px;
                position: relative;
                .imgs{
                    width: 85px;
                    height: 85px;
                }
                .h-conent{
                   position: absolute;
                   right: 20px;
                   text-align: left;
                   .h-num{
                       font-size: 36px;
                       font-family: PingFangSC-Medium;
                       color: #4098ff
                   }
                   .h-tit{
                       font-size: 14px;
                       font-family: PingFangSC-Medium;
                       color: #4098ff
                   }
                }
            }
        }
        .time{
            color: red;
        }
    }
    .sel-heads{
        margin-top: 10px;
        display: flex;
        width: 100%;
        padding: 10px 40px;
        background-color: #fff;
    }
</style>