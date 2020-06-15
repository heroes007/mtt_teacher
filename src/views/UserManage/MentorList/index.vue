<template>
    <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close"/>
        <transfer :showTransfer="showTransfer" @transferCancel="transferCancel" :downUrl="downUrl" :mould="mould" type="teacher"/>
        <FormModal :modal-false="true" :detail-data="tableRow" :show-modal='show' :form-list="formList"
                   @close="closeModal" @from-submit="handleSubmit"
                   :title="modalTitle" :rule-validate='rules'/>
        <screen :btn-type="btnType" :select-type1="selectType1" :typeArr="typeArr" size-title1="老师总数" :size-num1="total"
                btn-name="添加老师"
                placehodle="搜索用户ID/姓名" @selectChange1="selectChange1" @inputChange="inputChange"
                @handleClick="handleClick" @handleClick1="transferCancel(true)" btn-name1="导入/导出"/>
        <Tables :tabel-height="tableHeight" :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"
                :column="columns1" :table-data="list" :select-list="mentor"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>
<script>
    import Tables from '../../../components/tables.vue'
    import FormModal from '../../../components/FormModal.vue'
    import screen from '../../../components/ScreenFrame'
    import see from '../../../components/SeeInfo.vue'
    import transfer from '../../../components/transfer'
    import seeMixin from '../Mixins/seeMixin'
    import FormModalMixin from '../Mixins/FormModalMixin'
    import jurisdictionList from '../jurisdictionList'
    import UserMixins from '../Mixins/UserMixins'
    import postData from 'src/api/postData'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import {validatePass, validateUsername3} from '../validate'
    import baseUrl from '../../../../config/url.js'

    export default {
        name: "ManagementList",
        components: {Tables, FormModal, screen, see, pageList, transfer},
        mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
        props: {
            permissionItem3: {
                type: Object,
                default: null
            }
        },
        watch: {
            permissionItem3(_new) {
                // this.handleAuth(_new)
            }
        },
        data() {
            return {
                mould: 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com/user_task/20200219103219.xls',
                modalTitle: '',
                typeArr: ['isSuper', 'input', 'size1', 'button', 'button1'],
                tableRow: {},
                tableRowData: {},
                selectType1: false,
                keyword: '',
                organization_id: '',
                list: [],
                operationList: [['查看', 'operation1'], ['编辑', 'operation2'], ['删除', 'operation3']],
                formList: [
                    {type: 'input', name: '真实姓名', field: 'realname'},
                    {
                        type: 'select', name: '所属机构', field: 'organization_id',
                        selectList: [], selectField: ['id', 'title']
                    },
                    {
                        type: 'select', name: '科室', field: 'dept_id',
                        selectList: [], selectField: ['id', 'title']
                    },
                    {
                        type: 'select', name: '职称', field: 'profession_id',
                        selectList: [], selectField: ['id', 'title']
                    },
                    {type: 'input', name: '老师账号', field: 'username'},
                    {type: 'password', name: '账号密码', field: 'password'},
                ],
                rules: {
                    realname: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
                    dept_id: [{required: true, message: '请选择科室'}],
                    profession_id: [{required: true, message: '请选择职称'}],
                    username: [{required: true, validator: validateUsername3}],
                    password: [{required: true, validator: validatePass}],
                    organization_id: [{required: true, message: '请选择机构'}],
                },
                showTransfer: false
            }
        },
        computed: {
            downUrl() {
                let word = (this.keyword || this.organization_id) ? '?' + this.keyword ? this.organization_id ? `keyword=${this.keyword}&organization_id=${this.organization_id}` : `keyword=${this.keyword}` :`organization_id=${this.organization_id}` : ''
                return  baseUrl + 'user/exportTeachersToExcel' + word + (word.includes('?') ? '&' : '?') +`token=${sessionStorage.getItem('token')}`
            },
            columns1() {
                return [
                    {
                        title: '用户ID',
                        key: 'username',
                        align: 'left',
                        minWidth: 100
                    }, {
                        title: '真实姓名',
                        key: 'realname',
                        minWidth: 100
                    },
                    {
                        key: 'rname',
                        title: '身份',
                        minWidth: 100,
                    },
                    {title: '所属机构', key: 'title', align: 'left', minWidth: 100},
                    {
                        title: '最近登录时间',
                        key: 'update_time',
                        align: 'left',
                        minWidth: 190
                    },
                    {
                        title: '操作',
                        minWidth: 260,
                        slot: 'operation',
                        align: 'left',
                        operation: [['查看', 'operation1'], ['编辑', 'operation2'], ['删除', 'operation3']],
                    }]
            }
        },
        methods: {
            transferCancel(val, data) {
                this.showTransfer = val
                if(data) this.getList()
            },
            see(row, rowIndex) {
                window.open('/dashboard/mentor-derails')
                // this.detailShow = true;
                // this.tableRowData = row;
            },
            edit(row, rowIndex) {
                this.modalTitle = '编辑老师'
                this.show = true
                this.tableRow = {
                    realname: row.realname,
                    username: row.username,
                    password: row.password,
                    id: row.id,
                    organization_id: row.organization_id
                }
                this.setOrganization()
            },
            deletes(row, rowIndex) {
                let de = () => {
                    this.fromAddAndEdit('user/cancelTeacher', {id: row.id})
                }
                this.$config.deleteModal(de)
            },
            selectChange1(val) {
                this.organization_id = val
                this.getList()
            },
            inputChange(val) {
                this.keyword = val
                this.getList()
            },
            setOrganization() {
                if (this.organizationList) {
                    this.$nextTick(() => {
                        this.formList[1].selectList = this.organizationList
                    })
                }
            },
            handleClick() {
                this.modalTitle = '添加老师'
                this.show = true
                this.tableRow = {}
                this.setOrganization()
            },
            getList() {
                let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
                let org = role_id === 1 ? this.organization_id : this.getOrganizationId
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: org
                }
                postData('user/getTeacherList', d).then((res) => {
                    if (res.res_code == 1) {
                        this.list = res.data.list
                        this.total = res.data.count
                    }
                })
            },
            handleSubmit(val) {
                let d = val
                if (this.role_id != 1) d.organization_id = +sessionStorage.getItem('organizationId')
                if (this.modalTitle == ('添加老师')) this.fromAddAndEdit('user/addTeacher', d)
                else this.fromAddAndEdit('user/modifyTeacher', d)
            },
            getData() {
                postData('common/getDeptsNew').then(res => {
                    this.formList[2].selectList = res.data
                })
                postData('/common/getProfession').then(res => {
                    this.formList[3].selectList = res.data
                })
            }
        },
        mounted() {
            this.getList()
            // if(this.permissionItem3) this.handleAuth(this.permissionItem3)
            if (this.role_id == 1) this.getOrganization()
            else this.organization_id = +sessionStorage.getItem('organizationId')
            this.getData()
        }
    }
</script>

