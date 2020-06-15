<template>
    <div style="height: 100%; overflow-y: auto">
        <div style="height: calc(100% - 50px); min-width: 1370px;">
            <div id="mountNode" class="mountNode"></div>
            <div id="mini-map" class="mini-map"></div>
            <div ref="case_menu" style="display: none;">
                <div class="case-degree" v-if="is_init">
                    <div class="case-degree-title">病例难度</div>
                    <div class="case-degree-box" v-for="(item, index) in degree_list" :key="index" @click="degreeChange(index)">
                        <div class="degree-circle" :style="{backgroundColor: item.color}">
                            <div :class="ev.item._cfg.model.degree == index + 1 ? 'degree-circle-inner-small' : 'degree-circle-inner'"></div>
                        </div>
                        <div class="case-degree-title">{{item.title}}</div>
                    </div>
                </div>
                <div ref="case_menu_item" class="case-menu">
                    <div @click="editNode" class="case-menu-item">编辑</div>
                    <div @click="addNode" :class="case_result ? 'case-menu-item-disable' : 'case-menu-item'">添加</div>
                    <div @click="mergeNode" :class="is_init || case_result ? 'case-menu-item-disable' : 'case-menu-item'">连线</div>
                    <div @click="copyNode" :class="is_init || case_result ? 'case-menu-item-disable' : 'case-menu-item'">复制</div>
                    <div @click="explainNode" :class="is_init || case_result ? 'case-menu-item-disable' : 'case-menu-item'">添加说明</div>
                    <div :class="is_init || case_result ? 'case-menu-item-disable' : 'case-menu-item'">
                        <span>标记</span>
                        <span class="case-menu-item-menu">></span>
                        <div class="case-menu-item-sign">
                            <div @click="signNode(item)" v-for="(item, index) in case_type" :key="index" class="item-sign-box" v-if="index != 5">
                                <div class="item-sign-color" :style="{backgroundColor: item.color}"></div>
                                <div class="item-sign-title">{{item.short_title}}</div>
                                <Icon v-if="ev && ev.item._cfg.model.case_type == item.color" type="md-checkmark" style="margin-left: 30px;" color="#474C63"/>
                            </div>
                        </div>
                    </div>
                    <div @click="deleteNode" :class="is_init ? 'case-menu-item-disable' : 'case-menu-item'">删除</div>
                    <div @click="addNodeResult" :class="is_init || case_result ? 'case-menu-item-disable' : 'case-menu-item'">添加病症</div>
                </div>
            </div>
            <Input ref="case_input" v-model="input_data" class="case-input" @on-blur="inputBlur" @on-change="inputChange" @on-enter="inputEnter"  @on-focus="inputChange"/>
            <div ref="case_select" class="case-select">
                <Input ref="case_select_input" v-model="select_data" :style="{width: select_width + 'px'}" class="case-select-input" @on-change="selectChange" @on-blur="selectBlur"/>
                <div v-if="select_list.length" class="case-select-box">
                    <div class="case-select-content" :style="{width: select_width + 40 + 'px'}" @click="selectClick(item)" v-for="(item, index) in select_list" :key="index">{{item.name}}</div>
                </div>
            </div>
            <div ref="case_content" class="case-content">
                <span>{{case_content}}</span>
                <div class="case-content-triangle"></div>
            </div>
            <div class="sign-box">
                <div v-for="(item, index) in case_type" :key="index" style="display: flex;align-items: center;" @click="handleCursor(item, index)">
                    <div class="sign-box-content" :style="{backgroundColor: item.color}" ></div>
                    <div style="font-size: 14px;color: #474C63;">{{item.title}}</div>
                </div>
            </div>
            <div ref="case_prompt" class="case-prompt">
                <div v-for="(item, index) in contentList" :key="index">
                    <div v-if="item.title == '注'" class="case-prompt-content">
                        <div class="case-prompt-content-box">
                            <img class="case-prompt-content-img" :src="key_explain" alt="">
                            <div class="case-prompt-content-title">要点说明</div>
                        </div>
                        <div class="case-prompt-content-message">
                            <div class="case-prompt-content-message-box webkit-box">
                                <span class="case-prompt-content-message-title">文字说明：</span><span class="case-prompt-content-message-font">{{item.explain.text}}</span>
                            </div>
                            <div class="case-prompt-content-message-box">
                                <span>图片说明：</span><span class="case-prompt-content-message-hint">{{item.explain.imgList.length}}</span><span class="case-prompt-content-message-font">张</span>
                            </div>
                            <div class="case-prompt-content-message-box">
                                <span>音频说明：</span><span class="case-prompt-content-message-hint">{{item.explain.audioList.length}}</span><span class="case-prompt-content-message-font">张</span>
                            </div>
                            <div class="case-prompt-content-message-box">
                                <span>视频说明：</span><span class="case-prompt-content-message-hint">{{item.explain.videoList.length}}</span><span class="case-prompt-content-message-font">张</span>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.title == '题'" class="case-prompt-content">
                        <div class="case-prompt-content-box">
                            <img class="case-prompt-content-img" :src="add_content" alt="">
                            <div class="case-prompt-content-title">添加内容</div>
                        </div>
                        <div class="case-prompt-content-message" v-for="(item1, index1) in item.content.content" :key="index1">{{typeName[item.content.type]}}: {{typeContent(item.content.type, item1)}}</div>
                    </div>
                </div>
                <div style="display: flex;justify-content: center; margin-bottom: 24px;">
                    <Button type="primary" @click="checkPrompt">查看详情</Button>
                </div>
            </div>
            <Modal v-model="case_modal" :footer-hide="true" :title="nodeTitle" class="case-modal" width="700" @on-cancel="explainCancel">
                <div class="case-modal-content">
                    <div class="case-modal-left">
                        <div @click="exchangeType('prompt')" class="case-modal-left-title" :style="{'background': tabsTypeColor('prompt')}">要点说明</div>
                        <div @click="exchangeType('message')" class="case-modal-left-title" :style="{'background': tabsTypeColor('message')}">添加内容</div>
                    </div>
                    <div class="case-modal-right">
                        <div v-if="tabsType == 'prompt'" style="min-height: 380px">
                            <div  v-for="(item, index) in contentList" :key="index">
                                <div v-if="item.title == '注'">
                                    <div class="explainBox">
                                        <div class="explainBox-title">文字说明：</div>
                                        <div style="position: relative">
                                            <Input :disabled="explainState != '保存'" v-model="item.explain.text" style="width: 420px;" type="textarea" :autosize="{minRows: 4, maxRows: 4}" maxlength="500" placeholder="请输入文字说明"/>
                                            <div style="position: absolute; right: 0;">{{item.explain.text.length}}/500</div>
                                        </div>
                                    </div>
                                    <div class="explainBox" v-if="item.explain.imgList.length || explainState == '保存'">
                                        <div class="explainBox-title">图片说明：</div>
                                        <div class="explain-image" >
                                            <div v-for="(item1 ,index1) in item.explain.imgList" :key="index1" class="explain-image-box">
                                                <img class="explain-image-img" :src="item1.url" alt="">
                                                <div v-if="explainState == '保存'" class="explain-image-icon" @click="deleteList(item.explain.imgList, index1)"><Icon type="md-close" color="#fff" size="12"/></div>
                                            </div>
                                            <uploadAdd v-if="explainState == '保存'" :upload-config="uploadConfig" :panelOptions="panelOptions" @uploadcomplete="uploadcompletePhoto" types="image/*"/>
                                        </div>
                                    </div>
                                    <div class="explainBox" v-if="item.explain.audioList.length || explainState == '保存'">
                                        <div class="explainBox-title">音频说明：</div>
                                        <div class="explain-image">
                                            <audio ref="audio" :src="audioUrl"></audio>
                                            <div v-for="(item1 ,index1) in item.explain.audioList" :key="index1" class="explain-image-box">
                                                <img style="height: 36px;margin-right: 10px;" :src="audioIsPlay == index1 ? audioPause : audioPlay" alt="" @click="handleAudioPlay(item1, index1)">
                                                <div v-if="explainState == '保存'" class="explain-image-icon" @click="deleteList(item.explain.audioList, index1)"><Icon type="md-close" color="#fff" size="12"/></div>
                                            </div>
                                            <uploadAdd v-if="explainState == '保存'" :upload-config="uploadConfig" :panelOptions="panelOptions2" @uploadcomplete="uploadcompleteAudio" types="audio/*"/>
                                        </div>
                                    </div>
                                    <div class="explainBox" v-if="item.explain.videoList.length || explainState == '保存'">
                                        <div class="explainBox-title">视频说明：</div>
                                        <div class="explain-image">
                                            <div v-for="(item1 ,index1) in item.explain.videoList" :key="index1" class="explain-image-box">
                                                <video ref="video" :src="item1.url" style="height: 100px; margin-right: 10px;" controls></video>
                                                <div v-if="explainState == '保存'" class="explain-image-icon" @click="deleteList(item.explain.videoList, index1)"><Icon type="md-close" color="#fff" size="12"/></div>
                                            </div>
                                            <uploadAdd v-if="explainState == '保存'" :upload-config="uploadConfig" :panelOptions="panelOptions" @uploadcomplete="uploadcompleteVideo" types="video/*"/>
                                        </div>
                                    </div>
                                    <div style="display: flex;justify-content: center">
<!--                                        <Button type="primary" style="width: 120px;margin: 20px 0;" @click="explainBtn">确定</Button>-->
                                    </div>
                                </div>
                                <div v-else-if="item.title == '题' && contentList.length == 1">
                                    <div>暂无内容</div>
                                    <div style="display: flex;justify-content: center">
<!--                                        <Button type="primary" style="width: 120px;margin: 20px 0;" @click="explainBtn">确定</Button>-->
                                    </div>
                                </div>
                            </div>
                            <div v-if="!contentList.length">
                                <div>暂无内容</div>
                                <div style="display: flex;justify-content: center">
<!--                                    <Button type="primary" style="width: 120px;margin: 20px 0;" @click="explainBtn">确定</Button>-->
                                </div>
                            </div>
                        </div>
                        <div v-else style="min-height: 380px">
                            <div v-for="(item, index) in contentList" :key="index">
                                <div v-if="item.title == '题'" class="case-modal-right-box">
                                    <div class="case-modal-right-model"  v-for="(item1, index1) in item.content.content" :key="index1">
                                        <span  class="support-title">{{typeName[item.content.type]}}:</span>
                                        <span v-if="item.content.type == 'talk'">{{item1.question + item1.answer}}</span>
                                        <span v-if="item.content.type == 'physical'">
                                            <span>{{item1.first_name + (item1.second_id ? ('>' + item1.second_name) : null) + '>' + item1.third_name}}</span>
                                            <div v-for="(item2, index2) in item1.medias" :key="index2" style="display: flex">
                                                <img style="width: 100px;" v-if="item1.result_media_type == 'Picture'" :src="item2.result_media_url" alt="">
                                                <video style="width: 100px;" v-if="item1.result_media_type == 'Video'" :src="item2.result_media_url"></video>
                                                <audio style="width: 100px;" v-if="item1.result_media_type == 'Audio'" :src="item2.result_media_url"></audio>
                                            </div>
                                        </span>
                                        <span v-if="item.content.type == 'assist'">
                                            <span>{{item1.first_name + (item1.second_id ? ('>' + item1.second_name) : '') + '>' + item1.third_name}}</span>
                                            <div v-if="item1.type == 'ExaminationReport'">
                                                <tables :column="columns2" :table-data="item1.content"/>
                                            </div>
                                            <div v-else-if="item1.type == 'ImageData'" style="height: 580px;overflow: hidden">
                                                <iframe :frameborder="0" class="case-ifram" v-if="data_type == 'ImageData'"
                                                        :src="officeappsUrl + item1.content[0].report"></iframe>
                                            </div>
                                        </span>
                                        <Button type="primary" :class="'case-btn' + item1.item_type" @click="unfoldContent(item1)">{{contentName[item1.item_type]}}</Button>
                                        <div v-if="item1.unfold">
                                            <div v-if="item1.support_diagnose" style="margin-bottom: 10px;">
                                                <span class="support-title">支持诊断：</span>
                                                <span class="support-content">{{item1.support_diagnose}}</span>
                                            </div>
                                            <div v-if="item1.no_support_diagnose">
                                                <span class="support-title">排除诊断</span>
                                                <span class="support-content">{{item1.no_support_diagnose}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="(contentList.length == 1 && contentList[0].title == '注') || contentList.length == 0">暂无内容</div>
<!--                            <div style="display: flex;justify-content: center;margin: 30px 0;">-->
<!--                                <Button type="primary" style="width: 100px;">确认</Button>-->
<!--                            </div>-->
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import G6 from '@antv/g6'
    import postData from '../../../../../api/postData'
    import mouse_img1 from '../../../../../assets/img/case/1.png'
    import mouse_img2 from '../../../../../assets/img/case/2.png'
    import mouse_img3 from '../../../../../assets/img/case/3.png'
    import mouse_img4 from '../../../../../assets/img/case/4.png'
    import mouse_img5 from '../../../../../assets/img/case/5.png'
    import mouse_img6 from '../../../../../assets/img/case/6.png'
    import add_content from '../../../../../assets/img/case/addContent.png'
    import key_explain from '../../../../../assets/img/case/keyExplain.png'
    import uploadAdd from '../../../../../components/UploadAdd'
    import audioPlay from '../../../../../assets/img/case/audioPlay.png'
    import audioPause from '../../../../../assets/img/case/audioPause.png'
    import tables from '../../../../../components/tables'
    import officeappsUrl from '../../../../../../config/officeapps'

    export default {
        components: {uploadAdd, tables},
        data() {
            return {
                mouse_img1, mouse_img2, mouse_img3, mouse_img4, mouse_img5, mouse_img6, add_content, key_explain, audioPlay, audioPause, officeappsUrl,
                case_type: [
                    {color: '#A1CDFF', fill_color: '#ECF5FF', title: '问诊', short_title: '问诊'},
                    {color: '#60CFD7', fill_color: '#DFF5F7', title: '体格检查', short_title: '体检'},
                    {color: '#9BDD4A', fill_color: '#EBF8DB', title: '治疗', short_title: '治疗'},
                    {color: '#FFC058', fill_color: '#FFF2DE', title: '辅助检查', short_title: '辅检'},
                    // {color: '#E08049', fill_color: '#F9E6DB', title: '病种', short_title: '病种'},
                    {color: '#BB91FE', fill_color: '#F1E9FF', title: '鉴别要素', short_title: '鉴别要素'},
                ],
                img_opacity: '0.3',
                graph: null,
                ev: null,
                edge: null,
                data: {
                    nodes: [{
                        id: '1', label: '新建病症', all_label: '新建病症', groupId: 'none', x: 0, y: 0,
                        anchorPoints: [[0.5, 0], [0.5, 1]], init: true, degree: 2, size: [120, 40]
                    }],
                    groups: []
                },
                input_data: '',
                select_data: '',
                select_list: [],
                options1: [],
                loading_select: false,
                is_init: false,
                case_result: false,
                degree_list: [
                    {color: '#7ED321', title: '简单'},
                    {color: '#4098ff', title: '中等'},
                    {color: '#FD6C1E', title: '困难'},
                ],
                symptom: '新建病症',
                degree: 2,
                icd10_ids: [],
                icd10_names: '',
                input_data_omit: '',
                select_width: 100,
                is_main_result: false,
                merge_node: null,
                caseTypeName: '',
                cursorUrl: '',
                signColor: '',
                graphType: 'automate',
                case_content: '',
                outline: {},
                case_modal: false,
                tabsType: 'prompt',
                explain: {
                    text: '',
                    imgList: [],
                    audioList: [],
                    videoList: [],
                },
                nodeTitle: '',
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'user_task',
                    type: 1
                },
                panelOptions: {
                    panelWidth: 100,
                    panelHeight: 100,
                    panelSize: 100
                },
                panelOptions2: {
                    panelWidth: 36,
                    panelHeight: 36,
                    panelSize: 36
                },
                contentList: [],
                explainEv: {},
                explainState: '保存',
                audioUrl: '',
                dataList: [],
                typeName: {
                    talk: '问诊',
                    physical: '体格检查',
                    assist: '辅助检查',
                },
                columns2: [
                    {title: '项目', key: 'name', minWidth: 80},
                    {title: '缩写', key: 'abbreviation', minWidth: 50},
                    {title: '检查结果', key: 'value', minWidth: 80},
                    {title: '参考值', key: 'refvalue', minWidth: 60},
                    {title: '单位', key: 'units', minWidth: 50},
                ],
                check_list: [],
                contentName: {
                    1: '诊断依据',
                    2: '干扰项',
                    3: '减分项'
                }
            }
        },
        computed: {
            canvas_width() {
                return document.querySelector('#mountNode').offsetWidth
            },
            canvas_height() {
                return document.querySelector('#mountNode').offsetHeight
            },
        },
        methods: {
            unfoldContent(item) {
                console.log(item, '123');
                item.unfold = !item.unfold
                this.$forceUpdate()
            },
            typeContent(type, item) {
                switch (type) {
                    case 'talk':
                        return item.question
                        break
                    case 'physical':
                        return item.third_name
                        break
                    case 'assist':
                        return item.third_name
                        break
                }
            },
            uploadcompletePhoto(val) {
                this.contentList.forEach((item) => {
                    if(item.title == '注') {
                        item.explain.imgList.push({url: val})
                    }
                })
            },
            uploadcompleteAudio(val) {
                this.contentList.forEach((item) => {
                    if(item.title == '注') {
                        item.explain.audioList.push({url: val})
                    }
                })
            },
            uploadcompleteVideo(val) {
                this.contentList.forEach((item) => {
                    if(item.title == '注') {
                        item.explain.videoList.push({url: val})
                    }
                })
            },
            handleAudioPlay(item, index) {
                this.audioUrl = item.url
                if(this.audioIsPlay == index) {
                    this.audioIsPlay = null
                    if(this.$refs.audio) this.$refs.audio.pause()
                }else {
                    this.audioIsPlay = index
                    setTimeout(() => {if(this.$refs.audio) this.$refs.audio.play()},100)
                }
            },
            deleteList(list, index) {
                list.splice(index, 1)
            },
            explainCancel() {
                if(this.$refs.audio && this.$refs.audio.pause) this.$refs.audio.pause()
                if(this.$refs.video) this.$refs.video.forEach((item) => {
                    item.pause()
                })
                this.contentList.forEach((item, index) => {
                    if(item.title == '注' && !item.explain.text && !item.explain.imgList && !item.explain.audioList && !item.explain.videoList) {
                        this.contentList.splice(index, 1)
                    }
                })
                this.contentList = []
            },
            explainNode() {
                this.explainState = '保存'
                this.nodeTitle = this.ev.item._cfg.model.all_label || this.ev.item._cfg.model.label
                this.case_modal = true
                this.$refs.case_menu.style.display = 'none'
            },
            explainBtn() {
                this.case_modal = false
                // if(this.explainState == '保存') {
                //     this.explainState = '编辑'
                //     if(this.ev.item._cfg.model.list && this.ev.item._cfg.model.list.length) {
                //         let isExplain = false
                //         this.ev.item._cfg.model.list.forEach((it, index) => {
                //             if(it.title == '注') {
                //                 isExplain = true
                //                 if(!it.explain.text && !it.explain.imgList.length && !it.explain.audioList.length && !it.explain.videoList.length) this.ev.item._cfg.model.list.splice(index, 1)
                //             }
                //         })
                //         if(!isExplain) this.ev.item._cfg.model.list.push([{color: '#D45912', title: '注', explain: this.explain}])
                //     }else this.ev.item._cfg.model.list = [{color: '#D45912', title: '注', explain: this.explain}]
                // }else{
                //     this.explainState = '保存'
                // }
            },
            addExplainBtn() {
                if(this.contentList) {
                    let is_explain = false
                    this.contentList.forEach(item => {
                        if(item.title == '注') is_explain = true
                    })
                    if(!is_explain) this.contentList.push({color: '#D45912', title: '注', explain: this.explain})
                }else this.contentList = [{color: '#D45912', title: '注', explain: this.explain}]
                this.explainState = '保存'
            },
            checkPrompt() {
                this.case_modal = true
                this.explainState = '编辑'
                this.ev = this.explainEv
                this.$refs.case_prompt.style.display = 'none'
            },
            exchangeType(type) {
                this.tabsType = type
            },
            tabsTypeColor(type) {
                return type == this.tabsType ? '#4098ff' : '#969EC5'
            },
            handleBack() {
                this.$router.go(-1)
            },
            handleSubmit() {
                this.graph.save().nodes.forEach(item => {
                    if(item.case_result) {
                        this.icd10_ids.push(item.case_id)
                        this.icd10_names += this.icd10_names ? ',' + item.case_name : item.case_name
                    }
                })
                let data = {
                    outline: JSON.stringify(this.graph.save()),
                    symptom: this.symptom,
                    degree: this.degree,
                    icd10_ids: JSON.stringify(this.icd10_ids),
                    icd10_names: this.icd10_names
                }
                if(this.caseTypeName == 'check') {
                    postData('case/addOutline', data).then(res => {
                        this.$Message.success('复制成功')
                        if(res.res_code == 1) this.$router.go(-1)
                    })
                    return
                }
                if(this.$route.query.id) {
                    data.id = parseInt(this.$route.query.id)
                    postData('case/modifyOutline', data).then(res => {
                        this.$Message.success(res.msg)
                        if(res.res_code == 1) this.$router.go(-1)
                    })
                }else{
                    postData('case/addOutline', data).then(res => {
                        this.$Message.success(res.msg)
                        if(res.res_code == 1) this.$router.go(-1)
                    })
                }
            },
            handleCommit() {
                this.graph.save().nodes.forEach(item => {
                    if(item.case_result) {
                        this.icd10_ids.push(item.case_id)
                        this.icd10_names += this.icd10_names ? ',' + item.case_name : item.case_name
                    }
                })
                let data = {
                    outline: JSON.stringify(this.graph.save()),
                    symptom: this.symptom,
                    degree: this.degree,
                    icd10_ids: JSON.stringify(this.icd10_ids),
                    icd10_names: this.icd10_names,
                    isAudit: 1
                }
                if(this.caseTypeName == 'check') {
                    // window.open(`/dashboard/outline-content?caseId=${this.$route.query.id}`)
                    window.open(`/dashboard/outline-content`)
                    return
                }
                if(this.$route.query.id) {
                    data.id = parseInt(this.$route.query.id)
                    postData('case/modifyOutline', data).then(res => {
                        this.$Message.success(res.msg)
                        if(res.res_code == 1) this.$router.go(-1)
                    })
                }else{
                    if(data.icd10_names) {
                        postData('case/addOutline', data).then(res => {
                            this.$Message.success(res.msg)
                            if(res.res_code == 1) this.$router.go(-1)
                        })
                    }else this.$Message.info('请至少添加一个诊断')
                }
            },
            handleCursor(item, index) {
                // let imgList = {
                //     0: this.mouse_img1,
                //     1: this.mouse_img2,
                //     2: this.mouse_img4,
                //     3: this.mouse_img3,
                //     4: this.mouse_img5,
                //     5: this.mouse_img6,
                // }
                // let img = imgList[index]
                // document.querySelector('#mountNode').children[0].style.cursor = `url(${img}), progress`
                // this.signColor = {...item, ...{cursor:  `url(${img}), progress`}}
            },
            hugeZoom() {
                this.graph.zoom(1.2)
            },
            littleZoom() {
                this.graph.zoom(0.8)
            },
            selectChange(val) {
                if(this.select_data) {
                    postData('common/getIcd10', {keyword: this.select_data}).then(res => {
                        this.select_list = res.data
                    })
                }else{
                    this.select_list = []
                }
            },
            selectClick(val) {
                let div = this.createDiv()
                div.innerText = val.name
                document.body.append(div)
                let set_width = div.offsetWidth
                if(set_width > 120 && set_width < 190) {
                    this.ev.item._cfg.model.size[0] = set_width + 40
                    this.ev.item._cfg.model.case_name = val.name
                    this.select_width = set_width
                }else if(set_width > 190) {
                    let new_div = this.createDiv()
                    document.body.append(new_div)
                    for(let i in val.name) {
                        let set_width = new_div.offsetWidth
                        if(set_width < 190){
                            new_div.innerText = new_div.innerText + val.name[i]
                        } else {
                            this.ev.item._cfg.model.case_name = new_div.innerText + '...'
                        }
                    }
                    this.ev.item._cfg.model.size[0] = 230
                    this.select_width = 220
                    document.body.removeChild(new_div)
                }else{
                    this.ev.item._cfg.model.size[0] = 120
                    this.select_width = 100
                    this.ev.item._cfg.model.case_name = val.name

                }
                this.ev.item._cfg.model.case_id = val.id
                this.ev.item._cfg.model.all_label = val.name
                this.graph.refresh()
                this.$refs.case_select.style.display = 'none'
                this.select_data = ''
                this.select_list = []
            },
            degreeChange(index) {
                this.ev.item._cfg.model.degree = index + 1
                this.degree = index + 1
                this.graph.refresh()
                this.$refs.case_menu.style.display = 'none'
            },
            editNode() {
                if(this.ev.item._cfg.model.case_result) {
                    this.select_data = this.ev.item._cfg.model.all_label
                    this.ev.item._cfg.model.label = ''
                    this.graph.refresh()
                    this.$refs.case_menu.style.display = 'none'
                    const point = this.graph.getClientByPoint(this.ev.item._cfg.model.x - this.ev.item._cfg.model.size[0] / 2 , this.ev.item._cfg.model.y - this.ev.item._cfg.model.size[1] / 2 );
                    this.$refs.case_select.style.display = 'flex'
                    this.$refs.case_select.style.top = point.y + 2 + 'px'
                    this.$refs.case_select.style.left = point.x - 4 + 'px'
                    this.$refs.case_select_input.focus()
                }else{
                    this.input_data = this.ev.item._cfg.model.all_label
                    this.ev.item._cfg.model.label = ''
                    this.graph.refresh()
                    this.$refs.case_menu.style.display = 'none'
                    const point = this.graph.getClientByPoint(this.ev.item._cfg.model.x - this.ev.item._cfg.model.size[0] / 2 + 10, this.ev.item._cfg.model.y - this.ev.item._cfg.model.size[1] / 2 + 1);
                    this.$refs.case_input.$el.style.display = 'inline-block'
                    this.$refs.case_input.$el.style.top = point.y + 'px'
                    this.$refs.case_input.$el.style.left = point.x + 'px'
                    this.$refs.case_input.focus()
                }
            },
            inputChange() {
                let div = this.createDiv()
                div.innerText = this.input_data
                document.body.append(div)
                let set_width = div.offsetWidth
                if(set_width > 40 && set_width < 150) {
                    this.ev.item._cfg.model.size[0] = set_width + 40
                    this.graph.refresh()
                    this.setCaseInput()
                    this.input_data_omit = this.input_data
                }else if(set_width > 150) {
                    let new_div = this.createDiv()
                    document.body.append(new_div)
                    this.inputCount(new_div)
                    this.ev.item._cfg.model.size[0] = 190
                    this.graph.refresh()
                    this.setCaseInput()
                    document.body.removeChild(new_div)
                }else {
                    this.ev.item._cfg.model.size[0] = 80
                    this.input_data_omit = this.input_data
                    this.graph.refresh()
                    this.setCaseInput()
                }
                document.body.removeChild(div)
            },
            setCaseInput() {
                const point = this.graph.getClientByPoint(this.ev.item._cfg.model.x - this.ev.item._cfg.model.size[0] / 2 + 10, this.ev.item._cfg.model.y - this.ev.item._cfg.model.size[1] / 2 + 1);
                this.$refs.case_input.$el.style.top = point.y + 'px'
                this.$refs.case_input.$el.style.left = point.x + 'px'
            },
            createDiv() {
                let div = document.createElement('div')
                div.style.display = 'inline-block'
                div.style.fontSize = '16px'
                div.style.opacity = 0
                div.style.position = 'absolute'
                return div
            },
            inputCount(new_div) {
                for(let i in this.input_data) {
                    let set_width = new_div.offsetWidth
                    if(set_width < 150){
                        new_div.innerText = new_div.innerText + this.input_data[i]
                    } else {
                        this.input_data_omit = new_div.innerText
                    }
                }
            },
            inputBlur() {
                if(this.ev.item._cfg.model.init) this.symptom = this.input_data
                this.ev.item._cfg.model.label = this.input_data_omit && (this.input_data_omit != this.input_data) ? this.input_data_omit + '...' : this.input_data
                this.ev.item._cfg.model.all_label = this.input_data
                this.$refs.case_input.$el.style.display = 'none'
                this.graph.refresh()
                setTimeout(() => {
                    this.input_data = ''
                    this.input_data_omit = ''
                    this.updateGraph()
                }, 100)
            },
            inputEnter() {
                this.inputBlur()
            },
            selectBlur() {
                let ev = this.ev
                setTimeout(() => {
                    ev.item._cfg.model.label = ev.item._cfg.model.case_name
                    this.graph.refresh()
                    this.$refs.case_select.style.display = 'none'
                    this.select_data = ''
                    this.select_list = []
                    this.updateGraph()
                },200)
            },
            addNode(e) {
                if(!this.case_result) {
                    const point = this.graph.getPointByClient(e.clientX, e.clientY);
                    this.node = this.graph.addItem('node', {
                        id: G6.Util.uniqueId() + new Date().getTime(),
                        anchorPoints: [
                            [0.5, 0], [0.5, 1]
                        ],
                        label: '添加内容',
                        x: this.graphType == 'automate' ? null : this.ev.item._cfg.model.x,
                        y: this.graphType == 'automate' ? null : this.ev.item._cfg.model.y + 108,
                        newNode: true,
                        // all_label: '添加内容',
                    });
                    this.graph.addItem('edge', {
                        source: this.ev.item._cfg.id,
                        target: this.node._cfg.id,
                        shape: 'cubic',
                        style: {
                            stroke: '#ABB7C5',
                            endArrow: 'custom-arrow',
                            controlPoints: [0.1, 0.9]
                        },
                    })
                    this.updateGraph()
                    this.$refs.case_menu.style.display = 'none'
                }
            },
            addNodeSymbol(ev) {
                this.node = this.graph.addItem('node', {
                    id: G6.Util.uniqueId() + new Date().getTime(),
                    anchorPoints: [
                        [0.5, 0], [0.5, 1]
                    ],
                    label: '添加内容',
                    x: this.graphType == 'automate' ? null : ev.item._cfg.model.x,
                    y: this.graphType == 'automate' ? null : ev.item._cfg.model.y + 108,
                    newNode: true,
                    list:[]
                    // all_label: '添加内容',
                });
                this.graph.addItem('edge', {
                    source: ev.item._cfg.id,
                    target: this.node._cfg.id,
                    shape: 'cubic',
                    style: {
                        stroke: '#ABB7C5',
                        endArrow: 'custom-arrow',
                        controlPoints: [0.1, 0.9]
                    }
                })
                this.updateGraph()
            },
            addNodeResult(e) {
                if(!this.is_init && !this.case_result) {
                    const point = this.graph.getPointByClient(e.clientX, e.clientY);
                    this.node = this.graph.addItem('node', {
                        x: point.x,
                        y: point.y,
                        id: G6.Util.uniqueId() + new Date().getTime(),
                        anchorPoints: [
                            [0.5, 0], [0.5, 1]
                        ],
                        // case_type: '#bb91fe',
                        fill: '#F9E6DB',
                        stroke: '#E08049',
                        case_result: true,
                        case_id: '',
                        case_name: '',
                    });
                    this.graph.addItem('edge', {
                        source: this.ev.item._cfg.id,
                        target: this.node._cfg.id,
                        shape: 'cubic',
                        style: {
                            stroke: '#ABB7C5',
                            endArrow: 'custom-arrow',
                            controlPoints: [0.1, 0.9]
                        }
                    })
                    // this.graph.setMode('addNode');
                    this.$refs.case_menu.style.display = 'none'
                    // this.graph.changeData(this.graph.save())
                    // this.graph.refresh()
                    this.updateGraph()

                }
            },
            deleteNode() {
                if(!this.is_init) {
                    this.graph.remove(this.ev.item)
                    this.ev = null
                    this.graph.refresh()
                    this.$refs.case_menu.style.display = 'none'
                    // this.graph.changeData(this.graph.save())
                    // this.graph.refresh()
                    this.updateGraph()
                }
            },
            copyNode(e) {
                if(!this.is_init && !this.case_result) {
                    const point = this.graph.getPointByClient(e.clientX, e.clientY);
                    this.node = this.graph.addItem('node', {
                        ...this.ev.item._cfg.model,
                        x: point.x,
                        y: point.y,
                        id: G6.Util.uniqueId() + new Date().getTime(),
                        anchorPoints: [
                            [0.5, 0], [0.5, 1]
                        ]
                    });
                    this.graph.addItem('edge', {
                        source: this.ev.item.getInEdges()[0]._cfg.source,
                        target: this.node._cfg.id,
                        shape: 'cubic',
                        style: {
                            stroke: '#ABB7C5',
                            endArrow: 'custom-arrow',
                            controlPoints: [0.1, 0.9]
                        }
                    })
                    // this.graph.setMode('addNode');
                    this.$refs.case_menu.style.display = 'none'
                    this.updateGraph()
                }
            },
            signNode(val) {
                // if (this.ev.item._cfg.model.case_type == val.color) this.ev.item._cfg.model.case_type = ''
                // else this.ev.item._cfg.model.case_type = val.color
                if (this.ev.item._cfg.model.fill == val.fill_color) {
                    this.ev.item._cfg.model.fill = '#fff'
                    this.ev.item._cfg.model.stroke = ''
                }
                else {
                    this.ev.item._cfg.model.fill = val.fill_color
                    this.ev.item._cfg.model.stroke = val.color
                }
                this.graph.refresh()
                this.$refs.case_menu.style.display = 'none'
            },
            mergeNode(e) {
                if(!this.is_init && !this.case_result){
                    const point = this.graph.getPointByClient(e.clientX, e.clientY);
                    this.edge = this.graph.addItem('edge', {
                        source: this.ev.item._cfg.id,
                        target: point,
                        shape: 'cubic',
                        style: {
                            stroke: '#ABB7C5',
                            endArrow: 'custom-arrow',
                            controlPoints: [0.1, 0.9]
                        },
                        merge_line: true
                    });
                    this.$refs.case_menu.style.display = 'none'
                }
            },
            initDataList() {
                postData('common/getIcd10').then(res => {
                    this.select_list = res.data
                })
            },
            checkNodeColor(val, config) {
                val.getInEdges().forEach(item => {
                    item._cfg.model.style.stroke = config.color
                    item._cfg.model.style.lineWidth = config.lineWidth
                    let node = item.getSource()
                    if (node.getInEdges().length) this.checkNodeColor(node, config)
                })
                this.graph.refresh()
            },
            initGraph() {
                //注册边
                G6.registerEdge('cubic', {
                    draw(cfg, group) {
                        const startPoint = cfg.startPoint;
                        const endPoint = cfg.endPoint;
                        const distance = {
                            x: startPoint.x == endPoint.x ? 0 : Math.abs(endPoint.x - startPoint.x) > 20 ? startPoint.x > endPoint.x ? -10 : 10 :  0.5 * (endPoint.x - startPoint.x),
                            y: startPoint.y == endPoint.y ? 0 : startPoint.y > endPoint.y ? -10 : 10,
                        }
                        const shape = group.addShape('path', {
                            attrs: {
                                // stroke: '#ABB7C5',
                                stroke: cfg.style.stroke,
                                color: '#722ed1',
                                source: startPoint,
                                target: endPoint,
                                endArrow: {
                                    path: 'M 4,0 L -4,-4 L -4,4 Z',
                                    d: 4
                                },
                                path: [
                                    ['M', startPoint.x, startPoint.y],
                                    // ['C', 0 * (endPoint.x - startPoint.x) + startPoint.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y, 1 * (endPoint.x - startPoint.x) + startPoint.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y, endPoint.x, endPoint.y],
                                    // ['S', 0.7 * (endPoint.x - startPoint.x) + startPoint.x, 0.7 * (endPoint.y - startPoint.y) + startPoint.y, endPoint.x, endPoint.y],
                                    ['L', startPoint.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y - (endPoint.y > startPoint.y ? 10 : -10)],
                                    ['Q', startPoint.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y , startPoint.x + distance.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y],
                                    ['L', endPoint.x - distance.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y],
                                    ['Q', endPoint.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y , endPoint.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y + (endPoint.y > startPoint.y ? 10 : -10)],
                                    ['L', endPoint.x, endPoint.y]
                                ],
                                lineWidth: cfg.style.lineWidth
                            }
                        });
                        return shape;
                    }
                })
                //注册节点
                G6.registerNode('rect', {
                    draw(cfg, group) {
                        const size = cfg.size || [40, 40];
                        const width = size[0];
                        const height = size[1];
                        const rect = group.addShape('rect', {
                            attrs: {
                                x: -width / 2,
                                y: -height / 2,
                                stroke: cfg.stroke || '#ABB7C5',
                                width: width,
                                height: height,
                                fill: cfg.fill,
                                radius: 5,
                                lineWidth: 0.7,
                                // size: [100, 50],
                                // fill: '#f00'
                            }
                        })
                        group.addShape('text', {
                            attrs: {
                                x: 0, // 居中
                                y: 0,
                                textAlign: 'center',
                                textBaseline: 'middle',
                                text: cfg.label,
                                fill: cfg.label == '添加内容' ? '#ABB7C5' : '#000',
                                fontSize: 16
                            }
                        })
                        if (cfg.init) {
                            group.addShape('rect', {
                                attrs: {
                                    x: -width / 2 + 1,
                                    y: -height / 2,
                                    width: 5,
                                    height: height,
                                    fill: cfg.degree == 1 ? '#7ED321' : cfg.degree == 2 ? '#4098ff' : '#FD6C1E',
                                    stroke: cfg.degree == 1 ? '#7ED321' : cfg.degree == 2 ? '#4098ff' : '#FD6C1E',
                                    radius: [5, 0, 0, 5],
                                }
                            })
                        }
                        if (cfg.case_type) {
                            group.addShape('rect', {
                                attrs: {
                                    x: -width / 2 + 1,
                                    y: -height / 2,
                                    width: 5,
                                    height: height,
                                    fill: cfg.case_type,
                                    stroke: cfg.case_type,
                                    radius: [5, 0, 0, 5],
                                }
                            })
                        }
                        if (cfg.list) {
                            if (cfg.list) {
                                cfg.list.forEach((item, index) => {
                                    let color = item.name == 'inquiry' ? '#80B2EC' : item.name == 'physical' ? '#52C9D1' : '#F6B242'
                                    const circle1 = group.addShape('circle', {
                                        attrs: {
                                            x: cfg.list.length == 1 ? 0 : -16 + index * 32,
                                            y: -24,
                                            r: 10,
                                            stroke: item.color,
                                            fill: item.color,
                                        }
                                    });
                                    const text = group.addShape('text', {
                                        attrs: {
                                            x: cfg.list.length == 1 ? 0 : -16 + index * 32,
                                            y: -18,
                                            textAlign: 'center',
                                            text: item.title,
                                            fill: '#fff',
                                            labelCfg: {
                                                position: "left: 100",
                                                style: {color: '#f00'}
                                            }
                                        },
                                    });
                                })
                            }
                        }
                        if(!cfg.case_result &&  cfg.may_open) {
                            const circle1 = group.addShape('circle', {
                                attrs: {
                                    x: 0,
                                    y: 20,
                                    r: 7.5,
                                    stroke: '#4098ff',
                                    fill: '#4098ff',
                                    stateStyles: {
                                        hover: {
                                            stroke: '#f00',
                                            fill: '#f00'
                                        },
                                    }
                                }
                            });
                            const text = group.addShape('text', {
                                attrs: {
                                    x: 0,
                                    y: 18,
                                    textAlign: 'center',
                                    text: '+',
                                    fill: '#fff',
                                    fontSize: 18,
                                    textBaseline: 'middle',
                                },
                            });
                        }
                        return rect;
                    },
                });

                //添加节点
                G6.registerBehavior('click-add-node', {
                    getEvents() {
                        return {
                            'node:click': 'onClick',
                            mousemove: 'onMousemove',
                        };
                    },
                    onClick(ev) {
                        this.graph.update(this.node, {
                            x: this.ev ? this.ev.x : ev.x,
                            y: this.ev ? this.ev.y : ev.y
                        })
                        this.addNode = true
                    },
                    onMousemove(ev) {
                        if (!this.addNode && !this.ev) {
                            this.ev = ev
                            this.graph.update(ev.item, {
                                x: ev.x,
                                y: ev.y
                            })
                        } else if (!this.addNode && this.ev) {
                            this.graph.update(this.ev.item, {
                                x: ev.x,
                                y: ev.y
                            })
                        }
                    }
                });

                //添加边
                G6.registerBehavior('click-add-edge', {
                    getEvents() {
                        return {
                            'node:click': 'onClick',
                            mousemove: 'onMousemove',
                            'edge:click': 'onEdgeClick' // 点击空白处，取消边
                        };
                    },
                    onClick(ev) {
                        const node = ev.item;
                        const graph = this.graph;
                        const point = {x: ev.x, y: ev.y};
                        const model = node.getModel();
                        if (this.addingEdge && this.edge) {
                            graph.updateItem(this.edge, {
                                target: model.id
                            });
                            this.edge = null;
                            this.addingEdge = false;
                        } else {
                            this.edge = graph.addItem('edge', {
                                source: model.id,
                                target: point,
                                lineWidth: 10,
                                // shape: 'cubic',
                            });
                            this.addingEdge = true;
                        }
                    },
                    onMousemove(ev) {
                        const point = {x: ev.x, y: ev.y};
                        if (this.edge) {
                            this.graph.updateItem(this.edge, {
                                target: point
                            });
                        }
                    },
                    onEdgeClick(ev) {
                        const currentEdge = ev.item;
                        // 拖拽过程中，点击会点击到新增的边上
                        if (this.addingEdge && this.edge == currentEdge) {
                            this.graph.removeItem(this.edge);
                            this.edge = null;
                            this.addingEdge = false;
                        }
                    }
                });

                //区域选择
                G6.registerBehavior('select-region', {
                    getDefaultCfg() {
                        return {
                            multiple: false
                        };
                    },
                    getEvents() {
                        return {
                            'mousedown': 'regionMousedown',
                            'mouseup': 'regionMouseup',
                            'mousemove': 'regionMousemove',
                            'keydown': 'regionKeydown',
                            'keyup': 'regionKeyup',
                            'node:dragend': 'onDragEnd',
                        }
                    },
                    regionMousedown(ev) {
                        this.regionMove = true
                        ev.defaultPrevented = true
                    },
                    regionMouseup(ev) {
                        this.regionMove = false
                    },
                    regionMousemove(ev) {
                        // if(this.regionMove && this.regionKey) console.log(ev, 'move');

                    },
                    regionKeydown(ev) {
                        if(ev.keyCode == 17) this.regionKey = true
                    },
                    regionKeyup(ev) {
                        this.regionKey = false
                        // this.graph.read(this.graph.save())
                    },
                    onDragEnd(e) {
                        console.log(e, 'pppp');
                    }
                })

                if(this.graphType == 'automate') {
                    this.graph =  new G6.Graph({
                        container: 'mountNode',
                        width: this.canvas_width,
                        height: this.canvas_height,
                        // plugins: [ minimap ],
                        defaultNode: {
                            shape: 'rect',
                            size: [120, 40],
                            fill: '#fff'
                        },
                        defaultEdge: {
                            shape: 'cubic',
                            style: {
                                stroke: '#ABB7C5',
                            },
                            // controlPoints: [0.1, 0.9]
                        },
                        modes: {
                            default: ['click-select',  'drag-canvas', 'activate-relations',
                                // 'select-region',
                                {
                                    type: 'brush-select',
                                    trigger: 'ctrl',
                                    // includeEdges: false,
                                    onSelect(nodes, edge, evt) {
                                        const id = G6.Util.uniqueId() + new Date().getTime()
                                        this.graph.addItem('group', {
                                            groupId: id,
                                            nodes: [],
                                            title: ''
                                        })
                                        nodes.forEach(item => {
                                            item._cfg.model.groupId = id
                                        })
                                        this.graph.get('updateGraphContent')()
                                    }
                                }
                            ],
                            addNode: ['click-add-node', 'click-select', 'drag-canvas', 'activate-relations'],
                            addEdge: ['click-add-edge', 'click-select', 'drag-canvas', 'activate-relations'],
                        },
                        layout: {
                            type: 'dagre',
                            rankdir: 'TB',           // 可选，默认为图的中心
                            align: 'DL',             // 可选
                            nodesep:34,             // 可选
                            ranksep: 36,             // 可选
                            controlPoints: true,      // 可选
                            nodeSize: [100, 0]
                        },
                        groupType: 'rect',
                        groupStyle: {
                            default: {

                            }
                        },
                    })
                }else{
                    this.graph = new G6.Graph({
                        container: 'mountNode',
                        width: this.canvas_width,
                        height: this.canvas_height,
                        // plugins: [ minimap ],
                        defaultNode: {
                            shape: 'rect',
                            size: [120, 40],
                            fill: '#fff'
                        },
                        defaultEdge: {
                            shape: 'cubic',
                            style: {
                                stroke: '#ABB7C5',
                            },
                            // controlPoints: [0.1, 0.9]
                        },
                        modes: {
                            default: ['click-select',  'drag-canvas', 'activate-relations', 'drag-node',
                                {
                                    type: 'brush-select',
                                    trigger: 'ctrl',
                                    // includeEdges: false,
                                    onSelect(nodes, edge, evt) {
                                        const id = G6.Util.uniqueId() + new Date().getTime()
                                        this.graph.addItem('group', {
                                            groupId: id,
                                            nodes: [],
                                            title: ''
                                        })
                                        nodes.forEach(item => {
                                            item._cfg.model.groupId = id
                                        })
                                        this.graph.get('updateGraphContent')()
                                    }
                                }
                            ],
                        },
                        groupType: 'rect',
                        groupStyle: {
                            default: {

                            }
                        },
                    });
                }
                this.graph.read(this.data)
                this.graph.render()

                //全局右击事件
                this.graph.on('contextmenu', ev => {
                    this.signColor = ''
                    document.querySelector('#mountNode').children[0].style.cursor = 'default'

                    //在group中点击
                    if(ev.target._cfg.groupId) {
                        this.graph.removeItem(ev.target._cfg.groupId)
                    }

                    // if(this.graph.get('group')) console.log(this.graph.get('group').getMatrix(),'group.getMatrix()');
                })

                //右击node节点事件
                this.graph.on('node:contextmenu', ev => {
                    // if (ev.item && this.caseTypeName != 'check' && ev.item._cfg.model.newNode) {
                    //     this.ev = ev
                    //     let clientX = document.querySelector('#mountNode').clientWidth
                    //     let clientY = document.querySelector('#mountNode').clientHeight
                    //     this.$refs.case_menu.style.display = 'block'
                    //     this.$refs.case_menu_item.style.top = ev.clientY + 350 < clientY ? ev.clientY + 'px' : ev.clientY - 320 + 'px'
                    //     this.$refs.case_menu_item.style.left = ev.clientX + 150 < clientX ? ev.clientX + 'px' : ev.clientX - 120 + 'px'
                    //     document.querySelector('.case-menu-item-sign').style.left = ev.clientX + 300 < clientX ? '110px' : '-140px'
                    //     if(ev.item._cfg.model.init) this.is_init = true
                    //     else this.is_init = false
                    //     if(ev.item._cfg.model.case_result) this.case_result = true
                    //     else this.case_result = false
                    //     console.log(this.ev, 'eeee');
                    // }
                })

                //全局点击事件
                this.graph.on('click', ev => {
                    this.$refs.case_menu.style.display = 'none'
                    this.$refs.case_select.style.display = 'none'
                    this.$refs.case_prompt.style.display = 'none'
                    this.is_init = false
                    this.$nextTick(() => {
                        this.ev = null
                    })
                })

                //点击edge事件
                this.graph.on('edge:click', ev => {
                    if (this.edge) this.graph.removeItem(this.edge)
                })

                //点击node事件
                this.graph.on('node:click', ev => {
                    if(this.caseTypeName != 'check') {
                        if (this.edge) {
                            this.graph.update(this.edge, {
                                target: ev.item._cfg.id
                            })
                            this.edge = null
                            this.graph.changeData(this.graph.save())
                            this.graph.refresh()
                        }
                        if(this.signColor && !ev.item._cfg.model.init && !ev.item._cfg.model.case_result && ev.item._cfg.model.newNode) {
                            this.ev = ev
                            this.signNode(this.signColor)
                            setTimeout(() => {document.querySelector('#mountNode').children[0].style.cursor = this.signColor.cursor}, 1)
                            return
                        }
                        if(this.opinionRange(ev.x, ev.item._cfg.model.x - 7.5, ev.item._cfg.model.x + 7.5) && this.opinionRange(ev.y, ev.item._cfg.model.y + 12.5, ev.item._cfg.model.y + 27.5)) {
                            if(!ev.item._cfg.model.case_result) this.addNodeSymbol(ev)
                        }
                    }
                })

                //双击事件
                this.graph.on('dblclick', ev => {
                    // if (ev.item  && this.caseTypeName != 'check' && ev.item._cfg.model.newNode) {
                    //     this.ev = ev
                    //     this.editNode()
                    // }
                })

                //鼠标移动事件
                this.graph.on('canvas:mousemove', ev => {
                    if (this.edge) {
                        const point = {x: ev.x, y: ev.y};
                        this.graph.update(this.edge, {
                            target: point
                        })
                    }
                })

                //鼠标移除画布事件
                // this.graph.on('canvas:mouseout', ev => {
                //     if(this.edge) {
                //         if (this.edge) this.graph.removeItem(this.edge)
                //     }
                // })

                //鼠标进入事件
                this.graph.on('node:mouseenter', ev => {
                    // if (ev.item && this.caseTypeName != 'check' && !this.signColor) {
                    //     ev.item._cfg.model.may_open = true
                    //     this.graph.refresh()
                    // }
                    if (ev.item && ev.item._cfg.model.stroke == "#E08049") {
                        this.checkNodeColor(ev.item, {color: '#bb91fe', lineWidth: 3})
                    }
                    if(ev.item && ev.item._cfg.model.list && ev.item._cfg.model.list.length) {
                        const point = this.graph.getClientByPoint(ev.item._cfg.model.x - ev.item._cfg.model.size[0] / 2 + 10, ev.item._cfg.model.y - ev.item._cfg.model.size[1] / 2 + 1);
                        this.$refs.case_prompt.style.display = 'inline-block'
                        this.$refs.case_prompt.style.top = point.y + 10 + 'px'
                        this.$refs.case_prompt.style.left = point.x + 50 + 'px'
                        // if(ev.item._cfg.model.list) {
                        //     let is_explain = false
                        //     ev.item._cfg.model.list.forEach(item => {
                        //         if(item.title == '注') is_explain = true
                        //     })
                        //     if(!is_explain) ev.item._cfg.model.list.push({color: '#D45912', title: '注', explain: this.explain})
                        // }else ev.item._cfg.model.list = [{color: '#D45912', title: '注', explain: this.explain}]
                        // this.contentList = ev.item._cfg.model.list
                        this.contentList = ev.item._cfg.model.list || []
                        this.nodeTitle = ev.item._cfg.model.all_label || ev.item._cfg.model.label
                        this.explainEv = ev
                        console.log(ev.item._cfg.model.list, '1111');
                    }
                })

                //鼠标移出事件
                this.graph.on('node:mouseleave', ev => {
                    if (ev.item && this.caseTypeName != 'check' && !this.signColor) {
                        ev.item._cfg.model.may_open = false
                        this.graph.refresh()
                    }
                    if (ev.item && ev.item._cfg.model.stroke) {
                        this.checkNodeColor(ev.item, {color: '#ABB7C5', lineWidth: 1})
                    }
                    this.$refs.case_content.style.display = 'none'
                    this.$refs.case_prompt.style.display = 'none'
                })

                this.graph.on('mouseleave', ev => {
                    if(this.signColor) {
                        setTimeout(() => {document.querySelector('#mountNode').children[0].style.cursor = this.signColor.cursor}, 1)
                    }
                })

                this.graph.on('mousemove', ev => {
                    if(this.signColor) {
                        setTimeout(() => {document.querySelector('#mountNode').children[0].style.cursor = this.signColor.cursor}, 1)
                    }
                })

                this.graph.on('node:mouseenter', ev => {
                    if(ev.item._cfg.model.all_label && ev.item._cfg.model.label != ev.item._cfg.model.all_label){
                        this.case_content = ev.item._cfg.model.all_label
                        const point = this.graph.getClientByPoint(ev.item._cfg.model.x , ev.item._cfg.model.y)
                        this.$refs.case_content.style.top = point.y + 'px'
                        this.$refs.case_content.style.left = point.x + 'px'
                        this.$refs.case_content.style.display = 'inline-block'
                    }
                })

                // //鼠标抬起保存操作
                // this.graph.on('mouseup', ev => {
                //     if(ev.item) this.handleSubmit()
                // })
                // //回车抬起抬起保存操作
                // this.graph.on('keyup', ev => {
                //     if(ev.item) this.handleSubmit()
                // })

                this.graph.set('updateGraphContent', this.updateGraph)
            },
            opinionRange(num, minNum, maxNum) {
                if(num >= minNum && num <= maxNum) return true
                else return false
            },
            updateGraph() {
                const point = this.graph.getPointByCanvas(0, 0)
                const zoom = this.graph.getZoom()
                this.graph.read(this.graph.save())
                this.graph.render()
                this.graph.translate(-point.x, -point.y)
                this.graph.zoom(zoom)
            },
            setGraph() {
                this.$Modal.confirm({
                    title: '提示',
                    content: `确认切换为【${this.graphType == 'automate' ? '手动拖拽' : '自动布局'}】模式`,
                    onOk: () => {
                        const point = this.graph.getPointByCanvas(0, 0)
                        const zoom = this.graph.getZoom()
                        this.data = this.graph.save()
                        this.graph.destroy()
                        this.graphType = this.graphType == 'automate' ? 'manual' : 'automate'
                        this.initGraph()
                        this.graph.read(this.data)
                        this.graph.render()
                        this.graph.translate(-point.x, -point.y)
                        this.graph.zoom(zoom)
                    },
                })
            },
            setData(data, list) {
                console.log(data, list, 'data, list');
                list.forEach(item => {
                    if(item.list) {
                        item.list.forEach((item1, index1) => {
                            if(item1.title == '题') item.list.splice(index1, 1)
                        })
                    }
                })
                list.forEach((item) => {
                    for(let i in data) {
                        if(item.id == i && data[i][0].content.length) {
                           if(item.list && item.list.length) {
                                let is_content = false
                                item.list.forEach(item1 => {
                                    if(item1.title == '题') is_content = true
                                })
                                if(!is_content) item.list.push({color: '#1963BA', title: '题', content: data[i][0]})
                            }
                            else item.list = [{color: '#1963BA', title: '题', content: data[i][0]}]
                        }
                    }
                })
            },
            setElements() {
                let da = this.graph.save()
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
                                    code: t.id + '|' + sessionStorage.getItem('CASEID'),
                                    element_name: t.all_label,
                                    type: types[t.fill]
                                })
                            }
                        }
                    })
                }
                return ele
            },
            changeOutlineList(data) {
                const dataList = {}, list = ['assist', 'talk', 'physical']
                list.forEach(item => {
                    if(data[item]) data[item].forEach(item1 => {
                        item1.type = item
                        item1.code = item1.code.split('|')[0]
                        if(dataList[item1.code]) dataList[item1.code].push(item1)
                        else dataList[item1.code] = [item1]
                    })
                })
                this.dataList = dataList
            },
        },
        mounted() {
            this.$on('next', (save) => {
                this.outline.outline = JSON.stringify(this.graph.save())
                PostData('case/saveCaseOutline', {...{elements: this.setElements()}, ...this.outline}).then(res => {
                    this.$emit('saveData', save)
                })
            })
            PostData('case/getAllOutlineTalk',{"case_id": JSON.parse(sessionStorage.getItem('CASEID')),}).then(res => {
                this.changeOutlineList(res.data)
            }).then(() => {
                PostData('case/getCaseDetailAndOutlines', {id: parseInt(sessionStorage.getItem('CASEID'))}).then(res => {
                    if(res.res_code == 1) {
                        this.outline = res.data.outlines[0]
                        this.data = JSON.parse(res.data.outlines[0].outline)
                        this.graphType = 'manual'
                        this.setData(this.dataList, this.data.nodes)
                        this.initGraph()
                        // this.graph.translate(document.querySelector('#mountNode').offsetWidth / 2 - 160, 0)
                    }
                })
            })
            window.onresize = () => {
                return (() => {
                    this.canvas_width = document.querySelector('#mountNode').offsetWidth
                    this.canvas_height = document.querySelector('#mountNode').offsetHeight
                    this.graph.refresh()
                })
            }
        },
    }
</script>

<style scoped lang="less">
    .case-header {
        height: 50px;
        background: #686F92;
        display: flex;
        align-items: center;
        min-width: 1370px;
        justify-content: space-between;

        .case-header-left{
            display: flex;
            align-items: center;
            height: 100%;
        }

        .case-header-back {
            width: 130px;
            height: 100%;
            background: #4098FF;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .back-img {

            }

            .back-font {
                margin-left: 10px;
                font-size: 18px;
                color: #fff
            }
        }

        .case-header-title {
            margin-left: 30px;
            color: #fff;
            font-size: 18px;
        }

        /deep/ .ivu-btn-info{
            background-color: #2db7f5;
            border-color: #2db7f5;

            &:hover{
                background-color: #57c5f7;
                border-color: #57c5f7;
            }
        }

        .case-header-btn {
            margin-left: 30px;
            display: flex;
            align-items: center;

            .header-btn-img {
                margin-right: 16px;
                cursor: pointer;
            }
        }

        .case-header-type {
            display: flex;
            margin-right: 50px;
            align-items: center;

            .type-box {
                display: flex;
                cursor: pointer;
                align-items: center;
                margin-left: 15px;

                .type-box-color {
                    width: 20px;
                    height: 10px;
                    border-radius: 2px;
                    margin-right: 10px;
                }

                .type-box-font {
                    color: #fff;
                    font-size: 16px
                }
            }
            .save-btn-save{
                width: 133px;
                height: 34px;
                margin-right: 10px;
                margin-left: 30px;
                color: #4098ff;
                background-color:#fff;
            }
            .save-btn{
                width: 133px;
                height: 34px;
            }
        }
    }

    .mountNode {
        height: 100%;
    }

    .case-menu {
        position: absolute;
        width: 120px;
        z-index: 1;
        background: #FFFFFF;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.24);
        border-radius: 4px;
        padding: 20px 0;

        .case-menu-item {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;

            .case-menu-item-menu {
                position: absolute;
                right: 20px;
                color: #474C63
            }

            .case-menu-item-sign {
                display: none;
                position: absolute;
                background: #FFFFFF;
                box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.24);
                border-radius: 8px;
                left: 110px;
                top: 100px;
                width: 140px;
                padding: 10px;

                .item-sign-box {
                    margin: 10px;
                    display: flex;
                    align-items: center;
                }

                .item-sign-color {
                    height: 10px;
                    width: 10px;
                    border-radius: 100%;
                    margin-right: 12px;
                }

                .item-sign-title {
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #474C63;
                    letter-spacing: 0;
                    line-height: 35px;
                }

                .item-sign-box:hover {
                    .item-sign-title {
                        color: #4098ff;
                    }
                }
            }
        }

        .case-menu-item-disable{
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: no-drop;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #C8CCDD;

            .case-menu-item-sign{
                display: none;
            }
        }

        .case-menu-item:hover {
            color: #4098FF;

            .case-menu-item-menu {
                color: #4098FF;
            }

            .case-menu-item-sign {
                display: block;
            }
        }

    }

    .case-content{
        display: none;
        max-width: 200px;
        position: absolute;
        color: #fff;
        z-index: 1000;
        background-color:rgba(70, 76, 91, 0.9);
        padding: 8px 12px;
        transform: translateX(-50%) translateY(-180%);

        .case-content-triangle{
            width: 10px;
            border: 5px solid;
            border-color: rgba(70, 76, 91, 0.9) transparent transparent transparent;
            z-index: 1000;
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .case-input {
        display: none;
        position: absolute;
        height: 40px;
        width: 180px;
        z-index: 1;
        top: 300px;
        font-size: 16px !important;

        /deep/ .ivu-input, /deep/ .ivu-select-selection {
            border: none;
            font-size: 16px !important;
            background-color: rgba(0, 0, 0, 0);
        }
        /deep/ .ivu-select-arrow{
            display: none;
        }
    }

    .case-prompt{
        display: none;
        position: absolute;
        width: 300px;
        z-index: 1;
        top: 300px;
        font-size: 16px !important;
        background-color: #fff;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
        border-radius: 2px;
        padding: 20px;

        .case-prompt-content{
            margin-bottom: 34px;

            .case-prompt-content-box{
                display: flex;
                align-items: center;
                border-bottom: 1px solid #F0F0F7;
                padding-bottom: 8px;
                margin-bottom: 13px;
            }
            .case-prompt-content-img{
                width: 18px;
                height: 18px;
            }
            .case-prompt-content-title{
                margin-left: 8px;
            }
            .case-prompt-content-message{
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #474C63 !important;
                letter-spacing: 0;
                line-height: 24px;
                text-align: left;
                margin-bottom: 8px;
            }
            .webkit-box{
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .case-prompt-content-message-box{
                margin-bottom: 10px;
            }
            .case-prompt-content-message-title{
                width: 300px;
            }
            .case-prompt-content-message-font{
                color: #63688b;
            }
            .case-prompt-content-message-hint{
                color: #D45912;
                margin-right: 8px;
            }
        }
    }

    .case-modal{
        /deep/ .ivu-modal-header{
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
        }
        .case-modal-header{
            text-align: center;
            font-size: 16px;
            color: #474C63;
            font-family: PingFangSC-Medium;
        }
        /deep/ .ivu-modal-body{
            padding: 0;
        }
        .case-modal-content{
            display: flex;
            height: 540px;

            .case-modal-left{
                width: 140px;
                background: #F0F0F7;
                border-radius: 10px 0 0 10px;
                padding-top: 20px;

                .case-modal-left-title{
                    height: 43px;
                    display:flex;
                    justify-content: center;
                    align-items:center;
                    background: #969EC5;
                    color: #fff;
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    cursor: pointer;
                }
            }
            .case-modal-right{
                width: 560px;
                padding: 30px;
                overflow-y: auto;

                .case-modal-right-box{
                    width: 100%;
                    /*border-bottom: 1px solid #F0F0F7;*/
                    /*padding-bottom: 20px;*/
                }
                .case-modal-right-model{
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #F0F0F7;

                    .support-title{
                        font-size: 14px;
                        color: #474C63;
                        margin-right: 10px;
                    }
                    .support-content{
                        font-size: 14px;
                        color: #686F92;
                    }
                }
                .case-btn{
                    height: 24px;
                    font-size: 12px !important;
                    margin: 10px 0;
                    background: rgba(64,152,255,0.15);
                    border: 1px solid #4098FF;
                    color: #4098FF;
                }
                .case-btn1{
                    height: 24px;
                    font-size: 12px !important;
                    margin: 10px 0;
                    background: rgba(64,152,255,0.15);
                    border: 1px solid #4098FF;
                    color: #4098FF;
                }
                .case-btn2{
                    height: 24px;
                    font-size: 12px !important;
                    margin: 10px 0;
                    background: rgba(147,151,173,0.15);
                    border: 1px solid #9397AD;
                    color: #474C63;
                }
                .case-btn3{
                    height: 24px;
                    font-size: 12px !important;
                    margin: 10px 0;
                    background: rgba(245,72,2,0.15);
                    border: 1px solid #F54802;
                    color: #F54802;
                }
            }
        }
    }

    .case-detail{
        display: inline-block;
        position: absolute;
        width: 700px;
        z-index: 1;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-size: 16px !important;
        background-color: #fff;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
        border-radius: 2px;
    }

    .case-select{
        display: none;
        position: absolute;
        flex-direction: column;
        min-width: 120px;
        width: auto;
        z-index: 1;
        top: 300px;
        font-size: 16px !important;

        .case-select-input{
            min-width: 120px;
            height: 40px;
            width: auto;
            margin-left: 10px;
        }
        .case-select-box{
            height: 200px;
            overflow-y: auto;
            box-shadow: 0 1px 6px rgba(0,0,0,.2);
            background-color: #fff;
        }
        .case-select-content{
            width: 260px;
            padding: 7px 16px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;

            &:hover{
                background-color: rgba(243, 243, 243);
            }
        }

        /deep/ .ivu-input, /deep/ .ivu-select-selection {
            border: none;
            font-size: 16px !important;
            background-color: rgba(0, 0, 0, 0);
        }
        /deep/ .ivu-select-arrow{
            display: none;
        }
    }

    .case-degree {
        position: absolute;
        top: 100px;
        background-color: #fff;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        width: 400px;
        height: 50px;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.24);
        border-radius: 4px;

        .case-degree-title {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0.93px;
            margin: 0 30px;
        }

        .case-degree-box {
            display: flex;
            align-items: center;
            cursor: pointer;

            .degree-circle {
                width: 16px;
                height: 16px;
                border-radius: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .degree-circle-inner {
                    height: 12px;
                    width: 12px;
                    background-color: #fff;
                    border-radius: 100%
                }
                .degree-circle-inner-small {
                    height: 6px;
                    width: 6px;
                    background-color: #fff;
                    border-radius: 100%
                }
            }

            .case-degree-title {
                margin-left: 10px;
                margin-right: 30px;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
                letter-spacing: 0.93px;
            }
        }
    }
    .mini-map{
        position: absolute;
        top: 130px;
        right: 0;
    }
    .sign-box{
        position: absolute;
        top: 150px;
        right: 10px;
        background-color:#fff;
        z-index: 10;
        display: flex;
        flex-wrap: wrap;
        width: 200px;
    }
    .sign-box-content{
        width: 15px;
        height: 10px;
        border-radius: 2px;
        margin: 10px;
        cursor: pointer;
    }
    .explainBox{
        display: flex;
        padding: 30px 0;
        border-bottom: 1px solid #F0F0F7;

        .explainBox-title{
            width: 110px;
            text-align: center;
            font-size: 14px;
            color: #474C63;
            font-family: PingFangSC-Medium;
            line-height: 24px
        }
        .explain-image{
            display: flex;
            width: 520px;
            flex-wrap: wrap;

            .explain-image-box{
                position: relative;

                &:hover{
                    .explain-image-icon{
                        display: flex;
                    }
                }
            }
            .explain-image-img{
                height: 100px;
                margin-right: 10px;
            }
            .explain-image-icon{
                display: none;
                align-items:center;
                justify-content: center;
                position: absolute;
                top: 0;
                right: 10px;
                background-color:#E02020;
                width: 14px;
                height: 14px;
                cursor: pointer
            }
        }
    }
    /deep/ .ivu-table:before{
        display: none;
    }
</style>
