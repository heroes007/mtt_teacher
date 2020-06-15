<template>
    <div>
        <Modal v-model="messageModal" :footer-hide="true" :title="titleModal" width="700" label-position="left" @on-cancel="handleCancel">
            <Form ref="messageForm" :model="outlineForm" :rules="ruleValidate">
                <FormItem label="提纲病症：" style="position: relative" prop="symptom">
                    <Input :disabled="caseDisabled" v-model="outlineForm.symptom" placeholder="请描述主要病症" style="width: 320px;" maxlength="10"/>
                    <div class="input-num">{{outlineForm.symptom.length}}/10</div>
                </FormItem>
                <FormItem label="提纲难度：" prop="degree">
                    <RadioGroup v-model="outlineForm.degree">
                        <Radio :disabled="caseDisabled" label="1">简单</Radio>
                        <Radio :disabled="caseDisabled" label="2">适中</Radio>
                        <Radio :disabled="caseDisabled" label="3">困难</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="所属科室：" prop="dept">
                    <Select :disabled="caseDisabled" style="width: 320px;" v-model="outlineForm.dept">
                        <Option v-for="(item, index) in patient_list" :key="index" :value="item.patient_division">{{item.patient_division}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="提纲概要：" style="position: relative" prop="desc">
                    <Input :disabled="caseDisabled" v-model="outlineForm.desc" placeholder="请描述主要病症" type="textarea" style="width: 480px;" :autosize="{minRows: 5, maxRows: 5}" maxlength="300"/>
                    <div class="textarea-num">{{outlineForm.desc.length}}/300</div>
                </FormItem>
                <div style="display: flex; justify-content: center">
                    <Button @click="handleNext" type="primary" style="width: 150px;">下一步</Button>
                </div>
            </Form>
        </Modal>
        <Modal v-model="rejectModal" :footer-hide="true" title="拒绝理由" width="700">
            <Input type="textarea" :rows="10"/>
            <div style="margin-top: 40px;display: flex;justify-content: center">
                <Button type="primary" style="width: 120px;">确认</Button>
            </div>
        </Modal>
        <distribution :show="showDistribution" @close="closeDistribution" :outline_id="outline_id" @handleCancel="getList"/>
        <screen :typeArr="typeArr" sizeTitle1="提纲总数" :sizeNum1="total" btnName="新建提纲" btnName1="分配审核" placehodle="搜索病症或诊断内容"
                @inputChange="inputChange" @handleClick="handleClick" @handleClick1="handleClick1" :selectSubjects="true" :select2="select2" select2Placeholder="请选择审核状态"
                @selectChange1="selectChange1" @selectChange3="selectChange3" @selectChange2="selectChange2" ></screen>
<!--        <tables :tabel-height="tableHeight" :is-serial=true :column="columns1" :table-data="list" @operation="checkCase" @operation1="editCase"-->
<!--                @operation2="deleteCase" @operation3="auditCase" @operation4="copyCase"></tables>-->
        <div :style="{'height': tableHeight + 'px'}" class="content">
            <div v-for="(item, index) in list" :key="index" class="content-box" @click="checkCase(item)">
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
                        <div>科室： <span>{{item.dept}}</span></div>
                        <div>创建人： <span>{{item.realname}}</span></div>
                        <div>创建时间： <span>{{item.create_time}}</span></div>
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
                            <Button type="primary" @click="distributionCase(item)">分配</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import tables from '../../../components/tables'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import postData from '../../../api/postData'
    var operationList = [['查看','operation'], ['编辑','operation1'], ['删除','operation2'], ['审核','operation3'], ['复制','operation4']]
    import state_1 from '../../../assets/img/audit-sate/state_1.jpg'
    import state_2 from '../../../assets/img/audit-sate/state_2.jpg'
    import state_3 from '../../../assets/img/audit-sate/state_3.jpg'
    import state_5 from '../../../assets/img/audit-sate/state_5.jpg'
    import distribution from './components/distribution'

    export default {
        components: {screen, tables, pageList, distribution},
        mixins: [pageMixin],
        data() {
            return {
                state_1, state_2, state_3, state_5,
                typeArr: ['input', 'isSuper', 'select2', 'size1', 'button', 'button1'],
                sizeNum1: 10,
                tableHeight: null,
                keyword: '',
                rejectModal: false,
                showDistribution: false,
                outline_id: null,
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
                        title: '诊断内容',
                        key: 'icd10_title',
                        align: 'left',
                        minWidth: 200,
                        // render: (h,  param) =>  {
                        //     let d = ''
                        //     JSON.parse(param.row.icd10_names).forEach(item => {
                        //         d = !d ? item :  ',' + item
                        //     })
                        //     return  h('span', d)
                        // }
                    }, {
                        title: '难度',
                        // key: 'degree',
                        align: 'left',
                        minWidth: 80,
                        render: (h, param) => {
                            let d = param.row.degree == 1 ? '简单' : param.row.degree == 2 ? '适中' : '困难'
                            return h('span', d)
                        }
                    }, {
                        title: '科室',
                        key: 'dept',
                        minWidth: 120
                    }, {
                        title: '审核状态',
                        key: 'use_count',
                        minWidth: 120,
                        render: (h, param) => {
                            let data = {'-1': '审核失败', '0': '草稿', '1': '审核中', '2': '审核成功',}
                            let dataColor = {'-1': '#F54802', '0': '#474643', '1': '#4098FF', '2': '#2EBF07',}
                            return h('span', {
                                style: {
                                    color: dataColor[param.row.state],
                                },
                                domProps: {
                                    innerHTML: data[param.row.state]
                                },
                            })
                        }
                    }, {
                        title: '使用次数',
                        key: 'use_count',
                        minWidth: 120
                    }, {
                        title: '更新人',
                        key: 'realname',
                        minWidth: 120
                    }, {
                        title: '更新时间',
                        key: 'create_time',
                        minWidth: 200
                    }, {
                    title: '操作',
                    minWidth: 260,
                    check_id: true,
                    slot: 'operation',
                    operationAllot: true,
                    operation: this.$config.getRoleId() == 1 ? [[...operationList.slice(0, 4)], [...operationList.slice(0, 4)]] : [[...operationList.slice(0, 3)], [...operationList.slice(0, 1), ...operationList.slice(4,5)]],
                }
                ],
                list: [],
                messageModal: false,
                titleModal: '新建提纲',
                outlineForm: {
                    symptom: '',
                    degree: '',
                    dept: '',
                    desc: '',
                },
                ruleValidate: {
                    symptom: [{required: true, message: '请输入提纲病症', trigger: 'change'}],
                    degree: [{required: true, message: '请选择提纲难度'}],
                    dept: [{required: true, message: '请选择提纲所属科室'}],
                    desc: [{required: true, message: '请输入提纲概要', trigger: 'change'}],
                },
                patient_list: [],
                caseDisabled: false,
                select2: [
                    {id: 'all', title: ' 全部'}, {id: -1, title: '审核失败'}, {id: 0, title: '草稿'}, {id: 1, title: '审核中'}, {id: 2, title: '审核成功'}
                ],
                dept: '',
                organization_id: '',
                state: '',
                radioCheck: '同意',
            }
        },
        methods: {
            selectState(state) {
                return state == 4 ? "" : this['state_' + state]
            },
            inputChange(val) {
                this.keyword = val
                this.getList()
            },
            selectChange1(val) {
                this.organization_id = val
                this.getList()
            },
            selectChange2(val) {
                this.state = val == 'all' ? '' : val
                this.getList()
            },
            selectChange3(val) {
                this.dept = val == '全部科室' ? '' : val
                this.getList()
            },
            handleClick() {
                this.$refs.messageForm.resetFields()
                this.modifyCase(this.outlineForm, 'create')
            },
            handleClick1() {
                window.open('dashboard/distribution-outline')
            },
            editCase(val) {
                window.event.stopPropagation()
                this.modifyCase(val, 'edit')
            },
            checkCase(val) {
                this.modifyCase(val, 'check', true)
                this.$router.push({path: 'outline-content', query: {id: this.outlineForm.id || null}})
                sessionStorage.setItem('caseOutline', JSON.stringify(this.outlineForm))
            },
            modifyCase(val, type, state) {
                this.messageModal = !state
                this.outlineForm = val
                val.degree = String(val.degree)
                this.titleModal = type == 'edit' ? '编辑提纲' : '新建提纲'
                sessionStorage.setItem('caseType', JSON.stringify(type))
                this.caseDisabled = type == 'check' ? true : false
            },
            deleteCase(val) {
                window.event.stopPropagation()
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除该病症提纲</p>',
                    onOk: () => {
                        postData('case/removeOutline',{id: val.id}).then(res => {
                          if(res.res_code == 1) {
                              this.getList()
                              this.$Message.success(res.msg)
                          }
                        })
                    },
                });
            },
            rejectCase(val) {
                window.event.stopPropagation()
                this.rejectModal = true
            },
            distributionCase(val) {
                window.event.stopPropagation()
                this.outline_id = val.id
                this.showDistribution =  true
            },
            closeDistribution() {
                this.showDistribution =  false
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
            copyCase(val) {
                postData('case/copyOutline', {id: val.id}).then(res => {
                    if(res.res_code == 1) this.getList()
                })
            },
            getList() {
                let role_id = this.$config.getRoleId()
                let da = role_id > 1 ? this.$config.getOrganizationId() : this.organization_id
                if(role_id == 3) this.columns1[this.columns1.length-1].operation.splice(3, 1)
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: da,
                    dept: this.dept,
                    state: this.state
                }
                postData('case/getOutlineList', d).then((res) => {
                    this.list = res.data.data
                    this.list.map(item => {
                        let d = ''
                        if(item.icd10_names) JSON.parse(item.icd10_names).forEach(item1 => {
                            d = !d ? item1 :  d + ',' + item1
                        })
                        item.icd10_title = d
                    })
                    this.total = res.data.count
                })
            },
            handleNext() {
                this.$refs.messageForm.validate((valid) => {
                    if(valid) {
                        this.$router.push({path: 'outline-content', query: {id: this.outlineForm.id || null}})
                        sessionStorage.setItem('caseOutline', JSON.stringify(this.outlineForm))
                    }
                })
            },
            handleCancel() {
                this.outlineForm = {
                    symptom: '',
                    degree: '',
                    dept: '',
                    desc: '',
                }
            }
        },
        mounted() {
            this.getList()
            this.tableHeight = window.innerHeight - 200
            PostData('common/getDepts').then(res => {
                if(res.res_code == 1) this.patient_list = res.data
            })
        }
    }
</script>

<style scoped lang="less">
    .ivu-form-item{
        display: flex;
    }
    /deep/ .ivu-modal-body{
        padding: 40px;
    }
    /deep/ .ivu-form-item-label{
        font-family: PingFangSC-Regular;
        font-size: 16px !important;
        color: #474C63 !important;
        letter-spacing: 0.93px !important;
        text-align: right;
    }
    /deep/ .ivu-input, /deep/ .ivu-input-number, /deep/ .ivu-radio-wrapper, /deep/ .ivu-checkbox-wrapper{
        border-radius: 4px !important;
        font-family: PingFangSC-Regular !important;
        font-size: 16px !important;
        color: #474C63 !important;
        letter-spacing: 0.93px !important;
    }
    /deep/ .ivu-select-placeholder{
        font-family: PingFangSC-Regular;
        font-size: 16px!important;
        color: #9397AD;
        letter-spacing: 0.93px;
    }
    /deep/ .ivu-radio-inner, /deep/ .ivu-checkbox-inner{
        width: 16px;
        height: 16px;
    }
    /deep/ .ivu-radio-inner:after{
        left: 2px;
        top: 2px;
    }
    /deep/ .ivu-checkbox-inner:after{
        left: 5px;
        top: 3px;
    }
    /deep/ .ivu-radio-wrapper, /deep/ .ivu-checkbox-wrapper{
        margin-right: 30px;
    }
    .input-num{
        position: absolute;
        top: 0;
        right: -40px;
        line-height: 36px
    }
    .textarea-num{
        position: absolute;
        bottom: 0;
        right: -62px;
        line-height: 36px
    }
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
