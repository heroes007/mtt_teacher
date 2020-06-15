<template>
   <div class="case">
        <see :detail-data="tableRowData" title="查看用户信息" :show-modal='detailShow' @close="close" />
        <CaseHead :back="back" :state="+$route.query.state" :scoreState="+$route.query.score_state" :doStates="doStates" :examState="+this.$route.query.exam_state" :type="+$route.query.type" :studentCost="studentCost" :rightCost="rightCost"
        :answerCount="answerCount" :rightCount="rightCount" :patient-data="patientData" @seePatientInfo="seePatientInfo"  />
        <div class="case-main">
            <div  v-if="type==2||type==3" class="exam-info">
                <div class="title grey-medium2">{{title}}信息</div>
                <div class="de">
                    <p class="grey-medium4 de-title">{{examData.exam_name}}</p>
                    <p class="de-item">
                       <img src="../../../assets/case/mechanism.png" /> <span>{{examData.organization_name}}</span>
                       <img src="../../../assets/case/assessment.png" /> <span>{{examMethod[+examData.type-1]}}</span>
                       <span v-if="type==2"><img  src="../../../assets/case/duration.png" /> <span>限{{examData.duration}}分钟</span></span>
                       <span style="display: block; margin-top: 20px;" v-else-if="type==3">作业起止时间：{{examData.start_time}} ~ {{examData.end_time}}</span>
                    </p>
                    <Select class="case-select" v-model="caseIdActive" @on-change="caseChange">
                        <Option v-for="(item, k) in caseList" :value="item.id" :key="k">病例{{ k + 1 }}：{{ item.symptom }}</Option>
                    </Select>
                </div>
            </div>
            <div :class="(type==2||type==3) ? 'case-right2' : 'case-right'">
                <div class="item" v-for="(t,i) in rigthList" :key="i">
                    <img :src="t.img" />
                    <span>{{t.title}}</span>
                </div>
            </div>
            <Tabs v-model="activePane" @on-click="tabs">
                <TabPane label="诊疗日志" name="name1"  class="panes1">
                    <div class="diary-treat" v-show="panesShow">
                         <div v-if="type==2||type==3">
                            <div v-if="doStates">
                                <div class="exam-scoring grey-regular5" v-if="examState">
                                    <!-- <span>得分项：<span class="exam-medium">{{rightCount}}个</span>/{{answerCount}}个</span> -->
                                    <span >辅检费用：<span class="exam-medium">¥{{studentCost}}</span>/¥{{rightCost}}</span>
                                    <span class="exam-fraction" v-if="isScore">
                                        <span class="grey-regular5">评分</span>
                                        <InputNumber class="fraction" :max="100" :min="0" v-model="fraction"></InputNumber>
                                        <Button class="fraction-btn" @click="confirmFraction" type="primary">确定</Button>
                                    </span>
                                    <span class="exam-fraction" v-else v-html="scores"></span>
                                </div>
                            </div>
                            <div class="exam-scoring  grey-regular5" v-else>未做该病例</div>
                        </div>
                      <DiaryTreat :treats="treatsJournal" :caseInfo="caseInfo" :objectivetests="objectivetestsJournal" :mockDiagnosesEnd="mockDiagnosesJournal" />
                    </div>
                </TabPane>
                <TabPane label="参考答案" name="name2" class="panes2">
                    <div class="time-line-records" v-show="!panesShow" >
                        <TimeLineRecord :treats="treats" :objectivetests="objectivetests" :mockDiagnosesEnd="mockDiagnoses" :mockDiagnosesInit="mockDiagnosesInit" />
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <ScoringModal v-if="(type==2||type==3)&&state==2" :fraction="fraction" :showModal="showModal" @close="closeModal" @confirm="confirm"  />
   </div>
</template>
<script>
import see from 'components/SeeInfo.vue'
import seeMixin from '../Mixins/seeMixin'
import postData from 'src/api/postData'
import timelineRecordMixins from 'mix/timelineRecordMixins'
import correct from 'assets/case/correct.png'
import error from 'assets/case/error.png'
import neutral from 'assets/case/neutral.png'
import noChoice from 'assets/case/no-choice.png'
import DiaryTreat from 'components/diary-treat.vue'
import ScoringModal from '../../../components/scoring-modal.vue'
export default {
    components: { see, DiaryTreat, ScoringModal },
    mixins: [ timelineRecordMixins, seeMixin ],
    data(){
        return{
            treatsJournal: null,
            activePane: 'name1',
            caseIdActive: null,
            showModal: false,
            panesShow: true,
            back: {},
            caseState: false,
            caseInfo: {},
            objectivetestsJournal: [],
            fraction: 0,
            mockDiagnosesJournal: [],
            patientData: {},
            tableRowData: {},
            examMethod: ['完成所有病例','随机完成1个病例','考生自主选择病例'],
            journal: [
                {img: correct, title: '得分项'},
                {img: error, title: '扣分项'},
                {img: neutral, title: '中立项'},
            ],
            answer: [ {img: correct, title: '已选择'}, {img: noChoice, title: '未选择'},],
            rigthList: [],
            studentCost: 0,
            rightCost: 0,
            answerCount: 0,
            wrongCount: 0,
            rightCount: 0,
            examData: {},
            caseList: []
        }
    },
    watch:{
        answerCount(_new){
            if(this.type==2&&this.state==2){
                let c = Math.round(this.rightCount/this.answerCount*100)
                this.fraction = (Number.isNaN(c) || c < 0) ? 0 : c;
            }
        },
    },
    computed:{
        title(){
            return this.type == 2 ? '考试' : this.type == 3 ? '作业' : ''
        },
        examState(){
            return this.$route.query.exam_state == 2
        },
        ids(){
            return this.type == 2 ? { room_id: +this.$route.query.room_id } : this.type == 3 ? { homework_id: +this.$route.query.homework_id } : {}
        },
        doStates(){
           return this.$route.query.do_state ? this.$route.query.do_state : this.caseState ? true : false
        },
        scores(){
            let score = "font-family:PingFangSC-Medium;font-size:34px;color:#E50000;"
            let scoreText = "font-family:PingFangSC-Regular;font-size:20px;color:#E50000;"
            if(this.type == 2) {
                let operator = "font-family:PingFangSC-Medium;font-size:20px;color:#E50000;margin-right:20px;"
                let op = '操作人：'+`<span style=${operator}>${this.caseInfo.operator}</span>`
                return this.caseInfo.score_state ? op + '得分：'+`<span style=${score}>${this.caseInfo.score}</span>` + `<span style=${scoreText}>分</span>` : `<span style=${score}>未评分</span>`
            }
            if(this.type == 3) return this.caseInfo.score_state ? '得分：'+`<span style=${score}>${this.caseInfo.score}</span>` + `<span style=${scoreText}>分</span>` : `<span style=${score}>未评分</span>`
        },
        isScore(){
            // homework/getCaseInfo 作业评分后score_state 没有变化
            if(this.$route.query.back=='view-trainees') return this.caseInfo.score_state ? true : false
            else return this.caseInfo.score_state ? false : true
        },
        type(){
            return this.$route.query.type
        },
        state(){
            return this.$route.query.state
        },
        //学员信息接口
        headUrl(){
            return this.type == 1 ? 'exercise/getUserInfo' : this.type == 2 ? 'user/getExamInfo' : this.type == 3 ? 'user/getHWInfo' : ''
        },
        //病例信息接口
        caseUrl(){
            return this.type == 1 ? 'exercise/getCaseInfo' : this.type == 2 ? 'exam/getCaseInfo' : this.type == 3 ? 'homework/getCaseInfo' : ''
        },
        //诊疗日志 诊断
        diagnosisUrl(){
            return this.type == 1 ? 'exercise/getMockDiagnosis' : this.type == 2 ? 'exam/getMockDiagnosis' : this.type == 3 ? 'homework/getMockDiagnosis' : ''
        },
        //诊疗日志 处置治疗
        treatsUrl(){
            return this.type == 1 ? 'exercise/getTreat' : this.type == 2 ? 'exam/getTreat' : this.type == 3 ? 'homework/getTreat' : ''
        },
        //诊疗日志 模拟考试
        objectivetestsUrl(){
            return this.type == 1 ? 'exercise/getObjectivetests' : this.type == 2 ? 'exam/getObjectivetests' : this.type == 3 ? 'homework/getObjectivetests' : ''
        },
        scoreUrl(){
            return this.type == 2 ? 'exam/giveMark' : this.type == 3 ? 'homework/giveMark' : ''
        }
    },
    created(){
        this.rigthList = this.journal
        let url = this.$route.query.back;
        if(url == 'view-trainees') {
            let id = JSON.parse(sessionStorage.getItem('STUDENRTABLEROWDATA')).id
            this.back = { query: { id }, name: url }
        }else if(url == 'check-exam'){
            let id = this.type == 2 ? +this.$route.query.room_id : this.type == 3 ? +this.$route.query.homework_id  : null
            this.back = { query: { id, type: (+this.$route.query.type - 1) }, name: url }
        }else this.back = { name: url }
        if(this.$route.query.type == 1){
           this.practiceInit()
        }
        if(this.$route.query.type == 2 || this.$route.query.type == 3){
            this.examInit()
        }
    },
    methods: {
        confirmFraction(){
            this.showModal = true
        },
        confirm(){
            this.showModal = false
            let d = {...this.ids, user_id: +this.$route.query.id}
            let d2 = {...d, case_id: this.caseIdActive, score: this.fraction}
            postData(this.scoreUrl, d2).then((res) => {
                if(res.res_code==1) {
                    this.$Message.success('评分成功！');
                    if(this.$route.query.type == 2 || this.$route.query.type == 3){
                        this.examInit()
                    }
                }
            })
        },
        closeModal(){
            this.showModal = false
        },
        examInit(){
            let d = {...this.ids, user_id: +this.$route.query.id}
            this.getExamHeadData(this.headUrl, d)
        },
        handLeClearCount(){
             this.fraction = 0
             this.answerCount = 0
             this.wrongCount = 0
             this.rightCount = 0
             this.studentCost = 0
             this.rightCost = 0
        },
        // 处理考试
        getExamData(){
            let d = {...this.ids, user_id: +this.$route.query.id}
            let d2 = {...d, case_id: this.caseIdActive}
            this.handLeClearCount()
            new Promise((resolve,reject) => {
                this.getCaseInfo(this.caseUrl, {...d, id: this.caseIdActive})
                resolve()
            })
            // 诊疗日志
            .then(() => {
                if(this.examState)  this.getDiagnosisJournal(this.diagnosisUrl, d2)
                else this.mockDiagnosesJournal = null;
                return true
            })
            .then(() => {
                if(this.examState) this.getTreatsJournal(this.treatsUrl, d2)
                else this.treatsJournal = null
                return true
            })
            .then(() => {
                if(this.examState) this.getObjectivetestsJournal(this.objectivetestsUrl, d2)
                else this.objectivetestsJournal = null
                return true
            })
            // 参考答案
            .then(() => {
                this.getMockDiagnoses(this.caseIdActive)
                return true
            }).then(() => {
                this.getTreats(this.caseIdActive)
                return true
            }).then(() => {
                this.getObjectivetests(this.caseIdActive)
            })
        },
        practiceInit(){
            new Promise((resolve,reject) => {
                this.getHeadData(this.headUrl)
                resolve()
            }).then(() => {
                this.getCaseInfo(this.caseUrl)
                this.handLeClearCount()
                return true
            })
            //诊疗日志
            .then(() => {
                this.getDiagnosisJournal(this.diagnosisUrl)
                return true
            })
            .then(() => {
                this.getTreatsJournal(this.treatsUrl)
                return true
            })
            .then(() => {
                this.getObjectivetestsJournal(this.objectivetestsUrl)
                return true
            })
            // 参考答案
            .then(() => {
                this.getMockDiagnoses()
                return true
            }).then(() => {
                this.getTreats()
                return true
            }).then(() => {
                this.getObjectivetests()
            })
        },
        caseChange(id){
            this.caseList.forEach(t=>{
                if(t.id === id) this.caseState = t.do_state
            })
           this.getExamData()
        },
        getExamHeadData(url,d){
            let loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
            postData(url, d).then((res) => {
                if(res.res_code==1) {
                    this.examData = res.data
                    this.patientData = this.$config.setDataK(res.data.userInfo)
                    if(res.data.cases&&res.data.cases.length>0){
                        this.caseList = res.data.cases
                        this.caseIdActive = this.caseList[0].id
                        this.caseState = this.caseList[0].do_state
                        this.getExamData()
                    }
                    this.patientData.use_time = res.data.use_time
                    this.patientData.score = res.data.score
                    this.patientData.complate_case_count = res.data.complate_case_count
                    this.patientData.case_count = res.data.case_count
                    if(loadingInstance) loadingInstance.close()
                }
            })
        },
        getHeadData(url){
            let loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
            postData(url, {id: +this.$route.query.id}).then((res) => {
                if(res.res_code==1) {
                    this.patientData = res.data[0]
                    if(loadingInstance) loadingInstance.close()
                }
            })
        },
        getCaseInfo(url, d){
            postData(url, d || {id: +this.$route.query.id}).then((res) => {
                if(res.res_code==1) this.caseInfo = res.data
            })
        },
        tabs(name){
            // this.$nextTick(() => {
                this.panesShow = !this.panesShow
                this.rigthList = name === 'name1' ? this.journal : this.answer
                this.$forceUpdate()
            // })
        },
        handLePostData(url, filed, d){
            postData(url, d || {id: +this.$route.query.id}).then((res) => {
                if(res.res_code==1&&res.data) {
                    if(res.data.hasOwnProperty('data')) {
                        let d = res.data
                        this[filed] = res.data.data
                        this.$nextTick(() => {
                            if(d.answer_count) this.answerCount += d.answer_count
                            if(d.wrong_count) this.wrongCount += d.wrong_count
                            if(d.right_count) this.rightCount += d.right_count
                            if(d.student_cost) this.studentCost = d.student_cost
                            if(d.right_cost) this.rightCost = d.right_cost
                        })
                    }else this[filed] = null
                }
            })
        },
        getDiagnosisJournal(url, d){
            this.handLePostData(url, 'mockDiagnosesJournal', d)
        },
        getTreatsJournal(url, d){
            this.handLePostData(url, 'treatsJournal', d)
        },
        getObjectivetestsJournal(url, d){
            this.handLePostData(url, 'objectivetestsJournal', d)
        },
        seePatientInfo(){
            let d = this.patientData
            d.head_img = d.img_url;
            d.list = [
                 '证件类型：' + this.$config.getIdType(d.id_type),
                 '证件号码：' + d.id_num,
                 '手机号：' + d.phone,
                 '注册时间：' + d.create_time,
                 '最后登录：' + d.last_login_time
            ]
            this.tableRowData = d
            this.detailShow = true
        }
    }
}
</script>
<style lang="less" scoped>
.exam-scoring{
    position: relative;
    display: inline-flex;
    width: 100%;
    height: 40px;
    padding-left: 236px;
    margin-bottom: 10px;
    .exam-medium{
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #000000;
        letter-spacing: 1.17px;
    }
    .exam-fraction{
        position: absolute;
        right: 100px;
        display: inline-flex;
        height: 40px;
        align-items: center;
        .fraction{
            width: 140px !important;
            margin-left: 15px;
        }
        .fraction-btn{
            width: 112px;
            height: 40px;
            background: #4098FF;
            border-radius: 4px;
            border-radius: 4px;
            margin-left: 10px;
        }
    }
}
.time-line-records{
    height: auto;
}
.diary-treat{
    height: auto;
}
.case{
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    .case-main{
        width: 100%;
        // height: calc(100% - 170px);
        position: relative;
        top: -33px;
    }
}
.exam-info{
    height: 198px;
    background: #FAFAFD;
    border-radius: 4px;
    margin: 30px 30px 40px 236px;
    .title{
        padding: 15px 20px;
        letter-spacing: 1.17px;
        border-bottom: 1px solid #DFE0E6;
        text-align: left;
    }
    .de{
        width: 100%;
        padding: 24px 40px 40px 36px;
        position: relative;
        text-align: left;
        .de-title{
            margin-bottom: 16px;
            letter-spacing: 1.4px;
        }
        .de-item{
            img{
                width: 18px;
                height: 17px;
                position: relative;
                top: 2px;
                margin-right: 8px;
            }
            span{
                font-family: PingFangSC-Medium;
                font-size: 18px;
                color: #6D7183;
                letter-spacing: 1.05px;
                margin-right: 30px;
            }
        }
        .case-select{
            position: absolute;
            right: 40px;
            top: 24px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #333333;
            width: 295px;
            height: 42px;
            /deep/ .ivu-select-selection{
                width: 295px;
                height: 40px;
                border: 1px solid #4098FF;
                border-radius: 4px;
                /deep/  .ivu-select-selected-value{
                    height: 40px;
                    line-height: 40px;
                    padding-left: 15px;
                }
            }
        }
    }
}
/deep/ .ivu-tabs-nav-scroll{
    justify-content: flex-start;
}
/deep/ .ivu-tabs-nav{
    margin-left: 216px;
}
.case-right2{
    top: 270px
}
.case-right{
    top: 19px;
}
.case-right,.case-right2{
    position: absolute;
    right: 35px;
    display: inline-flex;
    .item{
        margin-left: 40px;
        display: flex;
        align-items: center;
        img{
            width: 17px;
            height: 17px;
            margin-right: 10px;
        }
    }
}
/deep/ .ivu-tabs-tabpane{
    padding-top: 30px;
}
/deep/ .ivu-timeline-item-content{
    width: calc(100% - 30px)
}
</style>


