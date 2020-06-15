<template>
   <div class="user-manage-main">
        <screen :selectSubjects="true" :select2="select2" :btn-type="btnType" @selectChange1="selectChange1" @selectChange3="selectChange3"  :select-type1="selectType1" :typeArr="typeArr" size-title1="练习总数" :size-num1="total"
        searchDropDownPlaceholder="请输入症状关键词（多选）" @selectChange2="selectChange2"  @searchDropDownChange="searchDropDownChange" :searchDropDown="symptom" :select2_1="difficultyList"  @selectChange2_1="selectChange2_1" />
        <Tables :tabel-height="tableHeight" :is-serial=true @operation1="see" :column="columns1" :table-data="list" />
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
            typeArr: ['isSuper','select2','select2_1','searchDropDown','size1'],
            selectType1: false,
            organization_id:'',
            list: [],
            symptom: [],
            select2: [{title: '选择评分状态', id: 'all'},{title: '未评分', id: 0},{title: '已评分', id: 1}],
            difficultyList: [{id: 'all', title: '选择难度'},{id: 1, title: '简单'},{id: 2, title: '适中'},{id: 3, title: '困难'}],
            operationList: [[['评分','查看'],'operation1']],
            symptomList: [],
            degree: null,
            score_state: null,
            patient_division: null,
        }
    },
    computed: {
         columns1(){
            return [
            {
                title: '病例症状',
                key: 'symptom',
                align: 'left',
                minWidth: 200
            },
            // {
            //     title: '所属科室',
            //     key: 'patient_division',
            //     align: 'left',
            //     minWidth: 150
            // },
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
                title: '真实姓名',
                key: 'realname',
                minWidth: 100
            },
            {
                title: '评分',
                key: '',
                minWidth: 100,
                render: (h, params) => {
                    let d = params.row.score_state == 1 ? params.row.score : '-'
                    return h('span', d)
                }
            },
            {
                title: '提交时间',
                key: 'last_time',
                minWidth: 100
            },
            {
                title: '操作人',
                key: 'operator',
                minWidth: 100
            },
            {
                title: '操作',
                minWidth: 260,
                operation_state: true,
                slot: 'operation',
                align: 'left',
                operation: [[['查看', (this.$config.getRoleId()==3 || this.$config.getRoleId()==2) ? '评分' : ''],'operation1']],
            }]
         }
    },
    beforeDestroy() {
        this.see = null;
        this.getList = null;
    },
    methods: {
        //查看
        see(row,rowIndex){
            // state 1--查看 2--评分
            let state = row.score_state===1 ? 1 : row.score_state===0 ? 2 : 0;
            let querys = {id: row.id, case_id: row.case_id, type: 1, state, back: 'exercise-manage', do_state: 1, score_state: row.score_state}
            let query = row.score_state === 1 ? {...querys, score: row.score} : querys
            let d = { query, name: "view-reports"}
            let role_id = this.$config.getRoleId() 
            if(state == 1) this.$router.replace(d)
            if(state == 2){
                if(role_id == 3 || role_id == 2) this.$router.replace(d)
                // else  this.$Message.info('无评分权限');
            }  
        },
        selectChange3(val){
            this.patient_division = val != '全部科室' ? val : ''
            this.getList()
        },
        selectChange1(val){
            this.organization_id = val
            this.getList()
        },
        selectChange2_1(val){
          this.degree = val
          this.getList()
        },
        selectChange2(val) {
            this.score_state = val == 'all' ? '' : val
            this.getList()
        },
        searchDropDownChange(val){
            this.symptomList = val;
            this.getList()
        },
        getList(){
            let d = {
              page_size: this.pageSize,
              page_num: this.current,
              symptom: this.symptomList,
              degree: this.degree,
              patient_division: this.patient_division,
              organization_id: this.$config.getOrganizationId(this.organization_id),
              score_state: this.score_state
            }
            postData('exercise/getExerciseList', d).then((res) => {
                 if(res.res_code == 1){
                    this.list = res.data.list
                    this.total = res.data.count
                 }
            })
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
    }
  }
</script>

