<template>
    <div>
        <div class="content">
            <div class="content-left">
                <div v-for="(item, index) in selectList" :key="index" :class="index == selectList.length - 1 ? 'content-box-last' : 'content-box'">
                    <div class="diagnose-type">{{titleList[item.caseType - 1]}}</div>
                    <div class="diagnose-score">
                        <div class="diagnose-score-title">分值</div>
                        <InputNumber @on-blur="editScoreLeft(item, index)" v-model="item.score" class="diagnose-score-input" :min="0" :max="100"/>
                        <span class="diagnose-score-hint">分</span>
                        <img class="diagnose-score-img" :src="explain_img" alt="">
                    </div>
                    <div v-for="(t,i) in item.diagnosis" :key="i" class="diagnose-message">
                        <div class="diagnose-message-left">
                            <span class="diagnose-message-left-title">诊断</span>
                            <div class="nothing" v-if="t.name=='无'">无</div>
                            <div v-else :class="'diagnose-msg'+item.caseType">{{t.name}}</div>
                        </div>
                        <div class="diagnose-message-right">
                            <div class="diagnose-message-right-title" >权重等级</div>
                            <Select :disabled="t.name=='无'" @on-change="editWeightLeft(item, index, t, i)" v-model="t.weight" class="diagnose-message-right-select">
                                <Option :value="0">请选择</Option>
                                <Option :value="5">非常重要</Option>
                                <Option :value="4">比较重要</Option>
                                <Option :value="3">一般重要</Option>
                                <Option :value="2">稍微重要</Option>
                                <Option :value="1">不重要</Option>
                            </Select>
                            <img @click="deletes(t.id, t.icd10_id)" class="diagnose-message-right-img" :src="delete_img" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-right">
                <Tabs @on-click="tabs" v-model="casePane" type="line" size="small">
                    <TabPane  :label="setLabel" name="outline">
                        <div class="tabs-outline">
                            <div v-for="(item, index) in diagnose_list" :key="index" class="tabs-outline-mean">
                                <div class="tabs-outline-mean-circle" :style="{'background': item.color}"></div>
                                <div class="tabs-outline-mean-content">{{item.title}}</div>
                            </div>
                        </div>
                        <div class="tabs-outline-content outline-list" v-if="list&&list.length>0">
                            <div class="tab-item" v-for="(t, i) in list" :key="i" :class="'tab-item-bg'+t.caseType">
                                <div class="tab-left">
                                    <span>{{setNum(i,true)}}、</span>
                                    <span>{{t.name}}</span>
                                    <div v-if="t.color" :style="{'background': t.color}" class="type-color"></div>
                                </div>
                                <div class="tab-right">添加至：</div>
                                <div v-for="(it, index) in t.typeLists" @click="selType(t, i, index,it)" :style="{'margin-right': index!==2 ? '20px' : 0, 'background': it.color}" :key="index" class="tab-right-type">
                                    {{it.title[0]}}
                                </div>
                            </div>
                        </div>
                        <!-- <Page simple size="small" v-if="total1>pageSize" class="case-page" :current="current1" :total="total1" :page-size="pageSize" @on-change="pageList1" /> -->
                    </TabPane>
                    <TabPane label="病种库" name="warehouse">
                        <div class="tabs-outline">
                            <div v-for="(item, index) in diagnose_list" :key="index" class="tabs-outline-mean">
                                <div class="tabs-outline-mean-circle" :style="{'background': item.color}"></div>
                                <div class="tabs-outline-mean-content">{{item.title}}</div>
                            </div>
                        </div>
                        <div class="tabs-outline-content">
                            <Input prefix="ios-search-outline" @on-change="serach" v-model="keyword" placeholder="请输入搜索内容" style="width: 100%"/>
                            <div v-if="list&&list.length>0">
                                <div class="tab-item" v-for="(t, i) in list" :key="i" :class="'tab-item-bg'+t.caseType">
                                    <div class="tab-left">
                                        <span>{{setNum(i)}}、</span>
                                        <span>{{t.name}}</span>
                                        <div v-if="t.color" :style="{'background': t.color}" class="type-color"></div>
                                    </div>
                                    <div class="tab-right">添加至：</div>
                                    <div v-for="(it, index) in t.typeLists" @click="selType(t, i, index, it)" :style="{'margin-right': index!==2 ? '20px' : 0, 'background': it.color}" :key="index" class="tab-right-type">
                                        {{it.title[0]}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="page-view">
                            <Page simple v-if="total2>pageSize" :current="current2" :total="total2" :page-size="pageSize" @on-change="pageList2" />
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
        <div class="case-btn-box">
            <Button class="case-btn-last" @click="handleLast" type="primary">上一步</Button>
            <Button class="case-btn" @click="handleNext(false)" type="primary">下一步</Button>
        </div>
    </div>
</template>

<script>
    import explain_img from '../../../../../assets/img/case/explain.png'
    import delete_img from '../../../../../assets/img/case/delete.png'
    import caseSee from '../../../../../assets/img/case/case-see.png'
    import caseSeeGrey from '../../../../../assets/img/case/case-see-grey.png'
    import Pages from '../../../../../components/Page'
    let diagnosisType = (n) => {
        return {
            caseType: n,
            score: 0,
            diagnosis: [{name: '无', weight: 0}],
        }
    }
    export default {
        components: { Pages },
        data(){
            return {
                keyword: '',
                current1: 1,
                total1: 1,
                pageSize: 12,
                current2: 1,
                total2: 1,
                titleList: ['主要诊断','次要诊断','鉴别诊断'],
                selectList: [],
                selectListDe: [
                    diagnosisType(1),
                    diagnosisType(2),
                    diagnosisType(3),
                ],
                score: 0,
                explain_img, delete_img,
                diagnose_list: [],
                actImg: caseSee,
                seedList: [],
                outLineList: [],
                casePane: 'outline',
                list: []
            }
        },
        beforeDestroy () {
            $CasePreservation.$off('CasePreservation', this.preservation)
        },
        mounted() {
            $CasePreservation.$on('CasePreservation', this.preservation)
            this.getOut()
            this.getList()
            this.getSelLeft(true)
            this.diagnose_list = this.typeList()
            this.selectList = this.selectListDe;
        },
        methods: {
            preservation(index){
                if(index == 3) this.handleNext(true)
            },
            editScoreLeft(t, i){
                if(t.score || t.score === 0){
                    let arr = ['PrincipalDiagnosis', 'SecondaryDiagnosis', 'DifferentialDiagnosis']
                    let d = {
                        case_id: +sessionStorage.getItem('CASEID'),
                        score: t.score,
                        type: arr[i]
                    }
                    PostData('case/setScore',d).then((r) => {})
                }
            },
            editWeightLeft(it, index, t, i){
                let d = {
                    case_id: +sessionStorage.getItem('CASEID'),
                    id: t.id,
                    name: t.name,
                    type: t.type,
                    icd10_id: t.icd10_id,
                    weight: t.weight,
                }
                PostData('case/modifyDiagnose',d).then((r) => {})
            },
            setRight(t,k){
                let col = ['#A876F9','#FFA003','#0AC7E6']
                this.list.map((it) => {
                    if(it.id === k.icd10_id) {
                        it.caseType = t.caseType
                        it.color = col[t.caseType - 1]
                        it.typeLists[t.caseType - 1].check = true
                        it.typeLists[t.caseType - 1].color = col[t.caseType - 1]
                        it.icds = k.id
                    }
                })
                // this.$forceUpdate()
            },
            getSelLeft(type){
                PostData('case/getDiagnoseByCase',{case_id: +sessionStorage.getItem('CASEID')}).then((r) => {
                    if(r&&r.data){
                        let d = [r.data.PrincipalDiagnosis, r.data.SecondaryDiagnosis, r.data.DifferentialDiagnosis]
                        d.map((t, i) => {
                            if(t.diagnosis&&t.diagnosis.length === 0){
                                t.diagnosis = [{name: '无', weight: 0}]
                            }
                            t.caseType = i + 1
                            if(type){
                                if(t.caseType){
                                    if(t.diagnosis&&t.diagnosis.length>0){
                                        t.diagnosis.map((k) => {
                                            this.setRight(t,k)
                                        })
                                    }
                                }
                            }
                        })
                        this.selectList = d
                    }
                })
            },
            setNum(i, type){
                let current = type ? this.current1 : this.current2;
                return (i + 1) + (current - 1)*this.pageSize
            },
            typeList(bool){
                return [
                    {title: '主要诊断', color: bool ? '#9397AD' : '#A876F9', check: false},
                    {title: '次要诊断', color: bool ? '#9397AD' : '#FFA003', check: false},
                    {title: '鉴别诊断', color: bool ? '#9397AD' : '#0AC7E6', check: false},
                ]
            },
            pageList1(){

            },
            pageList2(active){
                this.current2 = active
                this.getList('warehouse');
            },
            getOut(){
                let d = JSON.parse(sessionStorage.getItem('ACTIVEOUTLINE'));
                if(d.icd10_ids&&d.icd10_ids.includes('[')){
                    console.log(d, 'ddd');
                    let arr = d.icd10_ids ? JSON.parse(d.icd10_ids) : ''
                    let tit = d.icd10_names ? JSON.parse(d.icd10_names) : ''
                    let list = []
                    arr.map((t,i) => {
                        list.push({
                            id: t,
                            name: tit[i],
                            typeLists: this.typeList(true),
                            color: '',
                            caseType: 0,
                            score: 0
                        })
                    })
                    this.outLineList = list
                    this.total1 = list.length
                    this.list = list
                }
            },
            serach(){
                this.getList('warehouse');
            },
            getList(type){
                PostData('case/getIcd10',{keyword: this.keyword, page_size: this.pageSize, page_num: this.current2}).then((r) => {
                    if(r&&r.data){
                        this.total2 = r.data.count
                        this.seedList = r.data.data
                        this.seedList.map((t) => {
                            t.typeLists = this.typeList(true)
                            t.color = ''
                            t.caseType = 0
                            t.score = 0
                        })
                        if(type=='warehouse') {
                            this.list = this.seedList;
                            this.getSelLeft(true)
                        }
                        this.$forceUpdate()
                    }
                })
            },
            handleLast() {
                this.$emit('handleNavigate', 2)
            },
            getCase(d, n){
                let da = {
                    caseType: n,
                    score: 0,
                    diagnosis: [],
                };
                d.map((t) => {
                    da.diagnosis.push({name: t.name, weight: 0})
                })
                return da
            },
            addSel(t, i){
                let arr = ['PrincipalDiagnosis','SecondaryDiagnosis','DifferentialDiagnosis'];
                let d = {
                    case_id: +sessionStorage.getItem('CASEID'),
                    type: arr[t.caseType-1],
                    name: t.name,
                    icd10_id: t.id,
                    weight: ''
                }
                PostData('case/addDiagnose',d).then((r) => {
                    if(r&&r.res_code == 1) {
                        this.list[i].icds = r.data.case_diagnose_id
                        this.getSelLeft()
                    }
                })
            },
            deletes(id, idx){
                if(id){
                    PostData('case/removeDiagnose',{id}).then((r) => {
                        if(r&&r.res_code == 1)  {
                            this.getSelLeft()
                            this.list.map((it) => {
                                if(it.id === idx) {
                                it.typeLists = this.typeList(true)
                                it.color = ''
                                it.caseType = 0
                                }
                            })
                            // this.$forceUpdate()
                        }
                    })
                }else this.$Message.info('暂无诊断！');
            },
            getSelect(t, j, i){
                if(t.caseType){
                    this.addSel(t, i)
                }else{
                    let d = this.selectList[j], ids = null;
                    d.diagnosis.map((it) => {
                        if(it.icd10_id === t.id) ids = it
                    })
                    if(ids) this.deletes(ids.id, t.id)
                }
            },
            isOnly(){
                let bool = false
                this.selectList.map((t) => {
                    if(t.caseType === 1 && t.diagnosis[0].name != '无') bool = true
                })
                return bool
            },
            editTypeLeft(da, i){
                let arr = ['PrincipalDiagnosis', 'SecondaryDiagnosis', 'DifferentialDiagnosis']
                let d = {
                    case_id: +sessionStorage.getItem('CASEID'),
                    ...da,
                    weight: 0,
                    type: arr[i]
                }
                PostData('case/modifyDiagnose',d).then((r) => {
                    if(r&&r.res_code == 1) {
                        this.getSelLeft()
                    }
                })
            },
            selType(t, i, j, it){
                let col = ['#A876F9','#FFA003','#0AC7E6']
                let cg = '#9397AD';
                if(this.casePane == 'warehouse'&&j === 0) this.$Message.info('非提纲内的病症，不可设为主要诊断。');
                else if(this.isOnly()&&j === 0&&!it.check) this.$Message.info('只允许， 有一个主要诊断！');
                else{
                    let isEdit = false
                    if(t.caseType){
                        if(t.caseType !== (j + 1)) {
                            isEdit = true
                            let d = {
                                name: t.name,
                                icd10_id: t.id,
                                id: t.icds
                            }
                            this.editTypeLeft(d, j)
                        }
                    }
                    t.typeLists.map((k, l) => {
                        if(l==j){
                            k.check = !k.check;
                            k.color = k.check ? col[l] : cg
                            t.color = k.check ? col[l] : ''
                            t.caseType = k.check ? (l + 1) : 0// 1 主 2 次 3 鉴 0灰色
                        }else {
                            k.check = false
                            k.color = cg;
                        }
                    })
                    this.list[i] = t
                    if(!isEdit) this.getSelect(t, j, i)
                    this.$forceUpdate()
                }

            },
            setImg(type, bool){
                if(type) return bool ?  caseSee : caseSeeGrey ;
                return this.casePane == 'outline' ?  caseSee : caseSeeGrey ;
            },
            tabs(name){
                this.getOut()
                this.getList()
                this.actImg = this.casePane == 'outline' ?  caseSee : caseSeeGrey ;
                this.list = this.casePane == 'outline' ? this.outLineList : this.seedList;
                this.getSelLeft(true)
            },
            setLabel(h, params){
                return h('div',
                {
                   on: {
                       mouseenter: () => {
                          this.actImg = caseSee
                       },
                       mouseleave: () => {
                          this.actImg = this.casePane == 'outline' ?  caseSee : caseSeeGrey ;
                       }
                   },
                   style: {
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems : 'center',
                            justifyContent: 'center'
                    }
                },
                [
                    h('span', '提  纲', {style: {'letter-spacing': '1.5px'}}),
                    h('img', {
                        attrs: {
                            src: this.actImg,
                        },
                        style: {
                            width: '15px',
                            height: '15px',
                            marginLeft: '10px'
                        },
                    }),
                ]);
            },
            isFinish(){
                let d = this.selectList;
                let bool = true, score = 0
                if(d&&d.length>0){
                    d.map((t) => {
                        score += t.score
                        t.diagnosis.map((k) => {
                            if(k.name === '无') bool = bool&&true
                            else if(k.weight !== 0&&k.name != '无') bool = bool&&true
                            else bool = bool&&false
                        })
                    })
                }
                return [bool, score]
            },
            handleNext(save) {
                let d = this.selectList;
                if(d&&d.length>0){
                   if(d[0].diagnosis&&d[0].diagnosis.length>0&&d[0].diagnosis[0].name!='无'){
                       let da = this.isFinish()
                       if(da[0]){
                            if(da[1] == 100) {
                                if(!save) this.$emit('handleNavigate', 4)
                                else this.$Message.success('保存成功')
                            }
                            else this.$Message.info('诊断的分值总分必须为100分！');
                       }else this.$Message.info('请选择权重等级！');
                   }else this.$Message.info('请添加主要诊断！');
                }else this.$Message.info('请添加诊断！');
            }
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-input-number:hover .ivu-input-number-handler-wrap{
        display: none;
    }
    .outline-list{
        height: 432px;
        overflow-y: auto;
    }
    .case-page{
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        margin: auto;
    }
    .page-view{
         width: 560px;
         position: absolute;
         bottom: 20px;
    }
    .tab-item-bg0{
        background-color: #fff;
    }
    .tab-item-bg1{
        background-color: #e7d9fd;
    }
    .tab-item-bg2{
        background-color: #ffe5b9;
    }
     .tab-item-bg3{
        background-color: #b9eff8;
    }
    .tab-item{
        padding: 8px 20px;
        min-height: 36px;
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        &:hover{
            background: #FAFAFC;
            .tab-left{
                font-size: 14px;
                color: #4098FF;
            }
            .tab-right, .tab-right-type{
                display: block;
            }
        }
        .tab-left{
            flex: 1;
            text-align: left;
            .type-color{
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 4px;
            }
        }
        .tab-right{
            width: 60px;
            font-size: 14px;
            display: none;
        }
        .tab-right-type{
            width: 22px;
            height: 22px;
            color: #fff;
            border-radius: 100%;
            display: none;
        }
    }
    /deep/ .ivu-input{
        height: 34px;
        border-radius: 4px !important;
    }
    /deep/ .ivu-tabs-tab{
        width: 280px !important;
        padding: 0 !important;
        margin: 0 0 2px 0 !important;
        font-size: 18px !important;
        border: 1px solid #F0F0F7 !important;
    }
    /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused{
        border-color: #f0f0f7 !important;
    }
    /deep/ .ivu-tabs-ink-bar{
        width: 280px !important;
        margin: 0 !important;
        height: 3px !important;
    }
    .msg{
        flex: 1;
        text-align: left;
        margin: 0 10px;
        font-size: 14px;
        padding: 3px 10px;
        letter-spacing: 0.82px;
        border-radius: 3px
    }
    .nothing{
        margin-left: 10px;
        text-align: left;
        font-size: 14px;
        color: #9397AD;
    }
    .content{
        display: flex;
        justify-content: center;
        margin-top: 10px;

        .content-left{
            width: 500px;
            height: 627px;
            background: rgba(240,240,247,0.30);
            border-radius: 3px 0 0 3px;
            z-index: 1;
            overflow-y: auto;

            .content-box{
                padding: 0 58px 27px 40px;
                border-bottom: 1px dashed #ABB7C5;
            }
            .content-box-last{
                padding: 0 58px 27px 40px;
            }
            .diagnose-type{
                margin-top: 20px;
                margin-bottom: 15px;
                font-size: 16px;
                color: #474C63;
            }
            .diagnose-score{
                display: flex;
                align-items: center;
                position: relative;

                .diagnose-score-title{
                    width: 34px
                }
                .diagnose-score-input{
                    width: 338px;
                    margin: 0 10px;
                }
                .diagnose-score-hint{
                    position: absolute;
                    right: 36px;
                }
                .diagnose-score-img{
                    width: 14px;
                    height: 14px;
                }
            }
            .diagnose-message{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;

                .diagnose-message-left{
                    display: flex;

                    .diagnose-message-left-title{
                    }
                    .diagnose-msg1{
                       .msg;
                       background: #EEE4FE;
                       color: #A876F9;
                    }
                    .diagnose-msg2{
                       .msg;
                       background: #FFEDCE;
                       color: #FFA003;
                    }
                    .diagnose-msg3{
                       .msg;
                       background: #CFF4FA;
                       color: #0AC7E6;
                    }
                }
                .diagnose-message-right{
                    display: flex;
                    align-items: center;
                    .diagnose-message-right-title{
                        width: 56px
                    }
                    .diagnose-message-right-select{
                        width: 130px;
                        margin-left: 10px;
                        margin-right: 5px;
                    }
                    .diagnose-message-right-img{
                        height: 18px;
                        width: 18px;
                    }
                }
            }
        }
        .content-right{
            width: 560px;
            height: 627px;
            box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
            border-radius: 3px 0 0 3px;
            /deep/ .ivu-tabs{
                height: inherit;
                /deep/ .ivu-tabs-content{
                    height: 566px;
                }
            }
            .tabs-outline{
                display: flex;
                justify-content: center;
                margin: 15px 0;

                .tabs-outline-mean{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                }
                .tabs-outline-mean-circle{
                    height: 14px;
                    width: 14px;
                    border-radius: 100%;
                    margin-right: 5px;
                }
                .tabs-outline-mean-content{
                    font-size: 14px;
                    color: #474C63;
                    letter-spacing: 0.82px;
                }
            }
            .tabs-outline-content{
                padding: 0 20px;
                /deep/ .ivu-input{
                    border-radius: 18px !important;
                    height: 36px;
                    background: #F0F0F7;

                    &::-webkit-input-placeholder{
                        font-size: 16px;
                        color: #9397AD;
                    }
                }
            }
        }
    }
    .case-btn-box {
        display: flex;
        margin-top: 26px;
        justify-content: center;

        .case-btn-last {
            width: 150px;
            height: 38px;
            background-color: #fff;
            color: #4098ff;
        }

        .case-btn {
            width: 150px;
            height: 38px;
            margin-left: 20px;
        }
    }
</style>
