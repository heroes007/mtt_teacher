<template>
    <div class="score-detail" >
       <div class="score-titles">添加依据</div>
       <div v-if="type != 5&&scoreDetails" class="title"><HeightTitle :title="scoreDetails.name" /></div>
       <div v-if="isAdd" class="score-main">
           <div class="btns">
               <div>
                   <div v-for="(t,i) in seconds" :key="i">
                        <Button @click="openSeconds(i)" :class="secondNum == t.num ? 'act-dis-btn' : 'de-dis-btn'" class="dis-btn">
                           第{{t.num}}次诊疗                        
                           <Icon class="icons" :size="20" :type="t.open ? 'ios-arrow-down' : 'ios-arrow-forward'" />
                        </Button>
                        <div v-if="t.open">
                            <Button v-for="(it, l) in t.btns" :key="l + (i + 1)"  :class="it.active ? 'act-btn' : 'de-btn'" @click="getData(i, it.tab)">{{it.title}}</Button>
                        </div>
                   </div>
               </div>
           </div>
           <div class="score-content">
               <div v-if="list&&list.length>0" class="collapse">
                    <div v-for="(t,i) in list" :key="i" class="pane" :style="{'margin-bottom': t.show ? 0 : '12px'}">
                        <div class="item" @click="togg(t, i)">
                            <div class="item-title">{{t.talk_group || t.first_name}}</div>
                            <div class="right">
                                <img class="sel" :src="t.show ? selClose : selOpen" />
                            </div>
                        </div>
                        <div class="details" v-show="t.show">
                            <div class="content" v-if="t.chilrdren" v-for="(it, l) in t.chilrdren" :key="l" :disabled="it.is_exist" :class="setClass(it)">
                            <div class="content-detail" @click="add(t,it,i,l)">
                                <div class="content-left">
                                    <div class="ask">
                                        <div class="grey-regular4 topic">{{l+1}}、 <span v-if="tabs == 1">提问：</span>{{it[item1]}}</div>
                                    </div>
                                    <div v-if="tabs == 1" class="answer">
                                        <div class="answer-regular topic"><span v-if="tabs == 1">回答：</span>{{it[item2]}}</div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
               </div>
           </div>
       </div>
       <div class="operation-left-basiss" v-if="!isAdd">暂无依据</div>
       <div class="case-btn-box" v-if="type == 2&&isAdd || type == 3&&isAdd">
            <Button :disabled="isDisable" :class="isDisable ? 'disable-support' : 'active-support'" class="case-btn-last" @click="addSupport" type="primary">支持依据</Button>
            <Button :disabled="isDisable" class="case-btn" @click="addExclude" type="primary">排除依据</Button>
        </div>
    </div>
</template>

<script>
    import HeightTitle from '../../details-diagnosis/com/height-title'
    import selClose from '../../../../../../assets/img/case/sel-close.png'
    import selOpen from '../../../../../../assets/img/case/sel-open.png'
    let tabType = () => {
        return [
            { tab: 1, active: true, title: '问诊' } , 
            { tab: 2, active: false, title: '体格检查' },
            { tab: 3, active: false, title: '辅助检查' }
        ]
    }
    export default {
        components: {HeightTitle},
        props: {
            type: {
                type: String,  //1 问诊 2 体格检查 3 辅助检查 4 诊疗详情
                default: ''
            },
        },
        data() {
            return {
                diagnosisId: 0,
                scoreDetails: null, selOpen, selClose,
                activeItem1: null,
                activeItem2: null,
                activeId: 0,
                index1: 0,
                index2: 0,
                list: [],
                list1: [],
                list2: [],
                list3: [],
                tabs: 1,
                element_id: '',
                case_id: { case_id: +sessionStorage.getItem('CASEID') }, // 139
                secondNum: 1,
                seconds: [
                    // { num: 1, open: true, btns: tabType() },
                    // { num: 2, open: false, btns: tabType() },
                    // { num: 3, open: false, btns: tabType() },
                ],
            }
        },
        computed: {
            isAdd(){
                if(this.type == 5) return true
                if(this.type&&this.type <4 ) return this.scoreDetails&&this.scoreDetails.id
                else return false
            },
            item2(){
                return this.tabs == 1 ? 'answer' : this.tabs == 2 ? 'result_text' : ''
            },
            item1(){
                return this.tabs == 1 ? 'question' : (this.tabs == 2 || this.tabs == 3) ? 'third_name'  : ''
            },
            isDisable(){
                if(this.type == 2 || this.type == 3) return this.activeItem1&&this.activeItem2 ? false : true
                else false
            }
        },
        watch: {
            type(_new){
                this.tabs = 1;
                this.list = this.list1
            }
        },
        methods: {
            getDiagnoseFrequency(){
                PostData('case/getDiagnoseFrequency', this.case_id).then((r) => {
                    if(r.res_code == 1){
                        let d = []
                        if(r.data.length>0){
                            this.diagnosisId = r.data[0].id
                            r.data.map((t, i) => {
                                d.push({num: i + 1, open: i ? false : true, ...t, btns: tabType()})
                            })
                            this.seconds = d
                        }
                    }
                })
            },
            openSeconds(i){
                this.secondNum = i + 1
                this.seconds.map(( t, l ) => {
                    t.open = i === l ? !t.open : false
                    if(t.open&&i === l) {
                        this.diagnosisId = t.id
                        t.btns.map((it) => {
                            if(it.active) this.getData(i, it.tab, it)
                        })
                    }
                })
                this.getList(1)
            },
            setClass(it){
                if(it.is_exist) return 'disabled-content-detail'
                else return (it.id === this.activeId || it.first_id === this.activeId)  ? 'act-content' : 'de-content'
            },
            getListUrl(){
                return ['case/getTalkTreeForScore', 'case/getPhysicalFirstItemForScore', 'case/getAssistFirstItemForScore'][this.tabs - 1]
            },
            getTalkUrl(){
                return ['case/getTalkTreeForScore', 'case/getPhysicalResultListForScore', 'case/getAssistResultListForScore'][this.tabs - 1]
            },
            setDiagnosesItem(type = false){
                let d = this.scoreDetails
                return [{
                    case_diagnose_id: d.id,
                    basis_type: type ? 'SupportingBasis' : 'NonSupportingBasis',  // true 支持
                    weight: d.weight,
                }]
            },
            getCaseDiagnoses(bool){
                return this.type == 5 ? [] : this.setDiagnosesItem(bool)
            },
            addSupport(){
                this.allAdd(this.activeItem1, this.activeItem2, this.index1, this.index2, true)
            },
            addExclude(){
                this.allAdd(this.activeItem1, this.activeItem2, this.index1, this.index2, false)
            },
            allAdd(t, it, i, l, bool){
                if(t&&it){
                    if(this.tabs == 1) this.Interrogation(t, it, i, l, bool)
                    if(this.tabs == 2) this.physicalExam(t, it, i, l, bool)
                    if(this.tabs == 3) this.supplementaryExam(t, it, i, l, bool)
                }else this.$Message.info('请选择依据！');
            },
            add(t, it, i, l){
                if(it.is_exist) this.$Message.info('依据已存在！');
                else{
                    this.activeItem1 = t;
                    this.activeItem2 = it;
                    this.index1 = i
                    this.index2 = l
                    if(this.type == 1 || this.type == 5) {
                        this.allAdd(t, it, i, l, true)
                    }
                    this.activeId = it.id || it.first_id
                }
            },
            addSuccess(t, it, i, l, r, bool){
                this.$Message.success(r.msg);
                this.activeItem1 = null;
                this.activeItem2 = null;
                this.activeId = 0;
                let d1 = t
                let d = d1.chilrdren[l]
                if(d.is_exist === 0) d.is_exist = 1
                this.list.splice(i, 1, d1)
                if(this.type == 2 || this.type == 3){
                    let da = bool ? 'supported' : 'unsupported'
                    $CaseSuccessfulOperation.$emit('CaseSuccessfulOperation', this.element_id, it.id, da)
                }else $CaseSuccessfulOperation.$emit('CaseSuccessfulOperation', this.element_id, it.id)
            },
            supplementaryExam(t, it, i, l, bool){
                let d = it;
                d.assist_id = it.id
                d.item_type = this.type == 5 ? 3 : 1
                d.case_diagnoses = this.getCaseDiagnoses(bool)
                d.action_type = 'add'
                PostData('case/operateAssistBasis',{...d, frequency_id: this.diagnosisId}).then((r) => {
                    if(r.res_code == 1) this.addSuccess(t, it, i, l, r, bool)
                })
            },
            physicalExam(t, it, i, l, bool){
                let d = it;
                d.physical_id = it.id
                d.case_diagnoses = this.getCaseDiagnoses(bool)
                d.item_type = this.type == 5 ? 3 : 1
                d.action_type = 'add'
                PostData("case/operatePhysicalBasis", {...d, frequency_id: this.diagnosisId}).then((r) => {
                    if(r&&r.res_code == 1){
                        this.addSuccess(t, it, i, l, r, bool)
                    }
                })
            },
            Interrogation(t, it, i, l, bool){
                let da = {
                    ...this.case_id,
                    talk_group: t.talk_group,
                    question: it.question,
                    talk_id: it.id,
                    frequency_id: this.diagnosisId
                }
                let d = {
                    ...da,
                    answer: it.answer,
                    case_diagnoses: this.getCaseDiagnoses(bool),
                    question_index: it.question_index,
                    // element_id: t.id,
                    item_type: this.type == 5 ? 3 : 1,
                    deduct_reason : '',
                    deduct_weight: null,
                    action_type: 'add'
                }
                PostData('case/isExistBasis',da).then((r) => {
                    if(r&&r.res_code == 1) {
                        PostData('case/operateTalkBasis', d).then((r) => {
                            if(r.res_code == 1) this.addSuccess(t, it, i, l, r, bool)
                        })
                    }
                })
            },
            setToggData(t){
                let types = ['PrincipalDiagnosis','SecondaryDiagnosis','DifferentialDiagnosis', '', 'deduction']
                let d = {
                    ...this.case_id,
                    treat_type: types[this.type - 1],
                    case_diagnose_id: this.scoreDetails&&this.scoreDetails.id || null
                 }
                 let d1 = { talk_group: t.talk_group }
                 let d2 = { first_id: t.first_id }
                 return this.tabs == 1 ? {...d,...d1} : {...d,...d2}
            },
            togg(t, i, bool = false){
                let d = this.setToggData(t)
                if(!t.show){
                    PostData(this.getTalkUrl(), {...d, frequency_id: this.diagnosisId}).then((r) => {
                        let da = t;
                        da.show = bool ? bool : !t.show;
                        da.chilrdren = r.data;
                        this.list.splice(i,1,da)
                    })
                }else {
                    t.show = bool ? bool : !t.show;
                    this.list.splice(i,1,t)
                }
            },
            getList(n){
                if(this.getListUrl()){
                    PostData(this.getListUrl(), {...this.case_id, frequency_id: this.diagnosisId}).then((r) => {
                        if(r&&r.data){
                            let d = r.data
                            if(d&&d.length>0) d.map((t, i) => { t.show = false })
                            if(n) this['list'+n] = d;
                            this.list = d;
                        }
                    })
                }
            },
            getData(i, n, ts){
                this.tabs = n;
                let t = this.seconds[i];
                t.btns.map((it, l) => {
                    it.active = l === (n - 1)
                })
                this.seconds.splice(i, 1, t)
                if(this['list'+n]&&this['list'+n].length>0) this.list = this['list'+n]
                else this.getList(n)
            },
            setInit(t){
                this.seconds.map((t) => {
                    if(t.num == this.secondNum) t.btns = tabType()
                })
                this.element_id = t&&t.id
                this.scoreDetails = t
                if(timer) clearTimeout(timer)
                let timer = setTimeout(() => {
                    this.getList(1)
                    clearTimeout(timer)
                }, 200);
            }
        },
        beforeDestroy () {
            $CaseScoreDetails.$off('CaseScoreDetails', this.setInit)
        },
        mounted() {
            this.getDiagnoseFrequency()
            $CaseScoreDetails.$on('CaseScoreDetails', this.setInit)
        },
    }
</script>

<style lang="less" scoped>
    .disabled-content-detail{
        background-color: #f3f3f3;
        &:hover{
             background-color: #f3f3f3;
        }
    }
    .operation-left-basiss{
        height: 150px;
        line-height: 150px;
    }
    .score-titles{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
        height: 49px;
        width: inherit;
        line-height: 49px;
        text-align: center;
        border-bottom: 1px solid #f0f0f7;
    }
    .score-content{
        flex: 1;
        border-left: 1px solid #F0F0F7;
        height: inherit;
        overflow: hidden;
        overflow-y: auto;
    }
    .asks{
        padding: 2px;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        border-radius: 3px;
        border-radius: 3px;
        margin-right: 10px;
    }
    .act-content{
        background-color: rgba(235,244,255,0.5);
    }
    .de-content{
        background-color: #fff;
        &:hover{
            background-color: rgba(235,244,255,0.5);
        }
    }
    .topic{
        line-height: 18px;
        text-align: left;
    }
    .collapse{
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .btn1{
        width: 110px;
        height: 40px;
        font-size: 14px;
        border: none;
        border-radius: 0px
    }
    .pane{
        width: 100%;
        background-color: #fff;
        .item{
            width: 100%;
            height: 40px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            padding: 0 20px;
            background: #FAFAFC;
            cursor: pointer;
            .edit{
                width: 14px;
                height: 14px;
                margin-right: 10px;
            }
            .item-title{
                flex: 1;
                text-align: left;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #474C63;
            }
            .right{
                width: 51px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
                .close{
                    font-size: 14px;
                    color: #4098FF;
                }
                .open{
                    font-size: 14px;
                    color: #9397AD;
                }
                .sel{
                    width: 9px;
                    height: 6px;
                    margin-left: 5px;
                }
            }
        }
        .details{
            width: 100%;
            .content{
                padding: 15px 20px 11px 20px;
                border-top: 1px solid #F0F0F7;
                cursor: pointer;
                .content-detail{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .content-left{
                        flex: 1;
                        .ask{
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            .problem{
                                .asks;
                                color: #4098FF;
                                background-color: rgba(64,152,255,0.15);
                            }
                        }
                        .answer{
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            margin-top: 8px;
                            .answer-view{
                                .asks;
                                color: #FF9509;
                                background-color: rgba(255,149,9,0.15);
                            }
                            .answer-regular{
                                font-size: 14px;
                                color: #9397AD;
                            }
                        }
                    }
                }
            }
        }
    }
    .score-detail{
        height: 648px;
        width: 500px;
        background-color: #fff;
        position: relative;
        .title{
            margin-left: 20px;
        }
        .score-main{
            display: flex;
            flex-direction: row;
            height: 504px;
            .btns{
                width: 110px;
                display: flex;
                flex-direction: column;
                height: inherit;
                .act-dis-btn{
                    background-color: #4098FF;
                    color: #fff;
                }
                .de-dis-btn{
                    background-color: #F0F0F7;
                    color: #9397AD
                }
                .dis-btn{
                    .btn1;
                    box-shadow: none !important;
                    border-bottom: 1px solid rgba(121, 121, 121, 1);
                    position: relative;
                }
                .act-btn{
                    .btn1;
                    background-color:#4098FF;
                    color: #fff;
                    box-shadow: 0 0 5px 0 rgba(64,152,255,0.40);
                }
                .de-btn{
                    .btn1;
                    background-color: #F0F0F7;
                    color: #9397AD;
                    box-shadow: none;
                }
            }
        }
    }
    .case-btn-box{
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 0;
        margin-left: 120px;
        .disable-support{
            color: #c3cbd6;
            background-color: #f7f7f7;
        }
        .active-support{
            background-color: #fff;
            color: #4098ff;
        }
        .case-btn-last{
            width: 120px;
            height: 36px;
        }
        .case-btn{
            width: 120px;
            height: 36px;
            margin-left: 20px;
        }
    }
</style>
