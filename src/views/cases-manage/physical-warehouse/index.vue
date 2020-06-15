<template>
    <div style="display: flex; height: 100%">
        <div class="modal-box">
            <div class="classity-box">
                <div class="classity-title">体检类型</div>
                <Button class="classity-btn" @click="alterInquiry">修改</Button>
            </div>
            <Collapse style="height: calc(100% - 68px); overflow-y: auto; text-align: left; padding-left: 15px"
                      v-model="first" :accordion="true" simple @on-change="firstChange">
                <Panel v-for="(item,index) in firstList" :key="index" :name="String(item.id)">
                    <span class="item-head" style="width: 200px">{{item.name}}</span>
                    <Collapse style="height: 100%;overflow-y: auto" v-model="second" :accordion="true" simple
                              slot="content" @on-change="secondChange">
                        <Panel v-for="(item1,index1) in secondList" :key="index1" :name="String(item1.id)">
                            <span class="item-head">{{item1.name}}</span>
                            <div v-for="(it, ind) in thirdList" :key="it.id" slot="content"
                                 class="panel-content" @click="handleCheck(it, ind)"
                                 :class="it.checked ? 'panel-content-checked' : ''">
                                <div class="panel-title">{{it.name}}</div>
                                <Icon :size="24" color="#5399f7" type="md-checkmark" v-if="it.checked"/>
                            </div>
                        </Panel>
                    </Collapse>
                </Panel>
            </Collapse>
        </div>
        <div style="overflow-x: auto; flex: 1; backgroundColor: #f0f0f7">
            <screen :typeArr="typeArr" sizeTitle1="病问诊数" :sizeNum1="total" btnName="创建体检" placehodle="搜索内容"
                    @inputChange="inputChange" @handleClick="handleClick"
                    :select2="select2" @selectChange2="selectChange2" :select2Placeholder="select2Placeholder"
                    :select2_1="select2_1" @selectChange2_1="selectChange2_1"
                    :select2_1Placeholder="select2_1Placeholder" :hint="hint"></screen>
            <div class="content-box">
                <tables :tabel-height="tableHeight" :is-serial="true" :column="columns1" :table-data="list"
                        @operation1="editCase" @operation2="deleteCase" @operation="checkCase"></tables>
                <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
            </div>
        </div>
        <Modal v-model="checkInquiry" :mask-closable="false" :footer-hide="true" :title="modalTitle" width="700"
               @on-cancel="cancelCheck">
            <div v-if="modalTitle == '查看体格检查'">
                <div v-if="checkResult.result_media_type == 'Picture'">
                    <img v-for="(item, index) in checkResult.child" :key="index" :src="url + item.result_media_url" alt
                         style="width:100%"/>
                </div>
                <div v-else-if="checkResult.result_media_type == 'Video'">
                    <video v-for="(item, index) in checkResult.child" :key="index" class="collapse-video" autoplay
                           controls width="100%"
                           height="100%" :src="url + item.result_media_url" ref="checkVideo"></video>
                </div>
                <div v-else-if="checkResult.result_media_type == 'Audio'">
                    <audio v-for="(item, index) in checkResult.child" :key="index" class="collapse-audio"
                           :src="url + item.result_media_url"
                           controls id="audio" style="width: 100%;height: 4rem;" ref="checkAudio"></audio>
                </div>
                <div v-if="checkResult.result_media_type == 'None'" style="fontSize: 16px">{{checkResult.result_text}}
                </div>
                <Button type="primary" class="modal-btn" @click="checkPhysical">{{modalTitle == '查看体格检查' ? '确定' :
                    '保存'}}
                </Button>
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
                                                    <Dropdown placement="right-start">
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
                    <Input type="textarea" v-model="body_form.result_text" placeholder="请输入检查结果"/>
                </div>
                <div class="upload-box">
                    <div class="upload-hint">* 支持jpg/png图片、mp3音频、mp4/mov/avi视频，大小不超过300M,只能上传多个同类型文件</div>
                    <div style="display: flex; justifyContent: space-between">
                        <upload-btn style="height: 130px;height: 30px; marginBottom: 20px" text="上传文件"
                                    class="upload-btn"
                                    type="image/png,image/jpg,video/mp4,video/mov,video/avi,audio/mp3"
                                    bucket="jhyl-static-file"
                                    @uploadcomplete="uploadType" :maxFileSize="300"
                                    :dir="'mtt/Data/main/Cases/' + fileDir + '/DefaultAssistantExamination' + upload_name"/>
                        <Button style="width: 80px; height: 30px" type="primary" @click="checkPhysical">{{modalTitle == '查看体格检查' ? '确定' : '保存'}}</Button>
                    </div>
                    <div class="upload-list" v-for="(item, index) in body_form.result_media_urls" :key="index">
                        <div style="display: flex; align-items: center">
                            <img :src="splitFile(item.result_media_url, 'img')" alt style="height: 18px;width: 16px;"/>
                            <div class="upload-list-content">{{splitFile(item.result_media_url, 'name')}}</div>
                        </div>
                        <Icon @click="deleteUpload(index)" type="ios-close" size="20" style="cursor: pointer"/>
                    </div>
                </div>
            </div>
            <!-- <Button type="primary" class="modal-btn" @click="checkPhysical">{{modalTitle == '查看体格检查' ? '确定' : '保存'}}</Button> -->
        </Modal>
        <Modal v-model="alterModal" :mask-closable="false" :footer-hide="true" title="体格检查类型管理" width="700"
               class="alter-modal">
            <div class="alter-hint">体格检查类型支持三级菜单</div>
            <div ref="alter_tree" style="height: 500px; overflow-y: auto">
                <Tree :data="treeData" :render="renderContent" @on-toggle-expand="onToggleExpand"></Tree>
            </div>
        </Modal>
    </div>
</template>

<script>
    import screen from "../../../components/ScreenFrame";
    import tables from "../../../components/tables";
    import pageList from "../../../components/Page";
    import pageMixin from "../../mixins/pageMixins";
    import postData from "../../../api/postData";
    import uploadBtn from "../../../components/UploadButton";
    import audioImg from "../../../assets/img/templater/audio.png";
    import pictureImg from "../../../assets/img/templater/picture.png";
    import videoImg from "../../../assets/img/templater/video.png";

    const url = "http://sfile.9mededu.com/mtt/Data/main/Cases/";

    export default {
        components: {screen, tables, pageList, uploadBtn},
        mixins: [pageMixin],
        data() {
            return {
                audioImg,
                pictureImg,
                videoImg,
                typeArr: ["input", "button", "select2", "select2_1", "hint_num"],
                sizeNum1: 10,
                tableHeight: null,
                keyword: "",
                columns1: [
                    {
                        title: "检查部位",
                        key: "name",
                        align: "left",
                        minWidth: 400,
                        ellipsis: true
                    },
                    {
                        title: "适用性别",
                        key: "gender",
                        minWidth: 120,
                        render: (h, param) => {
                            let opinion = {Common: "通用", Male: "男", Female: "女"};
                            return h(
                                "span",
                                opinion[param.row.gender] ? opinion[param.row.gender] : "-"
                            );
                        }
                    },
                    {
                        title: "适用年龄",
                        key: "age_state",
                        minWidth: 120,
                        render: (h, param) => {
                            let opinion = {
                                0: '通用',
                                1: "婴幼儿",
                                2: "少年",
                                3: "青年",
                                4: "中年",
                                5: "老年",
                            };
                            return h("span", opinion[param.row.age_state]);
                        }
                    },
                    // {
                    //     title: "更新人",
                    //     key: "realname",
                    //     minWidth: 120
                    // },
                    {
                        title: "更新时间",
                        key: "update_time",
                        minWidth: 200
                    },
                    {
                        title: "操作",
                        minWidth: 240,
                        slot: "operation",
                        operation: [
                            ["查看", "operation"],
                            ["编辑", "operation1"],
                            ["删除", "operation2"]
                        ]
                    }
                ],
                list: [],
                select2: [
                    {id: "all", title: "全部性别"},
                    {id: "Common", title: "通用"},
                    {id: "Male", title: "男"},
                    {id: "Female", title: "女"}
                ],
                select2Placeholder: "选择性别",
                select2_1: [
                    {id: "all", title: "全部年龄"},
                    {id: 1, title: "婴幼儿(0-6岁)"},
                    {id: 2, title: "少儿(7-15岁)"},
                    {id: 3, title: "青年(16-35岁)"},
                    {id: 4, title: "中年(36-60岁)"},
                    {id: 5, title: "老年(61-99岁)"}
                ],
                select_age: [
                    {id: 0, title: "通用"},
                    {id: 1, title: "婴幼儿(0-6岁)"},
                    {id: 2, title: "少儿(7-15岁)"},
                    {id: 3, title: "青年(16-35岁)"},
                    {id: 4, title: "中年(36-60岁)"},
                    {id: 5, title: "老年(61-99岁)"}
                ],
                select2_1Placeholder: "选择性别",
                talk_group: "",
                checkInquiry: false,
                modalTitle: "添加问诊",
                inquiryType: "",
                inquiryList: [],
                askInput: "",
                answerInput: "",
                editId: "",
                title_list: [],
                hint: "",
                age_state: "",
                gender: "",
                sexType: null,
                ageType: null,
                alterModal: false,
                first: "",
                firstList: [],
                second: "",
                secondList: [],
                third: "",
                thirdList: [],
                checkResult: {},
                url,
                assist_tree: [],
                fileDir: "model",
                upload_name: "",
                upList: [],
                check_data: {},
                type_data: {},
                body_form: {
                    tool_region_id: null,
                    result_text: "",
                    result_media_type: "",
                    result_media_urls: [],
                    gender: "",
                    age_state: ""
                },
                treeData: [
                    {
                        title: "体格检查类型",
                        expand: true,
                        type: "catelog",
                        level: 0,
                        render: (h, {root, node, data}) => {
                            return h(
                                "span",
                                {
                                    style: {
                                        display: "inline-block",
                                        width: "100%"
                                    }
                                },
                                [
                                    h("span", [
                                        h("span", {
                                            domProps: {
                                                innerHTML: data.title
                                            },
                                            style: {
                                                padding: "4px 7px"
                                            }
                                        })
                                    ]),
                                    h(
                                        "span",
                                        {
                                            style: {
                                                display: "flex",
                                                float: "right",
                                                marginRight: "32px"
                                            }
                                        },
                                        [
                                            h("Button", {
                                                props: Object.assign({}, this.buttonProps, {
                                                    icon: "ios-add",
                                                    type: "primary"
                                                }),
                                                style: {
                                                    width: "64px"
                                                },
                                                on: {
                                                    click: () => {
                                                        this.append(data);
                                                    }
                                                }
                                            })
                                        ]
                                    )
                                ]
                            );
                        },
                        children: []
                    }
                ],
                buttonProps: {
                    type: "default",
                    size: "small"
                }
            };
        },
        methods: {
            splitFile(name, type) {
                let file = {
                    Picture: this.pictureImg,
                    Video: this.videoImg,
                    Audio: this.audioImg
                }
                if(type == 'name') return name.split('/')[name.split('/').length - 1]
                else {
                    let file_type = this.opinionCategory(name.split('.')[name.split('.').length - 1])
                    return file[file_type]
                }
            },
            firstChange(val) {
                if (val.length) {
                    this.second = null;
                    postData("case/getPhysicalTree", {parent_id: parseInt(val[0])}).then(
                        res => {
                            if (res.res_code == 1) {
                                this.secondList = res.data;
                            }
                        }
                    );
                }
            },
            secondChange(val) {
                if (val.length) {
                    postData("case/getPhysicalTree", {
                        category_id: parseInt(val[0])
                    }).then(res => {
                        if (res.res_code == 1) {
                            this.thirdList = res.data;
                        }
                    });
                }
            },
            inputChange(val) {
                this.keyword = val;
                if (this.check_data) this.handleCheck();
            },
            handleClick() {
                // if(this.check_data) this.checkInquiry = true
                // else this.$Message.info('请选择体检检查项目')
                this.checkInquiry = true;
                this.modalTitle = "创建体格检查";
            },
            selectChange2(val) {
                this.gender = val == "all" ? "" : val;
                if (this.check_data) this.handleCheck();
            },
            selectChange2_1(val) {
                this.age_state = val == "all" ? "" : val;
                if (this.check_data) this.handleCheck();
            },
            checkCase(val) {
                this.checkResult = val;
                this.modalTitle = "查看体格检查";
                this.checkInquiry = true;
            },
            editCase(val) {
                this.body_form = val;
                this.body_form.id = this.body_form.template_id;
                this.body_form.result_media_urls = this.body_form.child || [];
                this.body_form.result_media_urls.map(item => {
                    item.media_id = item.id;
                });
                this.upList = val.child;
                this.modalTitle = "编辑体格检查";
                this.checkInquiry = true;
            },
            deleteCase(val) {
                this.$Modal.confirm({
                    title: "确认要删除这项体格检查吗",
                    content: "删除后不会对已发布的病例造成影响",
                    onOk: () => {
                        postData("case/removePhysical", {
                            id: val.template_id,
                            result_media_type: val.result_media_type
                        }).then(res => {
                            if (res.res_code) {
                                this.$Message.success(res.msg);
                                this.handleCheck();
                            }
                        });
                    }
                });
            },
            setPart(item) {
                this.type_data = item
                // this.check_data = item
            },
            handleCheck(item, index) {
                if (item) this.check_data = item;
                let data = {
                    keyword: this.keyword,
                    age_state: this.age_state,
                    gender: this.gender,
                    page_size: this.pageSize,
                    page_num: this.current,
                    tool_region_id: this.check_data.id
                };
                postData("case/getPhysicalResultTemplate", data).then(res => {
                    if (res.res_code == 1) {
                        this.thirdList.map(item1 => {
                            if (item1.checked) item1.checked = false;
                        });
                        this.list = res.data.data;
                        item ? (item.checked = true) : null;
                        this.tableHeight = this.total > this.pageSize ? window.innerHeight - 200 : window.innerHeight - 166;
                        this.$forceUpdate();
                    }
                });
            },
            handleSubmit() {
                let data = {
                    question: this.askInput,
                    answer: this.answerInput,
                    category_id: this.inquiryType,
                    gender: this.sexType,
                    age_state: this.ageType
                };
                if (this.modalTitle == "添加问诊") {
                    postData("case/addTalk", data).then(res => {
                        if (res.res_code == 1) {
                            this.checkInquiry = false;
                            this.$Message.success(res.msg);
                            this.getList();
                        }
                    });
                } else {
                    data.id = this.editId;
                    postData("case/modifyTalk", data).then(res => {
                        if (res.res_code == 1) {
                            this.checkInquiry = false;
                            this.$Message.success(res.msg);
                            this.getList();
                        }
                    });
                }
            },
            getArgument() {
                postData("case/getTalkTree").then(res => {
                    if (res.res_code == 1) {
                        res.data.map((item, index) => {
                            item.id = item.talk_group;
                            item.title = item.talk_group;
                        });
                        this.inquiryList = res.data;
                    }
                });
            },
            opinionCategory(val) {
                switch (val) {
                    case "jpg" || "png":
                        return "Picture";
                    case "mp4" || "mov" || "avi":
                        return "Video";
                    default:
                        return "Audio";
                }
            },
            checkPhysical() {
                let url = this.modalTitle == "创建体格检查" ? "case/addPhysical" : "case/modifyPhysical";
                this.body_form.tool_region_id = this.check_data.id;
                if (this.modalTitle !== "查看体格检查")
                    postData(url, this.body_form).then(res => {
                        if (res.res_code == 1) {
                            this.handleCheck();
                            this.upList = [];
                            this.body_form = {
                                tool_region_id: null,
                                result_text: "",
                                result_media_type: "",
                                result_media_urls: [],
                                gender: "",
                                age_state: ""
                            };
                            this.checkInquiry = false;
                        }
                    });
                else this.checkInquiry = false;
            },
            cancelCheck() {
                if (this.$refs.checkAudio)
                    this.$refs.checkAudio.forEach(item => {
                        item.pause();
                    });
                if (this.$refs.checkVideo)
                    this.$refs.checkVideo.forEach(item => {
                        item.pause();
                    });
                this.body_form = {
                    tool_region_id: null,
                    result_text: "",
                    result_media_type: "",
                    result_media_urls: [],
                    gender: "",
                    age_state: ""
                }
            },
            uploadType(val) {
                console.log(val);
                this.body_form.result_media_urls.push({
                    result_media_url: val.url.split("Cases/")[1]
                });
                this.body_form.result_media_type = this.opinionCategory(
                    val.url.split(".")[val.url.split(".").length - 1]
                );
                this.$forceUpdate();
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
                };
                postData("case/getPhysicalResultTemplate", d).then(res => {
                    if (res.res_code == 1) {
                        res.data.data.forEach(item => {
                            item.question_and_answer = item.question + item.answer;
                        });
                        this.list = res.data.data;
                        this.total = res.data.count;
                        this.tableHeight =
                            this.total > this.pageSize
                                ? window.innerHeight - 200
                                : window.innerHeight - 166;
                        this.hint = `<span style="letter-spacing: 0.93px;white-space: nowrap">共<span style="color: #4098ff">${this.total}</span>/${res.data.countAll}条</span>`;
                    }
                });
            },
            getClassify() {
                this.tableHeight =
                    this.total > this.pageSize
                        ? window.innerHeight - 200
                        : window.innerHeight - 166;
                this.getCategory();
                this.getMoldTree()
            },
            getCategory(update) {
                return postData("case/getPhysicalTree").then(res => {
                    if (res.res_code == 1) {
                        this.firstList = res.data;
                        if(!update){
                            this.treeData[0].children = [];
                            res.data.forEach(item => {
                                this.treeData[0].children.push({
                                    title: item.name,
                                    expand: false,
                                    children: item.hasCatelog || item.hasItem ? [{}] : [],
                                    id: item.id,
                                    level: 1
                                });
                            });
                        }
                        // this.getList()
                    }
                });
            },
            getMoldTree() {
                postData('case/getWholePhysicalItem').then(res => {
                    if (res.res_code == 1) this.assist_tree = res.data
                })
            },
            alterInquiry() {
                this.alterModal = true;
            },
            renderContent(h, {root, node, data}) {
                return h(
                    "span",
                    {
                        style: {
                            display: "inline-block",
                            width: "100%"
                        }
                    },
                    [
                        h("span", [
                            h("Input", {
                                class: {
                                    editorInput: true,
                                    isCreate: data.is_create ? true : false
                                },
                                style: {
                                    width: "200px"
                                },
                                props: {
                                    value: data.title,
                                    placeholder: "请输入问诊类型"
                                },
                                on: {
                                    "on-blur": val => {
                                        this.modifyInput(val.target.value, data, root, node);
                                    },
                                    "on-enter": val => {
                                        this.modifyEnter(val);
                                    }
                                },
                                ref: "input_data" + data.nodeKey
                            })
                        ]),
                        h(
                            "span",
                            {
                                style: {
                                    display: "flex",
                                    float: "right",
                                    marginRight: "32px"
                                }
                            },
                            [
                                data.level != 3
                                    ? h("Button", {
                                        props: Object.assign({}, this.buttonProps, {
                                            icon: "ios-add"
                                        }),
                                        style: {
                                            marginRight: "8px"
                                        },
                                        on: {
                                            click: () => {
                                                this.append(data);
                                            }
                                        }
                                    })
                                    : null,
                                h("Button", {
                                    props: Object.assign({}, this.buttonProps, {
                                        icon: "ios-remove"
                                    }),
                                    on: {
                                        click: () => {
                                            this.remove(root, node, data);
                                        }
                                    }
                                })
                            ]
                        )
                    ]
                );
            },
            append(data) {
                if (!data.level) this.appendChildren(data);
                else postData("case/getPhysicalTree", data.level == 2 ? {category_id: parseInt(data.id)} : {parent_id: parseInt(data.id)}).then(res => {
                            if (res.res_code == 1) {
                                data.children = [];
                                res.data.forEach(item => {
                                    data.children.push({
                                        title: item.name,
                                        expand: false,
                                        children: item.hasCatelog || item.hasItem ? [{}] : [],
                                        id: item.id,
                                        level: data.level + 1
                                    });
                                });
                            }
                        }).then(() => {this.appendChildren(data);});
            },
            appendChildren(data) {
                const children = data.children || [];
                children.push({
                    title: "",
                    expand: true,
                    is_create: true,
                    level: data.level + 1
                });
                data.expand = true;
                this.$set(data, "children", children);
                setTimeout(() => {
                    this.$refs.alter_tree.scrollTop = this.$refs.alter_tree.scrollHeight;
                    document.querySelector(".isCreate").children[1].focus();
                }, 200);
            },
            remove(root, node, data) {
                this.$Modal.confirm({
                    title: "确认要删除这项类型吗",
                    content: "删除后不会对已发布的病例造成影响",
                    onOk: () => {
                        postData("case/removePhysicalCategory", {
                            id: data.id,
                            type: data.level == 3 ? "item" : "catelog"
                        }).then(res => {
                            if (res.res_code == 1) {
                                const parentKey = root.find(el => el === node).parent;
                                const parent = root.find(el => el.nodeKey === parentKey).node;
                                const index = parent.children.indexOf(data);
                                parent.children.splice(index, 1);
                            } else this.getClassify();
                        });
                    }
                });
            },
            modifyEnter(el) {
                el.path[0].blur();
            },
            modifyInput(val, data, root, node) {
                if (val && data.is_create) {
                    let parent_id;
                    root.forEach(item => {
                        if (item.nodeKey == node.parent) parent_id = item.node.id || 0;
                    });
                    let data_obj = {
                        category: val,
                        parent_id,
                        type: data.level == 3 ? "item" : "catelog"
                    };
                    postData("case/addPhysicalCategory", data_obj).then(res => {
                        if (res.res_code != 1) {
                            const parentKey = root.find(el => el === node).parent;
                            const parent = root.find(el => el.nodeKey === parentKey).node;
                            const index = parent.children.indexOf(data);
                            parent.children.splice(index, 1);
                            delete data.is_create;
                        }else {
                            this.updateList(root, node)
                            this.getCategory(1);
                        }
                    });
                } else if (val && !data.is_create) {
                    postData("case/modifyPhysicalCategory", {
                        id: data.id,
                        category: val,
                        type: data.level == 3 ? "item" : "catelog"
                    }).then(res => {
                        if (res.res_code != 1) this.getCategory();
                        else this.getCategory(1);
                    });
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
                    }
                })
            },
            onToggleExpand(val) {
                let data = {};
                val.level == 1 ? (data.parent_id = parseInt(val.id)) : (data.category_id = parseInt(val.id));
                postData("case/getPhysicalTree", data).then(res => {
                    if (res.res_code == 1) {
                        val.children = [];
                        res.data.forEach(item => {
                            val.children.push({
                                title: item.name,
                                expand: false,
                                // children: val.level < 2 ? [{}] : [],
                                children: item.hasCatelog || item.hasItem ? [{}] : [],
                                id: item.id,
                                level: val.level + 1
                            });
                        });
                    }
                    });
            },
            deleteUpload(index) {
                this.body_form.result_media_urls.splice(index, 1);
                this.$forceUpdate()
            }
        },
        mounted() {
            // this.getArgument()
            this.getClassify();
        }
    };
</script>

<style scoped lang="less">
    /deep/ .ivu-table:before {
        display: none;
    }

    /deep/ .ivu-table-wrapper {
        border: none !important;
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

    .check-inquiry {
        padding: 40px 50px;

        .check-ask {
            position: relative;
            width: 410px;
            background-color: rgb(238, 237, 246);
            color: #474c63;
            border-radius: 4px;
            padding: 8px 20px;
            .font-check;
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
            .font-check;
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

    .modal-box {
        width: 250px;
        height: 100%;
        overflow-y: auto;

        .classity-box {
            display: flex;
            height: 68px;
            align-items: center;
            justify-content: space-around;
        }

        .classity-title {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474c63;
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
        color: #474c63;
        letter-spacing: 0;
    }

    .panel-content-checked {
        background: #f0f0f7;
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
            background: #f0f0f7;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #686f92;
            text-align: center;
        }
    }

    /deep/ .editorInput {
        border: none;

        /deep/ .ivu-input {
            border: none;
        }

        /deep/ .ivu-input:focus {
            border: 1px solid #d7dde4;
        }
    }

    .model-left-title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #474c63;
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
        color: #474c63;
        letter-spacing: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .panel-content-checked {
        background: #f0f0f7;
        border-radius: 100px;
    }

    /deep/ .ivu-collapse,
    /deep/ .ivu-collapse-header,
    /deep/ .ivu-collapse-item {
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
            transform: translateY(-50%);
        }
    }

    /deep/ .item-head {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474c63;
        letter-spacing: 0;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /deep/ .ivu-collapse-content-box {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474c63;
        letter-spacing: 0;
        line-height: 34px;
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

        /deep/ textarea.ivu-input {
            height: 150px;
        }

        .modal-title {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474c63;
            margin-bottom: 10px;
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
