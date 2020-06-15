<template>
    <div style="height: 100%; overflow-y: auto">
        <Button type="primary" style="width: 120px;" @click="handleTest">保存</Button>
        <div class="case-degree" v-if="is_init">
            <div class="case-degree-title">病例难度</div>
            <div class="case-degree-box" v-for="(item, index) in degree_list" :key="index" @click="degreeChange(index)">
                <div class="degree-circle" :style="{backgroundColor: item.color}">
                    <div :class="evt.item._cfg.model.degree == index + 1 ? 'degree-circle-inner-small' : 'degree-circle-inner'"></div>
                </div>
                <div class="case-degree-title">{{item.title}}</div>
            </div>
        </div>
        <div style="height: calc(100% - 50px);position: relative">
            <!--G6模版-->
            <div id="mountNode" class="mountNode"></div>
            <div ref="case_menu" style="position: absolute; left: -150px;">
                <div ref="case_menu_item" class="case-menu">
                    <div v-if="menuObj.editEdge" @click="editEdge" :class="menuObj.editEdge === 'able' ? 'case-menu-item' : 'case-menu-item-disable'">编辑线</div>
                    <div v-if="menuObj.edit" @click="editNode" :class="menuObj.edit === 'able' ? 'case-menu-item' : 'case-menu-item-disable'">编辑</div>
                    <div v-if="menuObj.editGather" @click="editNodeGather" :class="menuObj.editGather === 'able' ? 'case-menu-item' : 'case-menu-item-disable'">编辑节点</div>
                    <div v-if="menuObj.add" :class="menuObj.add === 'able' ? 'case-menu-item' : 'case-menu-item-disable'">
                        <span>添加</span>
                        <span class="case-menu-item-menu">></span>
                        <div class="case-menu-item-sign" style="top: 50px;">
                            <div v-for="(item, index) in add_type" @click="addNode(item.type)" :key="index" class="item-sign-box">
                                <div class="item-sign-title">{{item.title}}</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="menuObj.line" @click="mergeNode" :class="menuObj.line === 'able' ? 'case-menu-item' : 'case-menu-item-disable'">连线</div>
                    <div v-if="menuObj.copy" @click="copyNode" :class="menuObj.copy === 'able' ? 'case-menu-item' : 'case-menu-item-disable'">复制</div>
                    <div v-if="menuObj.explain" @click="explainNode" :class="menuObj.explain === 'able' ? 'case-menu-item' : 'case-menu-item-disable'">添加说明</div>
                    <div v-if="menuObj.sign" :class="menuObj.sign === 'able' ? 'case-menu-item' : 'case-menu-item-disable'">
                        <span>标记</span>
                        <span class="case-menu-item-menu">></span>
                        <div class="case-menu-item-sign">
                            <div v-for="(item, index) in case_type" @click="signNode(item)" :key="index" class="item-sign-box" v-if="index != 5">
                                <div class="item-sign-color" :style="{backgroundColor: item.color}"></div>
                                <div class="item-sign-title">{{item.short_title}}</div>
                                <Icon v-if="evt.item && evt.item._cfg && evt.item._cfg.model.stroke == item.color" type="md-checkmark" style="margin-left: 30px;" color="#474C63"/>
                            </div>
                        </div>
                    </div>
                    <div v-if="menuObj.delete" :class="menuObj.delete === 'able' ? 'case-menu-item' : 'case-menu-item-disable'" @click="deleteNode">删除</div>
                    <div v-if="menuObj.deleteGather" :class="menuObj.deleteGather === 'able' ? 'case-menu-item' : 'case-menu-item-disable'" @click="deleteGatherNode">删除节点</div>
                    <div v-if="menuObj.result" :class="menuObj.result === 'able' ? 'case-menu-item' : 'case-menu-item-disable'" @click="addNodeResult">添加病种</div>
                </div>
            </div>
            <Input ref="case_input" v-model="input_data" type="textarea" :autosize="{minRows: 2, maxRows: 2}" class="case-input" @on-blur="inputBlur" @on-change="inputChange" @on-enter="inputEnter"  @on-focus="inputChange"/>
            <div ref="case_select" class="case-select">
                <Input ref="case_select_input" v-model="select_data" :style="{width: select_width + 'px'}" class="case-select-input" @on-change="selectChange" @on-blur="selectBlur"/>
                <div v-if="select_list.length" class="case-select-box">
                    <div class="case-select-content" :style="{width: select_width + 40 + 'px'}" @click="selectClick(item)" v-for="(item, index) in select_list" :key="index">
                        <Tooltip :content="item.name" max-width="400">
                            <div class="case-select-content-message" :style="{width: select_width + 20 + 'px'}">{{item.name}}</div>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <!--            添加说明框-->
            <Modal v-model="explainModel" :footer-hide="true" :title="nodeTitle" width="700" @on-cancel="explainCancel">
                <div class="explainBox">
                    <div class="explainBox-title">文字说明：</div>
                    <div style="position: relative">
                        <Input :disabled="explainState != '保存'" v-model="explain.text" style="width: 520px;" type="textarea" :autosize="{minRows: 4, maxRows: 4}" maxlength="500" placeholder="请输入文字说明"/>
                        <div style="position: absolute; right: 0;">{{explain.text.length}}/500</div>
                    </div>
                </div>
                <div class="explainBox" v-if="explain.imgList.length || explainState == '保存'">
                    <div class="explainBox-title">图片说明：</div>
                    <div class="explain-image" >
                        <div v-for="(item, index) in explain.imgList" :key="index" class="explain-image-box">
                            <img class="explain-image-img" :src="item.url" alt="">
                            <div v-if="explainState == '保存'" class="explain-image-icon" @click="deleteList(explain.imgList, index)"><Icon type="md-close" color="#fff" size="12"/></div>
                        </div>
                        <uploadAdd v-if="explainState == '保存'" :upload-config="uploadConfig" :panelOptions="panelOptions" @uploadcomplete="uploadcompletePhoto" types="image/*"/>
                    </div>
                </div>
                <div class="explainBox" v-if="explain.audioList.length || explainState == '保存'">
                    <div class="explainBox-title">音频说明：</div>
                    <div class="explain-image">
                        <audio ref="audio" :src="audioUrl"></audio>
                        <div v-for="(item ,index) in explain.audioList" :key="index" class="explain-image-box">
                            <img style="height: 36px;margin-right: 10px;" :src="audioIsPlay == index ? audioPause : audioPlay" alt="" @click="handleAudioPlay(item, index)">
                            <div v-if="explainState == '保存'" class="explain-image-icon" @click="deleteList(explain.audioList, index)"><Icon type="md-close" color="#fff" size="12"/></div>
                        </div>
                        <uploadAdd v-if="explainState == '保存'" :upload-config="uploadConfig" :panelOptions="panelOptions2" @uploadcomplete="uploadcompleteAudio" types="audio/*"/>
                    </div>
                </div>
                <div class="explainBox" v-if="explain.videoList.length || explainState == '保存'">
                    <div class="explainBox-title">视频说明：</div>
                    <div class="explain-image">
                        <div v-for="(item ,index) in explain.videoList" :key="index" class="explain-image-box">
                            <video ref="video" :src="item.url" style="height: 100px; margin-right: 10px;" controls></video>
                            <div v-if="explainState == '保存'" class="explain-image-icon" @click="deleteList(explain.videoList, index)"><Icon type="md-close" color="#fff" size="12"/></div>
                        </div>
                        <uploadAdd v-if="explainState == '保存'" :upload-config="uploadConfig" :panelOptions="panelOptions" @uploadcomplete="uploadcompleteVideo" types="video/*"/>
                    </div>
                </div>
                <div style="display: flex;justify-content: center">
                    <Button type="primary" style="width: 120px;margin: 20px 0;" @click="explainBtn">{{explainState}}</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import G6 from '@antv/g6'
    import postData from '../../api/postData'
    import uploadAdd from '../../components/UploadAdd.vue'
    import audioPlay from '../../assets/img/case/audioPlay.png'
    import audioPause from '../../assets/img/case/audioPause.png'

    export default {
        components: {uploadAdd},
        props: {
            menuObj: {
                type: Object,
                default: () => {
                    return {
                        editEdge: 'able',
                        edit: 'able',
                        editGather: 'able',
                        add: 'able',
                        line: 'able',
                        copy: 'able',
                        explain: 'able',
                        sign: 'able',
                        delete: 'able',
                        deleteGather: 'able',
                        result: 'able',
                    }
                }
            },
        },
        data() {
            return {
                audioPlay, audioPause,
                data: {
                    nodes: [{
                        id: '1', label: '新建病症', all_label: '新建病症',
                        anchorPoints: [[0.5, 0], [0.5, 1]], init: true, degree: 2, size: [120, 40]
                    }]
                },
                node: {},
                degree_list: [
                    {color: '#7ED321', title: '简单'},
                    {color: '#4098ff', title: '中等'},
                    {color: '#FD6C1E', title: '困难'},
                ],
                case_type: [
                    {color: '#A1CDFF', fill_color: '#ECF5FF', title: '问诊', short_title: '问诊'},
                    {color: '#60CFD7', fill_color: '#DFF5F7', title: '体格检查', short_title: '体检'},
                    {color: '#FFC058', fill_color: '#FFF2DE', title: '辅助检查', short_title: '辅检'},
                    {color: '#9BDD4A', fill_color: '#EBF8DB', title: '治疗', short_title: '治疗'},
                    {color: '#BB91FE', fill_color: '#F1E9FF', title: '鉴别要素', short_title: '鉴别要素'},
                    {color: '#E08049', fill_color: '#F9E6DB', title: '病种', short_title: '病种'},
                ],
                add_type: [
                    {type: 'opinion', title: '判断节点'},
                    {type: 'rect', title: '矩形节点'},
                    {type: 'gather', title: '集合节点'},
                ],
                evt: {},
                input_data: '',
                explainModel: false,
                explainState: '保存',
                explain: {
                    text: '',
                    imgList: [],
                    audioList: [],
                    videoList: [],
                },
                nodeTitle: '题目',
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
                audioUrl: '',
                audioIsPlay: null,
                graph: null,
                gatherNum: 0,
                select_data: '',
                select_list: [],
                select_width: 100,
                is_init: false,
            }
        },
        mounted() {
            window.addEventListener("resize", () => {
                const nodeStyle = document.getElementById("mountNode").getBoundingClientRect();
                this.graph.changeSize(nodeStyle.width, nodeStyle.height)
            });
            this.initGraph()
        },
        methods: {
            handleTest() {
                let list = [];
                this.graph.save().nodes.forEach(item => {
                    var hasItem = false;
                    list.forEach(item1 => {
                        if(item1.y === item.y) {
                            hasItem = true;
                            if(item.type === 'gather') item1.gather.push(item);
                            else item1.nodes.push(item)
                        }
                    });
                    if(!hasItem) {
                        if(item.type === 'gather') list.push({
                            nodes: [],
                            gather: [item],
                            y: item.y,
                        });
                        else list.push({
                            nodes: [item],
                            gather: [],
                            y: item.y,
                        })
                    }
                });
                list.forEach(item => {
                    var num = 0;
                    item.gather.forEach(item1 => {
                        num += item1.children.length;
                        item.nodeNum = item.nodes.length
                    });
                    item.gather.forEach(item1 => {
                        item1.gatherNum = num
                    })
                });
                this.data = this.graph.save();
                this.updateGraph()
            },
            degreeChange(index) {
                this.evt.item._cfg.model.degree = index + 1;
                this.degree = index + 1;
                this.graph.refreshItem(this.evt.item);
                this.is_init = false
            },
            addNode(type) {
                let e = window.event
                const point = this.graph.getPointByClient(e.clientX, e.clientY);
                let id = String(new Date().getTime())
                this.node = this.graph.addItem('node', {
                    id: id,
                    anchorPoints: [
                        [0.5, 0], [0.5, 1]
                    ],
                    x: this.evt.item._cfg.model.x,
                    y: this.evt.item._cfg.model.y,
                    label: '添加内容',
                    type: type,
                    children: [{id: String(new Date().getTime()), label: '添加内容'}]
                });
                this.graph.addItem('edge', {
                    source: this.evt.item._cfg.id,
                    target: id,
                    shape: 'cubic',
                    style: {
                        stroke: '#ABB7C5',
                        endArrow: 'custom-arrow',
                        // controlPoints: [0.1, 0.9]
                    },
                })
                this.$refs.case_menu.style.left = '-150px';
                this.updateGraph()
            },
            editEdge() {
                if(this.menuObj.editEdge === 'unable') return
                this.evt.item._cfg.model.text = ''
                this.updateGraph()
                let model = this.evt.item._cfg.model
                const point = this.graph.getCanvasByPoint(model.endPoint.x - 30, (model.startPoint.y + model.endPoint.y)/2 - 15);
                this.$refs.case_input.$el.style.left = `${point.x}px`;
                this.$refs.case_input.$el.style.top = `${point.y}px`;
                this.$refs.case_input.focus()
                this.$refs.case_menu.style.left = '-150px';
            },
            editNode() {
                if(this.menuObj.edit === 'unable') return
                if(this.evt.item._cfg.model.case_result) {
                    this.select_data = this.evt.item._cfg.model.all_label
                    this.evt.item._cfg.model.label = ''
                    this.updateGraph()
                    const point = this.graph.getCanvasByPoint(this.evt.item._cfg.model.x - this.evt.item._cfg.model.size[0] / 2 , this.evt.item._cfg.model.y - this.evt.item._cfg.model.size[1] / 2 );
                    this.$refs.case_select.style.top = point.y + 2 + 'px'
                    this.$refs.case_select.style.left = point.x - 4 + 'px'
                    this.$refs.case_select_input.focus()
                    this.$refs.case_menu.style.left = '-150px';
                }else{
                    this.input_data = this.evt.item._cfg.model.label
                    this.evt.item._cfg.model.label = ''
                    this.updateGraph()
                    let model = this.evt.item._cfg.model
                    const point = this.graph.getCanvasByPoint(model.x - model.size[0]/2, model.y - model.size[1]/2);
                    this.$refs.case_input.$el.style.left = `${point.x}px`;
                    this.$refs.case_input.$el.style.top = `${point.y}px`;
                    this.$refs.case_input.focus()
                    this.$refs.case_menu.style.left = '-150px';
                }
            },
            editNodeGather() {
                if(this.menuObj.editGather === 'unable') return
                let model = this.evt.item.getModel()
                this.gatherNum  = this.evt.target.get('childIndex')
                model.children[this.evt.target.get('childIndex')].label = ''
                const point = this.graph.getCanvasByPoint(model.x - model.size[0]/2 + this.gatherNum * 120, model.y - model.size[1]/2 + 10);
                this.$refs.case_input.$el.style.left = `${point.x}px`;
                this.$refs.case_input.$el.style.top = `${point.y}px`;
                this.$refs.case_input.focus()
                this.$refs.case_menu.style.left = '-150px';
                // this.updateGraph()
                this.graph.refreshItem(this.evt.item)
                this.graph.layout()
            },
            inputBlur() {
                if(this.evt.item._cfg.type == 'edge') this.evt.item._cfg.model.text = this.input_data
                else if(this.evt.item._cfg.model.type == 'gather') {
                    const {item} = this.evt;
                    const model = item.getModel()
                    model.children[this.gatherNum].label = this.input_data
                }
                else this.evt.item._cfg.model.label = this.input_data
                this.input_data = ''
                this.updateGraph()
                // this.graph.refreshItem(this.evt.item)
                // this.graph.refresh()
                // this.graph.layout()
                this.$refs.case_input.$el.style.left = '-150px';
            },
            inputChange() {},
            inputEnter() {
                // this.inputBlur()
            },
            initDataList() {
                postData('common/getIcd10').then(res => {
                    this.select_list = res.data
                })
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
            selectBlur() {
                let evt = this.evt
                setTimeout(() => {
                    // evt.item._cfg.model.label = evt.item._cfg.model.case_name || '请输入病种名称'
                    this.graph.refresh()
                    this.$refs.case_select.style.left = '-150px'
                    this.select_data = ''
                    this.select_list = []
                    this.updateGraph()
                },200)
            },
            createDiv() {
                let div = document.createElement('div')
                div.style.display = 'inline-block'
                div.style.fontSize = '16px'
                div.style.opacity = 0
                div.style.position = 'absolute'
                return div
            },
            selectClick(val) {
                let div = this.createDiv()
                div.innerText = val.name
                document.body.append(div)
                let set_width = div.offsetWidth
                if(set_width > 120 && set_width < 190) {
                    this.evt.item._cfg.model.size[0] = set_width + 40
                    this.evt.item._cfg.model.case_name = val.name
                    this.select_width = set_width
                }else if(set_width > 190) {
                    let new_div = this.createDiv()
                    document.body.append(new_div)
                    for(let i in val.name) {
                        let set_width = new_div.offsetWidth
                        if(set_width < 190){
                            new_div.innerText = new_div.innerText + val.name[i]
                        } else {
                            this.evt.item._cfg.model.case_name = new_div.innerText + '...'
                        }
                    }
                    this.evt.item._cfg.model.size[0] = 230
                    this.select_width = 220
                    document.body.removeChild(new_div)
                }else{
                    this.evt.item._cfg.model.size[0] = 120
                    this.select_width = 100
                    this.evt.item._cfg.model.case_name = val.name
                }
                this.evt.item._cfg.model.case_id = val.id
                this.evt.item._cfg.model.label = this.evt.item._cfg.model.case_name
                this.evt.item._cfg.model.all_label = val.name
                this.$refs.case_select.style.left = '-150px'
                this.select_data = ''
                this.select_list = []
                this.updateGraph()
                // this.graph.refreshItem(this.evt.item)
                // this.graph.layout()
            },
            mergeNode(e) {
                if(this.menuObj.line === 'unable') return
                this.graph.setMode('lineEdge')
                this.$refs.case_menu.style.left = '-150px';
            },
            copyNode(e) {
                if(this.menuObj.copy === 'unable') return
                let id = String(new Date().getTime())
                const point = this.graph.getPointByClient(e.clientX, e.clientY);
                console.log(point, this.evt.item._cfg.model, 'point');
                this.node = this.graph.addItem('node', {
                    ...this.evt.item._cfg.model,
                    x: point.x,
                    y: point.y,
                    id: id,
                    anchorPoints: [
                        [0.5, 0], [0.5, 1]
                    ]
                });
                this.graph.addItem('edge', {
                    source: this.evt.item.getInEdges()[0]._cfg.source._cfg.id,
                    target: this.node._cfg.id,
                    shape: 'cubic',
                    style: {
                        stroke: '#ABB7C5',
                        endArrow: 'custom-arrow',
                        controlPoints: [0.1, 0.9]
                    }
                })
                this.$refs.case_menu.style.left = '-150px';
                this.updateGraph()
            },
            explainNode() {
                if(this.menuObj.explain === 'unable') return
                this.explainState = '保存'
                this.nodeTitle = this.evt.item._cfg.model.all_label || this.evt.item._cfg.model.label
                this.explainModel = true
                this.$refs.case_menu.style.left = '-150px';
                if(this.evt.item._cfg.model.explain) this.explain = this.evt.item._cfg.model.explain
            },
            explainCancel() {
                if(this.$refs.audio) this.$refs.audio.pause()
                if(this.$refs.video) this.$refs.video.forEach((item) => {
                    item.pause()
                })
                this.explain = {
                    text: '',
                    imgList: [],
                    audioList: [],
                    videoList: [],
                }
            },
            deleteList(list, index) {
                list.splice(index, 1)
            },
            uploadcompletePhoto(val) {
                this.explain.imgList.push({url: val})
            },
            uploadcompleteAudio(val) {
                this.explain.audioList.push({url: val})
            },
            uploadcompleteVideo(val) {
                this.explain.videoList.push({url: val})
            },
            handleAudioPlay(item, index) {
                this.audioUrl = item.url
                if(this.audioIsPlay == index) {
                    this.audioIsPlay = null
                    this.$refs.audio.pause()
                }else {
                    this.audioIsPlay = index
                    setTimeout(() => {this.$refs.audio.play()},100)
                }
            },
            explainBtn() {
                if(this.explainState == '保存') {
                    this.explainState = '编辑'
                    this.evt.item._cfg.model.explain = this.explain
                    if(!this.explain.text && !this.explain.imgList.length && !this.explain.audioList.length && !this.explain.videoList.length) delete this.ev.item._cfg.model.explain
                }else{
                    this.explainState = '保存'
                }
            },
            signNode(val) {
                if (this.evt.item._cfg.model.fill == val.fill_color) {
                    this.evt.item._cfg.model.fill = '#fff'
                    this.evt.item._cfg.model.stroke = ''
                }
                else {
                    this.evt.item._cfg.model.fill = val.fill_color
                    this.evt.item._cfg.model.stroke = val.color
                }
                this.updateGraph()
                this.$refs.case_menu.style.left = '-150px'
            },
            addNodeResult() {
                if(this.menuObj.result === 'unable') return
                this.node = this.graph.addItem('node', {
                    x: this.graphType == 'automate' ? null : this.evt.item._cfg.model.x,
                    y: this.graphType == 'automate' ? null : this.evt.item._cfg.model.y,
                    id: String(new Date().getTime()),
                    anchorPoints: [
                        [0.5, 0], [0.5, 1]
                    ],
                    // case_type: '#bb91fe',
                    label: '请输入病种名称',
                    fill: '#F9E6DB',
                    stroke: '#E08049',
                    case_result: true,
                    case_id: '',
                    case_name: '',
                    size: [140, 40]
                });
                this.graph.addItem('edge', {
                    source: this.evt.item._cfg.id,
                    target: this.node._cfg.id,
                    shape: 'cubic',
                    style: {
                        stroke: '#ABB7C5',
                        endArrow: 'custom-arrow',
                        controlPoints: [0.1, 0.9]
                    }
                })
                this.updateGraph()
                this.$refs.case_menu.style.left = '-150px'
            },
            deleteNode() {
                if(this.menuObj.delete === 'unable') return
                this.graph.remove(this.evt.item)
                this.$refs.case_menu.style.left = '-150px';
                this.updateGraph()
            },
            deleteGatherNode() {
                if(this.menuObj.deleteGather === 'unable') return
                this.evt.item._cfg.model.add = false
                this.evt.item._cfg.model.children.splice(this.evt.target.get('childIndex'), 1)
                this.$refs.case_menu.style.left = '-150px';
                // this.updateGraph()
                this.graph.refreshItem(this.evt.item)
                this.graph.layout()
            },
            initGraph() {
                let that = this
                G6.registerBehavior('click-add-edge', {
                    getDefaultCfg() {
                        const self = this;
                        // The position where the mouse clicks
                        const point = { x: that.evt.x, y: that.evt.y };
                        const model = that.evt.item.getModel();
                        self.edge = that.graph.addItem('edge', {
                            source: model.id,
                            target: point,
                        });
                        self.addingEdge = true;
                    },
                    // Set the events and the corresponding responsing function for this behavior
                    getEvents() {
                        return {
                            'node:click': 'onClick', // The event is canvas:click, the responsing function is onClick
                            mousemove: 'onMousemove', // The event is mousemove, the responsing function is onMousemove
                            'edge:click': 'onEdgeClick', // The event is edge:click, the responsing function is onEdgeClick
                        };
                    },
                    // The responsing function for node:click defined in getEvents
                    onClick(ev) {
                        console.log(this, 'this2');
                        const self = this;
                        const node = ev.item;
                        const graph = self.graph;
                        // The position where the mouse clicks
                        const point = { x: ev.x, y: ev.y };
                        const model = node.getModel();
                        if (self.addingEdge && self.edge) {
                            graph.updateItem(self.edge, {
                                target: model.id,
                            });
                            self.edge = null;
                            self.addingEdge = false;
                            that.updateGraph()
                            this.graph.setMode('default')
                        } else {
                            // Add anew edge, the end node is the current node user clicks
                            self.edge = graph.addItem('edge', {
                                source: model.id,
                                target: point,
                            });
                            self.addingEdge = true;
                        }
                    },
                    // The responsing function for mousemove defined in getEvents
                    onMousemove(ev) {
                        const self = this;
                        // The current position the mouse clicks
                        const point = { x: ev.x, y: ev.y };
                        if (self.addingEdge && self.edge) {
                            // Update the end node to the current node the mouse clicks
                            self.graph.updateItem(self.edge, {
                                target: point,
                            });
                        }
                    },
                    onEdgeClick(ev) {
                        const self = this;
                        const currentEdge = ev.item;
                        if (self.addingEdge && self.edge === currentEdge) {
                            self.graph.removeItem(self.edge);
                            self.edge = null;
                            self.addingEdge = false;
                        }
                    },
                });
                //注册边
                G6.registerEdge('cubic', {
                    draw(cfg, group) {
                        const startPoint = cfg.startPoint;
                        const endPoint = cfg.endPoint;
                        const distance = {
                            x: startPoint.x == endPoint.x ? 0 : Math.abs(endPoint.x - startPoint.x) > 20 ? startPoint.x > endPoint.x ? -10 : 10 : 0.5 * (endPoint.x - startPoint.x),
                            y: startPoint.y == endPoint.y ? 0 : startPoint.y > endPoint.y ? -10 : 10,
                        }
                        const path = [
                            [
                                ['M', startPoint.x, startPoint.y],
                                ['L', startPoint.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y - (endPoint.y > startPoint.y ? 10 : -10)],
                                ['Q', startPoint.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y, startPoint.x + distance.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y],
                                ['L', endPoint.x - distance.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y],
                                ['Q', endPoint.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y, endPoint.x, 0.5 * (endPoint.y - startPoint.y) + startPoint.y + (endPoint.y > startPoint.y ? 10 : -10)],
                                ['L', endPoint.x, endPoint.y]
                            ],
                            [
                                ['M', startPoint.x, startPoint.y],
                                ['L', endPoint.x - distance.x, startPoint.y],
                                ['Q', endPoint.x, startPoint.y, endPoint.x, startPoint.y + (endPoint.y > startPoint.y ? 10 : -10)],
                                ['L', endPoint.x, endPoint.y]
                            ],
                        ]
                        const type = group.addShape('path', {
                            attrs: {
                                // stroke: '#ABB7C5',
                                stroke: cfg.style.stroke,
                                color: '#722ed1',
                                source: startPoint,
                                target: endPoint,
                                endArrow: {
                                    path: 'M -4,0 L 4,4 L 4,-4 Z',
                                    fill: '#ABB7C5',
                                    d: -4
                                },
                                // path: cfg.site === 'bottom' ? path[1] : path[0],
                                path: path[0],
                                lineWidth: cfg.style.lineWidth
                            }
                        });
                        if(cfg.text) {
                            group.addShape('text', {
                                attrs: {
                                    text: cfg.text,
                                    x: endPoint.x,
                                    y: endPoint.y / 2 + startPoint.y / 2,
                                    fill: (cfg.label == '添加内容' || cfg.label == '请输入病种名称') ? '#ABB7C5' : '#333',
                                    fontSize: 12,
                                    textAlign: 'center',
                                    textBaseline: 'middle',
                                    lineHeight: 18,
                                },
                                name: 'text-shape',
                            });
                        }
                        return type;
                    }
                })

                //矩形节点
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
                                fill: cfg.fill || '#fff',
                                radius: 5,
                                lineWidth: 0.7,
                            },
                            className: 'rectData'
                        })
                        if (cfg.label) {
                            group.addShape('text', {
                                attrs: {
                                    text: cfg.label,
                                    x: 0,
                                    y: 0,
                                    fill: (cfg.label === '添加内容' || cfg.label === '请输入病种名称') ? '#ABB7C5' : '#333',
                                    fontSize: 12,
                                    textAlign: 'center',
                                    textBaseline: 'middle',
                                    lineHeight: 18,
                                },
                                name: 'text-shape',
                            });
                        }
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
                        if(cfg.addNext) {
                            group.addShape('rect', {
                                attrs: {
                                    x: -width/2,
                                    y: 0,
                                    stroke: cfg.stroke || '#ABB7C5',
                                    width: 10,
                                    height: 10,
                                    fill: '#000',
                                    radius: 5,
                                    lineWidth: 0.7,
                                },
                            })
                        }
                        if (cfg.explain) {
                            const circle1 = group.addShape('circle', {
                                attrs: {
                                    x: cfg.topic ? -16 : 0,
                                    y: -24,
                                    r: 10,
                                    stroke: '#D45912',
                                    fill: '#D45912',
                                }
                            });
                            const text = group.addShape('text', {
                                attrs: {
                                    x: cfg.topic ? -16 : 0,
                                    y: -18,
                                    textAlign: 'center',
                                    text: "注",
                                    fill: '#fff',
                                    labelCfg: {
                                        position: "left: 100",
                                        style: {color: '#f00'}
                                    }
                                },
                            });
                        }
                        if (cfg.topic) {
                            const circle1 = group.addShape('circle', {
                                attrs: {
                                    x: cfg.explain ? 16 : 0,
                                    y: -24,
                                    r: 10,
                                    stroke: '#1963BA',
                                    fill: '#1963BA',
                                }
                            });
                            const text = group.addShape('text', {
                                attrs: {
                                    x: cfg.explain ? 16 : 0,
                                    y: -18,
                                    textAlign: 'center',
                                    text: "题",
                                    fill: '#fff',
                                    labelCfg: {
                                        position: "left: 100",
                                        style: {color: '#f00'}
                                    }
                                },
                            });
                        }
                        return rect;
                    },
                });

                //集合节点
                G6.registerNode('gather', {
                    draw(cfg, group) {
                        cfg.size = [cfg.children.length * 140 , 40];
                        const size = [cfg.children.length * 140 , 40];
                        const width = size[0];
                        const height = size[1];
                        let rect = {}
                        if (cfg.pack) {
                            rect = group.addShape('rect', {
                                attrs: {
                                    x: -60,
                                    y: -height / 2,
                                    stroke: '#4098ff',
                                    width: 120,
                                    height: height + 20,
                                    fill: cfg.fill || '#fff',
                                    radius: 5,
                                    lineWidth: 0.7,
                                }
                            })
                            group.addShape('text', {
                                attrs: {
                                    text: '集合',
                                    x: 0,
                                    y: 10,
                                    fill: '#333',
                                    stroke: '#ccc',
                                    fontSize: 12,
                                    textAlign: 'center',
                                    textBaseline: 'middle',
                                    lineHeight: 18,
                                },
                                name: 'text-shape',
                            });
                        } else {
                            rect = group.addShape('rect', {
                                attrs: {
                                    x: -width / 2,
                                    y: -height / 2,
                                    stroke: '#4098ff',
                                    fill: '#fff',
                                    width: cfg.add ? cfg.children.length * 140 + 50 : cfg.children.length * 140,
                                    height: height + 20,
                                    radius: 5,
                                    lineWidth: 0.7,
                                },
                            })
                            //遍历children中的节点
                            cfg.children.forEach((item, index) => {
                                let child = group.addShape('rect', {
                                    attrs: {
                                        x: 140 * index - width / 2 + 10,
                                        y: -10,
                                        stroke: cfg.stroke || '#ABB7C5',
                                        width: 120,
                                        height: height,
                                        fill: cfg.fill || '#fff',
                                        radius: 5,
                                        lineWidth: 0.7,
                                        linkPoints: cfg.item ? cfg.item._cfg.model.linkPoints : {},
                                    },
                                    className: 'child',
                                    childIndex: index
                                })
                                group.addShape('text', {
                                    attrs: {
                                        text: item.label,
                                        x: 140 * index - width / 2 + 70,
                                        y: 10,
                                        fill: item.label === '添加内容' ? '#ABB7C5' : '#333',
                                        fontSize: 12,
                                        textAlign: 'center',
                                        textBaseline: 'middle',
                                        lineHeight: 18,
                                    },
                                    className: 'child',
                                    childIndex: index
                                });
                            })
                            if(cfg.add) {
                                // 添加节点
                                group.addShape('rect', {
                                    attrs: {
                                        x: cfg.children.length * 140 - width / 2 + 10,
                                        y: -5,
                                        width: 30,
                                        height: 30,
                                        stroke: '#ABB7C5',
                                        fill: '#fff',
                                        radius: 5,
                                        cursor: 'pointer',
                                    },
                                    className: 'add-group'
                                })
                                group.addShape('text', {
                                    attrs: {
                                        x: cfg.children.length * 140 - width / 2 + 25,
                                        y: 5,
                                        fontSize: 40,
                                        textAlign: 'center',
                                        textBaseline: 'middle',
                                        fill: '#333',
                                        text: "+",
                                        fontWeight: 200,
                                        cursor: 'pointer',
                                    },
                                    className: 'add-group'
                                })
                            }
                        }
                        //收起节点
                        group.addShape('circle', {
                            attrs: {
                                x: cfg.pack ? 0 : cfg.children.length * 70 - width / 2,
                                y: -height / 2 - 5,
                                r: 10,
                                fill: '#fff',
                                stroke: '#333',
                                cursor: 'pointer',
                            },
                            className: 'packUp'
                        })
                        group.addShape('text', {
                            attrs: {
                                x:  cfg.pack ? 0 : cfg.children.length * 70 - width / 2,
                                y: -height / 2 - 7,
                                stroke: '#333',
                                fontSize: 12,
                                textAlign: 'center',
                                textBaseline: 'middle',
                                text: cfg.pack ? '+' : '-',
                                lineHeight: 20,
                                cursor: 'pointer',
                            },
                            className: 'packUp'

                        })
                        return rect;
                    },
                })

                //判断节点
                G6.registerNode('opinion', {
                    draw(cfg, group) {
                        const size = cfg.size || [40, 40];
                        const width = size[0];
                        const height = size[1];
                        const shape = group.addShape('path', {
                            attrs: {
                                path: [
                                    ['M', -width / 4, 0 - height / 2], // 上左侧顶点
                                    ['L', width / 4, 0 - height / 2], // 上右侧顶点
                                    ['L', width / 2, 0], // 右侧顶点
                                    ['L', width / 4, height / 2], // 下右部顶点
                                    ['L', -width / 4, height / 2], // 下左部顶点
                                    ['L', -width / 2, 0], // 左侧顶点
                                    ['Z'], // 封闭
                                ],
                                stroke: "#ABB7C5",
                                fill: cfg.fill || '#fff',
                            }
                        })
                        group.addShape('text', {
                            attrs: {
                                text: cfg.label,
                                x: 0,
                                y: 0,
                                fill: (cfg.label === '添加内容' || cfg.label === '请输入病种名称') ? '#ABB7C5' : '#333',
                                fontSize: 12,
                                textAlign: 'center',
                                textBaseline: 'middle',
                                lineHeight: 18,
                            },
                            name: 'text-shape',
                        });
                        shape.set('className', 'opinionData')
                        return shape
                    }
                })

                const nodeStyle = document.getElementById("mountNode").getBoundingClientRect()
                this.graph = new G6.Graph({
                    container: 'mountNode',
                    width: nodeStyle.width,
                    height: nodeStyle.height,
                    // renderer: 'svg',
                    animate: true,
                    defaultNode: {
                        type: 'rect',
                        size: [120, 40],
                        fill: '#fff',
                        anchorPoints: [
                            [0.5, 0], [0.5, 1]
                        ]
                    },
                    defaultEdge: {
                        type: 'cubic',
                        style: {
                            stroke: '#ABB7C5',
                        },
                    },
                    modes: {
                        default: ['click-select', 'drag-canvas', 'activate-relations', 'drag-node'],
                        lineEdge: ['click-add-edge']
                    },
                    layout: {
                        type: 'dagre',
                        rankdir: 'TB',           // 可选，默认为图的中心
                        // nodesep: 34,             // 可选
                        ranksep: 36,             // 可选
                        controlPoints: true,      // 可选
                        nodeSize: [100, 0],
                        nodesepFunc: (d) => {
                            if (d.type === "gather" && !d.pack) {
                                return d.size[0]/2 - 60 + 34;
                            }
                            return 34;
                        }
                    },
                });
                this.graph.read(this.data)
                this.graph.render()

                this.graph.on('contextmenu', evt => {
                    evt.preventDefault();
                    evt.stopPropagation();
                })
                //全局点击事件
                this.graph.on('click', evt => {
                    this.$emit('click', evt)
                })
                //右击节点事件
                this.graph.on('node:contextmenu', evt => {
                    this.$emit('node-contextmenu', evt)
                    this.evt = evt
                    const point = this.graph.getCanvasByPoint(evt.x, evt.y);
                    this.$refs.case_menu.style.left = `${point.x}px`;
                    this.$refs.case_menu.style.top = point.y > (document.getElementById("mountNode").offsetHeight / 2) ? `${point.y - document.querySelector('.case-menu').offsetHeight}px` : `${point.y}px`;
                })
                //右击路径事件
                this.graph.on('edge:contextmenu', evt => {
                    this.$emit('edge-contextmenu', evt)
                    this.evt = evt
                    const point = this.graph.getCanvasByPoint(evt.x, evt.y);
                    this.$refs.case_menu.style.left = `${point.x}px`;
                    this.$refs.case_menu.style.top = `${point.y}px`;
                })
                //离开节点事件
                this.graph.on('node:mouseleave', (evt) => {
                    const {item} = evt;
                    const model = item.getModel()
                    const shape = evt.target;
                    if(model.type == 'gather') {
                        model.add = false
                        this.graph.refreshItem(item)
                    }
                    this.$refs.case_menu.style.left = '-150px';
                });
                //离开路径事件
                this.graph.on('edge:mouseleave', (evt) => {
                    const {item} = evt;
                    const shape = evt.target;
                    this.$refs.case_menu.style.left = '-150px';
                });
                //进入节点事件
                this.graph.on('node:mouseenter', evt => {
                    this.$emit('node-mouseenter', evt)
                })
                // 节点点击事件
                this.graph.on('node:click', (evt) => {
                    this.$emit('node-click',evt)
                });
                //双击事件
                this.graph.on('dblclick', evt => {
                    this.$emit('dblclick', evt)
                })
            },
            updateGraph() {
                const point = this.graph.getPointByCanvas(0, 0)
                const zoom = this.graph.getZoom()
                this.data = this.graph.save()
                this.graph.clear()
                this.graph.read(this.data)
                this.graph.translate(-point.x, -point.y)
                this.graph.zoom(zoom)
            },
        },
    }
</script>

<style scoped lang="less">
    @import "style";
</style>
