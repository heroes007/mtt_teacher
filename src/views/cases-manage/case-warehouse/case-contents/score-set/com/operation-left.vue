<template>
    <div class="operation-main" :style="{height: '594px'}">
       <div class="score" v-if="type&&type < 4">
            {{title[type - 1]}}：
            <div class="diagnose-score-title">分值</div>
            <InputNumber @on-change="editScoreLeft" v-model="score1" class="diagnose-score-input" :min="0" :max="100"/>
            <span class="diagnose-score-hint">分</span>
            <div class="right"><span>{{title2[type - 1]}}：{{score2}}分</span><span class="score-text">{{title3[type - 1]}}：{{score3}}分</span></div>
       </div>
       <div v-if="type&&type == 4" class="dia-num">
            <Button @click="selSecond(t, i)" :class="secondNum == i ? 'act-dia-btn' : 'de-dia-btn'" class="dia-btn" v-for="(t, i) in seconds" :key="i">第{{t.num}}次诊疗</Button>
       </div>
       <div v-if="list&&list.length>0&&type<5&&!loading" class="collapse">
            <div v-for="(t,i) in list" :key="i" class="pane" :style="{'margin-bottom': t.show ? 0 : '12px'}">
                <div class="item" @click="scoreDetails(t, i)">
                    <div :class="type == 4 ? 'item-title4' : 'item-title'"><span v-if="type != 4">{{i+1}}、</span>{{t.name}} <span v-if="type == 4">（{{t.count}}）</span></div>
                    <div v-if="type != 4" class="diagnosis-weight"><RateStar stops @setStar="setWeight1(t, $event, i)" :weight="t.weight"/></div>
                    <div class="right">
                        <span :class="t.show ? 'close' : 'open'">{{t.show ? '收起' : '展开'}}</span>
                        <img class="sel" :src="t.show ? selClose : selOpen" />
                    </div>
                </div>
                <div class="details" v-show="t.show">
                    <div class="operation-left-basiss" v-if="type != 4 &&t.chilrdren&&t.chilrdren.length">支持依据（{{t.chilrdren.length}}）</div>
                    <div class="operation-content" v-if="t.chilrdren" @click="edit(t,i,it,l, 'supported')" v-for="(it, l) in t.chilrdren" :key="l" :class="actvieClass(it)">
                       <div class="content-detail">
                            <div class="content-left">
                                <div class="ask">
                                    <div class="grey-regular4 topic">{{it[item1]}}</div>
                                </div>
                            </div>
                            <div class="diagnosis-weight"><RateStar @setStar="setWeight2(t, i, it, l, $event, true)" :weight="it.weight"/></div>
                            <div @click.stop="deletes(t,it,i)" class="deletes"><Icon :size="20" type="ios-trash" /></div>
                       </div>
                       <div class="term-item">
                           <div :class="'term-type'+it.item_type" v-if="isTerm()&&it.item_type">
                           {{types[it.item_type - 1]}} <span v-if="type==2&&isTerm()">（{{it.use_count}}）</span>
                           </div>
                        </div>
                    </div>
                    <div class="operation-left-basiss" v-if="noChilrdren(t)">暂无依据</div>
                    <div class="operation-left-basiss" v-if="t.chilrdren2&&t.chilrdren2.length&&type!=2">排除依据（{{t.chilrdren2.length}}）</div>
                    <div class="operation-content" v-if="t.chilrdren2&&type!=2" @click="edit(t,i,it,l, 'unsupported')" v-for="(it, l) in t.chilrdren2" :key="l + 200" :class="actvieClass(it)">
                       <div class="content-detail">
                            <div class="content-left">
                                <div class="ask">
                                    <div class="grey-regular4 topic">{{it[item1]}}</div>
                                </div>
                            </div>
                            <div class="diagnosis-weight"><RateStar @setStar="setWeight2(t, i, it, l, $event, false)" :weight="it.weight"/></div>
                            <div @click.stop="deletes(t,it,i)" class="deletes"><Icon :size="20" type="ios-trash" /></div>
                       </div>
                       <div class="term-item">
                           <div :class="'term-type'+it.item_type" v-if="isTerm()&&it.item_type">
                           {{types[it.item_type - 1]}} <span v-if="type==2&&isTerm()">（{{it.use_count}}）</span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
       </div>
       <!-- <div class="loadings" v-if="loading">正在加载...</div> -->
       <div v-if="type == 5&&list.length>0" class="deduction-item">
       <div class="operation-content" @click="deductionEdit(it,l)" v-for="(it, l) in list" :key="l + 200" :class="it.content&&it.content.id === activeId ? 'act-content' : 'de-content'">
            <div class="content-detail">
                <div class="content-left">
                    <div class="ask">
                        <div class="grey-regular4 topic">{{it[item1]}}</div>
                    </div>
                </div>
                <div class="diagnosis-weight"><RateStar @setStar="deductionSetWeight(it, l, $event)" :weight="it.weight"/></div>
                <div @click.stop="deletes(null,it,l)" class="deletes"><Icon :size="20" type="ios-trash" /></div>
            </div>
            <div class="term-item">
                <div :class="'term-type'+it.item_type" v-if="isTerm()&&it.item_type">
                {{types[it.item_type - 1]}} <span v-if="type==2&&isTerm()">（{{it.use_count}}）</span>
                </div>
            </div>
        </div>
        </div>
        <div class="operation-no" v-if="!list || list.length == 0">
            暂无数据
        </div>
    </div>
</template>

<script>
    import selClose from '../../../../../../assets/img/case/sel-close.png'
    import selOpen from '../../../../../../assets/img/case/sel-open.png'
    import RateStar from '../../../../../../components/rate-star'
    export default {
         props: {
            typePane: {
                type: String,
                default: ''
            },
            pane: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            },
        },
        components: { RateStar },
        data() {
            return {
                seconds: [],
                title: ['主要诊断','次要诊断','鉴别诊断'],
                title2: ['次要诊断','主要诊断','主要诊断'],
                title3: ['鉴别诊断','鉴别诊断','次要诊断'],
                score1: 0,
                score2: 0,
                score3: 0,
                types: ['诊断依据','干扰项','减分项'],
                typeTit: ['问诊','查体','辅检','诊疗'],
                selClose,selOpen,
                activeId: 0,
                case_id: { case_id: +sessionStorage.getItem('CASEID') }, // 139
                list: [],
                supports: '',
                loading: true,
                times: null,
                secondNum: 0,
            }
        },
        watch: {
            type(_new){
                this.getList()
                if(_new < 4) this.getScore()
            }
        },
        computed: {
            item1(){
                return  this.type == 4 ? 'content' : 'name'
            },
        },
        methods: {
            getDiagnoseFrequency(){
                PostData('case/getDiagnoseFrequency', this.case_id).then((r) => {
                    if(r.res_code == 1){
                        let d = []
                        if(r.data.length>0){
                            this.diagnosisId = r.data[0].id
                            r.data.map((t, i) => {
                                d.push({num: i + 1, open: i ? false : true, ...t})
                            })
                            this.seconds = d
                        }
                    }
                })
            },
            selSecond(t, i){
                sessionStorage.setItem("FrequencyId", t.id)
                this.secondNum = i
                this.getList()
            },
            actvieClass(it){
                let d = this.type == 4 ? it.id : it.content.id
                return d === this.activeId ? 'act-content' : 'de-content'
            },
            noChilrdren(t){
                if(this.type == 1 || this.type == 4) return t.chilrdren&&t.chilrdren.length == 0
                else return t.chilrdren&&t.chilrdren.length == 0 && t.chilrdren2&&t.chilrdren2.length == 0
            },
            changeWeight(url, d, t, weight, i){
                PostData('case/' + url, d).then((r) => {
                    if(r&&r.res_code == 1) {
                        let da = t;
                        da.weight = weight;
                        $CaseScoreWeight.$emit('CaseScoreWeight', weight)
                        this.list.splice(i, 1, da)
                        this.$Message.info(r.msg);
                    }
                })
            },
            setWeight1(t, weight, i){
                let d = { id: t.id, weight}
                this.changeWeight('setDiagnoseWeight', d, t, weight, i)
            },
            deductionSetWeight(it, l, weight){
                let type = this.type < 4 ? 'basis' : it.type == 'treat' ? 'nursing' : it.type
                let d = {
                    id: it.content.id,
                    basis_id: it.content.id,
                    weight,
                    type: 'deduction',
                    basis_type: type
                }
                this.changeWeight('setBasisWeight', d, it, weight, l)
            },
            setWeight2(t, i, it, l, weight, support){
                let type = this.type < 4 ? 'basis' : it.type == 'treat' ? 'nursing' : it.type
                let d = {
                    id: this.type < 4 ? t.id : it.id,
                    basis_id: this.type < 4 ? it.content.basis_id : it.id,
                    weight,
                    type,
                }
                PostData('case/setBasisWeight', d).then((r) => {
                    if(r&&r.res_code == 1) {
                        let da = t;
                        if(support) da.chilrdren[l].weight = weight
                        else da.chilrdren2[l].weight = weight
                        $CaseScoreWeight.$emit('CaseScoreWeight', weight)
                        this.list.splice(i, 1, da)
                        this.$Message.info(r.msg);
                    }
                })
            },
            editScoreLeft(score){
                let allScore = this.score1 + this.score2 + this.score3
                this.times&&clearTimeout(this.times)
                this.times = setTimeout(() => {
                    if(allScore == 100){
                        if(score || score === 0) {
                            let arr = ['PrincipalDiagnosis','SecondaryDiagnosis','DifferentialDiagnosis']
                            let d = {
                                ...this.case_id,
                                type: arr[this.type - 1],
                                score
                            }
                            PostData('case/setScore', d).then((r) => {
                                if(r&&r.res_code == 1) {
                                    this.getScore()
                                    this.$Message.info('评分成功！');
                                }
                            })
                        }
                    }else  this.$Message.info('限制诊断总分一共为100分');
                }, 200);
            },
            isTerm(){
                return this.typePane&&this.typePane == 'term'
            },
            getTalkUrl(){
                let url1 = 'case/getListByDiagnoseId'
                return [url1,url1,url1,url1][this.type - 1]
            },
            scoreDetails(t, i){
                if(i === 0 || i > 0) this.togg(t, i)
                this.$emit('changeState', true)
                $CaseScoreDetails.$emit('CaseScoreDetails',t)
            },
            deductionEdit(it, l){
                this.activeId = it.content.id
                this.$emit('changeState', false)
                $CaseEdit.$emit('CaseEdit', null, it, 'deduction')
            },
            edit(t,i,it,l,type){
                setTimeout(() => {
                    this.supports = type
                    this.activeId = this.type == 4 ? it.id : it.content.id
                    this.$emit('changeState', false)
                    $CaseEdit.$emit('CaseEdit', t, it, type)
                }, 100)
            },
            delteUrl(t){
                if(this.type&&this.type<4 || this.type == 5){
                    let obj = {'talk' : 'removeTalkBasis','physical' : 'removeBasis','assist' : 'removeAssistBasis'}
                    return obj[t.type]
                }
                if(this.type == 4) return 'removeTreat'
            },
            deletes(t, it, i){
                let d = {
                    id: it.content.id || it.id,
                    ...this.case_id,
                    question_index: it.question_index
                }
                if(this.type == 4) d.type = it.type == 'treat' ? 'nursing' : it.type
                this.$Modal.confirm({
                    title: '你确认要删除吗？',
                    content: '<p>删除后列表里的所选数据将被清空。</p>',
                    onOk: () => {
                        PostData('case/' + this.delteUrl(it), d).then((r) => {
                            if(r&&r.res_code == 1) {
                              if(this.type<5)  this.togg(t, i, true)
                              if(this.type == 5) this.getList()
                            }
                        })
                    },
                    onCancel: () => {}
                });
            },
            setToggData(t, type){
                let d1 = {
                    ...this.case_id,
                    case_diagnose_id: t.id,
                    type,
                }
                return d1
            },
            togg4(t, i, bool){
                let d ={type: t.type == 'treat' ? 'nursing' : t.type,...this.case_id, score_type: 2, frequency_id: +sessionStorage.getItem("FrequencyId")}
                PostData('case/getListByType',d).then((r) => {
                    let da = t;
                    da.show = bool ? bool : !t.show;
                    da.chilrdren = r.data;
                    this.list.splice(i,1,da)
                    this.loading = false
                })
            },
            hide(d){
                this.list.map( t => {
                    if(t != d) t.show = false
                })
            },
            togg(t, i, bool = false, idx){
                this.hide(t)
                console.log(t,'pp')
                if(!t.show || bool){
                    if(this.type && this.type < 4) {
                        let d1 = this.setToggData(t, 'SupportingBasis')
                        let d2 = this.setToggData(t, 'NonSupportingBasis')
                        PostData(this.getTalkUrl(),d1).then((r) => {
                            let da = t;
                            if(this.type == 1) da.show = bool ? bool : !t.show;
                            da.chilrdren = r.data;
                            this.list.splice(i,1,da)
                            if(this.type == 1)  {
                                this.loading = false
                                if(idx) this.activeId = idx
                            }
                        })
                        if(this.type != 1){
                            PostData(this.getTalkUrl(),d2).then((r) => {
                                let da = t;
                                da.show = bool ? bool : !t.show;
                                da.chilrdren2 = r.data;
                                this.list.splice(i,1,da)
                                this.loading = false
                            })
                        }
                    }
                    if(this.type == 4) this.togg4(t, i, bool)
                }else {
                    t.show = bool ? bool : !t.show;
                    this.list.splice(i,1,t)
                }
            },
            supportsTogg(t, i, supports, idx){
                let d1 = this.setToggData(t, 'SupportingBasis')
                let d2 = this.setToggData(t, 'NonSupportingBasis')
                let d = supports == 'supported' ? d1 : supports == 'unsupported' ? d2 : null
                let name = supports == 'supported' ? 'chilrdren' : supports == 'unsupported' ? 'chilrdren2' : null
                if(d&&name){
                    PostData(this.getTalkUrl(), d).then((r) => {
                        let da = t;
                        da.show = !t.show;
                        da[name] = r.data;
                        this.list.splice(i,1,da)
                        if(idx) this.activeId = idx
                    })
                }
            },
            getList(bool = false, idx){
                let tab_type = ['PrincipalDiagnosis','SecondaryDiagnosis','DifferentialDiagnosis','treat', 'deduction'][this.type - 1]
                let d = this.type == 4 ? {score_type: 2, frequency_id: +sessionStorage.getItem("FrequencyId")} : {}
                PostData('case/getFirstListByTab',{...d, ...this.case_id, tab_type}).then((r) => {
                    if(r&&r.data){
                        this.list = r.data;
                        this.list.map((t, i) => {
                            t.show = false
                            t.chilrdren = []
                            t.chilrdren2 = []
                        })
                        if(this.type == 5) {
                            this.loading = false
                            if(bool&&idx) this.activeId = idx
                        }
                        if(this.type <4 ){
                            if(this.list&&this.list.length>0){
                                this.scoreDetails(this.list[0])
                                this.togg(this.list[0], 0)
                            }else this.scoreDetails(null)
                        }
                        if(this.type == 4)  {
                          if(this.list&&this.list.length>0)  this.togg(this.list[0], 0)
                        }
                        if(!bool){
                            if(this.type == 5) {
                                this.$emit('changeState', true)
                                $CaseScoreDetails.$emit('CaseScoreDetails', null)
                            }
                        }
                        if(!r.data&&r.data.length == 0) this.loading = false
                    }
                })
            },
            refreshData(id, idx, supports){
                if(this.type == 5) this.getList(true, idx)
                else{
                    this.list.map((t, i) => {
                        t.show = false
                        if(this.type < 5) {
                            let name = this.type == 4 ? 'type' : 'id'
                            if(id && t[name] == id) {
                                supports = supports || this.supports
                                if(this.type == 2&&supports || this.type == 3&&supports ){
                                    this.supportsTogg(t, i, supports, idx)
                                }else this.togg(t, i, false, idx)
                            }
                        }
                    })
                }
            },
            getScore(){
                PostData('case/getDiagnoseScore',this.case_id).then((r) => {
                    let d1 = r.data.PrincipalDiagnosis.score || 0
                    let d2 = r.data.SecondaryDiagnosis.score || 0
                    let d3 = r.data.DifferentialDiagnosis.score || 0
                    if(r.data){
                        if(this.type == 1) {
                            this.score1 = d1
                            this.score2 = d2
                            this.score3 = d3
                        }
                        if(this.type == 2) {
                            this.score1 = d2
                            this.score2 = d1
                            this.score3 = d3
                        }
                        if(this.type == 3) {
                            this.score1 = d3
                            this.score2 = d1
                            this.score3 = d2
                        }
                    }
                })
            },
        },
        beforeDestroy () {
            $CaseSuccessfulOperation.$off('CaseSuccessfulOperation', this.refreshData)
        },
        mounted() {
            if(this.type < 4) this.getScore()
            this.getList()
            if(this.type == 4) this.getDiagnoseFrequency()
            $CaseSuccessfulOperation.$on('CaseSuccessfulOperation', this.refreshData)
        },
        updated() {
            this.list = this.list
        },
    }
</script>

<style lang="less" scoped>
 .loadings{
     height: 300px;
     line-height: 300px;
 }
 .deduction-item{
     overflow-y: auto;
     height: 594px;
 }
 .dia-num{
    width: 561px;
    height: 50px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10);
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    .dia-btn{
        margin-left: 10px;
        box-shadow: none;
        &:hover{
            color: #fff;
            background-color: #4098FF;
            border: none;
        }
    }
    .act-dia-btn{
        color: #fff;
        background-color: #4098FF;
        border: none;
    }
    .de-dia-btn{
        color: #333;
        background-color: #fff;
        border: 1px solid #4098FF;
    }
 }
 .operation-content{
        padding: 15px 20px 11px 20px;
        border-top: 1px solid #F0F0F7;
        cursor: pointer;
        &:hover{
            background-color: rgba(235,244,255,0.5);
            border-left: 2px solid #4098FF;
        }
        &:hover .content-detail>.deletes{
            visibility: visible;
        }
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
            .deletes{
                font-size: 14px;
                color: #F54802;
                padding-left: 10px;
                width: 38px;
                visibility: hidden;
            }
        }
    }
    .operation-left-basiss{
        height: 40px;
        line-height: 40px;
    }
    .types{
        margin-top: 8px;
        border-radius: 3px;
        padding: 3px 6px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        letter-spacing: 0.7px;
        line-height: 14px;
        display: inline-flex;
        align-items: center;
    }
    .term-item{
        display: flex;
        justify-content: flex-start;
        .term-type1{
            .types;
            background: rgba(64,152,255,0.15);
            border: 1px solid #4098FF;
            color: #4098FF;
        }
        .term-type2{
            .types;
            background: rgba(147,151,173,0.15);
            border: 1px solid #9397AD;
            color: #474C63;
        }
        .term-type3{
            .types;
            background: rgba(245,72,2,0.15);
            border: 1px solid #F54802;
            color: #F54802;
        }
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
        border-left: 2px solid #4098FF;
    }
    .de-content{
        background-color: #fff;
    }
    .topic{
        line-height: 18px;
        text-align: left;
        padding-right: 10px;
    }
    .collapse{
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        height: 544px;
        overflow: hidden;
        overflow-y: auto;
    }
    .operation-main{
       width: 561px;
       padding-bottom: 15px;
       .operation-no{
           height: 200px;
           line-height: 200px;
       }
       .score{
           padding: 0 20px;
           display: flex;
           width: 561px;
           height: 50px;
           flex-direction: row;
           align-items: center;
           position: relative;
           box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10);
            .diagnose-score-title{
                width: 34px
            }
            .diagnose-score-input{
                width: 120px !important;
                margin: 0 10px;
            }
            .diagnose-score-hint{
                position: absolute;
                left: 210px;
            }
            .right{
                position: absolute;
                right: 30px;
                .score-text{
                    margin-left: 28px;
                }
            }
       }
       .pane{
            width: 100%;
            background-color: #fff;
            .item{
                width: 100%;
                min-height: 40px;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                padding: 5px 20px;
                background: #FAFAFC;
                cursor: pointer;
                .item-title{
                    flex: 1;
                    text-align: left;
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #4098FF;
                    padding-right: 10px;
                }
                .item-title4{
                    width: 100%;
                    text-align: center;
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #4098FF;
                    padding-right: 10px;
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
            }
       }
    }
</style>
