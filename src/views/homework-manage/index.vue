<template>
    <div class="user-manage-main">
        <screen :btn-type="btnType" :typeArr="typeArr" size-title1="作业总数" :size-num1="total" btn-name="创建作业" @selectChange1="selectChange1" @inputChange="inputChange" @handleClick="handleClick"
        placehodle="请输入关键字"  :select2Placeholder="select2Placeholder" @selectChange2="selectChange2" :select2="select2"/>
        <Tables :tabel-height="tableHeight" :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" :select-list="management"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>
<script>
    import Tables from '../../components/tables.vue'
    import screen from '../../components/ScreenFrame'
    import postData from 'src/api/postData'
    import pageList from '../../components/Page'
    import pageMixin from '../mixins/pageMixins'

    export default {
        components: { Tables, screen, pageList },
        mixins: [pageMixin],
        props: {
            permissionItem1: {
                type: Object,
                default: null
            }
        },
        data (){
            return{
                modalTitle: '',
                tableRow: {},
                tableRowData: {},
                columns1: [
                    {
                        title: '作业标题',
                        key: 'title',
                        align: 'left',
                        minWidth: 200
                    },{
                        title: '病例数量',
                        key: 'case_count',
                        minWidth: 100
                    },
                    {
                        title: '分配人数',
                        key: 'divide_count',
                        minWidth: 100
                    },
                    {
                        title: '状态',
                        key: 'homework_state',
                        minWidth: 100,
                        render: (h, param) => {
                                let data = param.row.homework_state == 1 ? '已开始' : param.row.homework_state == -1 ? '已结束' : '未开始'
                            return h('span', data)
                        }
                    },
                    {
                        title: '开始时间',
                        key: 'start_time',
                        minWidth: 200
                    },
                    {
                        title: '结束时间',
                        key: 'end_time',
                        minWidth: 200
                    },
                    {
                        title: '创建人',
                        key: 'realname',
                        minWidth: 200
                    },
                    {
                        title: '操作',
                        minWidth: 260,
                        slot: 'operation',
                        operationSlice: true,
                        sliceType: 'homework_state',
                        operation: [['查看','operation1'], ['编辑','operation2'], ['删除','operation3']],
                    }],
                list:[],
                formList: [
                    { type: 'input', name: '真实姓名',  field: 'realname'},
                    { type: 'input', name: '管理账号',  field: 'username' },
                    { type: 'password', name: '账号密码',  field: 'password' },
                ],
                rules:{
                    realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                },
                data1: null,
                keyword: '',
                operationList: [['查看','operation1'], ['编辑','operation2'], ['删除','operation3']],
                tableHeight: null,
                management: [],
                typeArr: ['isSuper', 'select2', 'input', 'size1', 'button'],
                btnType: true,
                select2Placeholder: '请选择状态',
                organization_id: null,
                select2: [{title: '全部', id: 'all'},{title: '未开始', id: 0},{title: '已开始', id: 1}, {title: '已结束', id: -1}],
                homework_state: ''
            }
        },
        methods: {
            see(row,rowIndex){
                this.$router.replace({name: 'check-exam', query: {type: 2, id: row.id}})
            },
            edit(row,rowIndex){
                this.$router.replace({name: 'creat-exam', query: {id: row.id, type: 2}})
            },
            deletes(row,rowIndex){
                this.$config.deleteModal(() => {
                    this.$config.fnPost('homework/removeHomework', {id: row.id}, () => { this.getList() })
                })
            },
            inputChange(val){
                this.keyword = val;
                this.getList()
            },
            selectChange1(val) {
                this.organization_id = val
                this.getList()
            },
            selectChange2(val) {
                this.homework_state = val == 'all' ? '' : val
                this.getList()
            },
            handleClick(){
                this.$router.replace({name: 'creat-exam', query: {type: 2}})
            },
            getList(){
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: this.$config.getOrganizationId(this.organization_id),
                    homework_state: this.homework_state
                }
                postData('homework/getHomeworkList', d).then((res) => {
                    this.list = res.data.list
                    this.total = res.data.count
                })
            }
        },
        mounted() {
            this.getList()
            this.tableHeight = window.innerHeight - 200
        }
    }
</script>
