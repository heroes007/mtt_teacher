<template>
    <div class="case-content-summarize">
        <Form ref="formValidate" class="case-form" :model="formInline" :rules="ruleValidate">
            <FormItem>
                <div class="case-title">
                    <span>患者信息</span>
                    <div class="case-line"></div>
                </div>
            </FormItem>
            <FormItem label="姓名" style="display: inline-block; width: 49%" prop="patient_name">
                <Input class="case-name" style="width: 262px" type="text" v-model="formInline.patient_name" placeholder="患者姓名"/>
                <span class="case-name-hint" @click="createName">自动生成</span>
            </FormItem>
            <FormItem label="年龄" style="display: inline-block; width: 49%; position: relative" prop="patient_age">
                <InputNumber class="case-name" style="width: 262px !important;" type="text" v-model="formInline.patient_age"/>
                <Select style="width: 74px;position: absolute;right: 0;top: 0;" v-model="formInline.patient_time_type">
                    <Option value="岁">岁</Option>
                    <Option value="月">月</Option>
                    <Option value="月">周</Option>
                    <Option value="日">日</Option>
                </Select>
            </FormItem>
            <FormItem label="性别" style="display: inline-block; width: 49%;" prop="patient_gender">
                <Select style="width: 262px;" @on-change="setSex" v-model="formInline.patient_gender" placeholder="患者性别">
                    <Option value="Male">男</Option>
                    <Option value="Female">女</Option>
                </Select>
            </FormItem>
            <FormItem label="民族" style="display: inline-block; width: 49%;" prop="patient_nation">
                <Select style="width: 262px;" v-model="formInline.patient_nation" placeholder="患者民族">
                    <Option v-for="(item, index) in nationList" :value="item.nation" :key="index">{{ item.nation }}</Option>
                </Select>
            </FormItem>
            <FormItem label="婚否" style="display: inline-block; width: 49%;" prop="patient_marital_status">
                <Select style="width: 262px;" v-model="formInline.patient_marital_status" placeholder="患者婚姻状态">
                    <Option value="未婚">未婚</Option>
                    <Option value="已婚">已婚</Option>
                    <Option value="离异">离异</Option>
                </Select>
            </FormItem>
            <FormItem v-if="formInline.patient_gender == 'Female'" label="生育情况" style="display: inline-block; width: 49%;" prop="is_fertility">
                <Select style="width: 262px;" v-model="formInline.is_fertility" placeholder="患者生育情况">
                    <Option :value="0">未怀孕</Option>
                    <Option :value="1">已怀孕</Option>
                    <Option :value="2">产后</Option>
                </Select>
            </FormItem>
             <FormItem class="case-postpartum" v-if="formInline.is_fertility == 1 || formInline.is_fertility == 2" style="display: inline-block; width: 49%">
                <template slot="label"><span style="color: #ff3300;margin-right: 4px;line-height: 1">*</span>产后时间</template>
                <InputNumber class="case-name" style="width: 130px !important;" type="text" v-model="formInline.postpartumWeeks"/>
                <span class="case-postpartum-hint">周</span>
                <InputNumber class="case-name" style="width: 130px !important;" type="text" v-model="formInline.postpartumDay"/>
                <span class="case-postpartum-hint">天</span>
            </FormItem>
            <FormItem label="病情陈述人" style="display: inline-block; width: 49%;" prop="medical_history_representor">
                <Select style="width: 262px;" v-model="formInline.medical_history_representor" placeholder="病情陈述人">
                    <Option value="本人">本人</Option>
                    <Option value="家属">家属</Option>
                </Select>
            </FormItem>
            <FormItem label="职业" style="display: inline-block; width: 49%;" prop="patient_occupation">
                <Input class="case-name" style="width: 262px" type="text" v-model="formInline.patient_occupation" placeholder="患者本人职业"/>
            </FormItem>
            <FormItem style="display: inline-block; width: 49%;" />
            <FormItem label="主要病症" prop="cardinal_symptom">
                <Input style="width: 644px;" type="textarea" v-model="formInline.cardinal_symptom" placeholder="请输入患者主要病症"/>
            </FormItem>
            <FormItem label="病情描述" prop="chief_complaint">
                <Input style="width: 644px;" type="textarea" v-model="formInline.chief_complaint" placeholder="请输入患者对病情描述"/>
            </FormItem>
            <FormItem class="case-btns">
                <div class="case-btn-box">
                    <Button class="case-btn-last" @click="handleLast" type="primary">上一步</Button>
                    <Button class="case-btn" @click="handleNext(false)" type="primary">下一步</Button>
                </div>
            </FormItem>
        </Form>
        <div v-if="ageImgs" class="age-imgs">
            <img :src="ageImgs" class="img"/>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                formInline: {
                    patient_name: '',
                    patient_nation: '',
                    patient_age: 0,
                    patient_gender: '',
                    patient_marital_status: '',
                    is_fertility: '',
                    medical_history_representor: '',
                    patient_occupation: '',
                    cardinal_symptom: '',
                    chief_complaint: '',
                    patient_time_type: '岁',
                    postpartumWeeks: 0,
                    postpartumDay: 0,
                },
                ruleValidate: {
                    patient_name: [{ required: true, message: '请输入患者姓名', trigger: 'blur'}],
                    patient_nation: [{ required: true, message: '请输入患者民族', trigger: 'blur'}],
                    patient_age: [{ required: true, message: '请输入患者年龄'}],
                    patient_gender: [{ required: true, message: '请选择患者性别', trigger: 'change'}],
                    patient_marital_status: [{ required: true, message: '请选择患者婚姻状态', trigger: 'change'}],
                    is_fertility: [{ required: true, message: '请选择患者生育情况'}],
                    medical_history_representor: [{ required: true, message: '请选择病情陈述人', trigger: 'change'}],
                    patient_occupation: [{ required: true, message: '请输入患者职业', trigger: 'blur'}],
                    cardinal_symptom: [{ required: true, message: '请输入主要病症', trigger: 'change'}],
                    chief_complaint: [{ required: true, message: '请输入主要病症', trigger: 'change'}],
                },
                symptom_list: [],
                patient_list: [],
                force_unscramble_list: [
                    {id: '0', title: '不强制解读'},
                    {id: '1', title: '自定义解读'},
                ],
                force_unscramble_content_list: [
                    {id: '1', title: '问诊结束'},
                    {id: '2', title: '体格检查结束'},
                    {id: '3', title: '辅助检查结束'},
                ],
                rediagnosis_list: [{id: '0', title: '不可复诊'}, {id: '1', title: '自定义配置'}],
                case_talk: 0,
                case_physical: 0,
                case_assist: 0,
                case_handle: 0,
                nationList: [],
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
                ageImgfemaxle: [
                    'http://sfile.9mededu.com/mtt/avatar/婴儿女.jpg',
                    'http://sfile.9mededu.com/mtt/avatar/儿童女.jpg',
                    'http://sfile.9mededu.com/mtt/avatar/青年女.jpg',
                    'http://sfile.9mededu.com/mtt/avatar/中年女.jpg',
                    'http://sfile.9mededu.com/mtt/avatar/老奶奶.jpg',
                ],
                ageImgMaxle: [
                    'http://sfile.9mededu.com/mtt/avatar/婴儿男.jpg',
                    'http://sfile.9mededu.com/mtt/avatar/儿童男.jpg',
                    'http://sfile.9mededu.com/mtt/avatar/青年男.jpg',
                    'http://sfile.9mededu.com/mtt/avatar/中年男.jpg',
                    'http://sfile.9mededu.com/mtt/avatar/老爷爷.jpg',
                ],
                caseAge: [{name:'0-5', checked: false}, {name:'6-15', checked: false},{name:'16-25', checked: false}, {name:'26-50', checked: false},{name:'50', checked: false}],
            }
        },
        computed: {
            ageImgs(){
                let d = this.formInline.patient_gender == 'Male' ? this.ageImgMaxle : this.formInline.patient_gender == 'Female' ? this.ageImgfemaxle : null
                if(d){
                    let year = {'岁': 1, '月': 12,'周': 52, '日': 365};
                    let num = year[this.formInline.patient_time_type]
                    let sort = Number.parseInt(this.formInline.patient_age/num);
                    let ageType = (d, n, m, sort, i) => {
                        return n <= sort <= m ? d[i] : ''
                    }
                    if(sort < 6) return ageType(d, 0, 5, sort, 0);
                    else if(sort < 16) return ageType(d, 6, 15, sort, 1);
                    else if(sort < 26) return ageType(d, 16, 25, sort, 2);
                    else if(sort < 51) return ageType(d, 26, 50, sort, 3);
                    else if(sort > 50) return ageType(d, 50, 300, sort, 4);
                }
            }
        },
        methods: {
            setSex(val){
                if(val == 'Female') {
                    this.formInline.is_fertility = 0
                }
                this.formInline.patient_marital_status = '未婚'
                this.formInline.medical_history_representor = '本人'
            },
            createName() {
                let i = parseInt(Math.random() * 100)
                let j = parseInt(Math.random() * 100)
                this.formInline.patient_name = this.family_name[i] + this.givenNames[j]
            },
            handleLast() {
                this.$emit('handleNavigate', 1)
            },
            setElement(){
                let d = JSON.parse(sessionStorage.getItem('ACTIVEOUTLINE'))
                if(d.outline&&d.outline.includes('{')){
                    let da = JSON.parse(d.outline);
                    let node = da.nodes;
                    let fillCol = ['#ECF5FF','#DFF5F7','#FFF2DE','#EBF8DB']
                    let types = {
                        '#ECF5FF': 'talk',
                        '#DFF5F7': 'physical',
                        '#FFF2DE': 'assist',
                        '#EBF8DB': 'treat',
                        // '#F9E6DB': 'disease',
                    }
                    let ele = []
                    if(node&&node.length>0){
                        node.map((t) => {
                            if(t.fill){
                                if(fillCol.includes(t.fill)&&t.all_label){
                                    ele.push({
                                        code: t.id+ '|' +Date.parse(new Date()),
                                        element_name: t.all_label,
                                        type: types[t.fill]
                                    })
                                }
                            }
                        })
                    }
                    return ele
                }else return null
            },
            addAndEdit(d, save){
                PostData('case/modifyCase', d).then((r) => {
                    if(r&&r.res_code == 1){
                        // let outline = JSON.parse(sessionStorage.getItem('ACTIVEOUTLINE'))
                        // outline.elements = d.elements;
                        // sessionStorage.setItem('ACTIVEOUTLINE', JSON.stringify(outline))
                        if(!save) this.$emit('handleNavigate', 3)
                        else this.$Message.success('保存成功')
                    }
                })
            },
            isPostpartum(){
                let bool = false
                if(this.formInline.is_fertility == 1 || this.formInline.is_fertility == 2){
                    if(this.formInline.postpartumWeeks || this.formInline.postpartumDay) bool = true
                    else {
                        let text = this.formInline.is_fertility == 1 ? '请输入怀孕时间' : '请输入产后时间'
                        this.$Message.info(text);
                        bool == false
                    }
                }else bool = true
                return bool
            },
            handleNext(save) {
                let data = this.$config.copy(this.formInline)
                if(this.formInline.rediagnosis === '1') data.rediagnosis_content = JSON.stringify({
                    talk: this.case_talk,
                    physical: this.case_physical,
                    assist: this.case_assist,
                    handle: this.case_handle,
                })
                let year = {'岁': 1, '月': 12,'周': 52, '日': 365};
                let num = year[data.patient_time_type]
                data.patient_age_sort = Number.parseInt(data.patient_age/num);
                if(this.formInline.is_fertility == 2 || this.formInline.is_fertility == 1){
                    let postpartum = {
                        weeks: this.formInline.postpartumWeeks,
                        day: this.formInline.postpartumDay,
                    }
                    data.fertility_time = JSON.stringify(postpartum)
                }
                let arr = {'岁': 0, '月': 1, '周': 2,'日': 3};
                let ageList = [0,0,0,0];
                ageList[arr[data.patient_time_type]] = data.patient_age
                data.patient_age_list = JSON.stringify(ageList);
                data.patient_age = data.patient_age + data.patient_time_type;
                this.$refs.formValidate.validate((valid) => {
                    if(valid&&this.isPostpartum()) {
                        sessionStorage.setItem('CaseContentSum',JSON.stringify(data))
                        let d = JSON.parse(sessionStorage.getItem('CaseContentMsg'))
                        d.degree = +d.degree;
                        d.outline_id = +d.outline_ids
                        d.outline_ids = [+d.outline_ids];
                        d.force_unscramble = +d.force_unscramble
                        d.rediagnosis = +d.rediagnosis
                        d.force_unscramble_content = JSON.stringify(d.force_unscramble_content)
                        // d.elements = this.setElement()
                        let da1 = {...data,...d}
                        da1.id = +sessionStorage.getItem('CASEID')
                        this.addAndEdit(da1, save)
                    }
                })
            },
            getSel(){
                PostData('common/getNations').then((r) => {
                    if(r&&r.data) this.nationList = r.data
                })
            },
            preservation(index){
                if(index == 2) this.handleNext(true)
            },
        },
        beforeDestroy () {
            $CasePreservation.$off('CasePreservation', this.preservation)
        },
        mounted() {
            this.getSel()
            $CasePreservation.$on('CasePreservation', this.preservation)
            if(sessionStorage.getItem('CaseContentSum')){
                let d = JSON.parse(sessionStorage.getItem('CaseContentSum'))
                this.formInline = d
                this.formInline.patient_time_type = d.patient_age.slice(d.patient_age.length-1, d.patient_age.length)
                this.formInline.patient_age = +(d.patient_age.slice(0, d.patient_age.length-1))
                if((this.formInline.is_fertility == 1 || this.formInline.is_fertility == 2)&&d.fertility_time){
                    let da = JSON.parse(d.fertility_time)
                    this.formInline.postpartumWeeks = +da.weeks
                    this.formInline.postpartumDay = +da.day
                }
            }
        },
    }
</script>

<style scoped lang="less">
    .age-imgs{
        position: absolute;
        right: calc(50% - 645px);
        top: 285px;
        .img{
            width: 243px;
        }
    }
    .case-postpartum{
        /deep/ .ivu-form-item-content{
            display: flex !important;
        }
    }
    .case-btns{
       margin-bottom: 10px !important;
    }
    /deep/ .ivu-form-item-label{
        font-family: PingFangSC-Regular;
        font-size: 16px !important;
        color: #474C63 !important;
        letter-spacing: 0.93px !important;
        text-align: right;
        width: 110px;
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
    /deep/ .ivu-input-number-handler-wrap{
        display: none;
    }
    /deep/ .ivu-form-item-error-tip{
        left: 90px;
    }
    /deep/ textarea.ivu-input{
        height: 110px;
    }
    .case-form{
        width: 760px;

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
        .case-postpartum-hint{
            position: relative;
            left: -25px;
            line-height: 36px;
            font-size: 13px;
            color: #4098FF;
            cursor: pointer;
        }
        .case-name-hint{
            position: absolute;
            left: 294px;
            top: 0;
            line-height: 36px;
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
            margin-left: 112px;

            /deep/ .ivu-input-number-input{
                text-align: center;
            }

            .case-end-box{
                display: flex;
                margin-right: 20px;

                .box-input-number{
                    width: 50px !important;
                    margin: 0 5px;
                }
            }
        }
        .case-btn-box{
            display: flex;
            margin-top: 26px;
            justify-content: center;
            margin-top: 100px;
            .case-btn-last{
                width: 150px;
                height: 38px;
                background-color: #fff;
                color: #4098ff;
            }

            .case-btn{
                width: 150px;
                height: 38px;
                margin-left: 20px;
            }
        }
    }

</style>
