<template>
    <div>
        <screen isSuper :typeArr="typeArr" sizeTitle1="病例总数" :sizeNum1="sizeNum1" btnName="创建病例" placehodle="病症/诊断/作者姓名"
                selectSubjects @selectChange1="selectChange1" @selectChange3="selectChange3" @inputChange="inputChange"
                @handleClick="handleClick" :select2="select2" @selectChange2="selectChange2"
                :select2Placeholder="select2Placeholder"
                :select2_1="select2_1" @se~lectChange2_1="selectChange2_1"
                :select2_1Placeholder="select2_1Placeholder"></screen>
<!--        <tables :tabel-height="tableHeight" :is-serial=true :column="columns1" :table-data="list"-->
<!--                @operation1="checkCase" @operation2="editCase" @operation3="toExamine"-->
<!--                @operation4="deleteCase" @operation5="copyCase"></tables>-->
        <Modal v-model="rejectModal" :footer-hide="true" title="拒绝理由" width="700">
            <Input type="textarea" :rows="10"/>
            <div style="margin-top: 40px;display: flex;justify-content: center">
                <Button type="primary" style="width: 120px;">确认</Button>
            </div>
        </Modal>
        <div :style="{'height': tableHeight + 'px'}" class="content">
            <div v-for="(item, index) in list" :key="index" class="content-box" @click="editCase(item)">
                <div class="box-degree" :style="{backgroundColor: degreeLevel[item.degree].color}">
                    {{degreeLevel[item.degree].title}}
                </div>
                <div class="box-img" :style="{transform: item.state == 0 ? 'rotate(450deg)' : item.state == 2 ? 'rotate(408deg)' : 'rotate(334deg)', top: item.state == 0 ? '-3px' : '-20px', right: item.state == 0 ? '3px' : '-38px'}">
                    <img :width="item.state == 0 ? '60' : '80'" height="60" :src="selectState(item.state + 2)" alt="">
                </div>
                <div class="content-top">
                    <div class="content-top-symptom">{{item.symptom}}</div>
                    <div class="content-top-content">
                        <div>ID: <span>{{item.id}}</span></div>
                        <div>诊断 <span style="overflow-x: auto">{{item.principal_diagnosis_name}}</span></div>
                    </div>
                </div>
                <div class="content-bottom">
                    <div class="bottom-left">
                        <div>科室： <span>{{item.patient_division}}</span></div>
                        <div>创建人： <span>{{item.realname}}</span></div>
                        <div>创建时间： <span>{{item.add_time}}</span></div>
                    </div>
                    <div class="bottom-right">
                        <div v-if="item.state == 2" style="margin-right: 10px;">
                            <div>{{item.use_count}}</div>
                            <div>使用次数</div>
                        </div>
                        <div class="right-btn" v-else-if="item.state == -1">
                            <Button type="primary" @click="rejectCase(item)">拒绝原因</Button>
                            <Button style="margin-left: 4px;" type="error" @click="deleteCase(item)">删除</Button>
                        </div>
                        <div class="right-btn" v-else-if="item.state == 0">
                            <Button type="primary" @click="editCase(item)">编辑</Button>
                            <Button style="margin-left: 4px;" type="error" @click="deleteCase(item)">删除</Button>
                        </div>
                        <div class="right-btn"  v-else-if="item.state == 1">
                            <Button type="primary" @click="auditCase(item)">审核</Button>
                        </div>
                        <div class="right-btn"  v-else-if="item.state == 3">
                            <Button type="primary">分配</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <page-list :current="current" :total="count" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import tables from '../../../components/tables'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import postData from '../../../api/postData'
    import axios from 'axios'
    import url from '../../../../config/url'
    import state_1 from '../../../assets/img/audit-sate/state_1.jpg'
    import state_2 from '../../../assets/img/audit-sate/state_2.jpg'
    import state_3 from '../../../assets/img/audit-sate/state_3.jpg'
    import state_5 from '../../../assets/img/audit-sate/state_5.jpg'

    let operationList = [['查看', 'operation1'], ['编辑', 'operation2']]
    let screenType = ['isSuper', 'input', 'input2', 'size1', 'button', 'select2']
    export default {
        components: {screen, tables, pageList},
        mixins: [pageMixin],
        data() {
            return {
                state_1, state_2, state_3, state_5,
                typeArr: this.$config.getRoleId() == 1 ? [...screenType, 'select2_1'] : screenType,
                count: 0,
                tableHeight: null,
                organization_id: null,
                keyword: '',
                rejectModal: false,
                degreeLevel: {
                    1: {color: '#7ED321', title: '简单'},
                    2: {color: '#4098ff', title: '中等'},
                    3: {color: '#FD6C1E', title: '困难'}
                },
                columns1: [{
                    title: '病症',
                    key: 'symptom',
                    align: 'left',
                    minWidth: 200
                }, {
                    title: '主要诊断',
                    key: 'principal_diagnosis_name',
                    align: 'left',
                    minWidth: 200
                }, {
                    title: '科室',
                    key: 'patient_division',
                    align: 'center',
                    minWidth: 200
                }, {
                    title: '难度',
                    key: 'degree',
                    align: 'left',
                    minWidth: 80,
                    render: (h, param) => {
                        let d = param.row.degree == 1 ? '简单' : param.row.degree == 2 ? '适中' : '困难'
                        return h('span', d)
                    }
                }, {
                    title: '患者信息',
                    key: 'message',
                    align: 'left',
                    minWidth: 200,
                    // render: (h, params) => {
                    //     let d = params.row.patient_name + '/' + params.row.patient_gender + '/' + params.row.patient_age
                    //     return h('span', d)
                    // }
                },
                    {
                        title: '审核状态',
                        key: '',
                        minWidth: 100,
                        render: (h, param) => {
                            // -1未通过 0草稿 1审核中 2通过
                            let arr = ['未通过', '草稿', '审核中', '通过']
                            let d = arr[param.row.state + 1]
                            return h('span', d)
                        }
                    },
                    {
                        title: '使用次数',
                        key: 'use_count',
                        minWidth: 100
                    }, {
                        title: '更新人',
                        key: 'realname',
                        minWidth: 120
                    }, {
                        title: '更新时间',
                        key: 'add_time',
                        minWidth: 200
                    }, {
                        title: '操作',
                        minWidth: 300,
                        slot: 'operation',
                        check_id: true,
                        operationAllot: true,
                        operation: this.$config.getRoleId() == 1 ? [[...operationList, ['审核', 'operation3'], ['删除', 'operation4']], [...operationList, ['审核', 'operation3'], ['删除', 'operation4']]] : [[...operationList, ['删除', 'operation4']], [['查看', 'operation1'], ['复制', 'operation5']]],
                    }
                ],
                list: [],
                state: '',
                select2: [{id: 'all', title: '全部难度'}, {id: 1, title: '简单'}, {id: 2, title: '适中'}, {id: 3, title: '困难'}],
                select2_1: [{id: 'all', title: '审核状态'}, {id: -1, title: '未通过'}, {id: 0, title: '草稿'}, {
                    id: 1,
                    title: '审核中'
                }, {id: 2, title: '通过'}],
                select2Placeholder: '选择科室',
                select2_1Placeholder: '选择难度',
                degree: '',
                patient_division: '',
                removeSession: ['CaseContentMsg', 'CaseContentSum', 'ACTIVEOUTLINE', 'CASEMSGEDIT', 'CASEID', 'CaseTreatment', 'CaseActiveStep'],
                radioCheck: '同意'
            }
        },
        computed: {
            sizeNum1() {
                return this.count ? this.count + '/' + this.total : this.total
            }
        },
        methods: {
            selectState(state) {
                return state == 4 ? '' : this['state_' + state]
            },
            selectChange1(val) {
                this.organization_id = val;
                this.getList()
            },
            selectChange3(val) {
                this.patient_division = val == '全部科室' ? '' : val;
                this.getList()
            },
            inputChange(val) {
                this.keyword = val
                this.getList()
            },
            handleClick() {
                sessionStorage.setItem('CaseActiveStep', 1)
                sessionStorage.setItem('CaseActiveMaxStep', 1)
                this.removeSession.forEach(item => {
                    sessionStorage.removeItem(item)
                })
                window.open('/dashboard/case-contents')
            },
            selectChange2(val) {
                this.degree = val == 'all' ? '' : val
                this.getList()
            },
            selectChange2_1(val) {
                this.state = val == 'all' ? '' : val
                this.getList()
            },
            checkCase(val) {
                let routeData = this.$router.resolve({query: {case_id: val.id}, name: "view-cases"});
                window.open(routeData.href, "_blank")
            },
            toExamine(v) {
                if (v.state == -1 || v.state == 2) this.$Message.info('已审核过该病例')
                else this.$Modal.confirm({
                    title: '提示',
                    closable: true,
                    render: (h) => {
                        return h('RadioGroup', {
                            attrs: {
                                'value': this.radioCheck
                            },
                            on: {
                                'on-change': (val) => {
                                    this.radioCheck = val
                                }
                            }
                        }, [
                            h('Radio', {props: {label: '同意'}}),
                            h('Radio', {props: {label: '拒绝'}}),
                        ])
                    },
                    onOk: () => {
                        let check = {'同意': 2, '拒绝': -1}
                        PostData('case/approveCase', {id: v.id, state: check[this.radioCheck]}).then((r) => {
                            if (r.res_code == 1) {
                                this.$Message.info('审核成功!')
                                this.getList()
                            }
                        })
                    },
                    onCancel: () => {

                    }
                });
            },
            editCase(val) {
                window.event.stopPropagation()
                sessionStorage.setItem('CaseActiveStep', 1)
                let url = this.$router.resolve({
                    path: '/dashboard/case-contents',
                    query: {id: val.id, copy_state: val.copy_state}
                })
                PostData('case/getStep', {case_id: val.id}).then(res => {
                    if (res.res_code == 1) {
                        sessionStorage.setItem('CaseActiveMaxStep', res.data.step)
                        window.open(url.href, "_blank")
                    }
                })
            },
            deleteCase(val) {
                window.event.stopPropagation()
                this.$Modal.confirm({
                    title: '提示',
                    content: `<p>是否删除该病例！</p>`,
                    onOk: () => {
                        postData('case/removeCase', {id: val.id}).then(res => {
                            if (res.res_code == 1) {
                                this.getList()
                                this.$Message.success(res.msg)
                            }
                        })
                    },
                });
            },
            auditCase(v) {
                window.event.stopPropagation()
                if(v.state == -1 || v.state == 2) this.$Message.info('已审核过该病例')
                else this.$Modal.confirm({
                    title: '提示',
                    closable: true,
                    render: (h) => {
                        return h('RadioGroup', {
                            attrs: {
                                'value': this.radioCheck
                            },
                            on: {
                                'on-change': (val) => {
                                    this.radioCheck = val
                                }
                            }
                        }, [
                            h('Radio', {props: {label: '同意'}}),
                            h('Radio', {props: {label: '拒绝'}}),
                        ])
                    },
                    onOk: () => {
                        let check = {'同意': 2, '拒绝' : -1}
                        PostData('case/approve',{id: v.id, state: check[this.radioCheck]}).then((r) => {
                            if(r.res_code == 1) {
                                this.$Message.info('审核成功!')
                                this.getList()
                            }
                        })
                    },
                    onCancel: () => {
                    }
                });
            },
            rejectCase(val) {
                window.event.stopPropagation()
                this.rejectModal = true
            },
            copyCase(val) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '复制需要1分钟时间，请一分钟查看',
                    onOk: () => {
                        axios.post(url + 'case/copyCase', {token: sessionStorage.getItem('token') || '', id: val.id}).then(res => {
                            if(res.res_code == 1) this.getList()
                        })
                    },
                });
                // postData('case/copyCase', {id: val.id}).then(res => {
                //     console.log(res);
                // })
            },
            getList() {
                let role_id = this.$config.getRoleId()
                let da = role_id > 1 ? this.$config.getOrganizationId() : this.organization_id
                let d = {
                    organization_id: da,
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    degree: this.degree,
                    patient_division: this.patient_division,
                    state: this.state
                }
                postData('case/getCaseList', d).then((res) => {
                    this.list = res.data.list
                    this.list.forEach(item => {
                        if (item.patient_age) {
                            let age = item.patient_age.split('')
                            age[age.length - 1] = age[age.length - 1] == '年' ? '岁' : age[age.length - 1]
                            item.message = item.patient_name + '/' + (item.patient_gender == 'Male' ? '男' : '女') + '/' + age.join('')
                        }
                    })
                    this.total = res.data.all_count
                    this.count = res.data.count
                })
            }
        },
        mounted() {
            this.pageSize = 12
            this.getList()
            this.tableHeight = window.innerHeight - 200
        }
    }
</script>

<style scoped lang="less">
    .content{
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        overflow-y: auto;
        justify-content: center;
        background-color: rgb(242, 242, 242);

        .content-box{
            width: 315px;
            height: 170px;
            margin: 20px;
            background-color: #fff;
            padding: 8px;
            color: #000;
            position: relative;

            &:hover{
                .right-btn{
                    display: flex;
                }
            }
            .right-btn{
                display: none;
            }
        }
        .box-img{
            position: absolute;
            right: -38px;
            top: -20px;
            transform: rotate(335deg);
        }
        .box-degree{
            position: absolute;
            left: 0;
            top: 0;
            width: 30px;
            height: 17px;
            text-align: center;
            line-height: 17px;
            color: #fff;
            font-size: 12px;
        }
        .content-top{
            display: flex;

            .content-top-symptom{
                width: 82px;
                height: 64px;
                background-color:rgba(201, 201, 201, 1);
                display: flex;
                justify-content: center;
                align-items: center
            }
            .content-top-content{
                text-align: left;
                margin-left: 10px;
            }
        }
        .content-bottom{
            display: flex;
            justify-content: space-between;
            position: relative;
            margin-top: 10px;

            .bottom-left{
                text-align: left;
            }
            .bottom-right{
                display: flex;
                flex-direction: column;
                align-items: center;
                position: absolute;
                bottom: -10px;
                right: -6px;

                /deep/ .ivu-btn{
                    font-size: 14px !important;
                }
            }
        }
    }
</style>
