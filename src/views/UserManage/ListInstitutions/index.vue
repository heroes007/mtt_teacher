<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <FormModal :modal-false="true" :detail-data="tableRow" :uploadFlie=true :show-modal='show' :form-list="formList" @from-submit="handleSubmit"
                   @close="closeModal" :title="modalTitle" :rule-validate="rules" :maxFileSize="2"/>
        <screen :btn-type="btnType"  :typeArr="typeArr"  size-title1="机构总数" :size-num1="total" btn-name="添加机构" placehodle="搜索机构名称"  @inputChange="inputChange"
                @handleClick="handleClick" @handleClick1="handleClick1" btn-name1="批量分配病例"/>
        <Tables :tabel-height="tableHeight" :is-serial=true @operation1="see" @operation2="edit" @operation3="allocationCases" :column="columns1" :table-data="list" :select-list="institution"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>
<script>
  import Tables from '../../../components/tables.vue'
  import FormModal from '../../../components/FormModal.vue'
  import screen from '../../../components/ScreenFrame'
  import see from '../../../components/SeeInfo.vue'
  import seeMixin from '../Mixins/seeMixin'
  import FormModalMixin from '../Mixins/FormModalMixin'
  import postData from 'src/api/postData'
  import { mapState } from 'vuex'
  import UserMixins from '../Mixins/UserMixins'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  import  { validatePass, validateUsername2 } from '../validate'
  import subdomainUrl from '../../../../config/subdomainUrl'

  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, see, pageList },
    mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
    props: {
        permissionItem2: {
            type: Object,
            default: null
        }
    },
    data (){
        return{
            modalTitle: '',
            tableRow: {},
            tableRowData: {},
            keyword: '',
            typeArr: ['input','size1','button', 'button1'],
            columns1: [
            {
                title: '机构名称',
                key: 'title',
                align: 'left',
                minWidth: 100
            },
            {
                title: '老师总数',
                key: 'teacher_count',
                minWidth: 100
            },
            {
                title: '学员总数',
                key: 'student_count',
                minWidth: 100
            },
            {
                title: '病例总数',
                key: 'case_count',
                minWidth: 100
            },
             {
                title: '用户ID',
                key: 'username',
                align: 'left',
                minWidth: 150
            },
            {
                key: 'rname',
                title: '身份',
                minWidth: 120,
            },
            {
                title: '状态',
                key: 'state_name',
                minWidth: 100
            },
            {
                title: '最近登录时间',
                key: 'update_time',
                align: 'left',
                minWidth: 190
            },
            {
                title: '操作',
                minWidth: 300,
                slot: 'operation',
                align: 'left',
                isSwitch: true, // true --> 正常 false --> 禁用
                switchKey: 'states',
                switchList: ['正常', '停用'],
                operation: [['查看','operation1'], ['编辑','operation2'],['分配病例','operation3']],
            }],
            list: [],
            formList: [
                { type: 'input', name: '机构名称',  field: 'title'},
                { type: 'input', name: '机构域名', field: 'subdomain', subdomainUrl: subdomainUrl },
                { type: 'input', name: '机构账号',  field: 'username' },
                { type: 'password', name: '账号密码',  field: 'password' },
                { type: 'textarea', name: '机构介绍',  field: 'desc' },
            ],
            rules:{
                title: [{ required: true, message: '请输入机构名称', trigger: 'blur' } ],
                subdomain: [{ required: true, message: '请输入子域名', trigger: 'blur' } ],
                username: [{ required: true, validator: validateUsername2 }],
                password: [{ required: true, validator: validatePass }],
                desc: [{ required: true, message: '请输入机构介绍', trigger: 'blur' } ],
            },
            operationList: [['查看','operation1'], ['编辑','operation2'],['分配病例','operation3']]
        }
    },
    watch: {
        permissionItem2(_new){
            // this.handleAuth(_new)
        }
    },
    methods: {
        allocationCases(row,rowIndex){
            this.$router.push({name: "distribution-case", query: {organization_id: row.id}})
        },
        see(row,rowIndex){
          this.tableRowData = row;
          this.tableRowData.mechanismName = row.title
          this.detailShow = true;
        },
        edit(row,rowIndex){
            this.show = true
            row.head_img = row.logo_img&&row.logo_img != '-' ? row.logo_img : ''
            this.modalTitle = '编辑机构'
            this.tableRow = row
        },
        deletes(row,rowIndex){
          this.fromAddAndEdit('user/removeDept', {id: row.organization_id})
        },
        inputChange(val){
           this.keyword = val;
           this.getList()
        },
        handleClick(){
            this.modalTitle = '添加机构'
            this.show = true
            this.tableRow = {}
        },
        handleClick1() {
            this.$router.push({name: "distribution-case"})
            let arr = []
            // axios.post('http://api.9mededu.com/met/product/curriculum_online/get_list', {
            //     token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjE1NCwicm9sZV9pZCI6MSwib3JnYW5pemF0aW9uX2lkIjoxLCJleHAiOjE1ODM5MTk0MjM0OTB9.ozuuVmOywO1Xy3REH3UwzHAN6IMO1qodklSorCMwXvw",
            //     product_id: 39,
            //     page_size: 998,
            //     page_num: 1,
            // }).then(res => {
            //     res.data.data.data.forEach(item => {
            //         axios.post('http://api.9mededu.com/met/product/curriculum_online_catalog/get_list', {
            //             token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjE1NCwicm9sZV9pZCI6MSwib3JnYW5pemF0aW9uX2lkIjoxLCJleHAiOjE1ODM5MTk0MjM0OTB9.ozuuVmOywO1Xy3REH3UwzHAN6IMO1qodklSorCMwXvw",
            //             curriculum_online_id: item.id
            //         }).then(re => {
            //             re.data.data.forEach(item1 => {
            //                 item1.children.forEach(item2 => {
            //                     arr.push(item2.video_url)
            //                 })
            //             })
            //         })
            //     })
            // }).then(() => {
            //     setTimeout(() => {
            //         console.log(arr, 'arr');
            //     }, 2000)
            // })
        },
        getList(){
            let d = {
              keyword: this.keyword,
              page_size: this.pageSize,
              page_num: this.current
            }
            postData('user/getOrgList', d).then((res) => {
              this.list = res.data.list
              this.total = res.data.count
              this.list.map((t) => {
                t.state_name = t.state == -1 ? '停用' : '正常'
                t.states = t.state == -1 ? false : true
              })
            })
        },
        handleSubmit(val) {
          val.role_id = 2
          val.logo_img = val.head_img
          if(this.modalTitle === '添加机构') this.fromAddAndEdit('user/addOrgAndAdmin', val)
          else this.fromAddAndEdit('user/modifyOrgAndAdmin', val)
        },
    },
    mounted() {
        this.getList()
        // if(this.permissionItem2) this.handleAuth(this.permissionItem2)
    }
  }
</script>
<style scoped>
</style>
