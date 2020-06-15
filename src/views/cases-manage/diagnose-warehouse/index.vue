<template>
    <div style="display: flex; height: 100%">
        <div class="modal-box">
            <div class="classity-box">
                <div class="classity-title">辅检类型</div>
                <Button class="classity-btn" @click="alterInquiry">修改</Button>
            </div>
            <Collapse style="height: 100%;overflow-y: auto; text-align: left; padding-left: 15px" v-model='first'
                      :accordion="true" simple @on-change="firstChange">
                <Panel v-for="(item,index) in firstList" :key="index" :name="String(item.id)">
                    <span class="item-head">{{item.name}}</span>
                    <Collapse v-if="item.hasCatelog" style="height: 100%;overflow-y: auto" v-model='second'
                              :accordion="true" simple slot="content" @on-change="secondChange">
                        <Panel v-for="(item1,index1) in secondList" :key="index1" :name="String(item1.id)">
                            <span class="item-head">{{item1.name}}</span>
                            <div v-for="(it, ind) in thirdList" :key="it.id" slot="content" class="panel-content"
                                 @click="handleCheck(it, ind)" :class="it.checked ? 'panel-content-checked' : ''">
                                <div class="panel-title">{{it.name}}</div>
                                <Icon :size="24" color="#5399f7" type="md-checkmark" v-if="it.checked"/>
                            </div>
                        </Panel>
                    </Collapse>
                    <div v-else v-for="(it, ind) in secondList" :key="it.id" slot="content" class="panel-content"
                         @click="handleCheck(it, ind)" :class="it.checked ? 'panel-content-checked' : ''">
                        <div class="panel-title">{{it.name}}</div>
                        <Icon :size="24" color="#5399f7" type="md-checkmark" v-if="it.checked"/>
                    </div>
                </Panel>
            </Collapse>
        </div>
        <div style="overflow-x: auto; flex: 1; backgroundColor: #f0f0f7">
            <screen :typeArr="typeArr" sizeTitle1="病问诊数" :sizeNum1="total" btnName="创建辅检" placehodle="搜索内容"
                    @inputChange="inputChange" @handleClick="handleClick" :select2="select2" @selectChange2="selectChange2"
                    :select2Placeholder="select2Placeholder" :select2_1="select2_1" @selectChange2_1="selectChange2_1"
                    :select2_1Placeholder="select2_1Placeholder" :hint="hint"></screen>
            <div class="content-box">
                <tables :tabel-height="tableHeight" :is-serial=true :column="columns1" :table-data="list"
                        @operation="checkCase" @operation1="editCase" @operation2="deleteCase"></tables>
                <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
            </div>
        </div>
        <Modal v-model="checkInquiry" :mask-closable="false" :footer-hide="true" :title="modalTitle" width="700"
               class="check-modal" :styles="{marginBottom: '100px'}" @on-cancel="handleCancel">
            <div v-if="modalTitle == '查看辅助检查'">
                <div v-if="data_type == 'ExaminationReport'">
                    <tables :tabel-height="580" :column="columns2" :table-data="check_list"
                            @inputChange="inputContentChange"/>
                </div>
                <div v-else-if="data_type == 'ImageData'" style="height: 580px;overflow: hidden">
                    <iframe :frameborder="0" class="case-ifram" v-if="data_type == 'ImageData'"
                            :src="officeappsUrl + check_list[0].report"></iframe>
                </div>
                <Button type="primary" class="modal-btn" @click="hanldSubmit">确认</Button>
            </div>
            <div v-else>
                <div class="add-physical">
                    <div>
                        <div class="modal-title">检查部位</div>
                        <Dropdown trigger="click">
                            <div class="drop-select">
                                {{this.type_data.name ? this.type_data.name : (this.check_data.name || '请选择')}}
                                <Icon type="ios-arrow-down" color="#9ea7b4"></Icon>
                            </div>
                            <DropdownMenu slot="list" class="drop-menu">
                                <span v-for="(item, index) in assist_tree" :key="index">
                                    <DropdownMenu slot="list" class="drop-menu">
                                        <Dropdown placement="right-start">
                                            <DropdownItem class="drop-item">
                                                <span class="drop-item-content">{{item.name}}</span>
                                                <Icon type="ios-arrow-forward"></Icon>
                                            </DropdownItem>
                                            <DropdownMenu slot="list" class="drop-menu">
                                                <span v-for="(item1, index1) in item.children" :key="index1">
                                                    <Dropdown v-if="item1.children" placement="right-start">
                                                        <DropdownItem class="drop-item">
                                                            <span class="drop-item-content">{{item1.name}}</span>
                                                            <Icon type="ios-arrow-forward"></Icon>
                                                        </DropdownItem>
                                                        <DropdownMenu slot="list"
                                                                      style="max-height: 800px; overflow-y: auto">
                                                            <DropdownItem v-for="(item2, index2) in item1.children"
                                                                          :key="index2" class="drop-item-last"><div
                                                                    @click="setPart(item2)">{{item2.name}}</div></DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                    <DropdownItem v-else class="drop-item-last"><div
                                                            @click="setPart(item1)">{{item1.name}}</div></DropdownItem>
                                                </span>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </DropdownMenu>
                                </span>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <div class="modal-title">适用性别</div>
                        <Select v-model="body_form.gender" class="inquiry-type">
                            <Option v-show="index != 0" v-for="(item, index) in select2" :value="item.id" :key="index">
                                {{ item.title }}
                            </Option>
                        </Select>
                    </div>
                    <div>
                        <div class="modal-title">适用年龄</div>
                        <Select v-model="body_form.age_state" class="inquiry-type">
                            <Option v-for="(item, index) in select_age" :value="item.id"
                                    :key="index">{{ item.title }}
                            </Option>
                        </Select>
                    </div>
                </div>
                <div class="check-result">
                    <div class="modal-title">检查结果</div>
                    <RadioGroup v-model="body_form.type" size="large" class="check-radio">
                        <Radio label="ImageData">使用文件</Radio>
                        <Radio label="ExaminationReport">使用模版</Radio>
                    </RadioGroup>
                </div>
                <div class="upload-box" v-if="body_form.type == 'ImageData'">
                    <div class="upload-hint">* 支持jpg/png图片、mp3音频、mp4/mov/avi视频，大小不超过300M,只能上传一个文件</div>
                    <div style="display: flex; justify-content: space-between">
                        <upload-btn text="上传文件" class="upload-btn"
                                    type="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document "
                                    bucket="jhyl-static-file"
                                    :dir="'mtt/Data/main/Cases/' + fileDir + '/DefaultAssistantExamination' + upload_name"
                                    @uploadcomplete="uploadType" :maxFileSize="300" />
                        <Button style="width: 80px; height: 30px" type="primary" @click="checkPhysical">{{modalTitle ==
                            '查看体格检查' ? '确定' : '保存'}}
                        </Button>
                    </div>
                    <div class="upload-list" v-if="body_form.file.report">
                        <div style="display: flex; align-items: center">
                            <img :src="wordImg" alt style="height: 18px;width: 16px;"/>
                            <div class="upload-list-content">{{splitFile(body_form.file.report)}}</div>
                        </div>
                        <Icon @click.native="deleteUpload" type="ios-close" size="20" style="cursor: pointer"/>
                    </div>
                </div>
                <div v-else class="upload-mold">
                    <div class="mold-head">
                        <div class="mold-head-content" v-for="(item, index) in mold_head" :key="index"
                             :style="{'width': item.width}">{{item.title}}
                        </div>
                    </div>
                    <div v-for="(item, index) in body_form.reports" class="mold-content" :key="index">
                        <img class="content-img" :src="deleteImg" alt="" @click="deleteTable(index)">
                        <div style="display: flex;">
                            <Input v-model="item[item1.model]" v-for="(item1, index1) in mold_head" :key="index1"
                                   class="content-edit"
                                   :style="{'width': item1.width, 'padding-left': item1.model == 'name' ? '10px' : ''}"
                                   autocomplete="off">
                                <!--                                <Icon v-if="item1.model == 'value'" type="ios-arrow-round-up" slot="suffix" color="#f00"/>-->
                            </Input>
                        </div>
                    </div>
                    <div class="btn-box">
                        <Button class="modal-add-btn" @click="addTable">添加模块列表</Button>
                        <Button type="primary" class="modal-save-btn" @click="checkPhysical">{{modalTitle == '查看辅助检查' ?'确定' : '保存'}}</Button>
                    </div>
                </div>
            </div>
        </Modal>
        <Modal v-model="alterModal" :mask-closable="false" :footer-hide="true" title="辅助类型管理" width="700" class="alter-modal">
            <div class="alter-hint">辅助检查类型支持两级菜单或者三级菜单</div>
            <div ref="alter_tree" style="height: 500px; overflow-y: auto">
                <Tree :data="treeData" :render="renderContent" @on-toggle-expand="onToggleExpand"></Tree>
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
    import officeappsUrl from '../../../../config/officeapps'
    import uploadBtn from "../../../components/UploadButton";
    import deleteImg from '../../../assets/img/templater/delete.png'
    import wordImg from '../../../assets/img/templater/word.png'
    const url = "http://sfile.9mededu.com/mtt/Data/main/Cases/";

    export default {
        components: {screen, tables, pageList, uploadBtn},
        mixins: [pageMixin],
        data() {
            return {
                officeappsUrl, deleteImg, wordImg,
                typeArr: ['input', 'button', 'select2', 'select2_1', 'hint_num'],
                sizeNum1: 10,
                tableHeight: null,
                keyword: '',
                mold_head: [
                    {title: '项目', width: '240px', model: 'name'},
                    {title: '缩写', width: '90px', model: 'abbreviation'},
                    {title: '检查结果', width: '150px', model: 'value'},
                    {title: '参考值', width: '150px', model: 'refvalue'},
                    {title: '单位', width: '74px', model: 'units'},
                ],
                columns1: [{
                    title: '检查项',
                    key: 'name',
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
                }, {
                    title: '适用年龄',
                    key: 'age_state',
                    minWidth: 120,
                    render: (h, param) => {
                        let opinion = {0: '通用', 1: '婴幼儿', 2: '少年', 3: '青年', 4: '中年', 5: '老年'}
                        return h('span', opinion[param.row.age_state])
                    }
                }, {
                    title: '更新时间',
                    key: 'update_time',
                    minWidth: 200
                }, {
                    title: '操作',
                    minWidth: 240,
                    slot: 'operation',
                    // operation: [['查看', 'operation']],
                    operation: [['查看', 'operation'], ['编辑', 'operation1'], ['删除', 'operation2']],
                }],
                list: [],
                check_list: [],
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
                modalTitle: '添加辅检',
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
                first: '',
                firstList: [],
                second: '',
                secondList: [],
                third: '',
                thirdList: [],
                body_form: {
                    item_id: null,
                    gender: "",
                    age_state: "",
                    type: "ImageData",
                    reports: [],
                    file: {},
                },
                fileDir: "model",
                assist_tree: [],
                upload_name: "",
                treeData: [
                    {
                        title: '辅助检查类型',
                        expand: true,
                        render: (h, {root, node, data}) => {
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
                                        }
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
                                            click: () => {
                                                this.append(data, 'catelog')
                                            }
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
                },
                columns2: [
                    {title: '项目', key: 'name', minWidth: 100},
                    {title: '缩写', key: 'abbreviation', minWidth: 50},
                    {title: '检查结果', key: 'value', minWidth: 50},
                    {title: '参考值', key: 'refvalue', minWidth: 50},
                    {title: '单位', key: 'units', minWidth: 50},
                ],
                data_type: '',
                check_data: {},
                type_data: {}
            }
        },
        methods: {
            splitFile(name) {
                return name.split('/')[name.split('/').length - 1]
            },
            uploadType(val) {
                this.body_form.file.report = val.url.split("Cases/")[1]
                // this.body_form.result_media_urls.push({
                //     result_media_url: val.url.split("Cases/")[1]
                // });
                // this.body_form.result_media_type = this.opinionCategory(
                //     val.url.split(".")[val.url.split(".").length - 1]
                // );
                this.$forceUpdate();
            },
            deleteUpload() {
                this.body_form.file = {}
                this.$forceUpdate()
            },
            checkPhysical() {
                if (this.body_form.id) {
                    postData('case/modifyAssisTemplate', this.body_form).then(res => {
                        if (res.res_code == 1) {
                            this.checkInquiry = false
                            this.handleCheck()
                        }
                    })
                } else {
                    this.body_form.item_id = this.type_data.id || this.check_data.id
                    postData('case/addAssisTemplate', this.body_form).then(res => {
                        if (res.res_code == 1) {
                            this.checkInquiry = false
                            this.handleCheck()
                        }
                    })
                }
            },
            firstChange(val) {
                let hasCatelog
                this.firstList.forEach(item => {
                    if (item.id == val) hasCatelog = item.hasCatelog
                })
                if (val.length) {
                    postData('case/getAssistTree', hasCatelog ? {parent_id: parseInt(val[0])} : {category_id: parseInt(val[0])}).then(res => {
                        if (res.res_code == 1) {
                            this.secondList = res.data
                        }
                    })
                }
            },
            secondChange(val) {
                if (val.length) {
                    postData('case/getAssistTree', {category_id: parseInt(val[0])}).then(res => {
                        if (res.res_code == 1) {
                            this.thirdList = res.data
                        }
                    })
                }
            },
            inputChange(val) {
                this.keyword = val
                if (this.check_data) this.handleCheck()
            },
            inputContentChange(val) {

            },
            handleClick() {
                this.body_form.reports = []
                for (let i = 0; i < 5; i++) {
                    this.body_form.reports.push({abbreviation: "", name: "", refvalue: "", units: "", value: "",})
                }
                [this.inquiryType, this.askInput, this.answerInput, this.sexType, this.ageType, this.modalTitle, this.checkInquiry] = [this.talk_group, '', '', '', '', '添加辅助检查', true]
            },
            setPart(item) {
                this.type_data = item
                // this.check_data = item
            },
            addTable() {
                this.body_form.reports.push({abbreviation: "", name: "", refvalue: "", units: "", value: "",})
            },
            selectChange2(val) {
                this.gender = val == 'all' ? '' : val
                if (this.check_data) this.handleCheck()
            },
            selectChange2_1(val) {
                this.age_state = val == 'all' ? '' : val
                if (this.check_data) this.handleCheck()
            },
            checkCase(val) {
                this.check_list = val.child
                this.data_type = val.type
                this.modalTitle = '查看辅助检查'
                this.checkInquiry = true
            },
            hanldSubmit() {
                this.checkInquiry = false
            },
            editCase(val) {
                this.body_form = val
                this.body_form.id = val.template_id
                if (this.body_form.type == "ExaminationReport") {
                    this.body_form.reports = this.body_form.child
                } else {
                    this.body_form.file = {report: this.body_form.child[0].report}
                    this.body_form.reports = []
                    for (let i = 0; i < 5; i++) {
                        this.body_form.reports.push({abbreviation: "", name: "", refvalue: "", units: "", value: "",})
                    }
                }
                this.data_type = this.body_form.type
                this.type_data = this.check_data
                // [this.editId, this.inquiryType, this.sexType, this.ageType, this.askInput, this.answerInput] = [val.id, val.category_id, val.gender == '-' ? '' : val.gender, val.age_state, val.question, val.answer]
                this.modalTitle = '编辑辅助检查'
                this.checkInquiry = true
            },
            deleteCase(val) {
                this.$Modal.confirm({
                    title: '确认要删除这项问答吗',
                    content: '删除后不会对已发布的病例造成影响',
                    onOk: () => {
                        postData('case/removeAssisTemplate', {id: val.template_id}).then(res => {
                            if (res.res_code) {
                                this.$Message.success(res.msg)
                                this.handleCheck()
                            }
                        })
                    },
                });
            },
            deleteTable(index) {
                let {abbreviation, name, refvalue, units, value} = this.body_form.reports[index]
                if (abbreviation || name || refvalue || units || value) this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除该项内容',
                    onOk: () => {
                        this.body_form.reports.splice(index, 1)
                    },
                });
                else this.body_form.reports.splice(index, 1)
            },
            handleCheck(item, index) {
                if (item) this.check_data = item
                let data = {
                    keyword: this.keyword,
                    age_state: this.age_state,
                    gender: this.gender,
                    page_size: this.pageSize,
                    page_num: this.current,
                    item_id: this.check_data.id
                }
                postData('case/getAssisResultTemplate', data).then(res => {
                    if (res.res_code == 1) {
                        this.list = res.data.data
                        this.secondList.map(item1 => {
                            if (item1.checked) item1.checked = false
                        })
                        this.thirdList.map(item1 => {
                            if (item1.checked) item1.checked = false
                        })
                        item ? item.checked = true : null
                        this.tableHeight = this.total > this.pageSize ? window.innerHeight - 200 : window.innerHeight - 166
                        this.$forceUpdate()
                    }
                })
            },
            handleCancel() {
                this.body_form = {
                    item_id: null,
                    gender: "",
                    age_state: "",
                    type: "ImageData",
                    reports: [],
                    file: {},
                }
            },
            handleSubmit() {
                let data = {
                    question: this.askInput,
                    answer: this.answerInput,
                    category_id: this.inquiryType,
                    gender: this.sexType,
                    age_state: this.ageType,
                }
                if (this.modalTitle == '添加问诊') {
                    postData('case/addTalk', data).then(res => {
                        if (res.res_code == 1) {
                            this.checkInquiry = false
                            this.$Message.success(res.msg)
                            this.getList()
                        }
                    })
                } else {
                    data.id = this.editId
                    postData('case/modifyTalk', data).then(res => {
                        if (res.res_code == 1) {
                            this.checkInquiry = false
                            this.$Message.success(res.msg)
                            this.getList()
                        }
                    })
                }
            },
            getArgument() {
                postData('case/getTalkTree').then(res => {
                    if (res.res_code == 1) {
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
                    // category_id: this.talk_group,
                    // gender: this.gender,
                    // age_state: this.age_state
                    tool_region_id: null
                }
                postData('case/getPhysicalResultTemplate', d).then((res) => {
                    if (res.res_code == 1) {
                        res.data.data.forEach(item => {
                            item.question_and_answer = item.question + item.answer
                        })
                        this.list = res.data.data
                        this.total = res.data.count
                        this.tableHeight = this.total > this.pageSize ? window.innerHeight - 200 : window.innerHeight - 166
                        this.hint = `<span style="letter-spacing: 0.93px;white-space: nowrap">共<span style="color: #4098ff">${this.total}</span>/${res.data.countAll}条</span>`
                    }
                })
            },
            getClassify() {
                this.tableHeight = this.total > this.pageSize ? window.innerHeight - 200 : window.innerHeight - 166
                this.getCategory()
                this.getMoldTree()
            },
            getMoldTree() {
                postData('case/getWholeAssistTree').then(res => {
                    if (res.res_code == 1) this.assist_tree = res.data
                })
            },
            getCategory(update) {
                return postData('case/getAssistTree').then(res => {
                    if (res.res_code == 1) {
                        this.firstList = res.data
                        if (!update) {
                            this.treeData[0].children = []
                            res.data.forEach(item => {
                                this.treeData[0].children.push({
                                    title: item.name,
                                    expand: false,
                                    children: item.hasCatelog || item.hasItem ? [{}] : [],
                                    id: item.id,
                                    level: 1,
                                    hasCatelog: item.hasCatelog,
                                    hasItem: item.hasItem,
                                    type: item.type
                                })
                            })
                        }
                    }
                })
            },
            alterInquiry() {
                this.alterModal = true
            },
            renderContent(h, {root, node, data}) {
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
                                'on-blur': (val) => {
                                    this.modifyInput(val.target.value, data, root, node)
                                },
                                'on-enter': (val) => {
                                    this.modifyEnter(val)
                                }
                            },
                            ref: "input_data" + data.nodeKey
                        })
                    ]),
                    h('span', {
                        style: {
                            display: 'flex',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        !data.hasItem && data.type == 'catelog' && data.level != 2 ? h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-add'
                            }),
                            domProps: {
                                innerHTML: '添加分类',
                            },
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                    this.append(data, 'catelog')
                                }
                            }
                        }) : null,
                        !data.hasCatelog && data.type == 'catelog' ? h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-add'
                            }),
                            domProps: {
                                innerHTML: '添加检查',
                            },
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                    this.append(data, 'item')
                                }
                            }
                        }) : null,
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-remove'
                            }),
                            domProps: {
                                innerHTML: '删除',
                            },
                            on: {
                                click: () => {
                                    this.remove(root, node, data)
                                }
                            }
                        })
                    ])
                ]);
            },
            appendChildren(data, level, type) {
                const children = data.children || [];
                children.push({
                    title: '',
                    expand: true,
                    is_create: true,
                    level, type
                });
                data.expand = true
                this.$set(data, 'children', children);
                setTimeout(() => {
                    this.$refs.alter_tree.scrollTop = this.$refs.alter_tree.scrollHeight
                    document.querySelector('.isCreate').children[1].focus()
                }, 200)
            },
            append(data, type) {
                if (!data.level) this.appendChildren(data, 1, type)
                // else postData('case/getAssistTree', data.type == 'item' ? {category_id: parseInt(data.id)} : {parent_id: parseInt(data.id)}).then(res => {
                else postData('case/getAssistTree', {category_id: parseInt(data.id)}).then(res => {
                    if (res.res_code == 1) {
                        data.children = []
                        res.data.forEach(item => {
                            data.children.push({
                                title: item.name,
                                expand: false,
                                children: data.type == 'catelog'&& (item.hasCatelog || item.hasItem) ? [{}] : [],
                                id: item.id,
                                level: 2,
                                hasCatelog: item.hasCatelog,
                                hasItem: item.hasItem,
                                type: item.type
                            })
                        })
                    }
                }).then(() => {
                    this.appendChildren(data, 2, type)
                })
            },
            remove(root, node, data) {
                this.$Modal.confirm({
                    title: '确认要删除这项类型吗',
                    content: '删除后不会对已发布的病例造成影响',
                    onOk: () => {
                        postData('case/removeAssistCategory', {id: data.id, type: data.type}).then(res => {
                            if (res.res_code == 1) {
                                const parentKey = root.find(el => el === node).parent;
                                const parent = root.find(el => el.nodeKey === parentKey).node;
                                const index = parent.children.indexOf(data);
                                parent.children.splice(index, 1);
                                this.getCategory(1)
                            } else this.getCategory()
                        })
                    },
                });
            },
            modifyEnter(el) {
                el.path[0].blur()
            },
            modifyInput(val, data, root, node) {
                if (val && data.is_create) {
                    let parent_id
                    root.forEach(item => {
                        if (item.nodeKey == node.parent) parent_id = item.node.id || 0
                    })
                    let data_obj = {
                        category: val,
                        parent_id,
                        type: data.type,
                        cost: data.type == 'item' ? 0 : null
                    }
                    postData('case/addAssistCategory', data_obj).then(res => {
                        if (res.res_code == 1) {
                            this.getCategory(1)
                            delete data.is_create
                            this.updateList(root, node)
                        } else this.getCategory()
                    })
                } else if (val && !data.is_create) {
                    postData('case/modifyAssistCategory', {id: data.id, category: val, type: data.type}).then(res => {
                        if (res.res_code == 1) this.getCategory(1)
                        else this.getCategory()
                    })
                } else if (!val) {
                    const parentKey = root.find(el => el === node).parent;
                    const parent = root.find(el => el.nodeKey === parentKey).node;
                    const index = parent.children.indexOf(data);
                    parent.children.splice(index, 1);
                }
            },
            updateList(root, node) {
                root.map(item => {
                    if(item.nodeKey == node.parent) {
                        this.onToggleExpand(item.node)
                        if(!item.node.hasCatelog  && !item.node.hasItem) {
                            node.node.type == 'catelog' ? item.node.hasCatelog = true : item.node.hasItem = true
                        }
                    }
                })
            },
            onToggleExpand(val) {
                if (val.hasItem && val.type == 'catelog') {
                    postData('case/getAssistTree', {category_id: parseInt(val.id)}).then(res => {
                        if (res.res_code == 1) {
                            val.children = []
                            res.data.forEach(item => {
                                val.children.push({
                                    title: item.name,
                                    expand: false,
                                    children: [],
                                    id: item.id,
                                    level: val.level + 1,
                                    type: item.type
                                })
                            })
                        }
                    })
                } else if (val.hasCatelog && val.type == 'catelog') {
                    postData('case/getAssistTree', {parent_id: parseInt(val.id)}).then(res => {
                        if (res.res_code == 1) {
                            val.children = []
                            res.data.forEach(item => {
                                val.children.push({
                                    title: item.name,
                                    expand: false,
                                    children: item.hasCatelog || item.hasItem ? [{}] : [],
                                    id: item.id,
                                    hasCatelog: item.hasCatelog,
                                    hasItem: item.hasItem,
                                    level: val.level + 1,
                                    type: item.type
                                })
                            })
                        }
                    })
                } else if (val.nodeKey == 0) {this.getCategory()}
                // else if(!val.hasItem && !val.hasCatelog) {
                //     val.children = []
                // }
            }
        },
        mounted() {
            // this.getArgument()
            this.getClassify()
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-table:before {
        display: none;
    }

    /deep/ .ivu-table-wrapper {
        border: none !important
    }

    .font-input {
        font-family: PingFangSC-Regular;
        font-size: 16px !important;
        letter-spacing: 0;
    }

    .font-check {
        font-family: PingFangSC-Medium;
        font-size: 22px;
        letter-spacing: 1.08px;
        line-height: 34px;
    }

    .add-inquiry {
        padding: 30px 14px;

        .modal-title {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474C63;
            margin-bottom: 10px;
        }

        .inquiry-type {
            height: 50px;
            margin-bottom: 30px;
            width: 200px;
        }

        /deep/ .ivu-select-selection, /deep/ .ivu-select-selected-value, /deep/ .ivu-select-placeholder {
            height: 40px;
            line-height: 40px;
            .font-input
        }

        /deep/ .ivu-select-item {
            .font-input
        }

        /deep/ .ivu-input {
            height: 80px;
            .font-input
        }
    }

    .check-inquiry {
        padding: 40px 50px;

        .check-ask {
            position: relative;
            width: 410px;
            background-color: rgb(238, 237, 246);
            color: #474C63;
            border-radius: 4px;
            padding: 8px 20px;
            .font-check
        }

        .check-answer {
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

        .triangle-ask {
            width: 0;
            height: 0;
            border: 8px solid;
            border-color: transparent rgb(238, 237, 246) transparent transparent;
            position: absolute;
            left: -16px;
            top: 20px;
        }

        .triangle-answer {
            width: 0;
            height: 0;
            border: 8px solid;
            border-color: transparent transparent transparent #4098ff;
            position: absolute;
            right: -16px;
            top: 20px;
        }
    }

    .modal-btn {
        width: 180px;
        height: 36px;
        margin: 40px auto 20px auto;
    }

    .btn-box {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
        margin-bottom: 100px;
    }

    .modal-save-btn {
        width: 80px;
        height: 30px;
    }

    .modal-add-btn {
        width: 130px;
        height: 30px;
        background-color: #fff;
        margin-right: 10px;
    }

    .modal-box {
        width: 250px;
        height: 100%;
        overflow-y: auto;

        .classity-box {
            display: flex;
            height: 68px;
            align-items: center;
            justify-content: space-around
        }

        .classity-title {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474C63;
            letter-spacing: 0;
        }

        .classity-btn {
            background-color: #fff;
            height: 22px;
            width: 58px;
            font-family: PingFangSC-Regular;
            font-size: 14px !important;
            letter-spacing: 0.82px;
        }
    }

    .panel-content {
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 34px;
        cursor: pointer;
        width: 210px;
        margin-left: 15px;

        &:hover {
            .panel-title {
                color: #4098ff;
            }
        }
    }

    .panel-title {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }

    .panel-content-checked {
        background: #F0F0F7;
        border-radius: 100px;
    }

    .content-box {
        background-color: #fff;
        margin: 0 10px 10px 10px;
        height: calc(100% - 76px);
        min-width: 780px;
    }

    .alter-modal {
        /deep/ .ivu-modal-body {
            padding: 0;
        }

        .alter-hint {
            height: 30px;
            line-height: 30px;
            background: #F0F0F7;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #686F92;
            text-align: center
        }
    }

    /deep/ .editorInput {
        border: none;

        /deep/ .ivu-input {
            border: none
        }

        /deep/ .ivu-input:focus {
            border: 1px solid #d7dde4;
        }
    }

    .model-left-title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #474C63;
        letter-spacing: 0;
        text-align: center;
        padding-top: 20px;
    }

    .panel-content {
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 34px;
        cursor: pointer;
        width: 144px !important;

        &:hover {
            .panel-title {
                color: #4098ff;
            }
        }
    }

    .panel-title {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .panel-content-checked {
        background: #F0F0F7;
        border-radius: 100px;
    }

    /deep/ .ivu-collapse, /deep/ .ivu-collapse-header, /deep/ .ivu-collapse-item {
        border: none !important;
    }

    /deep/ .ivu-collapse-item {
        line-height: 34px;
    }

    .modal-box {
        /deep/ .ivu-icon-ios-arrow-forward {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%)
        }
    }

    /deep/ .item-head {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 200px;
    }

    /deep/ .ivu-collapse-content-box {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
        line-height: 34px;
    }

    .case-ifram {
        width: 100%;
        height: 100%;
    }

    .check-modal {
        // height: 800px;
        // /deep/ .ivu-modal-content{
        //     height: 100%;
        //     overflow: hidden;
        //     text-overflow: ellipsis;
        // }
        /deep/ .ivu-table:after {
            display: none
        }

        /deep/ .ivu-modal-content {
            min-height: 500px;
        }
    }

    .add-physical {
        padding: 30px 14px;
        display: flex;
        justify-content: space-between;

        .modal-title {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474c63;
            margin-bottom: 10px;
        }

        .inquiry-type {
            height: 50px;
            margin-bottom: 30px;
            width: 200px;
        }

        /deep/ .ivu-select-selection,
        /deep/ .ivu-select-selected-value,
        /deep/ .ivu-select-placeholder {
            height: 40px;
            line-height: 40px;
            .font-input;
        }

        /deep/ .ivu-select-item {
            .font-input;
        }

        /deep/ .ivu-input {
            height: 80px;
            .font-input;
        }
    }

    .check-result {
        padding: 0 14px;
        display: flex;
        align-items: center;

        .modal-title {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474c63;
        }

        .check-radio {
            margin-left: 30px;

            /deep/ .ivu-radio-inner {
                width: 18px;
                height: 18px;

                &:after {
                    left: 3px;
                    top: 3px;
                }
            }

            /deep/ .ivu-radio-wrapper {
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
            }
        }

        /deep/ textarea.ivu-input {
            height: 150px;
        }
    }

    .upload-box {
        padding: 10px 14px;

        .upload-hint {
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #a4a9c0;
            letter-spacing: 0;
            margin: 10px 0;
        }

        .upload-btn {
            width: 130px;
            height: 30px;
            margin-bottom: 20px;

            /deep/ .ivu-btn {
                width: 130px;
                height: 30px;
            }
        }

        .upload-list {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 310px;
            height: 30px;
            margin-top: 10px;
            background: rgba(240, 240, 247, 0.5);
            border: 1px solid rgba(175, 179, 201, 0.5);
            padding: 0 10px;

            &:hover {
                background: #f3f8ff;
                border: 1px solid #bddbff;
            }

            .upload-list-content {
                width: 200px;
                overflow: hidden;
                margin-left: 10px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }

    .drop-select {
        cursor: pointer;
        width: 198px;
        height: 40px;
        border: 1px solid #d7dde4;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 8px;
        height: 40px;
        line-height: 40px;
        font-family: PingFangSC-Regular;
        font-size: 16px !important;
        letter-spacing: 0;
    }

    /deep/ .ivu-dropdown-item {
        font-family: PingFangSC-Regular;
        font-size: 16px !important;
        letter-spacing: 0;
    }

    .upload-mold {
        margin-top: 10px;

        .mold-head {
            display: flex;

            .mold-head-content {
                background: #F0F0F7;
                border: 1px solid #C8CCDD;
                height: 36px;
                line-height: 36px;
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: #474C63;
                text-align: center;
                margin-right: -1px
            }
        }

        .mold-content {
            position: relative;

            &:hover {
                .content-img {
                    display: inline-block;
                }
            }

            .content-img {
                display: none;
                height: 14px;
                width: 14px;
                position: absolute;
                z-index: 1;
                top: 50%;
                left: 2px;
                transform: translateY(-50%);
                cursor: pointer;
            }

            .content-edit {
                border: 1px solid #C8CCDD;
                text-align: center;
                height: 36px;
                line-height: 36px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #474C63;
                margin-right: -1px;
                margin-top: -1px;
                overflow: hidden;

                /deep/ .ivu-input {
                    border: none;
                    text-align: center;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;

                    &:focus {
                        overflow-y: visible;
                    }
                }

                &:focus {
                    outline: none;
                }
            }
        }
    }

    .drop-menu {
        width: 200px;
        max-height: 800px;
        overflow-y: auto
    }

    .drop-item {
        display: flex;
        justify-content: space-between;

        .drop-item-content {
            width: 150px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis
        }
    }

    .drop-item-last {
        width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
    }
</style>
