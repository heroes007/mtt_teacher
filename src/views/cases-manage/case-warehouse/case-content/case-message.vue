<template>
    <div class="content">
        <Form ref="formValidate" class="case-form" :model="formInline" label-position="left" :rules="ruleValidate">
            <FormItem>
                <div class="case-title">
                    <span>患者信息</span>
                    <div class="case-line"></div>
                </div>
            </FormItem>
            <FormItem label="姓名" style="display: inline-block; width: 49%" prop="patient_name">
                <Input class="case-name" style="width: 250px" type="text" v-model="formInline.patient_name" placeholder="患者姓名"/>
                <span class="case-name-hint" @click="createName">自动生成</span>
            </FormItem>
            <FormItem label="年龄" style="display: inline-block; width: 50%;" required>
                <div style="display: flex;align-items: center">
                    <div class="age-year"><InputNumber v-model="formInline.age_year" :min="0" :max="999999"/><span class="age-hint">岁</span></div>
                    <div class="age-month"><InputNumber v-model="formInline.age_month" :min="0" :max="999999"/><span class="age-hint">月</span></div>
                    <div class="age-day"><InputNumber v-model="formInline.age_day" :min="0" :max="999999"/><span class="age-hint">天</span></div>
                </div>
            </FormItem>
            <FormItem label="性别" style="display: inline-block; width: 32%;" prop="patient_gender">
                <Select style="width: 150px;" v-model="formInline.patient_gender">
                    <Option value="Male">男</Option>
                    <Option value="Female">女</Option>
                </Select>
            </FormItem>
            <FormItem label="民族" style="display: inline-block; width: 32%;" prop="patient_nation">
                <Select style="width: 150px;" v-model="formInline.patient_nation">
                    <Option v-for="(item ,index) in nation_list" :key="index" :value="item.nation">{{item.nation}}</Option>
                </Select>
            </FormItem>
            <FormItem label="婚姻状态" style="display: inline-block; width: 34%;" prop="patient_marital_status">
                <Select style="width: 150px;" v-model="formInline.patient_marital_status">
                    <Option value="未婚">未婚</Option>
                    <Option value="已婚">已婚</Option>
                </Select>
            </FormItem>
            <FormItem label="职业" style="display: inline-block; width: 32%;">
                <template slot="label"><span style="margin-left: 12px;">职业</span></template>
                <Input v-model="formInline.patient_occupation" style="width: 150px;" placeholder="请输入职业"/>
<!--                <Select style="width: 150px;" v-model="formInline.patient_occupation">-->
<!--                    <Option value="程序员">程序员</Option>-->
<!--                </Select>-->
            </FormItem>
            <FormItem label="电话" style="display: inline-block; width: 32%;">
                <template slot="label"><span style="margin-left: 12px;">电话</span></template>
                <Input style="width: 150px;" type="text" v-model="formInline.patient_contact" placeholder="输入手机号"/>
            </FormItem>
            <FormItem label="支付方式" style="display: inline-block; width: 34%;">
                <template slot="label"><span style="margin-left: 12px;">支付方式</span></template>
                <Select style="width: 150px;" v-model="formInline.patient_pay_pattern">
                    <Option value="微信">微信</Option>
                    <Option value="支付宝">支付宝</Option>
                    <Option value="现金">现金</Option>
                </Select>
            </FormItem>
            <FormItem label="住址">
                <template slot="label"><span style="margin-left: 12px;">住址</span></template>
                <Input style="width: 664px;" type="text" v-model="formInline.patient_addr" placeholder="请输入家庭住址"/>
            </FormItem>
            <FormItem>
                <div class="case-title">
                    <span>病症信息</span>
                    <div class="case-line"></div>
                </div>
            </FormItem>
            <FormItem label="病症" required>
                <Select style="width: 664px;" v-model="formInline.outline_ids" placeholder="请选择病症（多选）" multiple filterable>
                    <Option v-for="(item, index) in symptom_list" :key="index" :value="item.id">{{item.symptom}}</Option>
                </Select>
            </FormItem>
            <FormItem label="科室" style="display: inline-block; width: 60%;" prop="patient_division">
                <Select style="width: 372px;" v-model="formInline.patient_division">
                    <Option v-for="(item, index) in patient_list" :key="index" :value="item.patient_division">{{item.patient_division}}</Option>
                </Select>
            </FormItem>
            <FormItem label="病情陈述者" style="display: inline-block; width: 39%;" prop="medical_history_representor">
                <Select style="width: 168px;" v-model="formInline.medical_history_representor">
                    <Option value="Self">本人</Option>
                </Select>
            </FormItem>
            <FormItem label="描述" prop="chief_complaint">
                <Input style="width: 664px;" type="text" v-model="formInline.chief_complaint" placeholder="请输入病情描述"/>
            </FormItem>
            <FormItem>
                <div class="case-title">
                    <span>病例设置</span>
                    <div class="case-line"></div>
                </div>
            </FormItem>
            <FormItem label="难度设置" prop="degree">
                <RadioGroup v-model="formInline.degree">
                    <Radio v-for="(item, index) in degree_list" :key="index" :label="item.id">{{item.title}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="强制解读" prop="force_unscramble">
                <RadioGroup v-model="formInline.force_unscramble">
                    <Radio v-for="(item, index) in force_unscramble_list" :key="index" :label="item.id">{{item.title}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem v-if="formInline.force_unscramble === '1'" prop="force_unscramble_content">
                <CheckboxGroup v-model="formInline.force_unscramble_content" class="checkout-group">
                    <Checkbox v-for="(item, index) in force_unscramble_content_list" :label="item.id" :key="index">{{item.title}}</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="复诊配置" prop="rediagnosis">
                <RadioGroup v-model="formInline.rediagnosis">
                    <Radio v-for="(item, index) in rediagnosis_list" :key="index" :label="item.id">{{item.title}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem v-if="formInline.rediagnosis === '1'">
                <div class="case-end">
                    <div class="case-end-box">
                        <div>问诊结束</div>
                        <InputNumber class="box-input-number" v-model="case_talk" :max="100" :min="0"></InputNumber>
                        <div>次</div>
                    </div>
                    <div class="case-end-box">
                        <div>体检结束</div>
                        <InputNumber class="box-input-number" v-model="case_physical" :max="100" :min="0"></InputNumber>
                        <div>次</div>
                    </div>
                    <div class="case-end-box">
                        <div>辅检结束</div>
                        <InputNumber class="box-input-number" v-model="case_assist" :max="100" :min="0"></InputNumber>
                        <div>次</div>
                    </div>
                    <div class="case-end-box" style="margin-right: 0;">
                        <div>处置结束</div>
                        <InputNumber class="box-input-number" v-model="case_handle" :max="100" :min="0"></InputNumber>
                        <div>次</div>
                    </div>
                </div>
            </FormItem>
            <FormItem>
                <Button class="case-btn" @click="handleSubmit" type="primary">下一步</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import postData from '../../../../api/postData'

    export default {
        data() {
            return {
                fruit: [],
                formInline: {
                    patient_name: '',
                    age_year: 0,
                    age_month: 0,
                    age_day: 0,
                    patient_gender: '',
                    patient_nation: '',
                    patient_marital_status: '',
                    patient_occupation: '',
                    patient_contact: '',
                    patient_pay_pattern: '',
                    patient_addr: '',
                    outline_ids: '',
                    patient_division: '',
                    medical_history_representor: '',
                    chief_complaint: '',
                    degree: '',
                    force_unscramble: '',
                    force_unscramble_content: [],
                    rediagnosis: ''
                },
                case_talk: 0,
                case_physical: 0,
                case_assist: 0,
                case_handle: 0,
                ruleValidate: {
                    patient_name: [{ required: true, message: '请输入姓名', trigger: 'change'}],
                    age_year: [{ required: true, message: '请输入年龄', trigger: 'change'}],
                    patient_gender: [{ required: true, message: '请选择性别', trigger: 'change'}],
                    patient_nation: [{ required: true, message: '请选择民族', trigger: 'change'}],
                    patient_marital_status: [{ required: true, message: '请选择婚姻状态', trigger: 'change'}],
                    outline_ids: [{ required: true, message: '请选择病症', trigger: 'change'}],
                    patient_division: [{ required: true, message: '请选择科室', trigger: 'change'}],
                    medical_history_representor: [{ required: true, message: '请选择病情陈述者', trigger: 'change'}],
                    chief_complaint: [{ required: true, message: '请输入病情描述', trigger: 'change'}],
                    degree: [{ required: true, message: '请选择病情难度', trigger: 'change'}],
                    force_unscramble: [{ required: true, message: '请选择强制解读选项', trigger: 'change'}],
                    force_unscramble_content: [{ required: true, type: 'array', min: 1, message: '请选择强制解读选项', trigger: 'change'}],
                    rediagnosis: [{ required: true, message: '请选择病情复诊配置', trigger: 'change'}],

                },
                degree_list: [{id: '1', title: '简单'},{id: '2', title: '适中'},{id: '3', title: '困难'},],
                force_unscramble_list: [
                    {id: '0', title: '不强制解读'},
                    {id: '1', title: '自定义解读'},
                    // {id: '1', title: '问诊结束'},
                    // {id: '2', title: '体格检查结束'},
                    // {id: '3', title: '辅助检查结束'},
                ],
                force_unscramble_content_list: [
                    {id: '1', title: '问诊结束'},
                    {id: '2', title: '体格检查结束'},
                    {id: '3', title: '辅助检查结束'},
                ],
                rediagnosis_list: [{id: '0', title: '不可复诊'}, {id: '1', title: '自定义配置'}],
                symptom_list: [],
                nation_list: [],
                family_name: [
                    "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
                    "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
                    "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏",
                    "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
                    "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦",
                    "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
                    "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺",
                    "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
                    "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余",
                    "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
                ],
                givenNames: [
                    "子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛",
                    "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊",
                    "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政",
                    "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建",
                    "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋",
                    "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅",
                    "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡",
                    "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕",
                    "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵",
                    "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌"
                ],
                patient_list: []
            }
        },
        methods: {
            handleSubmit() {
                let data = this.formInline
                if(this.formInline.rediagnosis === '1') data.rediagnosis_content = JSON.stringify({
                    talk: this.case_talk,
                    physical: this.case_physical,
                    assist: this.case_assist,
                    handle: this.case_handle,
                })
                this.$refs.formValidate.validate((valid) => {
                    if(valid) {
                        data.patient_age = this.formInline.age_year ? this.formInline.age_year + '年' : this.formInline.age_month ? this.formInline.age_month + '月' : this.formInline.age_day + '天'
                        data.patient_age_sort = this.formInline.age_year ? this.formInline.age_year : parseInt(this.formInline.age_month/12) ? parseInt(this.formInline.age_month/12) : parseInt(this.formInline.age_day/365)
                        data.patient_age_list = JSON.stringify([this.formInline.age_year, this.formInline.age_month, this.formInline.age_day])
                        data.degree = parseInt(data.degree)
                        data.force_unscramble = parseInt(data.force_unscramble)
                        data.rediagnosis = parseInt(data.rediagnosis)
                        data.force_unscramble_content = JSON.stringify(data.force_unscramble_content)
                        data.symptom = ''
                        data.outline_ids.map(item => {
                            item = parseInt(item)
                            this.symptom_list.forEach(item1 => {
                                if(item1.id == item)  data.symptom += item1.symptom + ','
                            })
                        })
                        if(this.$route.query.id) {
                            delete data.outlines
                            postData('case/modifyCase',data).then(res => {
                                if(res.res_code == 1) {
                                    this.$router.push({path: 'case-content', query: {id: this.$route.query.id}})
                                }
                            })
                        }else{
                            data.file_dir = parseInt(new Date().getTime()/1000)
                            postData('case/addCase',data).then(res => {
                                if(res.res_code == 1) {
                                    this.$router.push({path: 'case-content', query: {id: res.data.id}})
                                }
                            })
                        }
                    }
                })
            },
            createName() {
                var i = parseInt(Math.random() * 100)
                var j = parseInt(Math.random() * 100)
                this.formInline.patient_name = this.family_name[i] + this.givenNames[j]
            },
            getList() {
                postData('case/getOutlineList', {page_num: 1, page_size: 99999}).then(res => {
                    if(res.res_code == 1) {
                        this.symptom_list = res.data.data
                        if(this.$route.query.caseId) this.formInline.outline_ids = [parseInt(this.$route.query.caseId)]
                    }
                })
                postData('common/getNations').then(res => {
                    if(res.res_code == 1) this.nation_list = res.data
                })
                postData('common/getDepts').then(res => {
                    if(res.res_code == 1) this.patient_list = res.data
                })
            },
            getInitData() {
                if(this.$route.query.id) {
                    postData('case/getCaseDetailAndOutlines', {id: parseInt(this.$route.query.id)}).then(res => {
                        if(res.res_code == 1) {
                            this.formInline = res.data
                            this.formInline.degree = this.formInline.degree.toString()
                            this.formInline.force_unscramble = this.formInline.force_unscramble.toString()
                            this.formInline.rediagnosis = this.formInline.rediagnosis.toString()
                            this.formInline.force_unscramble_content = JSON.parse(this.formInline.force_unscramble_content)
                            this.formInline.outline_ids = []
                            this.formInline.outlines.forEach(item => {
                                this.formInline.outline_ids.push(item.outline_id)
                            })
                            this.formInline.age_year = JSON.parse(this.formInline.patient_age_list)[0]
                            this.formInline.age_month = JSON.parse(this.formInline.patient_age_list)[1]
                            this.formInline.age_day = JSON.parse(this.formInline.patient_age_list)[2]
                            if(this.formInline.rediagnosis === '1'){
                                this.formInline.rediagnosis_content = JSON.parse(this.formInline.rediagnosis_content)
                                this.case_talk = this.formInline.rediagnosis_content.talk
                                this.case_physical = this.formInline.rediagnosis_content.physical
                                this.case_assist = this.formInline.rediagnosis_content.assist
                                this.case_handle = this.formInline.rediagnosis_content.handle
                            }
                        }
                    })
                }
            }
        },
        mounted() {
            this.getList()
            this.getInitData()
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-form-item-label{
        font-family: PingFangSC-Regular;
        font-size: 16px !important;
        color: #474C63 !important;
        letter-spacing: 0.93px !important;
        text-align: right;
    }
    /deep/ .ivu-form-item-content{
        text-align: left;
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
        left: 3px;
        top: 3px;
    }
    /deep/ .ivu-checkbox-inner:after{
        left: 5px;
        top: 3px;
    }
    /deep/ .ivu-radio-wrapper, /deep/ .ivu-checkbox-wrapper{
        margin-right: 30px;
    }
    .content{
        height: 100%;
        overflow-y: auto;
    }
    .case-form{
        margin: 60px auto;
        width: 730px;

        .case-title{
            font-family: PingFangSC-Regular;
            font-size: 24px;
            color: #A4A9C0;
            letter-spacing: 1.4px;
            text-align: center;
            position: relative;
        }
        .case-name{
            /deep/ .ivu-input{
                padding-right: 80px !important;
            }
        }
        .case-name-hint{
            position: absolute;
            left: 236px;
            fine-height: 36px;
            font-size: 13px;
            color: #4098FF;
            cursor: pointer;
        }
        .case-line{
            opacity: 0.1;
            background: #4098FF;
            width: 108px;
            height: 8px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 22px;
        }
        .age-year{
            width: 100px;
            position: relative;
            display: flex;
            align-items: center;

            /deep/ .ivu-input-number{
                border-radius: 4px 0 0 4px !important;
            }
        }
        .age-month{
            width: 100px;
            position: relative;
            display: flex;
            align-items: center;

            /deep/ .ivu-input-number{
                border-radius: 0 !important;
                border-left: 0;
                border-right: 0;
            }
        }
        .age-day{
            width: 100px;
            position: relative;
            display: flex;
            align-items: center;

            /deep/ .ivu-input-number{
                border-radius: 0 4px 4px 0 !important;
            }
        }
        .age-hint{
            width: 0;
            position: absolute;
            left: 76px;
            font-size: 16px;
            color: #474C63;
        }
        .case-end{
            display: flex;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0.93px;
            margin-left: 12px;

            /deep/ .ivu-input-number-input{
                text-align: center;
            }

            .case-end-box{
                display: flex;
                margin-right: 30px;

                .box-input-number{
                    width: 50px !important;
                    margin: 0 8px;
                }
            }
        }
        .case-btn{
            width: 150px;
            height: 38px;
            margin: 50px auto 0 auto;
        }
    }
    /deep/ .ivu-input-number-handler-wrap{
        display: none;
    }
    .checkout-group{
        margin-left: 20px;
    }
</style>
