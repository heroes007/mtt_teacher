<template>
   <div class="user-manage-main">
	    <transfer :showTransfer="showTransfer" @transferCancel="transferCancel" :downUrl="downUrl" :mould="mould"/>
        <comparison :show="showComparison" @close="close" />
        <FormModal :modal-false="true"  :detail-data="tableRow" :show-modal='show' :form-list="formList" @close="closeModal" @from-submit="handleSubmit"
         @change-list="changeList"  modalText="*学员账号为证件号，密码是证件号后四位"   :title="modalTitle" :rule-validate='rules'/>
        <screen :btn-type="btnType" :select-type1="selectType1" :typeArr="typeArr" size-title1="学员总数" :size-num1="total" btn-name="添加学员"
                @handleClick1="transferCancel(true)" btn-name1="导入/导出"  placehodle="搜索用户ID/姓名/证件号"   @selectChange1="selectChange1"  @inputChange="inputChange" @handleClick="handleClick"/>
        <div class="student-comparison">
            <div class="texts">学员对比</div>
            <div class="student-comparison2">
                <div @click="studentComparison" class="student-comparison2-bg">
                    <img class="pk" :src="pk" />
                </div>
            </div>
        </div>
        <Tables :tabel-height="tableHeight" :is-serial=true @operation1="see" @operation2="deletes"  @table-swtich="tableSwtich" :column="columns1" :table-data="list"  :select-list="student"/>
       <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>
<script>
  import Tables from '../../../components/tables.vue'
  import FormModal from '../../../components/FormModal.vue'
  import screen from '../../../components/ScreenFrame'
  import FormModalMixin from '../Mixins/FormModalMixin'
  import jurisdictionList from '../jurisdictionList'
  import UserMixins from '../Mixins/UserMixins'
  import seeMixin from '../Mixins/seeMixin'
  import postData from 'src/api/postData'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  import pk from '../../../assets/img/pk.png'
  import comparison from './comparison'
  import transfer from '../../../components/transfer'
  import baseUrl from '../../../../config/url.js'

  let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
  const IDTYPE = [{id: 1, title: '身份证'},{id: 2, title: '工作证'},{id: 3, title: '手机号'},{id: 4, title: '学生证'},{id: 5, title: '护照'}]
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, pageList, comparison, transfer },
    mixins: [ FormModalMixin, UserMixins, pageMixin, seeMixin],
    props: {
        permissionItem4: {
            type: Object,
            default: null
        }
    },
    watch: {
        permissionItem4(_new){
            // this.handleAuth(_new)
        }
    },
    data (){
        const validateCheck = (rule, value, callback) => {
            let ID = /^(^\d{18}$|^\d{17}(\d|X|x))$/;
            let passport = /^1[45][0-9]{7}$|([P|p|S|s]\d{7}$)|([S|s|G|g]\d{8}$)|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|([H|h|M|m]\d{8,10})$/;
            let JobNum = /^[a-zA-Z0-9]{4,}$/;
            let phone = /^[1]([3-9])[0-9]{9}$/;
            if (value == ''||value == undefined) {
                callback(new Error('请输入证件号码'));
            } else if (this.caccval == 1) {
                if(ID.test(value)) callback();
                else callback(new Error('请输入正确的身份证号码'));
            } else if (this.caccval == 2||this.caccval == 4) {
                let text = this.caccval == 2 ? '工作证' : '学生证'
                if(JobNum.test(value)) callback();
                else callback(new Error('请输入正确的'+text));
            } else if (this.caccval == 3) {
                if(phone.test(value)) callback();
                else callback(new Error('请输入正确的手机号'));
            }else if (this.caccval == 5) {
                if(passport.test(value)) callback();
                else callback(new Error('请输入正确的护照号码'));
            }
        };
        const realnameItem = { type: 'input', name: '真实姓名',  field: 'realname'}
        const sexItem =  { type: 'radio', name: '性别', selectField: [ 'id','name' ], field: 'sex',selectList: [{id: 1, name: '男'}, {id: 0, name: '女'}] }
        const organizationItem = { type: 'select', name: '所属机构', field: 'organization_id' ,
                selectList: [], selectField: [ 'id','title' ]
        }
        const formItem = role_id == 1 ? [realnameItem, sexItem, organizationItem] : [realnameItem, sexItem]
        return{
			mould: 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com/user_task/20200219103242.xls',
            pk, showComparison: false,
            modalTitle: '',
            tableRow: {},   
			showTransfer: false,
            tableRowData: {},
            selectType1: false,
            keyword: '',
            organization_id:'',
            list: [],
            operationList: [['查看','operation1']],
            caccval: null,
            formList: [
                ...formItem,
                { type: 'select', name: '班级/年级', field: 'grade_id' , selectChange: true,
                    selectList: [], selectField: [ 'id','title' ]
                },
                { type: 'select', name: '科室', field: 'dept_id' , selectChange: true,
                    selectList: [], selectField: [ 'id','title' ]
                },
                { type: 'select', name: '学员类型', field: 'student_type_id' , selectChange: true,
                    selectList: [], selectField: [ 'id','title' ]
                },
                { type: 'select', name: '证件类型', field: 'id_type' , selectChange: true,
                    selectList: IDTYPE, selectField: [ 'id','title' ]
                },
                { type: 'input', name: '证件号码',  field: 'id_num'}
            ],
            rules:{
                sex: [{ required: true, message: '请选择性别'}],
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                organization_id: [{ required: true, message: '请选择机构' } ],
                id_type: [{ required: true, message: '请选择证件类型' } ],
                grade_id: [{ required: true, message: '请选择班级/年级' } ],
                dept_id: [{ required: true, message: '请选择科室' } ],
                student_type_id: [{ required: true, message: '请选择学员类型' } ],
                id_num: [{ required: true, validator: validateCheck, } ],
            }
        }
    },
    computed: {
		downUrl() {
		    let word = (this.keyword || this.organization_id) ? '?' + this.keyword ? this.organization_id ? `keyword=${this.keyword}&organization_id=${this.organization_id}` : `keyword=${this.keyword}` :`organization_id=${this.organization_id}` : ''
		    return  baseUrl + 'user/exportStudentsToExcel' + word + (word.includes('?') ? '&' : '?') +`token=${sessionStorage.getItem('token')}`
		},
         typeArr(){
             let d = ['isSuper','input','size1', 'button1'];
             return (this.role_id == 1 || this.role_id == 2) ? [...d,,'button'] : d
         },
         columns1(){
            return [
            {
                title: '用户ID',
                key: 'username',
                align: 'left',
                minWidth: 100
            },{
                title: '真实姓名',
                key: 'realname',
                minWidth: 100
            },
            {
                title: '性别',
                key: '',
                minWidth: 100,
                render: (h, params) => {
                    let d = this.$config.setSex(params.row.sex)
                    return h('span', d)
                }
            },
            { title: '所属机构', key: 'organization_name', align: 'left', minWidth: 100 },
            {
                title: '证件类型',
                key: '',
                minWidth: 100,
                render: (h, params) => {
                    let d = params.row.id_type;
                    let text = '-'
                    if(d){
                        IDTYPE.forEach((t)=>{
                            if(t.id == d) text = t.title
                        })
                    }
                    return h('span', text)
                }
            },
            {
                title: '证件号',
                key: 'id_num',
                align: 'left',
                minWidth: 180
            },
            {
                title: '状态',
                key: 'state_name',
                minWidth: 80,
                render: (h, params) => {
                    let d = params.row.state == -1 ? '停用' : '正常'
                    return h('span', d)
                }
            },
            {
                title: '注册时间',
                key: 'create_time',
                align: 'left',
                minWidth: 190
            },
            {
                title: '操作',
                minWidth: 260,
                slot: 'operation',
                align: 'left',
                isSwitch: true, // true --> 正常 false --> 禁用
                switchKey: 'states',
                deletes: true,
                switchList: ['正常', '停用'],
                operation: [['查看','operation1'],'isSwitch',['删除','operation2']],
            }]
         }
    },
    methods: {
		transferCancel(val, data) {
		    this.showTransfer = val
		    if(data) this.getList()
		},
        studentComparison(){
            this.showComparison = true
        },
        close(){
            this.showComparison = false
        },
        see(row,rowIndex){
            sessionStorage.setItem('STUDENRTABLEROWDATA', JSON.stringify(row))
            let routeData = this.$router.resolve({ query: {id: row.id, grade_id: row.grade_id || ''}, name: "view-trainees" });
            window.open(routeData.href, "_blank")
        },
        changeList(val){
            this.caccval = val
        },
        selectChange1(val){
          this.organization_id = val
          this.getList()
        },
        inputChange(val){
          this.keyword = val
          this.getList()
        },
        modalInit(d){
            this.modalTitle = '添加学员'
            this.show = true
            this.tableRow = {}
            let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
            if(role_id !== 3 || role_id !== 2) this.formList[2].selectList = d
        },
        handleClick(){
            let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
            if(role_id == 2 || role_id == 3) this.modalInit([])
            else {
                postData('common/getOrganizations').then((res) => {
                    if(res.res_code == 1){
                        this.modalInit(res.data)
                    }
                })
            }
        },
        getList(){
            let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
            let org = role_id === 1 ? this.organization_id : this.getOrganizationId
            let d = {
              keyword: this.keyword,
              page_size: this.pageSize,
              page_num: this.current,
              organization_id: org,
            }
            postData('user/getStudentList', d).then((res) => {
                 if(res.res_code == 1){
                    this.list = res.data.list
                    this.total = res.data.count
                    this.list.map((t) => {
                        t.states = t.state == -1 ? false : true
                        t.head_img = t.img_url
                        t.homework_count = t.homework_count + ' 次'
                        t.test_count = t.test_count + ' 次'
                        t.exam_count = t.exam_count + ' 次'
                    })
                 }
            })
        },
        deletes(r){
          let d = { id: r.id, status:  'remove' }
          let de = () => { this.fromAddAndEdit('user/operateStudent', d) }
          this.$config.deleteModal(de, '删除该学员账号后，该学员学习数据将一并删除，是否继续？')
        },
        tableSwtich(r){
          let d = { id: r.id, status:  r.states ? 'start' : 'stop' }
          this.fromAddAndEdit('user/operateStudent', d)
        },
        handleSubmit(val){
          let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
          if(role_id == 2 || role_id == 3) val.organization_id = +sessionStorage.getItem('organizationId')
          this.fromAddAndEdit('user/addStudent',val)
        },
        getDate(url, i){
            let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
            PostData(url).then((res) => {
                let num = role_id == 1 ? i : i - 1
                this.formList[num].selectList = res.data
            })
        },
        getSelList() {
            this.getDate('common/getGrades', 3)
            this.getDate('common/getDeptsNew', 4)
            this.getDate('common/getStudentTypes', 5)
        }
    },
    mounted() {
        this.getSelList()
        if(this.role_id == 1)  this.getOrganization()
        if(this.role_id == 3) {this.columns1[this.columns1.length - 1].operation.splice(1, 1)}
        this.getList()
        // if(this.permissionItem4) this.handleAuth(this.permissionItem4)
    }
  }
</script>
<style lang="less">
    .student-comparison{
        position: absolute;
        top: 70px;
        right: 10px;
        z-index: 1000;
        height: 80px;
        background-color: #fffd55;
        width: 40px;
        border: 1px solid rgb(255, 204, 0);
        border-radius: 10px;
        .texts{
            -webkit-writing-mode: vertical-rl;
            writing-mode: vertical-rl;
            color: #333;
            margin-left: 9px;
            margin-top: 11px;
        }
    }
    .student-comparison2{
        position: absolute;
        top: -1px;
        right: -1px;
        z-index: 1000;
        height: 80px;
        width: 80px;
        display: none;
        background-color: #fff;
        .student-comparison2-bg{
            height: 80px;
            width: 80px;
            border-radius: 40px;
            background-image: url('../../../assets/img/pk-bg.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            .pk{
                width: 60px;
                margin-top: 10px;
            }
        }
    }
    .student-comparison:hover .student-comparison2{
        display: block;
    }
</style>
