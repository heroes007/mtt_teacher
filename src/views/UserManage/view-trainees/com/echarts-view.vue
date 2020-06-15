<template>
    <div class="echarts-main">
        <div class="echarts-item">
            <div style="width: 100%;height:100%" id="daily-trips"></div>
        </div>
        <div style="margin-left: 10px;" class="echarts-item">
            <div style="width: 100%;height:100%;" id="study-duration"></div>
            <div v-if="echartsRight.length>0" class="echarts-box2">
                <div v-for="(item, index) in echartsRight" :key="index" class="echarts-box-2">
                    <div class="echarts-box-color" :style="{backgroundColor: item.color}"></div>
                    <p class="texts1 grey-regulars2">{{item.name}}</p>
                    <p class="texts2">{{item.ratio}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: '',
        data() {
            return {
                echartsRight: [],
                colors: ['#6666C6','#5A92FF', '#FFB94B', '#10BBDF', '#4ecb73', '#f04864'],
            }
        },
        mounted(){
            this.setInit()
        },
        methods: {
            setInit(){
                $AbilityAnalysis.$on('AbilityAnalysiss', (columnar_data, annular_data) => {
                    let d1 = [], dx = []
                    if(columnar_data&&columnar_data.length>0){
                        columnar_data.map(t => {
                            d1.push(t.y)
                            dx.push(t.x)
                        })
                    }
                    this.echerts1(d1, dx)
                    let names = ['20-24 点', '16-20 点', '12-16 点', '8-12 点', '4-8 点', '0-4 点']
                    let itemStyle = this.itemStyleInit()
                    let list = [annular_data.h20_24, annular_data.h16_20, annular_data.h12_16, annular_data.h8_12, annular_data.h4_8, annular_data.h0_4]
                    if(list&&list.length>0){
                        list.map((t, i) => {
                            t.value = t.count
                            t.color = this.colors[i]
                            t.name = names[i]
                            t.itemStyle = itemStyle
                        })
                        this.echartsRight = list
                        this.echerts2(list)
                    }
                })
            },
            itemStyleInit(){
                return {
                    normal: {
                        // color: '#fff',
                        borderColor: '#fff',
                        borderType: 'solid',
                        borderWidth: 5
                    }
                }
            },
            setEchertsTitle(text){
                return {
                    text,
                    // left: 20,
                    textStyle: {
                        fontSize: 14,
                        color: '#474C63'
                    }
                }
            },
            echerts2(list){
                let myChart = echarts.init(document.getElementById('study-duration'))
                let option = {
                    title: this.setEchertsTitle('学员学习时长'),
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    color: this.colors,
                    series: [
                        {
                            name: '学习时长',
                            type: 'pie',
                            center: ['30%','50%'],
                            radius: ['30%', '45%'],
                            avoidLabelOverlap: false,
                            hoverOffset: 3,
                            selectedOffset: 3,
                            label: {
                                show: false,
                                position: 'center',
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 16,
                                    formatter: '{d}% \n \n {b}'
                                }
                            },
                            data: list
                        }
                    ]
                };
                myChart.setOption(option);
            },
            echerts1(dy, dx){
                let myChart = echarts.init(document.getElementById('daily-trips'));
                let option = {
                    color: ['#5A92FF'],
                    title: this.setEchertsTitle('学习病例数'),
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                    },
                    grid: {
                        left: '0%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            fontSize: 10,
                            color: '#474C63',
                            // formatter: function (value) {
                            //     return value.slice(5);
                            // },
                        },
                        // boundaryGap: true,
                        // axisLine: { show: false },
                        // axisTick: { show: false},
                        data: dx
                    },
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: { show: false },
                            axisTick: { show: false},
                            axisLabel: {
                                formatter: function (value) {
                                    return Number.isInteger(value) ? value : '';
                                },
                                fontSize: 10,
                                color: '#474C63'
                            },
                            splitLine: { lineStyle: {type: 'dashed', color: '#D4D7E3'}},
                        }
                    ],
                    series: [
                        {
                            name: '学习人次',
                            type: 'bar',
                            barWidth: '60%',
                            data: dy
                        }
                    ]
                };
                myChart.setOption(option);
            },
        }
    }
</script>

<style lang="less" scoped>
     .echarts-box-color{
            width: 8px;
            height: 8px;
            border-radius: 100%;
            margin-right: 5px;
        }
    .echarts-main{
        margin-top: 40px;
        padding: 0 30px;
        display: flex;
        justify-content: flex-start;
        .echarts-item{
            flex: 1;
            height: 300px;
            position: relative;
            .echarts-box2{
                position: absolute;
                right: 40px;
                top: calc(50% - 110px);
                .echarts-box-2{
                    display: flex;
                    margin-bottom: 16px;
                    align-items: center;
                }
                .texts2{
                    font-family: PingFangSC-Medium;
                    font-size: 10px;
                    color: #474C63;
                    margin-left: 5px;
                }
                .texts1{
                    width: 68px;
                    text-align: left;
                    margin-right: 5px;
                    padding-right: 5px;
                    border-right: 1px solid #f0f0f7;
                }
            }
        }
    }
</style>