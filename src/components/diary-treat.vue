<template>
    <Timeline class="time-lines">
        <!-- 查看  问诊/体格检查/辅助检查 -->
        <SeeCase :showModal="showModal" :type="type" :detailData="detailData" @close-modal="closeModal" />
        <TimelineItem v-if="caseInfo">
            <img slot="dot" class="case-dot" src="../assets/case/case-info.png" />
            <Card class="case-card">
                <p slot="title"><span class="grey-regular5">病例信息</span></p>
                <div class="case-info">
                    <div class="case-title"><span class="case-patient-division">{{caseInfo.patient_division}}</span><span class="grey-medium3">{{caseInfo.symptom}}</span></div>
                    <div class="case-d">
                        <img class="case-img" :src="caseInfo.patient_head_portrait_url" />
                        <div class="case-per grey-regular5">
                            <p>患者信息：{{caseInfo.patient_name}}
                               <span class="case-patient"> {{caseInfo.patient_nation}} | {{caseInfo.patient_age}} | {{caseInfo.patient_marital_status}} </span>
                            </p>
                            <p class="illness-statement">病情陈述者：{{$config.setSelf(caseInfo.medical_history_representor)}}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </TimelineItem>
        <!-- 诊断 -->
        <TimelineItem v-if="mockDiagnoses&&mockDiagnoses.length>0">
            <img slot="dot" src="../assets/case/diagnosis.png" />
            <Card class="case-card">
                <p slot="title"><span class="grey-regular5">诊断</span><span class="item-number">（共{{mockDiagnoses.length}}项）</span></p>
                <div v-for="(t,i) in mockDiagnoses" :key="i">
                    <div class="case-card-title grey-medium2" v-if="mockDiagnosesShow">
                        <div :class="'circular'+t.type"></div>
                        {{$config.getDiagnosisType(t.type)}}诊断：<img class="is-right-img" :src="isRightImg(t.is_right)" />{{t.case_diagnosis_name}}
                    </div>
                    <Card class="specific-item" v-if="mockDiagnosesShow&&t.basis&&t.basis.length>0">
                        <p slot="title"><span class="grey-regular1">诊断依据</span></p>
                        <div v-if="t.basis&&t.basis.length>0&&l.content" v-for="l in t.basis" :key="l.id">
                           <!-- 问诊 -->
                           <div v-if="l.type==1" class="card-item"  @click="seeCase(1,l.content)">
                                <img class="card-img" :src="isRightImg(l.is_right)" /><img class="card-img2" src="../assets/case/interrogation.png" />
                                <p class="card-text">{{l.content.question}}</p>
                           </div>
                            <!-- 体检 -->
                           <div v-if="l.type==2" class="card-item" @click="seeCase(4,l.content)">
                                <img class="card-img" :src="isRightImg(l.is_right)" /><img class="card-img2" src="../assets/case/physical-examination.png" />
                                <p class="card-text">{{l.content.name}}</p>
                           </div>
                           <!-- 辅检 -->
                           <div v-if="l.type==3" class="card-item" @click="seeCase(5,l.content)">
                                <img class="card-img" :src="isRightImg(l.is_right)" /><img class="card-img2" src="../assets/case/accessory-examination.png" />
                                <p class="card-text">{{l.content.name}}</p>
                           </div>
                        </div>
                    </Card>
                </div>
            </Card>
        </TimelineItem>
        <!-- 处置治疗 -->
        <TimelineItem v-if="itemNumber()">
            <img slot="dot" src="../assets/case/disposition-treatment.png" />
            <Card class="case-card">
                <p slot="title"><span class="grey-regular5">处置治疗</span><span class="item-number">（共{{itemNumber()}}项）</span></p>
                <!-- 处置原则 -->
                <Card class="specific-item disposition-treatment" v-if="treats&&analyseSuggestion&&analyseSuggestion.treatment_principle">
                    <p slot="title"><span class="grey-regular1">处置原则</span></p>
                    <div class="card-item2">
                        <p  class="card-text log-and-answer-content">原则内容：{{analyseSuggestion.treatment_principle}}</p>
                    </div>
                </Card>
                <!-- 护理 -->
                <Card class="specific-item disposition-treatment" v-if="treats&&setNurse()">
                    <p slot="title" v-if="nurse.nursing_grade"><span class="grey-regular1">护理 </span></p>
                    <div class="card-item"><p class="card-text">
                        <img class="card-img" :src="isRightImg(nurse.is_right_nursing_grade)" />护理等级：{{nurse.nursing_grade}}</p>
                    </div>
                    <div class="card-item"><p class="card-text">
                        <img class="card-img" :src="isRightImg(nurse.is_right_routine)" />护理常规：{{nurse.nursing_routine}}</p>
                    </div>
                    <div class="card-item" v-if="nurse.meal_names&&nurse.meal_names.length>0" v-for="(n, i) in nurse.meal_names" >
                        <p class="card-text"><img class="card-img" :src="isRightImg(nurse.meals_is_right[i])" />膳食{{nurseItem(i,nurse.meal_names)}}：{{n}} </p>
                    </div>
                    <div class="card-item"><p class="card-text">
                        <img class="card-img" :src="isRightImg(nurse.is_right_posture)" />体位：{{nurse.posture_name}}</p>
                    </div>
                    <div class="card-item" v-if="nurse.nursing_item_names&&nurse.nursing_item_names.length>0" v-for="(n, i) in nurse.nursing_item_names">
                        <p class="card-text">
                          <img class="card-img" :src="isRightImg(nurse.nursing_item_is_right[i])" />  护理项目{{nurseItem(i,nurse.nursing_item_names)}}：{{n}}
                        </p>
                    </div>
                    <div class="card-item" v-if="nurse.operation_names&&nurse.operation_names.length>0" v-for="(n, i) in nurse.operation_names">
                        <p class="card-text">
                            <img class="card-img" :src="isRightImg(nurse.operation_is_right[i])" /> 操作{{nurseItem(i,nurse.operation_names)}}：{{n}}
                            <span v-if="operationContent(nurse.operation_content,i)">, {{operationContent(nurse.operation_content,i)}}</span>
                        </p>
                    </div>
                    <div class="card-item2">
                        <p  class="card-text log-and-answer-content">应用理由：<span>{{nurse.reason}}</span></p>
                    </div>
                </Card>
                 <!-- 西药 -->
                <div v-if="treats&&treats.drugsStudent" >
                <Card class="specific-item disposition-treatment" v-for="w in treats.drugsStudent" :key="w.id">
                    <p slot="title"><span class="grey-regular1">{{w.first_name}} > {{w.second_name}} > {{w.third_name}}</span></p>
                    <div class="card-item"><p class="card-text"><img class="card-img" :src="isRightImg(w.is_right_name)" />药物名称：{{w.drug_name}}</p></div>
                    <div class="card-item"><p class="card-text"><img class="card-img" :src="isRightImg(w.is_right_method)" />药物用法：{{w.drug_method}}</p></div>
                    <div class="card-item"><p class="card-text"><img class="card-img" :src="isRightImg(w.is_right_dose)" />药物剂量：{{w.drug_use_dose}}</p></div>
                    <div class="card-item"><p class="card-text"><img class="card-img" :src="isRightImg(w.is_right_interval)" />时间间隔：{{w.drug_interval}}</p></div>
                    <!-- 最后一条数据 -->
                    <div class="card-item2" v-if="w.drug_use_reason">
                        <p  class="card-text log-and-answer-content">应用理由：{{w.drug_use_reason}}</p>
                    </div>
                </Card>
                </div>
                 <!-- 手术 -->
                <Card v-if="treats&&treats.analyseOperation" class="specific-item disposition-treatment">
                    <p slot="title"><span class="grey-regular1">手术</span></p>
                    <div class="card-item"><p class="card-text">手术名称：{{analyseOperation.operation_name}}</p></div>
                    <div class="card-item2">
                        <p  class="card-text log-and-answer-content">应用理由：{{analyseOperation.use_reason}}</p>
                    </div>
                </Card>
                <!-- 建议 -->
                <Card class="specific-item disposition-treatment" v-if="treats&&analyseSuggestion&&analyseSuggestion.suggestion">
                    <p slot="title"><span class="grey-regular1">建议</span></p>
                    <div class="card-item2">
                        <p  class="card-text log-and-answer-content">建议内容：{{analyseSuggestion.suggestion}}</p>
                    </div>
                </Card>
            </Card>
        </TimelineItem>
        <!-- 模拟考试 -->
        <TimelineItem v-if="objectivetests&&objectivetests.length>0">
            <img slot="dot" src="../assets/case/mock-exam.png" />
            <Card class="case-card mock-exam-card">
                <p class="mock-exam-card-title" slot="title"><span class="grey-regular5">模拟考试</span><span class="item-number">（共{{objectivetests.length}}项）</span></p>
                <div class="case-card-title2 grey-regular1">客观题</div>
                <Card class="specific-item objectivetests" v-for="(o, j) in objectivetests" :key="o.id">
                    <p slot="title"><span class="grey-regular1 objectivetests-title">
                        <img class="card-img" :src="isRightImg(o.is_right)" />{{j+1}}. {{o.question}}（{{choose(o.option_choose_id, o.options)}}）</span>
                    </p>
                    <div :class="lastItem(o.options.length,p)" v-for="(op, p) in o.options" :key="op.id">
                        <p class="card-text">{{$config.setABC(p)}}. {{op.option_name}}</p>
                    </div>
                </Card>
            </Card>
        </TimelineItem>
    </Timeline>
</template>
<script>
import SeeCase from 'components/see-case.vue'
import postData from 'src/api/postData'
import correct from 'assets/case/correct.png'
import error from 'assets/case/error.png'
import neutral from 'assets/case/neutral.png'
import { async } from 'q';
export default {
    components: { SeeCase },
    props: {
        mockDiagnosesEnd: {
            type: Array,
            default: []
        },
        caseInfo: {
            type: Object,
            default: null
        },
        treats:{
            type: Object,
            default: null
        },
        objectivetests: {
            type: Array,
            default: []
        },
    },
    data(){
        return{
            correct, error, neutral,
            showModal: false,
            mockDiagnosesShow: false,
            detailData: {},
            type: null,
            mockDiagnoses: []
        }
    },
    computed: {
        nurse(){
            return this.treats&&this.treats.mockDiagnosesStudent
        },
        analyseOperation(){
            return this.treats&&this.treats.analyseOperation
        },
        analyseSuggestion(){
            return this.treats&&this.treats.analyseSuggestion
        },
        isShowBtn(){
            return this.$route.name == 'view-cases'
        },
    },
    watch: {
        mockDiagnosesEnd(_new){
           this.$nextTick(() => {
            this.mockDiagnoses = _new
            this.mockDiagnosesShow = true
           })
        },
    },
    methods: {
        choose(n,list){
            let d = ''
            list.forEach((t,i) => {
                if(t.id == n)  d = this.$config.setABC(i)
            });
            return d
        },
        operationContent(d,i){
            d = JSON.parse(d)
            if(d.length>0) return d[1]
            return ''
        },
        nurseItem(n,d){
            return d.length>1 ? n + 1 : ''
        },
        isRightImg(n){
            return [this.error, this.correct, this.neutral][n]
        },
        setNurse(){
          return  this.treats.mockDiagnosesStudent&&Object.keys(this.treats.mockDiagnosesStudent).length>0
        },
        // 处理最后一条数据的样式
        lastItem(len, i){
            return (len - 1) == i ? 'card-item2' : 'card-item'
        },
        closeModal(){
            this.showModal = false;
        },
        itemNumber(){
            if(this.treats){
                let l1 = this.treats.mockDiagnosesStudent&&Object.keys(this.treats.mockDiagnosesStudent).length>0 ? 1 : 0;
                let l2 = this.analyseOperation&&Object.keys(this.treats.analyseOperation).length>0 ? 1 : 0;
                let l3 = 0;
                if(this.analyseSuggestion&&Object.keys(this.analyseSuggestion).length>0){
                    if(this.analyseSuggestion.suggestion) l3 +=1
                    if(this.analyseSuggestion.treatment_principle) l3 +=1
                }
                let l4 = this.treats.drugsStudent&&this.treats.drugsStudent.length>0 ? this.treats.drugsStudent.length : 0
                return l1 + l2 + l3 + l4
            }
            return 0
        },
        closePatient (val) {
            this.patientInfoShow = val
        },
        seePatientInfo(){
            this.patientInfoShow = true
        },
        seeCase(type, data){
            this.type = type
            this.showModal = true
            this.detailData = data
        },
    },
}
</script>
<style lang="less" scoped>
.mock-exam-card{
    /deep/ .ivu-card-head {
        padding-bottom: 0;
        padding-top: 0;
        .mock-exam-card-title{
            height: 49px;
            line-height: 49px;
        }
    }
}
.objectivetests-title{
    display: inline-flex;
    align-items: center;
    img{
        margin-right: 8px;
    }
}
.case-dot{
    width: 54px;
    height: 54px;
}
.is-right-img{
    margin-right: 8px;
}
.case-info{
    padding-top: 22px;
    .case-title{
        margin-bottom: 20px;
        .case-patient-division{
            font-family: PingFangSC-Regular;
            font-size: 18px;
            color: #4098FF;
            padding: 5px 10px;
            background: #EFF7FF;
            border-radius: 3px;
            margin-right: 15px;
        }
    }
    .case-d{
        display: inline-flex;
        .case-img{
            width: 80px;
            height: 80px;
            border-radius: 5px;
        }
        .case-per{
            margin-left: 20px;
            .case-patient{
                margin-left: 20px;
            }
            .illness-statement{
                margin-top: 16px;
            }
        }
    }
}
.loadingIcon{
  vertical-align: baseline;
  display: inline-block;
  color: red;
}
.objectivetests{
    margin-bottom: 20px;
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
/deep/ .ivu-card-head{
    padding: 15px 30px;
    height: 57px;
    line-height: 28px;
    p{
        position: relative;
        top: 3px;
        font-weight: normal;
    }
}
/deep/ .ivu-timeline{
    padding: 60px 30px 0 163px;
    margin: 0;
}
/deep/ .ivu-timeline-item-head-custom{
    width: 54px;
    margin-top: 24px;
}
/deep/ .ivu-timeline-item-content{
    padding: 1px 1px 10px 75px;
}
/deep/ .ivu-timeline-item-tail{
    left: 13px;
}
/deep/ .ivu-timeline-item:last-child .ivu-timeline-item-tail{
    display: block;
    top: -20px;
}
/deep/ .ivu-card{
    text-align: left;
}
.size{
    width: 14px;
    height: 14px;
    border-radius: 7px;
    margin-right: 12px;
}
.disposition-treatment{
    margin-top: 29px;
}
.tl{
    // overflow: hidden;
    // overflow-y: auto;
    padding-top: 10px;
    padding-left: 163px;
}
.time-lines{
    // height: 100%;
    .tl;
}
.case-card{
    background: #FFFFFF;
    box-shadow: 0 0 8px 0 rgba(64,152,255,0.25);
    border-radius: 8px;
    border-radius: 8px;
    width: 100%;
    /deep/ .ivu-card:hover{
        box-shadow: none;
    }
    /deep/ .ivu-card-body{
        padding: 0 30px 45px 30px;
    }
    .item-number{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #6D7183;
        letter-spacing: 0.93px;
    }
    .circular1{
        background: #A876F9;
        .size;
    }
    .circular2{
        background: #FFA003;
        .size;
    }
    .circular3{
        background: #0AC7E6;
        .size;
    }
    &-title2{
        margin: 15px 0;
        height: 25px;
        line-height: 25px;
    }
    &-title{
        display: inline-flex;
        height: 28px;
        align-items: center;
        margin: 20px 0;
    }
    .specific-item{
        background: #FAFAFD;
        border-radius: 10px;
        border-radius: 10px;
        /deep/ .ivu-card-body{
            padding: 30px;
        }
        .card-item{
            margin-bottom: 20px;
        }
        .card-item, .card-item2{
            display: flex;
            align-items: center;
            .card-img{
                margin-right: 26px;
                width: 18px;
                height: 18px;
            }
            .card-img2{
                margin-right: 10px;
            }
            .card-text{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                display: inline-flex;
                align-items: center;
                color: #474C63;
                letter-spacing: 0.93px;
            }
        }
    }
}
/deep/ .ivu-card-head{
    p{
        height: 28px;
    }
}
</style>

