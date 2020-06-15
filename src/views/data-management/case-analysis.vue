<template>
    <div class="case-analysis">
        <div class="case-head">
            <div class="h-view">
                <span class="grey-medium6">病例使用排名</span>
                <span class="case-num">共计病例2356份</span>
            </div>
            <selects @dataPickerChange="dataPickerChange" @timeChange="timeChange" 
            @selectChange1="selectChange1" @selectChange2="selectChange2" 
            @selectChange3="selectChange3" @selectChange4="selectChange4" />
            <div style="margin-top: 20px">
                <tables :column="column" :tableData="tableData"/>
            </div>
        </div>
    </div>
</template>

<script>
    import SellectsMixins from './sellects-mixins'
    import tables from '../../components/tables'
    import u1 from '../../assets/case/u34827.png'
    import u2 from '../../assets/case/u34829.png'
    import u3 from '../../assets/case/u34831.png'
    export default {
        mixins: [SellectsMixins],
        components: { tables },
        name: '',
        data() {
            return {
                column: [
                    {
                        title: '排名',
                        width: 100,
                        render: (h, params) => {
                            if(params.index < 3){
                                return h('img', {
                                    style: {
                                        width: "20px",
                                        verticalAlign: "middle"
                                    },
                                    attrs: {
                                        src: [u1, u2, u3][params.index]
                                    }
                                })
                            }else return h('span', params.index + 1)
                        }
                    },
                    {
                        title: '姓名',
                        key: 'realname'
                    },
                    {
                        title: '使用总次数',
                        key: 'count',
                        align: 'center'
                    },
                    {
                        title: '平均得分',
                        key: 'score',
                        align: 'center'
                    },
                ],
                tableData: [
                    {realname: '天涯', count: 2, score: 10},
                    {realname: '天涯', count: 2, score: 10},
                    {realname: '天涯', count: 2, score: 10},
                    {realname: '天涯', count: 2, score: 10}
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
    .case-head{
        padding: 20px 40px;
        background-color: #fff;
        .h-view{
            text-align: left;
            margin-bottom: 20px;
            .case-num{
                margin-left: 40px;
            }
        }
    }
</style>