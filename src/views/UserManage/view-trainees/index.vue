<template>
   <div class="case">  
        <ranking v-if="isRank" :isShow="rankingShow" @close="rankingClose" :title="rankingTitle" :type="rankingType"/>
        <see :detail-data="tableRowData" title="查看用户信息" :show-modal='detailShow' @close="close" />
        <CaseHead :patient-data="patientData" @seePatientInfo="seePatientInfo"  />
        <div class="case-main" :style="activeItem ? 'height: calc(100% - 240px);' : 'height: calc(100% - 160px);'">
            <div v-if="activeItem&&hInfo" class="statistics-view">
                <span>{{getTypeTitle}}次数：{{hInfo.r_count}}</span>
                <span v-if="activeItem == 1" class="s-item">平均时长：{{getAvgtime}}</span>
                <span v-if="activeItem == 1&&isRank" class="s-item">班级排名：{{hInfo.in_grade_sort_num}}</span>
                <span v-if="activeItem == 2&&isRank" class="s-item">综合排名：{{hInfo.in_grade_sort_num}}</span>
                <span v-if="activeItem != 3&&isRank" @click="toSee" class="see-item">查看</span>
            </div>
            <hr v-if="activeItem" class="hr" />
            <Row v-if="activeItem" class="case-table-head">
                <Col :span="3">提交时间</Col><Col :span="6">{{headTitle}}</Col><Col :span="6">{{headTitle2}}</Col>
                <Col :span="3">评分</Col><Col :span="6" class="last">操作</Col>
            </Row>
            <hr v-if="activeItem" class="hr" />
            <div class="content" :style="activeItem ? 'height: calc(100% - 40px);' : 'height: calc(100% - 30px);'">
                <div class="case-menu" :style="activeItem ? '' : 'margin-top:103px;'">
                    <div class="case-menu-item" v-for="(m,i) in menuList" :class="m.active ? 'menu-active' : ''"  @mouseenter="menuMouse(i, true)" @mouseleave="menuMouse(i, false)"  @click="menuCli(i, true)" :key="i">
                        <div v-if="m.active" class="item-active"></div>
                        <Icon v-if="m.img == 'ability'" :size="22" :color="m.active ? '#4098FF' : '#474C63'" type="ios-paper" />
                        <img v-else :class="'menu-item-img'+i" :src="m.active ? m.img[1] : m.img[0]" />
                        <span>{{m.title}}</span>
                    </div>
                </div>
                <div class="content-main" :style="activeItem ? 'padding-top: 30px;' : 'margin-top: 5px'">
                    <div class="abil" v-show="activeItem == 0">
                        <div class="ab-left ab-item">
                            <div class="ab-head">
                                <span class="tit">系统能力</span>
                                <Poptip placement="bottom-start" trigger="hover" title="">
                                    <div slot="content">
                                        <p>系统性：考察学员整体诊疗能力是否全面。诊疗过程中正确率越高，评分越高。</p>
                                        <p>逻辑性：考察学员的诊断、治疗是否有据可依。诊断依据越准确，评分越高。</p>
                                        <p>精准性：考察学员的诊疗能力都准确率。正确率越高，评分越高。</p>
                                        <p>敏捷性：考察学员诊疗思维的熟练程度、 反应速度。诊疗耗时越少，评分越高。</p>
                                        <p>经济性：考察学员诊疗费用把控能力。花费越少，评分越高。</p>
                                    </div>
                                    <Icon :size="18" type="md-help-circle" />
                                </Poptip>
                                <div class="ab-right">
                                    <span>综合评分：</span>
                                    <Rate show-text allow-half v-model="valueCustom">
                                        <span style="color: red">{{ valueCustom }}</span>
                                    </Rate>
                                </div>
                            </div>
                            <div style="flex:1;height: 300px;margin-top:10px;">
                                <div style="width: 100%; height: 100%" id="system-capability"></div>
                            </div>
                        </div>
                        <div class="ab-item">
                             <div class="ab-head">
                                <span class="tit">诊疗能力</span>
                                <Poptip trigger="hover" placement="bottom-start" title="">
                                    <div slot="content">
                                        <p>问诊：考察学员问诊的有效性。问诊有效性越高，评分越高。</p>
                                        <p>查体：考察学员体格检查的有效性。体格检查项正确率越高，评分越高。</p>
                                        <p>辅检：考察学员辅助检查的准确性。辅助检查项准确率越高，评分越高。</p>
                                        <p>诊断：考察学员诊断思维能力。诊断准确率越高，评分越高。</p>
                                        <p>治疗：考察学员综合治疗能力。花费越少，有效性越高，评分越高。</p>
                                    </div>
                                    <Icon :size="18" type="md-help-circle" />
                                </Poptip>
                                <div class="ab-right">
                                    <span>综合评分：</span>
                                    <Rate show-text allow-half v-model="valueCustom2">
                                        <span style="color: red">{{ valueCustom2 }}</span>
                                    </Rate>
                                </div>
                            </div>
                            <div style="flex:1;height: 300px;margin-top:10px;">
                                <div style="width: 100%; height: 100%" id="treatment-capability"></div>
                            </div>
                        </div>
                    </div>
                    <Timeline v-if="list.length>0&&activeItem">
                        <TimelineItem v-for="t in years" :key="t">
                            <p class="title" >{{t}}</p>
                            <Row class="content-row grey-regular1" v-for="(it,i) in list" v-if="showItem(it,t)" :key="i">
                                <Col :span="3">{{submitTime(it.submit_time)}}</Col>
                                <Col :span="6">{{it.symptom}}</Col>
                                <Col :span="6">{{it.base_diagnose||it.complate_case_count}}</Col>
                                <Col :span="3">{{scores(it)}}</Col>
                                <Col :span="6" class="last" @click.native="viewReports(it)">【查看成绩报告】</Col>
                            </Row>
                        </TimelineItem>
                    </Timeline>
                    <div class="no-time" v-else-if="list.length==0&&activeItem">
                         <img class="no-record" src="../../../assets/case/no-record.png" />
                         <p>暂无{{menuList[activeItem].title}}</p>
                    </div>
                    <BrokenLine type="abilityAnalysis1" id="abilityAnalysis1" title="考试成绩趋势" url="user/getExamTendency" v-if="activeItem == 0" />
                    <BrokenLine type="abilityAnalysis2" id="abilityAnalysis2" title="学习时长（分钟）" url="user/getSynthesize" v-if="activeItem == 0" />
                    <EchartsView v-if="activeItem==0"/>
                </div>
            </div>
        </div>
        <Page class="pages" :current="current" :total="total" v-if="list.length>0&&activeItem" :page-size="pageSize" @on-change="pageChange"></Page>
   </div>
</template>
<script>
import postData from 'src/api/postData'
import see from 'components/SeeInfo.vue'
import seeMixin from '../Mixins/seeMixin'
import CaseHead from 'components/case-head.vue'
import practiceG from 'assets/case/practice-g.png'
import practiceB from 'assets/case/practice-b.png'
import taskG from 'assets/case/task-g.png'
import taskB from 'assets/case/task-b.png'
import examG from 'assets/case/exam-g.png'
import examB from 'assets/case/exam-b.png'
import echarts from 'echarts'
import ranking from './ranking'
import BrokenLine from './com/broken-line'
import EchartsView from './com/echarts-view'

export default {
    components: { see, CaseHead, ranking, BrokenLine, EchartsView },
    mixins: [seeMixin],
    data(){
        return{
            hInfo: null,
            practiceInfo: null,
            examInfo: null,
            taskInfo: null,
            rankingShow: false,
            rankingTitle: '',
            rankingType: 0,
            valueCustom: 4.56,
            valueCustom2: 4.56,
            tableRowData: {},
            activeItem: 0,
            patientData: {},
            current: 1,
            total: 0,
            pageSize: 12,
            practiceList: [],
            examList: [],
            list: [],
            taskList: [],
            menuList: [
                { img: 'ability', title: '能力分析', active: true},
                { img: [practiceG, practiceB], title: '练习记录', active: false},
                { img: [examG, examB], title: '考试记录', active: false},
                { img: [taskG, taskB], title: '作业记录', active: false}
            ]
        }
    },
    mounted(){
        this.getEcherts()
        this.getEcherts2()
    },
    computed: {
        isRank(){
            return +this.$route.query.grade_id ? true : false
        },
        getAvgtime(){
            if(this.hInfo && this.hInfo.avg_time){
                let t = this.hInfo.avg_time
                if(t>60) return Number.parseInt(t/60) + '分钟' + Number.parseInt(t%60) + '秒'
                else return t + '秒'
            }else return '0秒'
        },
        studentInfo(){
            return JSON.parse(sessionStorage.getItem('STUDENRTABLEROWDATA'))
        },
        years(){
            let d = []
            if(this.list.length>0) this.list.forEach(t => d.push(t.submit_time.slice(0,4)))
            d = [...new Set(d)];
            return d
        },
        headTitle(){
            return this.activeItem === 1 ? '病例症状' : this.activeItem === 2 ? '考试标题' : this.activeItem === 3 ? '练习标题' : ''
        },
        headTitle2(){
            return this.activeItem === 1 ? '主要诊断' : (this.activeItem === 2 || this.activeItem === 3) ? '完成病例（次）' : ''
        },
        getTypeTitle(){
            return this.activeItem === 1 ? '练习' : this.activeItem === 2 ? '考试' : '作业'
        },
    },
    methods: {
        getEcherts(){
            postData('user/getSystemAbility', {user_id: +this.$route.query.id}).then((r) => {
                if(r.res_code == 1) this.setEcherts1(r.data.sysAbi)
            })
        },
        getEcherts2(){
            postData('user/getDiagnosisTreatAbility', {user_id: +this.$route.query.id}).then((r) => {
                if(r.res_code == 1) this.setEcherts2(r.data.dtAbi)
            })
        },
        rankingClose(){
            this.rankingShow = false
        },
        toSee(){
            this.rankingTitle = this.activeItem == 1 ? '班级排名' : '综合排名'
            this.rankingShow = true
            this.rankingType = this.activeItem
        },
        setOptions(indicators, list){
            return {
                tooltip: {
                    trigger: 'axis',
                    padding: 20,
                    backgroundColor: '#595d70',
                    formatter: function ({value}) {
                        let str = ''
                        for (var i = 0; i < value.length; i++) {
                            str += `<div style='display: flex;justifyContent: flex-start;position: relative;'>
                            <span style='margin-right: 50px;'>${indicators[i].name}</span>
                            <br/><span style='position: absolute;right:0;'>${value[i]}</span></div>`;
                        }
                        return str
                    }
                },
                radar: {
                    name: {
                        formatter: function (value) {
                            return value&&value.split("-").join("\n") || value
                        },
                    },
                    splitNumber: 4,
                    indicator: indicators,
                    radius: 120,
                    center: ["50%", "50%"],
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(64,152,255,0.20)',
                        },
                    },
                    splitLine : {
                        show : true,
                        lineStyle : {
                            width : 1,
                            color : 'rgba(64,152,255,0.20)', // 设置网格的颜色
                        },
                    },
                    splitArea : {
                        areaStyle:{
                            color:['#fff','#f7faff']
                        }
                    }
                },
                symbolSize: 0,
                textStyle:{
                    fontSize: 10,
                    color: '#ADB2CD',
                },
                series: [
                    {
                        avoidLabelOverlap: false,
                        type: 'radar',
                        tooltip: {
                            trigger: 'item',
                        },
                        itemStyle: { normal: {areaStyle: {type: 'default'}}},
                        data: [
                            {
                                value: list,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(35,158,255,0.5)'
                                    },
                                },
                            },
                        ]
                    },
                ]
            };
        },
        handleDate(d){
            let indicators = [], list = []
            d.map((t) => {
                // 线下课程安-排合理性
                indicators.push({ name: t.name, max: 5 })
                list.push(t.score)
            }) 
            return {indicators, list}
        },
        setEcherts1(d){
            let myChart = echarts.init(document.getElementById('system-capability'));
            let {indicators, list} = this.handleDate(d)
            myChart.setOption(this.setOptions(indicators, list));
        },
        setEcherts2(d){
            let myChart = echarts.init(document.getElementById('treatment-capability'));
            let {indicators, list} = this.handleDate(d)
            myChart.setOption(this.setOptions(indicators, list));
        },
        submitTime(time){
            return time.slice(5)
        },
        scores(t){
            return t.score_state&&t.score!='-' ? t.score + '分' : '-'
        },
        showItem(it,t){
            return it.submit_time.slice(0,4) === t
        },
        menuMouse(i,bool){
            if(i===this.activeItem) this.menuList[i].active = true
            else this.menuList[i].active = bool
        },
        viewReports(t){
            // type 1--练习 2--考试 3--作业
            // state 1--查看 2--评分
            // back 返回的url 
            let da = this.activeItem == 2 ? { room_id: t.room_id } : this.activeItem == 3 ? { homework_id: t.homework_id } : {}
            let d = this.activeItem == 1 ? { case_id: t.case_id, id: t.id, do_state: 1 } : {...da, id: +this.$route.query.id,}
            this.$router.replace({ query: {...d, score_state: t.score_state, type: this.activeItem,  exam_state: 2, state: 1, score: t.score, back: 'view-trainees'}, name: "view-reports"})
        },
        menuCli(k,bool){
            this.activeItem = k
            this.list = k === 1 ? this.practiceList : k === 2 ? this.examList : k == 3 ?  this.taskList : []
            this.menuList.map((t,i) => {
                t.active = false
                if(i === k) t.active = bool
            })
            if(k) this.hInfo = k == 1 ? this.practiceInfo : k == 2 ? this.examInfo : this.taskInfo
        },
        pageChange(val){
            this.current = val
        },
        seePatientInfo(){
            this.tableRowData = JSON.parse(sessionStorage.getItem('STUDENRTABLEROWDATA'))
            this.detailShow = true
        },
        getHeadData(){
            let loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
            postData('user/getCaseCount',{user_id: +this.$route.query.id}).then((res) => {
                if(res.res_code==1) {
                     postData('user/getUserBaseInfo',{user_id: +this.$route.query.id}).then((r) => {
                        if(res.res_code==1) {
                            let da = r.data
                            da.student_type = da.student_type ? da.student_type : '未知'
                            this.patientData = {...da,...res.data, user_id: +this.$route.query.id}
                            if(loadingInstance) loadingInstance.close()
                        }
                    })
                }
            })
        },
        getExerciseBaseInfo(url, field){
            postData(url, {user_id: +this.$route.query.id,grade_id: +this.$route.query.grade_id}).then(r => {
                if(r.res_code == 1) this[field] = r.data
            })
        },
        getList(url,field){
            let d = {
                user_id: +this.$route.query.id,
                page_num: this.current,
                page_size: this.pageSize
            }
            postData(url,d).then((res) => {
                if(res.res_code==1) {
                    if(res.data&&res.data.length>0){
                        let d = this.$config.setDataInit(res.data)
                        this[field] = d
                    }
                }
            })
        }
    },
    created(){
        new Promise((resolve,reject) => {
            this.getHeadData()
            resolve()
        }).then(() => {
            this.getList('user/getExerciseRecords','practiceList')
            this.getExerciseBaseInfo('user/getExerciseBaseInfo', 'practiceInfo')
            return true
        }).then(() => {
            this.getList('user/getExamRecords','examList')
            this.getExerciseBaseInfo('user/getExamBaseInfo', 'examInfo')
            return true
        }).then(() => {
            this.getList('user/getHomeworkRecords','taskList')
            this.getExerciseBaseInfo('user/getHWBaseInfo', 'taskInfo')
            return true
        })
    }
}
</script>
<style lang="less" scoped>
.left{
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #4098FF;
    letter-spacing: 1.05px;
    text-align: center;
}
.statistics-view{
    display: flex;
    margin-left: 317px;
    height: 40px;
    font-size: 16px;
    align-items: center;
    .s-item{
        margin-left: 40px;
    }
    .see-item{
        margin-left: 20px;
        color: #4098FF
    }
}
.abil{
    display: flex;
    .ab-left{
       border-right: 1px solid #f0f0f7
    }
    .ab-item{
        width: 50%;
        padding: 0 30px;
        .ab-head{
            height: 30px;
            display: flex;
            align-items: center;
            position: relative;
            .tit{
                font-size: 16px;
                margin-right: 5px;
            }
            .ab-right{
                position: absolute;
                right: 0;
            }
        }
    }
}
.case{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .case-main{
        position: relative;
        top: -33px;
        overflow: hidden;
        .case-table-head{
            width: calc(100% - 317px);
            margin-left: 317px;
            height: 59px;
            line-height: 59px;
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #9397AD;
            letter-spacing: 1.05px;
            .last{
                text-align: center;
            }
        }
        .hr{
           width: calc(100% - 293px);
           margin-left: 293px;
           height: 1px;
           border: none;
           border-top: 1px solid #F0F0F7;
        }
        .content{
            display: flex;
            width: 100%;
            .case-menu{
                width: 293px;
                height: 144px;
                display: flex;
                flex-direction: column;
                padding: 0 46.5px;
                .menu-active{
                    background: #f0faff;
                    color: #4098FF;
                }
                &-item{
                    width: 100%;
                    height: 48px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #474C63;
                    position: relative;
                    cursor: pointer;
                    .item-active{
                        width: 4px;
                        height: 48px;
                        background: #4098FF;
                        position: absolute;
                        left: 0;
                        border-radius: 5px;
                    }
                    .menu-item-img1{
                        width: 17px;
                    }
                    .menu-item-img2{
                        width: 21px;
                    }
                    .menu-item-img3{
                        width: 15px;
                    }
                    span{
                        margin-left: 20px;
                    }
                }
            }
            .content-main{
                flex: 1;
                overflow: hidden;
                overflow-y: auto;
                height: 100%;
                .no-time{
                    width: inherit;
                    margin-top: 100px;
                    .no-record{
                        width: 217px;
                        height: 240px;
                    }
                    p{
                        font-family: PingFangSC-Regular;
                        font-size: 20px;
                        color: #9397AD;
                        letter-spacing: 1.67px;
                        text-align: center;
                    }
                }
                .title{
                    text-align: left;
                    font-family: PingFangSC-Regular;
                    font-size: 20px;
                    color: #9397AD;
                    letter-spacing: 1px;
                    margin-bottom: 20px;
                }
                .content-row{
                    width: 100%;
                    margin-bottom: 30px;
                    .last{
                        .left;
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
/deep/ .ivu-timeline-item:last-child .ivu-timeline-item-tail{
    display: block;
}
/deep/ .ivu-timeline-item-head{
    width: 8px;
    height: 8px;
    background: #9397AD;
    border:none;
}
/deep/ .ivu-timeline-item-tail{
    left: 4px;
}
/deep/ .ivu-timeline-item-tail{
    border-left: 1px solid #9397AD;
}
/deep/ .ivu-timeline-item-content{
    top: -10px;
    flex-direction: column;
}
/deep/ .ivu-col{
    text-align: left;
}
.pages{
    position: absolute;
    right: 0;
    left: 0;
    bottom: 10px;
    margin: auto;

}
</style>


