<template>
    <div style="height: 100%;">
        <screen :type-arr="typeArr" :title="modalTitle" @handleBack="handleBack"></screen>
        <add-modal @close="closeAddModal" :show="showAdd" @submit="addCase" :type="+type" :organization_id="examForm.organization_id" :deleteItem="deleteItem" :deleteIndex="deleteIndex"
                   :selectIndex="selectIndex" :caseLists="caseLists"/>
        <select-modal @close="closeSelectModal" :type="+type" :show="showSelect" :organization_id="examForm.organization_id"
                    :editList="changeList"   @allot="allot"></select-modal>
        <div style="height: calc(100% - 140px); overflow-y: auto">
            <Form :model="examForm" ref="form" :label-width="labelWid" label-position="right" class="form" :rules="ruleList">
                <FormItem :label="tit+'标题'" prop="title">
                    <Input v-model="examForm.title" :placeholder="`请输入${tit}标题`" class="form-input"/>
                </FormItem>
                <FormItem :label="tit+'机构'" prop="organization_id">
                    <div style="width: 472px;height: 42px;" @click="changeHint">
                        <Select v-model="examForm.organization_id" class="form-select" :disabled="(this.changeList.length || this.caseList.length) ? true : false">
                            <Option v-for="(item, index) in organizationsList" :key="index" :value="item.id">
                                {{item.title}}
                            </Option>
                        </Select>
                    </div>
                    <div class="verify" v-if="showHint">*请先删除已分配病例和学员再修改机构</div>
                </FormItem>
                <FormItem :label="tit+'内容'" required>
                    <div class="verify-item"> <Button type="primary" ghost @click="addExam">添加病例</Button>  <span class="verify2">*不能超过10份病例</span></div>
                    <div v-if="caseList.length" class="case-list">
                        <Card class="case" v-for="(item, index) in caseList" :key="index">
                            <div class="case-person">
                                <img class="case-person-img" :src="item.patient_head_portrait_url" alt="">
                                <div class="case-person-message">
                                    <div class="case-person-message-state">{{item.symptom}}</div>
                                    <div class="case-person-message-information">{{item.patient_name}} |
                                        {{$config.setSex(item.patient_gender)}} | {{item.patient_age}}
                                    </div>
                                </div>
                            </div>
                            <div class="case-state">
                                <div class="case-state-difficulty">
                                    <div class="case-state-difficulty-point" :style="item.degree == 1 ? {background: '#72C925'} : item.degree == 2 ? {background: '#FF9E02'} : {background: '#FF5900'}"></div>
                                    <span class="case-state-difficulty-type">{{item.degree == 1 ? '简单' : item.degree == 2 ? '适中' : '困难'}}</span>
                                </div>
                                <div class="case-state-title">{{item.patient_division}}</div>
                            </div>
                            <div class="delete-img" @click="deleteCase(item,index)">
                                <img class="case-delete" :src="caseDelete" alt="">
                            </div>
                        </Card>
                    </div>
                </FormItem>
                <FormItem :label="assessment" prop="type">
                    <RadioGroup v-model="examForm.type" size="large">
                        <Radio :label="1">完成所有病例</Radio>
                        <Radio :label="2">随机完成1个病例</Radio>
                        <Radio :label="3">
                            <span>考生自主选择病例</span>
                            <span style="margin-left: 12px;" v-if="examForm.type == 3">
                                <span>选择</span>
                                <InputNumber v-model="examForm.min_count" style="width: 40px;" :min="1" :max="caseList.length ? caseList.length : 1"></InputNumber>
                                <span>个病例</span>
                            </span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem v-if="type!=2" :label="tit+'时长'" prop="duration">
                    <div class="exam-duration">
                        <InputNumber :min="1" v-model="examForm.duration" class="form-number"></InputNumber>
                        <span class="form-time">分钟</span>
                    </div>
                    <div class="verify">*考生开始{{tit}}后，需在答题时长内完成本场{{tit}}</div>
                </FormItem>
                <FormItem :label="tit+'时间'" prop="exam_state">
                    <RadioGroup v-model="examForm.exam_state" @on-change="examStates" size="large">
                        <Radio :label=1>立即开始</Radio>
                        <Radio :label=2>自定义</Radio>
                        <DatePicker v-model="examForm.timeSlot" v-if="examForm.exam_state == 2" class="form-date-picker"
                                    type="datetimerange" split-panels style="width: 200px"></DatePicker>
                    </RadioGroup>
                    <div class="verify">*{{verify}}</div>
                </FormItem>
                <FormItem label="分配学员" required>
                    <div class="allot-student">
                        <Button type="primary" ghost @click="selectExam">选择学员</Button>
                        <div v-if="this.changeList.length" style="margin-left: 15px;">已分配：<span style="color: #4098ff">{{this.changeList.length}}</span>人</div>
                    </div>
                </FormItem>
                <Button type="primary" class="btn" @click="submit">保存</Button>
            </Form>
        </div>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import addModal from '../modal/add-modal'
    import selectModal from '../modal/select-modal'
    import postData from '../../../api/postData'
    import caseDelete from '../../../assets/img/add_case_delete.png'
    const VERIFY = ['选择此模式，在考试创建成功后学员可以立即参加考试，考试时间当天截止','选择此模式，在作业创建成功后学员可立即开始做作业，作业有效时间默认7天']
    export default {
        components: {screen, addModal, selectModal},
        data() {
            const tit = this.$route.query.type == 1 ? '考试' :  '作业'
            return {
                typeArr: ['backgroundColor', 'back', 'title'],
                showAdd: false,
                showSelect: false,
                organizationsList: [],
                examForm: {
                    title: '',
                    type: 1,
                    duration: 50,
                    exam_state: 1,
                    timeSlot: '',
                    organization_id: null,
                    case_ids: [],
                    student_ids: [],
                    min_count: 1
                },
                ruleList: {
                    title: [{required: true, message: '请输入标题'}],
                    type: [{required: true, message: '请选择考核模式'}],
                    duration: [{required: true, message: '请选择考核模式'}],
                    exam_state: [{required: true, message: `请选择${tit}时间`}],
                    organization_id: [{required: true, message: `请选择${tit}机构`}],
                },
                caseList: [],
                studentList: [],
                deleteList: true,
                selectIndex: null,
                changeList: [],
                showHint: false,
                deleteItem: {},
                deleteIndex: null,
                caseLists: [],
                verify: this.$route.query.type == 1 ? VERIFY[0] : VERIFY[1],
                caseDelete
            }
        },
        computed: {
            listLength() {
                return (this.changeList.length + this.caseList.length)
            },
            edit() {
                return this.$route.query.id
            },
            assessment(){
                return this.type == 1 ? '考核方式' : this.type == 2 ? '病例考核方式' : ''
            },
            labelWid(){
                return this.type == 1 ? 140 : this.type == 2 ? 175 : 0
            },
            type(){
                // type 1 考试  2 作业
                 return this.$route.query.type
            },
            tit(){
               return this.type == 1 ? '考试' : this.type == 2 ? '作业' : ''
            },
            modalTitle(){
                let text = this.type == 1 ? '考试' : this.type == 2 ? '作业' : ''
                return this.edit ? '编辑' + text : '创建' + text
            }
        },
        watch: {
            listLength(val) {
                if(val == 0) this.showHint = false
            }
        },
        methods: {
            examStates(v){
                let t = this.type == 1 ? '参与本场考试' :'完成作业'
                let d = this.type == 1 ? VERIFY[0] : VERIFY[1]
                this.verify = v == 1 ? d : `学员在此时间范围内均可参与${t}，每个学员只能参加一次${this.tit}`
            },
            changeHint() {
                if(this.changeList.length) {
                    this.showHint = true
                }
            },
            handleBack() {
                let url = this.type == 1 ? 'exam-manage' : 'homework-manage'
                this.$router.replace(url)
            },
            closeAddModal(val) {
                this.showAdd = val
            },
            closeSelectModal(val) {
                this.showSelect = val
            },
            addExam() {
                if (this.examForm.organization_id) this.showAdd = true
                else this.$Message.info('请选择机构')
            },
            selectExam() {
                if (this.examForm.organization_id) this.showSelect = true
                else this.$Message.info('请选择机构')
            },
            addCase(val) {
                this.caseList = val
            },
            deleteCase(item, index) {
                this.caseList.splice(index, 1)
                this.deleteItem = item
                this.deleteIndex = index
            },
            allot(val) {
                this.changeList = val
            },
            getEdit() {
                let url = this.type == 1 ? 'exam/getExamDetail' : 'homework/getHomeworkDetail'
                postData(url, {id: parseInt(this.edit)}).then(res => {
                    if(res.res_code == 1) {
                        this.examForm = res.data
                        if(this.type==2)  this.examForm.exam_state = res.data.hw_state
                        this.examForm.timeSlot = [new Date(res.data.start_time), new Date(res.data.end_time)]
                        let u1 = this.type == 1 ? 'exam/getSelectStudents' : 'homework/getSelectStudents'
                        let d = this.type == 1 ? {room_id: parseInt(this.edit)} : {homework_id: parseInt(this.edit)}
                        postData(u1, {...d, organization_id: res.data.organization_id}).then(res1 => {
                            this.changeList = res1.data.list
                        })
                        let u2 = this.type == 1 ? 'exam/getSelectCases' : 'homework/getSelectCases'
                        postData(u2, {...d, organization_id: res.data.organization_id}).then(res1 => {
                            if(res.res_code==1){
                                this.caseList = res1.data.list
                                this.caseLists = res1.data.list
                            }
                        })
                    }
                })
            },
            submit() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        if (this.caseList.length) {
                            if (this.changeList.length) {
                                if (this.examForm.exam_state == 2) {
                                    this.examForm.start_time =  this.$config.formatTime(this.examForm.timeSlot[0])
                                    this.examForm.end_time = this.$config.formatTime(this.examForm.timeSlot[1])
                                } else {
                                    let now_time = new Date()
                                    this.examForm.start_time = this.$config.formatTime(now_time)
                                    let n = this.type == 1 ? 1 : 7
                                    if(this.type==1) this.examForm.end_time = this.$config.formatTime(new Date(new Date(now_time.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 * n - 1))
                                    else this.examForm.end_time = this.$config.formatTime(new Date(now_time.getTime() + 24 * 60 * 60 * 1000 * 7))
                                }
                                this.examForm.case_ids = []
                                this.examForm.student_ids = []
                                this.caseList.forEach(item => {
                                    this.examForm.case_ids.push(item.id)
                                })
                                this.changeList.forEach(item => {
                                    this.examForm.student_ids.push(item.id)
                                })
                                if(this.edit) {
                                    let url = this.type == 1 ? 'exam/modifyRoom' : 'homework/modifyHomework'
                                    postData(url, {...this.examForm, id: parseInt(this.edit)}).then(res => {
                                        if (res.res_code == 1) {
                                            this.$Message.success(res.msg)
                                            this.handleBack()
                                        }
                                    })
                                }else{
                                    let url = this.type == 1 ? 'exam/addRoom' : 'homework/addHomework'
                                    if(this.type == 2)  this.examForm.hw_state = this.examForm.exam_state
                                    postData(url, this.examForm).then(res => {
                                        if (res.res_code == 1) {
                                            this.$Message.success(res.msg)
                                            this.handleBack()
                                        }
                                    })
                                }
                            } else this.$Message.info('请选择学员')
                        } else this.$Message.info('请选择病例')
                    }
                })
            },
        },
        mounted() {
            postData('common/getOrganizations').then(res => {
                if (res.res_code == 1) {
                    let roleId = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
                    if(roleId != 1) {
                        let id = sessionStorage.getItem('organizationId')
                        if(res.data&&res.data.length>0){
                            res.data.forEach((t) => {
                                if(t.id == id) this.organizationsList = [t]
                            })
                        }
                    }else this.organizationsList = res.data
                }
            })
            if(this.edit) this.getEdit()
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-btn{
        display: inline-block !important;
    }
    /deep/ .ivu-input-number{
        width: 40px !important;
    }
    /deep/ .ivu-input-number-handler-wrap{
        display: none;
    }
    /deep/ .ivu-input-number-input{
        text-align: center;
    }
    .verify-item{
        display: inline-flex;
        align-items: center;
    }
    .form {
        margin: 70px;

        /deep/ .screen {
            /*border-bottom: 1px solid #E4E5E9;*/
        }

        /deep/ .ivu-form-item-content {
            text-align: left;
        }

        /deep/ .ivu-form-item-label {
            font-size: 20px !important;
            color: #666666 !important;
            text-align: right;
            padding-right: 30px;
        }

        /deep/ .ivu-form-item {
            margin-bottom: 32px;
        }

        /deep/ .ivu-btn {
            height: 36px;
        }

        /deep/ .ivu-input {
            height: 46px;
            font-size: 18px !important;
            border-radius: 4px !important;
        }

        /deep/ .ivu-select-selection {
            height: 46px;
            font-size: 18px !important;
            line-height: 42px !important;
        }

        /deep/ .ivu-select-selected-value, /deep/ .ivu-select-placeholder {
            font-size: 18px !important;
            line-height: 46px !important;
        }

        .exam-duration /deep/ .ivu-form-item-content {
            display: flex;
            align-items: center;
        }

        .ivu-radio-large .ivu-radio-wrapper {
            font-size: 18px;
        }

        /deep/ .ivu-radio {
            margin-right: 8px;
        }

        /deep/ .ivu-radio-wrapper {
            margin-right: 20px;
        }
    }

    .form-date-picker {
        width: 335px !important;

        /deep/ .ivu-input {
            height: 36px;
            font-size: 14px !important;
        }
        /deep/ .ivu-btn{
            display: inline-block !important;
        }
    }

    .form-input {
        width: 477px;
    }

    .form-number {
        width: 102px !important;
    }

    .form-time {
        font-size: 18px;
        color: #333333;
        margin: auto 10px;
    }

    .form-select {
        width: 476px;
        height: 42px;
    }

    .btn {
        width: 178px;
        margin: 40px auto;
        height: 46px;
        font-size: 18px !important;
    }

    .case-list {
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #E4E5E9;
        padding-top: 20px;
        border-bottom: 1px solid #E4E5E9;
        margin-top: 20px;
        width: 100%;
    }

    .case {
        width: 240px;
        height: 108px;
        position: relative;
        margin: 0 15px;
        overflow: hidden;
        margin-bottom: 17px;

        .case-person {
            display: flex;
            border-bottom: 1px solid rgba(209, 209, 217, 0.50);

            .case-person-img {
                width: 50px;
                height: 50px;
            }

            .case-person-message {
                margin-left: 10px;

                .case-person-message-state {
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #474C63;
                    letter-spacing: 0.82px;
                    text-align: justify;
                }

                .case-person-message-information {
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #474C63;
                    letter-spacing: 0.7px;
                    text-align: justify;
                }
            }
        }

        .case-state {
            display: flex;

            .case-state-difficulty {
                display: flex;
                align-items: center;

                .case-state-difficulty-point {
                    height: 8px;
                    width: 8px;
                    border-radius: 50%;
                }

                .case-state-difficulty-type {
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #474C63;
                    letter-spacing: 0.82px;
                    text-align: justify;
                    margin-left: 5px;
                }
            }

            .case-state-title {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #474C63;
                letter-spacing: 0.82px;
                text-align: justify;
                margin-left: 18px;
            }
        }

        .case-delete {
            width: 8px;
            height: 8px;
        }
    }

    /deep/ .ivu-card-body {
        padding: 10px;
    }

    .delete-img {
        width: 40px;
        position: absolute;
        height: 40px;
        background: rgb(147, 151, 173);
        transform: rotate(-314deg);
        top: -20px;
        right: -20px;
        cursor: pointer;

        .case-delete {
            position: absolute;
            transform: rotate(-314deg);
            bottom: 4px;
            right: 14px;
        }
    }

    .allot-student {
        display: flex;
        align-items: center;
    }
    .v{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #9397AD;
        letter-spacing: 0.82px;
        text-align: justify;
    }
    .verify2{
        .v;
        margin-left: 10px;
    }
    .verify {
        margin-top: 10px;
        .v;
    }
</style>
