<template>
    <div class="main" :style="{height: type == 4 ? '544px' : '594px'}">
       <div v-if="list&&list.length>0" class="collapse">
            <div v-for="(t,i) in list" :key="i" class="pane" :style="{'margin-bottom': t.show ? 0 : '12px'}">
                <div class="item" @click="togg(t, i)">
                    <img :src="t.count ? actEdit : deEdit" class="edit" />
                    <div class="item-title">{{t[elementName]}}（{{t.count}}）</div>
                    <div class="right">
                        <span :class="t.show ? 'close' : 'open'">{{t.show ? '收起' : '展开'}}</span>
                        <img class="sel" :src="t.show ? selClose : selOpen" />
                    </div>
                </div>
                <div class="details" v-show="t.show">
                    <div class="case-add">
                        <img @click="add(t)" :src="caseAdd" class="add" />
                        <span @click="add(t)" class="add-text">添加{{typeTit[+type - 1]}}</span>
                    </div>
                    <div class="content" v-if="t.chilrdren" @click="edit(t,i,it,l)" v-for="(it, l) in t.chilrdren" :key="l" :class="it.id === activeId ? 'act-content' : 'de-content'">
                       <div class="content-detail">
                            <div class="content-left">
                                <div class="ask">
                                    <div class="problem">{{itemType1(it)}}</div>
                                    <div class="grey-regular4 topic">{{it[item1]}}</div>
                                </div>
                                <div v-if="type != 3" class="answer">
                                    <div class="answer-view">{{itemType2[type-1]}}</div>
                                    <div class="answer-regular topic">{{it[item2]}}</div>
                                </div>
                            </div>
                            <div @click.stop="deletes(t,it,i)" class="deletes">删除</div>
                       </div>
                       <div class="term-item">
                           <div :class="'term-type'+it.item_type" v-if="isTerm()&&it.item_type">
                            {{types[it.item_type - 1]}} 
                           <span v-if="type<4&&isTerm()">
                               <span v-if="it.support_count || it.no_support_count">&nbsp;|</span>
                               <span v-if="it.support_count">支持诊断（{{it.support_count}}）</span>
                               <span v-if="it.support_count&&it.no_support_count">|</span>
                               <span v-if="it.no_support_count">排除诊断（{{it.no_support_count}}）</span>
                            </span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
       </div>
    </div>
</template>

<script>
    import caseAdd from '../../../../../../assets/img/case/case-add.png'
    import selClose from '../../../../../../assets/img/case/sel-close.png'
    import selOpen from '../../../../../../assets/img/case/sel-open.png'
    import actEdit from '../../../../../../assets/img/case/edit1.png'
    import deEdit from '../../../../../../assets/img/case/edit2.png'
    export default {
         props: {
            typePane: {
                type: String,  // 'term' 详情
                default: ''
            },
            pane: {
                type: String,
                default: ''
            },
            type: {
                type: String,  //1 问诊 2 体格检查 3 辅助检查 4 诊疗详情
                default: ''
            },
            diagnosisId: {}
        },
        data() {
            return {
                itemType2: ['答','结果'],
                types: ['诊断依据','干扰项','减分项'],
                typeTit: ['问诊','查体','辅检','诊疗'],
                caseAdd,selClose,selOpen,actEdit,deEdit,
                activeId: 0,
                case_id: { case_id: +sessionStorage.getItem('CASEID') }, // 139
                list: [],
                timeout: null
            }
        },
        computed: {
            elementName(){
                if(this.isTerm()){
                    return ['talk_group','first_name','first_name', 'name'][this.type - 1]
                }else return 'element_name'
            },
            item2(){
                return this.type == 1 ? 'answer' : this.type == 2 ? 'result_text' : ''
            },
            item1(){
                return this.type == 1 ? 'question' : (this.type == 2 || this.type == 3) ? 'item' : this.type == 4 ? 'content' : ''
            },
        },
        methods: {
            itemType1(t){
                if(this.type < 4)  return ['问','部位','检查项'][this.type - 1]
                if(this.type == 4) return {'operation': '手术','medicine': '西药', 'treat': '护理'}[t.type]
            },
            isTerm(){
                return this.typePane&&this.typePane == 'term'
            },
            getListUrl(){
                if(this.isTerm()){
                    return ['case/getTalkTree','case/getPhysicalFirstItem','case/getAssistFirstItem', 'case/getTreatDetailList'][this.type - 1]
                }else return 'case/getElements'
            },
            getTalkUrl(){
                if(this.type == 1) {
                    return this.isTerm() ? 'case/getTalkTree' : 'case/getTalkListByElement'
                }
                if(this.type == 2) {
                    return this.isTerm() ? 'case/getPhysicalResultByFirstId' : 'case/getPhysicalResultByElement'
                }
                if(this.type == 3) {
                    return this.isTerm() ? 'case/getAssistResultByFirstId' : 'case/getAssistResultByElement'
                }
                if(this.type == 4) {
                    return this.isTerm() ? 'case/getListByType' : 'case/getListByElement'
                }
            },
            add(t){
                let d = null
                if(this.isTerm()){
                    d = [t.talk_group, t.first_id, t.first_id, t.id][this.type - 1]
                }else d = t.id
                $CaseAdd.$emit('CaseAdd', d, this.typePane, t)
            },
            edit(t,i,it,l){
                t.chilrdren.map((k,j) => {
                 if(j === l)  this.activeId = k.id
                })
                $CaseEdit.$emit('CaseEdit', t, it, this.typePane)
                this.list[i] = t;
                this.$forceUpdate()
            },
            reduce(t){
                let name = this.isTerm() ? 'talk_group' : 'id'
                this.list.map((it) => {
                    if(it[name] == t[name] ) t.count = t.count - 1
                })
            },
            delteUrl(){
                return ['case/removeTalkBasis','case/removeBasis','case/removeAssistBasis', 'case/removeTreat'][this.type - 1]
            },
            deletes(t, it, i){
                let d = {
                    id: it.id,
                    element_id: t.id,
                    ...this.case_id,
                    question_index: it.question_index
                }
                let da = this.isTerm() ? {id: it.id,...this.case_id} : d
                if(this.type == 4) da.type = it.type == 'treat' ? 'nursing' : it.type
                this.$Modal.confirm({
                    title: '你确认要删除吗？',
                    content: '<p>删除后列表里的所选数据将被清空。</p>',
                    onOk: () => {
                        PostData(this.delteUrl(), {...da, frequency_id: this.diagnosisId}).then((r) => {
                            if(r&&r.res_code == 1) {
                                this.togg(t, i, true)
                                this.reduce(t)
                            }
                        })
                    },
                    onCancel: () => {}
                });
            },
            setToggData(t){
                let d1 = {element_id: t.id,...this.case_id}
                if(this.type == 1) return this.isTerm() ? {...this.case_id, talk_group: t.talk_group} : d1
                if(this.type == 2 || this.type == 3) {
                    let d2 = {...this.case_id,first_id: t.first_id}
                    return this.isTerm() ? d2 : d1
                }
                if(this.type == 4) return this.isTerm() ? {type: t.type == 'treat' ? 'nursing' : t.type,...this.case_id} : d1
            },
            hide(d){
                this.list.map( t => {
                    if(t != d) t.show = false
                })
            },
            togg(t, i, bool = false){
                this.hide(t)
                let d = this.setToggData(t)
                if(!t.show || bool){
                    PostData(this.getTalkUrl(),{...d, frequency_id: this.diagnosisId}).then((r) => {
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
            getList(id){
                if(this.getListUrl()){
                    let type = ['talk','physical','assist','treat'][this.type - 1]
                    PostData(this.getListUrl(),{...this.case_id, type, frequency_id: this.diagnosisId}).then((r) => {
                        if(r&&r.data){
                            this.list = r.data;
                            this.list.map((t, i) => {
                                t.show = false
                                let name = this.type == 1&&this.isTerm() ? 'talk_group' : (this.type == 2 || this.type == 3)&&this.isTerm() ? 'first_id' : 'id'
                                if(id && t[name] == id) this.togg(t, i)
                                t.chilrdren = []
                            })
                        }
                    })
                }
            },
        },
        beforeDestroy () {
            $CaseSuccessfulOperation.$off('CaseSuccessfulOperation', this.getList)
        },
        mounted() {
            this.getList()
            $CaseSuccessfulOperation.$on('CaseSuccessfulOperation', this.getList)
        },
        updated() {
            this.list = this.list
        },
    }
</script>

<style lang="less" scoped>
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
    }
    .collapse{
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .main{
       width: 561px;
       overflow-y: auto;
       padding: 15px 20px;
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
                padding: 10px 20px;
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
                .case-add{
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    .add{
                        width: 15px;
                        height: 15px;
                        margin-right: 8px;
                    }
                    .add-text{
                        font-size: 14px;
                        color: #474C63;
                    }
                }
                .content{
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
                        .deletes{
                            font-size: 14px;
                            color: #F54802;
                            padding-left: 10px;
                            width: 38px;
                            visibility: hidden;
                        }
                    }
                }
            }
       }
    }
</style>
