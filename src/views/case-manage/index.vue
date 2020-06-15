<template>
   <div class="user-manage-main">
        <FormModal :modal-false="true"  :detail-data="tableRow" :show-modal='show' :form-list="formList" @close="closeModal" @from-submit="handleSubmit"
                   :title="modalTitle" :rule-validate='rules'/>
        <!-- :select2="IntendedForList"  --> 
        <screen :selectSubjects="true" :btn-type="btnType" @selectChange3="selectChange3"  :select-type1="selectType1" :typeArr="typeArr" size-title1="病例总数" :size-num1="total" btn-name="添加病例"
        searchDropDownPlaceholder="请输入症状关键词（多选）"  @searchDropDownChange="searchDropDownChange" :searchDropDown="symptom" :select2_1="difficultyList"  @selectChange2_1="selectChange2_1" @handleClick="handleClick"/>
        <Tables :tabel-height="tableHeight" :is-serial=true @operation1="see" @operation2="deletes"  @table-swtich="tableSwtich" :column="columns1" :table-data="list" />
       <page-list class="page-main" :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>
<script>
  import Tables from 'components/tables.vue'
  import FormModal from 'components/FormModal.vue'
  import screen from 'components/ScreenFrame'
  import FormModalMixin from '../UserManage/Mixins/FormModalMixin'
  import jurisdictionList from '../UserManage/jurisdictionList'
  import UserMixins from '../UserManage/Mixins/UserMixins'
  import postData from 'src/api/postData'
  import pageList from 'components/Page'
  import pageMixin from '../mixins/pageMixins'
  import  { validatePass, validateUsername3 } from '../UserManage/validate'
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, pageList },
    mixins: [ FormModalMixin, UserMixins, pageMixin ],
    data (){
        return{
            modalTitle: '',
            typeArr: ['select2_1','searchDropDown','size1'],
            tableRow: {},
            selectType1: false,
            organization_id:'',
            list: [],
            symptom: [],
            // IntendedForList: [{id: 'all', title: '不限'},{id: 1, title: '住培一年级'},{id: 2, title: '住培二年级'},{id: 3, title: '住培三年级'}],
            difficultyList: [{id: 'all', title: '选择难度'},{id: 1, title: '简单'},{id: 2, title: '适中'},{id: 3, title: '困难'}],
            operationList: [['查看','operation1']],
            formList: [
                { type: 'input', name: '真实姓名',  field: 'realname'},
                { type: 'select', name: '证件类型', field: 'types' ,
                    selectList: [{id: 1, title: '身份证'},{id: 2, title: '工号'}], selectField: [ 'id','title' ]
                },
                { type: 'input', name: '证件号码',  field: 'cacc'},
                { type: 'input', name: '病例账号',  field: 'username' },
                { type: 'password', name: '账号密码',  field: 'password' },
                { type: 'select', name: '所属机构', field: 'organization_id' ,
                    selectList: [], selectField: [ 'id','title' ]
                },
            ],
            symptomList: [],
            degree: null,
            patient_division: null,
            rules:{
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                cacc: [{ required: true, message: '请输入证件号', trigger: 'blur' } ],
                username: [{ required: true, validator: validateUsername3 }],
                password: [{ required: true, validator: validatePass }],
                organization_id: [{ required: true, message: '请选择机构' } ],
                types: [{ required: true, message: '请选择证件类型' } ],
            }
        }
    },
    computed: {
         columns1(){
            return [
            {
                title: '症状',
                key: 'symptom',
                align: 'left',
                minWidth: 200
            },
            {
                title: '所属科室',
                key: 'patient_division',
                align: 'left',
                minWidth: 150
            },
            {
                title: '难度',
                key: '',
                minWidth: 80,
                render: (h, params) => {
                    let sex = params.row.degree == 1 ? '简单' : params.row.degree == 2 ? '适中' : '困难'
                    return h('span', sex)
                }
            },
            {
                title: '患者姓名',
                key: 'patient_name',
                minWidth: 100
            },
             {
                title: '性别',
                key: '',
                minWidth: 80,
                render: (h, params) => {
                    let sex = this.$config.setSex(params.row.patient_gender)
                    return h('span', sex)
                }
            },
            {
                title: '年龄',
                key: 'patient_age',
                minWidth: 80
            },
            {
                title: '使用次数',
                key: '',
                minWidth: 100,
                render: (h, params) => {
                    return h('span', '-')
                }
            },
            {
                title: '操作',
                minWidth: 260,
                slot: 'operation',
                align: 'left',
                operation: [['查看','operation1'],['删除','operation2']],
            }]
         }
    },
    beforeDestroy() {
        this.see = null;
        this.deletes = null;
        this.getList = null;
    },
    methods: {
        //查看
        see(row,rowIndex){
            let routeData = this.$router.resolve({ query: {case_id: row.id}, name: "view-cases" });
            window.open(routeData.href, "_blank")
        },
        selectChange3(val){
            this.patient_division = val != '全部科室' ? val : ''
            this.getList()
        },
        deletes(row,rowIndex){
            let d = {
                id: row.id,
                organization_id: +sessionStorage.getItem('organizationId')
            }
            this.$config.deleteModal(() => {
                this.$config.fnPost('case/removeCase', d, () => { this.getList() })
            })
        },
        selectChange2_1(val){
          this.degree = val
          this.getList()
        },
        setOrganization(){
             if(this.organizationList){
                // if(this.role_id == 1){
                //     this.getOrganization()
                //   this.$nextTick(()=>{
                //     this.formList[1].selectList = this.organizationList
                //   })
                // }else if(this.formList[1].field == 'organization_id') this.formList.splice(1,1);
            }
        },
        searchDropDownChange(val){
            this.symptomList = val;
            this.getList()
        },
        handleClick(){
            this.modalTitle = '添加病例'
            this.show = true
            this.tableRow = {}
            this.setOrganization()
        },
        getList(){
            let d = {
              page_size: this.pageSize,
              page_num: this.current,
              symptom: this.symptomList,
              degree: this.degree,
              organization_id: this.$config.getOrganizationId(),
              patient_division: this.patient_division
            }
            postData('case/getCaseList', d).then((res) => {
                 if(res.res_code == 1){
                    this.list = res.data.list
                    this.total = res.data.count
                 }
            })
        },
        tableSwtich(r){
          let d = { id: r.id, state:  r.states ? 0 : -1 }
        //   this.fromAddAndEdit('user/removeDept', d)
        },
        handleSubmit(val){
          let d = val
          // d.role_id = this.role
          // if(this.role_id != 1) d.organization_id = +sessionStorage.getItem('organizationId')
          // if(this.modalTitle == ('添加病例')) this.fromAddAndEdit('/user/addDeptTeacher',d)
        },
        getSymptom(){
            postData('common/getSymptoms').then((res)=>{
                if(res.res_code==1){
                    this.symptom = res.data
                    if(this.symptom.length>0){
                        this.symptom.map((t)=>{
                            t.id = t.symptom
                            t.title = t.symptom
                        })
                    }
                }
            })
        }
    },
    mounted() {
        this.tableHeight = window.innerHeight - 200
        this.getList()
        this.getSymptom()
        // this.organizationList = null
        // if(this.role_id == 1)  this.getOrganization()
    }
  }
</script>

