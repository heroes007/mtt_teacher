<template>
    <Modal v-model="isShow" title="添加病例" width="1024" :mask-closable="false" :footer-hide="true" @on-cancel="close" :styles="{'top':'50px'}">
        <screen :type-arr="typeArr" :select2="select2" :select2Placeholder="select2Placeholder" :placehodle="placehodle"
                @selectChange2="selectChange2" :size-title1="sizeTitle1" :size-num1="caseList.length" @inputChange="inputChange"/>
        <tables :tabel-height="tableHeight" :column="columns1" :table-data="list" :select-list="management" :isSelection="true"  @select-tables="selectTable" @on-select-all="selectAllTable"
                :select-index="selectIndex" :delete-data="deleteList"/>
        <div v-if="list.length>0">
            <div class="case-num">已选<span style="color: #4098FF">{{caseList.length}}</span>病例</div>
            <div class="case-list">
                <img :src="leftImg" alt="" class="left-img" :style="transformLast && transformLast > 3 ? '' : 'opacity: 0.5'" @click="caseLeft">
                <div style="width: calc(100% - 74px); display: flex;overflow: hidden;padding-top: 30px;padding-bottom: 30px;">
                    <div ref="caseBox" style="display: flex">
                        <Card class="case" v-for="(item, index) in caseList" :key="index">
                            <div class="case-person">
                                <img class="case-person-img" :src="item.patient_head_portrait_url" alt="">
                                <div class="case-person-message">
                                    <div class="case-person-message-state">{{item.symptom}}</div>
                                    <div class="case-person-message-information">{{item.patient_name}} | {{$config.setSex(item.patient_gender)}} | {{item.patient_age}}</div>
                                </div>
                            </div>
                            <div class="case-state">
                                <div class="case-state-difficulty">
                                    <div class="case-state-difficulty-point" :style="item.degree == 1 ? {background: '#72C925'} : item.degree == 2 ? {background: '#FF9E02'} : {background: '#FF5900'}"></div>
                                    <span class="case-state-difficulty-type">{{item.degree == 1 ? '简单' : item.degree == 2 ? '适中' : '困难'}}</span>
                                </div>
                                <div class="case-state-title">{{item.patient_division}}</div>
                            </div>
                            <img class="case-delete" :src="deleteImg" alt="" @click="deleteCase(item,index)">
                        </Card>
                    </div>
                </div>
                <img :src="leftImg" alt="" class="right-img" :style="transformLast && (transformLast < caseList.length) ? '' : 'opacity: 0.5'" @click="caseRight">
            </div>
        </div>
        <div style="text-align: center">
            <Button type="primary" class="case-btn" @click="submit">确认</Button>
        </div>
    </Modal>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import tables from '../../../components/tables'
    import deleteImg from '../../../assets/img/case_delete.png'
    import leftImg from '../../../assets/img/case_left.png'
    import postData from '../../../api/postData'

    export default {
        components: {screen, tables},
        data() {
            return {
                isShow: false,
                typeArr: ['select2', 'input', 'size1'],
                select2: [{title: '全部', id: 'all'},{title: '简单', id: 1},{title: '适中', id: 2},{title: '困难', id: 3}],
                select2Placeholder: '请选择难度',
                placehodle: '搜索症状关键词',
                sizeTitle1: '病例总数',
                sizeNum1: 10,
                tableHeight: 422,
                columns1: [
                    { title: '症状', key: 'symptom', align: 'left' },
                    { title: '所属科室', key: 'patient_division', align: 'left' },
                    {
                        title: '难度',
                        key: 'degree',
                        render: (h, param) => {
                            let data = param.row.degree == 1 ? '简单' : param.row.degree == 2 ? '适中' : '困难'
                            return h('span', {style: {color: param.row.degree == 1 ?  '#72C925' : param.row.degree == 2 ? '#FF9E02' :  '#FF5900'}}, data)
                        }
                    },
                    {title: '患者姓名', key: 'patient_name'},
                    {
                        title: '性别', key: '',
                        render: (h, param) => {
                            return h('span', this.$config.setSex(param.row.patient_gender))
                        }
                    },
                    {title: '年龄', key: 'patient_age'},
                    ],
                list: [],
                management: [],
                case_num: null,
                caseList: [],
                transformLast: null,
                keyword: '',
                degree: '',
                selectIndex: null,
                deleteList: true,
                deleteImg, leftImg
            }
        },
        props: {
            show: {
                type: Boolean
            },
            deleteItem: {
                type: Object
            },
            type: {
                type: Number
            },
            deleteIndex: {
                type: Number
            },
            caseLists: {
                type: Array
            },
            organization_id: {
                type: Number
            },
        },
        watch: {
            show(val) {
                this.isShow = val
                if(val) this.getList()
            },
            caseLists(val) {
                this.caseList = val
                this.getList()
            },
            deleteItem(val) {
                this.list.forEach((item1, index1) => {
                    if(val.id == item1.id) {
                        this.selectIndex = index1
                        this.deleteList = !this.deleteList
                    }
                })
            },
        },
        methods: {
            close() {
                this.$emit('close', false)
            },
            selectChange2(val) {
                this.degree = val == 'all' ? '' : val
                this.getList()
            },
            inputChange(val) {
                this.keyword = val
                this.getList()
            },
            deleteCase(item, index) {
                console.log(item, this.list, 'this.list')
                this.caseList.splice(index, 1)
                this.list.forEach((item1, index1) => {
                    if(item.id == item1.id) {
                        this.selectIndex = index1
                        this.deleteList = !this.deleteList
                    }
                })
            },
            caseLeft() {
                if(this.transformLast && this.transformLast > 3) {
                    let transX = (4 - this.transformLast) * 306 + 'px'
                    this.$refs.caseBox.style.transform = `translateX(${transX})`
                    this.transformLast -= 1
                }
            },
            caseRight() {
                if(this.transformLast && this.caseList.length > this.transformLast) {
                    let transX = (2 - this.transformLast) * 306 + 'px'
                    this.$refs.caseBox.style.transform = `translateX(${transX})`
                    this.transformLast += 1
                }
            },
            selectTable(selection, row) {
                this.caseList = selection
                this.transformLast = this.caseList.length > 2 ? 3 : null
            },
            selectAllTable(selection, row) {
                this.caseList = selection
                this.transformLast = this.caseList.length > 2 ? 3 : null
            },
            submit() {
                if(this.caseList.length > 10) {
                    this.$Message.info('不能超过10份病例')
                }else{
                    this.$emit('submit', this.caseList)
                    this.close()
                }
            },
            getList() {
                let data = {
                    keyword: this.keyword,
                    degree: this.degree,
                    organization_id: this.organization_id
                }
                let url = this.type == 1 ? 'exam/getCases' : 'homework/getCases'
                postData(url, data).then(res => {
                    if(res.res_code == 1) {
                        if(this.caseList.length) {
                            res.data.list.forEach(item => {
                                this.caseList.forEach(item1 => {
                                    if(item.id == item1.id) item._checked = true
                                })
                            })
                        }
                        this.list = res.data.list
                    }
                })
            }
        },
    }
</script>

<style scoped lang="less">
    /deep/ .all-size{
        margin-right: 20px;
    }
    /deep/ .ivu-table:after{
        width: 0;
    }
    /deep/ .ivu-card-body{
        padding: 0;
    }
    /deep/ .ivu-card-body{
        width: 276px;
    }
    /deep/ .select-list{
        min-width: 180px;
    }
    .case-num{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0.93px;
        text-align: justify;
        margin-top: 20px;
    }
    .case-list{
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 196px;
    }
    .case{
        width: 276px;
        height: 136px;
        position: relative;
        margin: 0 15px;

        .case-person{
            display: flex;
            padding: 16px 16px 12px 16px;
            border-bottom: 1px solid rgba(209,209,217,0.50);

            .case-person-img{
                width: 60px;
                height: 60px;
            }

            .case-person-message{
                margin-left: 10px;

                .case-person-message-state{
                    font-family: PingFangSC-Medium;
                    font-size: 16px;
                    color: #474C63;
                    letter-spacing: 0.93px;
                    text-align: justify;
                }

                .case-person-message-information{
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #474C63;
                    letter-spacing: 0.82px;
                    text-align: justify;
                    margin-top: 18px;
                }
            }
        }

        .case-state{
            display: flex;
            margin: 11px 16px 0 16px;

            .case-state-difficulty{
                display: flex;
                align-items: center;

                .case-state-difficulty-point{
                    height: 8px;
                    width: 8px;
                    border-radius: 50%;
                }

                .case-state-difficulty-type{
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #474C63;
                    letter-spacing: 0.82px;
                    text-align: justify;
                    margin-left: 5px;
                }
            }

            .case-state-title{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #474C63;
                letter-spacing: 0.82px;
                text-align: justify;
                margin-left: 18px;
            }
        }

        .case-delete{
            display: none;
            width: 34px;
            height: 34px;
            position: absolute;
            top: -17px;
            right: -17px;
        }
    }
    .case:hover{
        .case-delete{
            display: inline-block;
            width: 34px;
            height: 34px;
            position: absolute;
            top: -17px;
            right: -17px;
        }
    }
    .left-img{
        width: 26px;
        height: 26px;
        transform: rotateZ(180deg)
    }
    .right-img{
        width: 26px;
        height: 26px
    }
    .case-btn{
        width: 150px;
        height: 38px;
        margin: 10px auto 0 auto;
    }
</style>
