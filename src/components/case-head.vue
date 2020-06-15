<template>
    <div class="case-head">
        <ScoringModal v-if="type==1&&state==2" :fraction="fraction" :showModal="showModal" @close="close" @confirm="confirm"  />
        <div v-if="back" class="back" @click="goBack">返回上一页</div>
        <div class="case-head-pers" @click="seePatientInfo">
            <div style="display: table-caption">
                <img class="case-head-img" :src="headImg ? headImg : 'http://sfile.9mededu.com/production/20191114131117.png'" alt="头像" />
            </div>
            <div v-if="isPersonal" class="personal-data">个人资料</div>
        </div>
        <div class="head-details" v-if="isShowBtn">
            <p class="head-details-title"><span class="white-regular2 head-details-t1">{{patientData.patient_division}}</span><span class="white-regular1">{{patientData.symptom}}</span></p>
            <p class="white-regular3 head-details-per"><span>{{patientData.patient_name}}</span><span class="head-details-per2">{{$config.setSex(patientData.patient_gender)}} | {{patientData.patient_age}} | {{patientData.patient_nation}}</span></p>
        </div>
        <div class="head-details" v-if="isPersonal">
            <p v-if="type" class="head-details-title white-medium2">{{patientData.realname}}的{{title}}{{typeTit}}</p>
            <div v-else class="head-details-title2 white-medium2">{{patientData.realname}} 
                <img v-if="handleSex" :src="handleSex" />
                <!-- <span v-else >未知</span> -->
            </div>
            <p class="head-details-per" v-if="isShowTitle">
                <span class="white-regular4">{{title}}用时：{{patientData.use_time}}</span>
            </p>
            <div style="display: flex; text-align: left" v-if="!type">
                <div>
                    <p class="head-details-type">用户ID：{{patientData.user_id}}</p>
                    <p class="head-details-type">年级/班级：{{patientData.grade_name}}</p>
                    <p class="head-details-type">科室：{{patientData.dept_name}}</p>
                </div>
                <div style="margin-left: 40px">
                    <p class="head-details-type">类型：{{patientData.student_type}}</p>
                    <p class="head-details-type">证件号：{{patientData.id_num}}</p>
                    <p class="head-details-type">注册时间：{{patientData.create_time}}</p>
                </div>
            </div>
            <!-- <p class="head-details-per details-item" v-if="!type">
                <span class="head-details-type">证件类型：</span><span class="white-regular4">{{$config.getIdType(patientData.id_type)}}</span>
            </p> -->
        </div>
        <div class="head-right" v-if="isTrainees">
            <p class="white-regular5">数据统计截止日期：{{newDates}}</p>
            <div class="rigth-item">
                <div>
                    <p class="white-medium1">{{patientData.case_count}}<span class="white-medium3">个</span></p>
                    <p class="white-regular3">完成病例</p>
                </div>
                <div class="rigth-item-num">
                    <p class="white-medium1">{{patientData.count}}<span class="white-medium3">次</span></p>
                    <p class="white-regular3">完成次数</p>
                </div>
            </div>
        </div>
        <!-- 练习评分 -->
        <div class="practice-scoring" v-if="type==1&&state==2">
            <p class="white-regular3" style='text-align: right'>
                <!-- <span>得分项：<span class="white-medium3">{{rightCount}}个</span>/{{answerCount}}个</span> -->
                <span class="item2">辅检费用：<span class="white-medium3">¥{{studentCost}}</span>/¥{{rightCost}}</span>
            </p>
            <div class="practice-fraction">
                <span class="white-regular3">评分</span>
                <InputNumber class="fraction" :max="100" :min="0" v-model="fraction"></InputNumber>
                <Button class="fraction-btn" @click="confirmFraction" type="primary">确定</Button>
            </div>
        </div>
        <!-- 考试/作业评分说明 -->
        <ScoreCescription  v-if="isScore" :title="title" :showModal="showCescriptionModal" @close="closeCescriptionModal" />
        <div class="head-right" v-if="isScore">
           <p class="white-regular5 score-description" @click="description"><img class="score-description-img" src="../assets/case/score-description.png" />评分说明</p>
           <div class="rigth-item">
                <div>
                    <p ><span class="white-medium5">{{patientData.complate_case_count}}个</span><span class="white-regular6">/{{patientData.case_count}}个</span></p>
                    <p class="white-regular3">考试病例</p>
                </div>
            </div>
        </div>
        <div v-if="isReports" class="reports-right">
            <div class="item" v-for="(t,i) in rightList" :key="i" v-if="t.title!=='得分项'">
                <p><span class="white-medium5">{{t.num1}}</span><span class="white-regular6">{{t.num2}}</span></p>
                <p class="white-regular3 title">{{t.title}}</p>
            </div>
        </div>
        <Button class="btn" v-if="isShowBtn" @click="seePatientInfo" type="primary">查看患者信息</Button>
    </div>
</template>
<script>
import ScoringModal from './scoring-modal.vue'
import ScoreCescription from './score-cescription.vue'
import postData from 'src/api/postData'
import female from '../assets/icons/icon/sex/female.png'
import male from '../assets/icons/icon/sex/male.png'
const NUM = { type: Number, default: 0 }
export default {
    components: { ScoringModal, ScoreCescription },
    data() {
        let typeTitle = this.type == 1 ? '练习' : this.type == 2 ? '考试' : this.type == 3 ? '作业' : '学习'
        let practiceList = [ {num1: '0个', num2: '/0个', title: '得分项'},{num1: '¥0', num2: '/¥0', title: '辅检费用'},]
        let d = this.state == 1 && this.type == 1 ? practiceList : [{num1: '0个', num2: '/0个', title: typeTitle + '病例'}]
        let score = this.scoreState ? {num1: '0分', num2: '/100分'} : {num1: '未评分', num2: '/100分'}
        return {
            rightList: [{...score, title: '个人得分'},...d],
            fraction: 0,
            showModal: false,
            showCescriptionModal: false
        }
    },
    props: {
        studentCost: NUM,
        rightCost: NUM,
        rightCount: NUM,
        answerCount: NUM,
        examState: NUM,
        doStates: {},
        scoreState: {},
        patientData: {
            type: Object,
            default: {}
        },
        type: NUM,
        state: NUM,
        back: {
            type: Object,
            default: null
        }
    },
    watch:{
        answerCount(_new){
           let c = Math.round(this.rightCount/this.answerCount*100)
           this.fraction = (Number.isNaN(c) || c < 0) ? 0 : c;
            if(this.type==1&&this.state==1){
               if(this.scoreState)  this.rightList[0].num1 = this.$route.query.score || 0 + '分'
               this.rightList[1].num1 = this.rightCount + '个'
               this.rightList[1].num2 = '/' + this.answerCount + '个'
               this.rightList[2].num1 = '¥' + this.studentCost
               this.rightList[2].num2 = '/¥' + this.rightCost
            }
        },
        patientData(_new){
            if((this.type==2 || this.type==3)){
               if(this.state==1){
                    if(this.scoreState) this.rightList[0].num1 = this.patientData.score || 0 + '分'
                    this.rightList[1].num1 = this.patientData.complate_case_count + '个'
                    this.rightList[1].num2 = '/' + this.patientData.case_count + '个'
               }
            }
        },
    },
    created(){
        this.numInits()
    },
    computed: {
        handleSex(){
            return this.patientData.sex == 1 ? male: this.patientData.sex === 0 ? female : ''
        },
        isScore(){
            return (this.type==2 || this.type==3)&&this.state==2&&this.examState==2
        },
        isShowTitle(){
           if(this.doStates) return this.type == 1 ? true : ((this.type == 2 || this.type == 3) && this.examState == 2) ? true : false
           return false
        },
        newDates(){
            return this.$config.formatTime(new Date())
        },
        headImg(){
            return this.patientData.hasOwnProperty('img_url') ? this.patientData.img_url : this.patientData.patient_head_portrait_url
        },
        isShowBtn(){
            return this.$route.name == 'view-cases'
        },
        isPersonal(){
            let d = ['view-reports', 'view-trainees']
            return d.includes(this.$route.name)
        },
        isTrainees(){
            let arr = ['view-trainees']
            return  arr.includes(this.$route.name)
        },
        isReports(){
            return this.$route.name == 'view-reports'&&this.state==1
        },
        typeTit(){
            return this.type ? this.$route.query.back=='view-trainees' ? '成绩报告' : '报告' : '记录'
        },
        title(){
            return this.type == 1 ? '练习' : this.type == 2 ? '考试' : this.type == 3 ? '作业' : '学习'
        },
        scoreUrl(){
            return this.type == 1 ? 'exercise/giveMark' : this.type == 2 ? '' : this.type == 3 ? '' : ''
        }
    },
    methods: {
        numInits(){
            if(!this.scoreState){
                this.rightList[0].num1 = '未评分'
                this.rightList[0].num2 = '/100分'
            }
        },
        description(){
            this.showCescriptionModal = true
        },
        closeCescriptionModal(){
            this.showCescriptionModal = false
        },
        seePatientInfo(){
            this.$emit('seePatientInfo')
        },
        goBack(){
           this.$router.replace(this.back)
        },
        confirmFraction(){
            this.showModal = true
        },
        setQuerydata(d){
            let str = ''
            let len = Object.keys(d).length
            for(let i in d){
                str += i + '=' +d[i] + '&'
            }
            return str
        },
        confirm(){
            this.close()
            postData(this.scoreUrl,{id: +this.$route.query.id,score: this.fraction}).then((res) => {
                if(res.res_code==1) {
                    this.$Message.success('评分成功！');
                    let d = this.$route.query
                    d.state = '1'
                    d.score = this.fraction
                    d.score_state = '1'
                    let str = this.setQuerydata(d)
                    let str2 = str.slice(0,str.length-1)
                    window.location.href = 'dashboard/'+this.$route.name + '?' + str2
                }
            })
        },
        close(){
            this.showModal = false
        }
    }
}
</script>
<style lang="less" scoped>
    .head-details-type{
        color: #fff;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        margin-top: 2px;
    }
    .score-description{
        display: flex;
        align-items: center;
        .score-description-img{
            width: 16px;
            height: 16px;
            margin-right: 10px;
        }
    }
    .case-head{
        width: 100%;
        height: 170px;
        background: url('../assets/case/bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        padding: 50px 100px 0 100px;
        display: inline-flex;
        position: relative;
        cursor: pointer;
        .back{
            width: 110px;
            height: 38px;
            position: absolute;
            cursor: pointer;
            top: 20px;
            left: 0;
            background: #4098FF;
            border-radius: 0 82px 82px 0;
            line-height: 38px;
            color: #fff;
        }
        &-pers{
            width: 153px;
            height: 153px;
            border-radius: 76.5px;
            border: 4px solid #FFFFFF;
            box-shadow: 0 2px 10px 0 rgba(14,21,59,0.25);
            z-index: 555;
            &:hover{
                .personal-data{
                    display: block;
                }
            }
            .case-head-img{
                width: 145px;
                height: 145px;
                border-radius: 73px;
            }
            .personal-data{
                position: absolute;
                display: none;
                text-align: center;
                top: 166px;
                left: 115px;
                width: 125px;
                height: 33px;
                line-height: 30px;
                background: url('../assets/case/head-pers.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                color: #fff;
                z-index: 666;
            }
        }
        .head-details{
            margin-left: 40px;
            .head-details-title{
                margin-bottom: 17px;
                text-align: left;
            }
            .head-details-title2{
                margin-bottom: 10px;
                text-align: left;
            }
            .head-details-t1{
                padding: 2px 10px;
                background: #35407C;
                border-radius: 2px;
                border-radius: 2px;
                margin-right: 20px;
            }
            .head-details-per{
                text-align: left;
                .head-details-per2{
                   margin-left: 20px;
                }
            }
            .details-item{
                margin-top: 8px;
            }
        }
        .btn{
            width: 140px;
            height: 40px;
            background: #4098FF;
            border-radius: 4px;
            border-radius: 4px;
            position: absolute;
            right: 120px;
            top: 65px;
        }
        .head-right{
            position: absolute;
            right: 50px;
            top: 20px;
            padding-bottom: 29px;
            .rigth-item{
                display: flex;
                margin-top: 29px;
                .rigth-item-num{
                    margin-left: 80px;
                }
            }
        }
        .reports-right{
            position: absolute;
            right: 40px;
            top: 64px;
            padding-bottom: 43px;
            display: flex;
            .item{
                margin-right: 60px;
                .title{
                    margin-top: 13px;
                }
            }
        }
        .practice-scoring{
            position: absolute;
            right: 100px;
            top: 41px;
            display: flex;
            flex-direction: column;
            p{
                .item2{
                    margin-left: 20px;
                }
            }
            .practice-fraction{
                display: inline-flex;
                height: 40px;
                align-items: center;
                margin-top: 26px;
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
    }
    /deep/ .ivu-input-number-input{
        text-align: center;
    }
</style>


