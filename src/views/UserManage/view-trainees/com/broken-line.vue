<template>
    <div class="echarts-main">
        <div class="echarts-head">
            <Select v-model="times" @on-change="timeChange" style="width: 200px" >
                <Option v-for="(item,i) in select" :value="item.id " :key="i">{{ item.title }}</Option>
            </Select>
            <DatePicker v-if="isDaterange" type="daterange" format="yyyy-MM-dd" placeholder="请选择时间范围"  class="screen-data-picker"
            v-model="data_picker" @on-change="dataPickerChange" ></DatePicker>
        </div>
        <div :id="id" style="height: 300px;width: 100%;"></div>
    </div>
</template>
<script>
    import echarts from 'echarts'
    export default {
        props: {
            id: {},
            title: {},
            url: {},
            type: {}
        },
        name: '',
        data() {
            return {
                isDaterange: false,
                data_picker: [],
                times: 'MONTH',
                select: [
                    {id: "MONTH", title: '近30天'},
                    {id: "6MONTH", title: '近半年'},
                    {id: "YEAR", title: '近一年'},
                    {id: "CUSTOM", title: '自定义'},
                ],
            }
        },
        mounted(){
            this.getEcharts()
        },
        methods: {
            setCustom(){
                let d = {}
                if(this.times == 'CUSTOM'&&this.data_picker.length==2){
                    d.start_time = this.data_picker[0]
                    d.end_time = this.data_picker[1]
                    d.time_format = this.isCustonMouths() ? 'DAY' : 'MONTH'
                }
                return d
            },
            dataPickerChange(val) {
                this.data_picker = val
                this.getEcharts()
            },
            getEcharts(){
                let d = {
                    user_id: +this.$route.query.id,
                    time_type: this.times,
                    ...this.setCustom()
                }
                PostData(this.url, d).then(r => {
                    if(r.res_code == 1){
                        let d1 = [], d2 = [], dx = []
                        if(this.type == 'abilityAnalysis1'){
                            if(r.data&&r.data.length>0){
                                r.data.map(t => {
                                    d1.push(t.user_score)
                                    d2.push(t.avg_score)
                                    dx.push(t.title + '-' + t.exam_time)
                                })
                            }
                            this.setEcherts1([d1, d2], dx)
                        }
                        const { line_data, columnar_data, annular_data } = r.data
                        if(this.type == 'abilityAnalysis2'){
                            if(line_data&&line_data.length>0){
                                line_data.map(t => {
                                    d1.push(t.y)
                                    dx.push(t.x)
                                })
                            }
                            $AbilityAnalysis.$emit('AbilityAnalysiss', columnar_data, annular_data)
                            this.setEcherts1(d1, dx)
                        }
                    }
                })
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
            isCustonMouths(){
                let bool = false
                if(this.times == 'CUSTOM'&&this.data_picker.length==2&&this.data_picker[0]){
                    let da = new Date(this.data_picker[0])
                    let n1 = this.data_picker[1].split('-').join("")
                    let n2 = (this.$config.getDay(29, da)).split('-').join("")
                    bool = +n1 <= (+n2)
                }
                return (this.times=='WEEK'||this.times=='MONTH') ? true : bool
            },
            timeChange(val){
                this.isDaterange = val =='CUSTOM'
                if(val !='CUSTOM') this.getEcharts()
            },
            setOptions(d, dx){
                let obj = {
                    abilityAnalysis1: ['本人成绩','平均成绩'],
                    abilityAnalysis2: []
                }
                let setData = (name, d) => {
                    return  {
                        name,
                        type: 'line',
                        stack: '总量',
                        data: d || [0]
                    }
                }
                let da = {
                    abilityAnalysis1: d&&d.length>0 ? [setData('本人成绩', d[0]),setData('平均成绩', d[1])] : [setData('本人成绩'),setData('平均成绩')], 
                    abilityAnalysis2: [setData('学习时长', d)]
                } 
                let legendData = obj[this.type]
                let list = da[this.type]
                return {
                    color: ['#4098FF','#f6bb60'],
                    title: this.setEchertsTitle(this.title),
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: legendData
                    },
                    grid: {
                        left: '0%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: dx || [''],
                        axisLabel: {
                            formatter: function (value) {
                                return value&&value.split("-").join("\n") || value
                            },
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: list
                };
            },  
            setEcherts1(d, dx){
                let myChart = echarts.init(document.getElementById(this.id));
                myChart.setOption(this.setOptions(d, dx));
            },
        }
    }
</script>

<style lang="less" scoped>
    .echarts-main{
        margin-top: 40px;
        padding: 0 30px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .screen-data-picker{
        width: 200px !important;
        margin-left: 10px !important;
        /deep/ .ivu-btn{
            display: inline-block !important;
        }
    }
    .echarts-head{
        display: flex;
        margin-bottom: 40px;
    }
</style>