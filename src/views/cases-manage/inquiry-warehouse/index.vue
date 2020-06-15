<template>
    <div style="display: flex; height: 100%">
        <div>
            <div class="modal-box">
                <div class="classity-box">
                    <div class="classity-title">问诊类型</div>
                    <Button class="classity-btn" @click="alterInquiry">修改</Button>
                </div>
                <div v-for="(item, index) in title_list" :key="index" @click="handleCheck(item, index)" class="panel-content" :class="item.checked ? 'panel-content-checked' : ''">
                    <div class="panel-title">{{item.title}}</div>
                    <Icon :size="24" color="#5399f7" type="md-checkmark" v-if="item.checked"/>
                </div>
            </div>
        </div>
        <div style="overflow-x: auto; flex: 1">
            <screen :typeArr="typeArr" sizeTitle1="病问诊数" :sizeNum1="total" btnName="创建问诊" placehodle="搜索内容" @inputChange="inputChange"
                @handleClick="handleClick" :select2="select2" @selectChange2="selectChange2" :select2Placeholder="select2Placeholder"
                :select2_1="select2_1" @selectChange2_1="selectChange2_1" :select2_1Placeholder="select2_1Placeholder" :hint="hint"></screen>
            <div class="content-box">
                <tables :tabel-height="tableHeight" :is-serial=true :column="columns1" :table-data="list"
                    @operation1="editCase" @operation2="deleteCase" @operation="checkCase"></tables>
                <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
            </div>
        </div>
        <Modal v-model="checkInquiry" :mask-closable="false" :footer-hide="true" :title="modalTitle" width="700">
            <div v-if="modalTitle == '添加问诊' || modalTitle == '编辑问诊'" class="add-inquiry">
                <div style="display: flex; justify-content: space-between">
                    <div>
                        <div class="modal-title">问诊类型</div>
                        <Select v-model="inquiryType" class="inquiry-type">
                            <Option v-for="(item, index) in title_list" :value="item.id" :key="index">{{ item.title }}</Option>
                        </Select>
                    </div>
                    <div>
                        <div class="modal-title">适用性别</div>
                        <Select v-model="sexType" class="inquiry-type">
                            <Option v-show="index != 0" v-for="(item, index) in select2" :value="item.id" :key="index">{{ item.title }}</Option>
                        </Select>
                    </div>
                    <div>
                        <div class="modal-title">适用年龄</div>
                        <Select v-model="ageType" class="inquiry-type">
                            <Option v-for="(item, index) in select_age" :value="item.id" :key="index">{{ item.title }}</Option>
                        </Select>
                    </div>
                </div>
                <div class="modal-title">提问</div><Input v-model="askInput" type="textarea" placeholder="请输入提问内容" style="margin-bottom: 30px;"/>
                <div class="modal-title">标准回答</div><Input v-model="answerInput" type="textarea" placeholder="请输入回答内容"/>
                <Button type="primary" @click="handleSubmit" class="modal-btn">保存</Button>
            </div>
            <div v-else class="check-inquiry">
                <div class="check-ask">
                    <div class="triangle-ask"/>{{askInput}}
                </div>
                <div class="check-answer">
                    <div class="triangle-answer"/>{{answerInput}}
                </div>
            </div>
        </Modal>
        <Modal v-model="alterModal" :mask-closable="false" :footer-hide="true" title="问诊类型管理" width="700" class="alter-modal">
            <div class="alter-hint">问诊类型只支持一级菜单</div>
            <div ref="alter_tree" style="height: 500px; overflow-y: auto">
                <Tree :data="treeData" :render="renderContent"></Tree>
            </div>
        </Modal>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import tables from '../../../components/tables'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import postData from '../../../api/postData'

    export default {
        components: {screen, tables, pageList},
        mixins: [pageMixin],
        data() {
            return {
                typeArr: ['input', 'button', 'select2', 'select2_1', 'hint_num'],
                sizeNum1: 10,
                tableHeight: null,
                keyword: '',
                columns1: [{
                    title: '问答',
                    key: 'question_and_answer',
                    align: 'left',
                    minWidth: 400,
                    ellipsis: true,
                }, {
                    title: '适用性别',
                    key: 'gender',
                    minWidth: 120,
                    render: (h, param) => {
                        let opinion = {Common: '通用', Male: '男', Female: '女'}
                        return h('span', opinion[param.row.gender] ? opinion[param.row.gender] : '-')
                    }
                },{
                    title: '适用年龄',
                    key: 'age_state',
                    minWidth: 120,
                    render: (h, param) => {
                        let opinion = {0: '通用', 1: '婴幼儿', 2: '少年', 3: '青年', 4: '中年', 5: '老年'}
                        return h('span', opinion[param.row.age_state])
                    }
                },{
                    title: '更新人',
                    key: 'realname',
                    minWidth: 120
                }, {
                    title: '更新时间',
                    key: 'update_time',
                    minWidth: 200
                }, {
                    title: '操作',
                    minWidth: 240,
                    slot: 'operation',
                    operation: [['查看', 'operation'],['编辑', 'operation1'], ['删除', 'operation2']],
                }],
                list: [],
                select2: [
                    {id: 'all', title: '全部性别'},
                    {id: 'Common', title: '通用'},
                    {id: 'Male', title: '男'},
                    {id: 'Female', title: '女'},
                ],
                select2Placeholder: '选择性别',
                select2_1: [
                    {id: 'all', title: '全部年龄'},
                    {id: 1, title: '婴幼儿(0-6岁)'},
                    {id: 2, title: '少儿(7-15岁)'},
                    {id: 3, title: '青年(16-35岁)'},
                    {id: 4, title: '中年(36-60岁)'},
                    {id: 5, title: '老年(61-99岁)'},
                ],
                select_age: [
                    {id: 0, title: '通用'},
                    {id: 1, title: '婴幼儿(0-6岁)'},
                    {id: 2, title: '少儿(7-15岁)'},
                    {id: 3, title: '青年(16-35岁)'},
                    {id: 4, title: '中年(36-60岁)'},
                    {id: 5, title: '老年(61-99岁)'},
                ],
                select2_1Placeholder: '选择性别',
                talk_group: '',
                checkInquiry: false,
                modalTitle: '添加问诊',
                inquiryType: '',
                inquiryList: [],
                askInput: '',
                answerInput: '',
                editId: '',
                title_list: [],
                hint: '',
                age_state: '',
                gender: '',
                sexType: null,
                ageType: null,
                alterModal: false,
                treeData: [
                    {
                        title: '问诊检查类型',
                        expand: true,
                        render: (h, { root, node, data }) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('span', {
                                        domProps: {
                                            innerHTML: data.title,
                                        },
                                        style: {
                                            padding: '4px 7px'
                                        },
                                    })
                                ]),
                                h('span', {
                                    style: {
                                        display: 'flex',
                                        float: 'right',
                                        marginRight: '32px'
                                    }
                                }, [
                                    h('Button', {
                                        props: Object.assign({}, this.buttonProps, {
                                            icon: 'ios-add',
                                            type: 'primary'
                                        }),
                                        style: {
                                            width: '64px'
                                        },
                                        on: {
                                            click: () => { this.append(data) }
                                        }
                                    })
                                ])
                            ]);
                        },
                        children: []
                    }
                ],
                buttonProps: {
                    type: 'default',
                    size: 'small',
                }
            }
        },
        methods: {
            inputChange(val) {
                this.keyword = val
                this.getList()
            },
            handleClick() {
                [this.inquiryType, this.askInput, this.answerInput, this.sexType, this.ageType, this.modalTitle, this.checkInquiry] = [this.talk_group, '', '', '', '',  '添加问诊', true]
            },
            selectChange2(val) {
                this.gender = val == 'all' ? '' : val
                this.getList()
            },
            selectChange2_1(val) {
                this.age_state = val == 'all' ? '' : val
                this.getList()
            },
            checkCase(val) {
                [this.askInput, this.answerInput] = [val.question, val.answer]
                this.modalTitle = '查看问诊'
                this.checkInquiry = true
            },
            editCase(val) {
                [this.editId, this.inquiryType, this.sexType, this.ageType, this.askInput, this.answerInput] = [val.id, val.category_id, val.gender == '-' ? '' : val.gender, val.age_state,val.question, val.answer]
                this.modalTitle = '编辑问诊'
                this.checkInquiry = true
            },
            deleteCase(val) {
                this.$Modal.confirm({
                    title: '确认要删除这项问答吗',
                    content: '删除后不会对已发布的病例造成影响',
                    onOk: () => {
                        postData('case/removeTalk', {id:val.id}).then(res => {
                            if(res.res_code){
                                this.$Message.success(res.msg)
                                this.getList()
                            }
                        })
                    },
                });
            },
            handleCheck(item, index) {
                this.title_list.map(item_list => {
                    if(item_list.checked == true) item_list.checked = false
                })
                item.checked = true
                this.$forceUpdate()
                this.inquiryType = this.talk_group = item.id
                this.getList()
            },
            handleSubmit() {
                let data = {
                    question: this.askInput,
                    answer: this.answerInput,
                    category_id: this.inquiryType,
                    gender: this.sexType,
                    age_state: this.ageType,
                }
                if(this.modalTitle == '添加问诊') {
                    postData('case/addTalk', data).then(res => {
                        if(res.res_code == 1) {
                            this.checkInquiry = false
                            this.$Message.success(res.msg)
                            this.getList()
                        }
                    })
                }else{
                    data.id = this.editId
                    postData('case/modifyTalk',data).then(res => {
                        if(res.res_code == 1) {
                            this.checkInquiry = false
                            this.$Message.success(res.msg)
                            this.getList()
                        }
                    })
                }
            },
            getArgument() {
                postData('case/getTalkTree').then(res => {
                    if(res.res_code == 1) {
                        res.data.map((item, index) => {
                            item.id = item.talk_group
                            item.title = item.talk_group
                        })
                        this.inquiryList = res.data
                    }
                })
            },
            getList() {
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    category_id: this.talk_group,
                    gender: this.gender,
                    age_state: this.age_state
                }
                postData('case/getTalkList', d).then((res) => {
                    if(res.res_code == 1) {
                        res.data.data.forEach(item => {
                            item.question_and_answer = item.question + item.answer
                        })
                        this.list = res.data.data
                        this.total = res.data.count
                        this.tableHeight = this.total>this.pageSize ? window.innerHeight - 200 : window.innerHeight - 166
                        this.hint = `<span style="letter-spacing: 0.93px;white-space: nowrap">共<span style="color: #4098ff">${this.total}</span>/${res.data.countAll}条</span>`
                    }
                })
            },
            getClassify() {
                this.getCategory()
            },
            getCategory() {
                return  postData('case/getTalkCategories').then(res => {
                    if(res.res_code == 1) {
                        this.title_list = res.data
                        this.treeData[0].children = []
                        res.data.forEach(item => {
                            this.treeData[0].children.push({
                                title: item.title,
                                expand: false,
                                children: [],
                                id: item.id
                            })
                        })
                        if(res.data.length) {
                            this.talk_group = res.data[0].id
                            this.title_list[0].checked = true
                        }
                        this.getList()
                    }
                })
            },
            alterInquiry() {
                this.alterModal = true
            },
            modifyInput(val, data, el) {
                if(el) el.path[0].blur()
                else if(val && data.is_create) {
                    postData('case/addTalkCategory', {category: val}).then(res => {
                        if(res.res_code == 1) this.getCategory()
                    })
                }else if(val && !data.is_create) {
                    postData('case/modifyTalkCategory', {id: data.id, category: val}).then(res => {
                        if(res.res_code == 1) this.getClassify()
                    })
                }else if(!val) {
                    this.getClassify()
                    this.$forceUpdate()
                }
            },
            renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Input', {
                            class: {
                                editorInput: true,
                                isCreate: data.is_create ? true : false
                            },
                            style: {
                                width: '200px',
                            },
                            props: {
                                value: data.title,
                                placeholder: '请输入问诊类型',
                            },
                            on: {
                                'on-blur': (val) => {this.modifyInput(val.target.value, data)},
                                'on-enter': (val) => {this.modifyInput(val.target.value, data, val)}
                            },
                            ref: "input_data" + data.nodeKey,
                            key: "input_data" + data.nodeKey,
                            refInFor: true
                        })
                    ]),
                    h('span', {
                        style: {
                            display: 'flex',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-remove'
                            }),
                            on: {
                                click: () => { this.remove(root, node, data) }
                            }
                        })
                    ])
                ]);
            },
            append (data) {
                const children = data.children || [];
                children.push({
                    title: '',
                    expand: true,
                    is_create: true,
                });
                this.$set(data, 'children', children);
                setTimeout(() => {
                    this.$refs.alter_tree.scrollTop = this.$refs.alter_tree.scrollHeight
                    document.querySelectorAll('.ivu-input')[document.querySelectorAll('.ivu-input').length - 1].focus()
                },100)
                // postData('case/addTalkCategory', {category: '新建问诊分类'}).then(res => {
                //     if(res.res_code == 1) {
                //         this.getCategory().then(() => {
                //             setTimeout(() => {
                //                 this.$refs.alter_tree.scrollTop = this.$refs.alter_tree.scrollHeight
                //                 document.querySelectorAll('.ivu-input')[document.querySelectorAll('.ivu-input').length - 1].focus()
                //             },100)
                //         })
                //         // this.getClassify()
                //         // this.$nextTick(() => {
                //         //     this.$refs['input_data' + children[children.length - 1].nodeKey].focus()
                //         // })
                //         // },200)
                //     }
                // })
            },
            remove (root, node, data) {
                this.$Modal.confirm({
                    title: '确认要删除这项类型吗',
                    content: '删除后不会对已发布的病例造成影响',
                    onOk: () => {
                        postData('case/removeTalkCategory', {id: data.id}).then(res => {
                            if(res.res_code == 1) this.getClassify()
                        })
                        // const parentKey = root.find(el => el === node).parent;
                        // const parent = root.find(el => el.nodeKey === parentKey).node;
                        // const index = parent.children.indexOf(data);
                        // parent.children.splice(index, 1);
                    },
                });
            }
        },
        mounted() {
            // this.getArgument()
            this.getClassify()
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-table:before{
        display: none;
    }
    /deep/ .ivu-table-wrapper{
        border: none !important
    }
    .font-input{
        font-family: PingFangSC-Regular;
        font-size: 16px !important;
        letter-spacing: 0;
    }
    .font-check{
        font-family: PingFangSC-Medium;
        font-size: 22px;
        letter-spacing: 1.08px;
        line-height: 34px;
    }
    .add-inquiry{
        padding: 30px 14px;

        .modal-title{
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474C63;
            margin-bottom: 10px;
        }
        .inquiry-type{
            height: 50px;
            margin-bottom: 30px;
            width: 200px;
        }
        /deep/ .ivu-select-selection, /deep/ .ivu-select-selected-value, /deep/ .ivu-select-placeholder{
            height: 40px;
            line-height: 40px;
            .font-input
        }
        /deep/ .ivu-select-item{
            .font-input
        }
        /deep/ .ivu-input{
            height: 80px;
            .font-input
        }
    }
    .check-inquiry{
        padding: 40px 50px;

        .check-ask{
            position: relative;
            width: 410px;
            background-color: rgb(238, 237, 246);
            color: #474C63;
            border-radius: 4px;
            padding: 8px 20px;
            .font-check
        }
        .check-answer{
            position: relative;
            width: 410px;
            background-color: #4098ff;
            color: #fff;
            right: 0;
            margin-top: 40px;
            border-radius: 4px;
            padding: 8px 20px;
            margin-left: 170px;
            .font-check
        }
        .triangle-ask{
            width: 0;
            height: 0;
            border: 8px solid;
            border-color: transparent rgb(238, 237, 246) transparent transparent;
            position: absolute;
            left: -16px;
            top: 20px;
        }
        .triangle-answer{
            width: 0;
            height: 0;
            border: 8px solid;
            border-color: transparent transparent transparent #4098ff;
            position: absolute;
            right: -16px;
            top: 20px;
        }
    }
    .modal-btn{
        width: 180px;
        height: 36px;
        margin: 40px auto 20px auto;
    }
    .modal-box{
        width: 250px;
        height: calc(100% - 47px);
        overflow-y: auto;

        .classity-box{
            display: flex;
            height: 68px;
            align-items: center;
            justify-content: space-around
        }
        .classity-title{
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474C63;
            letter-spacing: 0;
        }
        .classity-btn{
            background-color: #fff;
            height: 22px;
            width: 58px;
            font-family: PingFangSC-Regular;
            font-size: 14px !important;
            letter-spacing: 0.82px;
        }
    }
    .panel-content{
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 34px;
        cursor: pointer;
        width: 210px;
        margin-left: 15px;

        &:hover{
            .panel-title{
                color: #4098ff;
            }
        }
    }
    .panel-title{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }
    .panel-content-checked{
        background: #F0F0F7;
        border-radius: 100px;
    }
    .content-box{
        background-color: #f0f0f7;
        padding: 0 10px 10px 10px;
    }
    .alter-modal{
        /deep/ .ivu-modal-body{
            padding: 0;
        }
        .alter-hint{
            height: 30px;
            line-height: 30px;
            background: #F0F0F7;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #686F92;
            text-align: center
        }
    }
    /deep/ .editorInput{
        border: none;
        /deep/ .ivu-input{
            border: none
        }
        /deep/ .ivu-input:focus{
            border: 1px solid #d7dde4;
        }
    }
</style>
