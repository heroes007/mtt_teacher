<template>
    <div style="height: 100%;">
        <inquiryModal :is-show="show_inquiry" @cancel-inquiry="cancelInquiry" :outline="outline" :ev="ev" @inquiryDone="inquiryDone"/>
        <physicalModal :is-show="show_physical" @cancel-physical="cancelPhysical" :outline="outline" :ev="ev" :file-dir="case_data.file_dir" @physicalDone="physicalDone"/>
        <diagnoseModal :is-show="show_diagnose" @cancel-diagnose="cancelDiagnose" :outline="outline" :ev="ev" :file-dir="case_data.file_dir" @diagnoseDone="diagnoseDone"/>
        <div class="case-header">
            <div class="header-box">
                <div class="case-header-back" @click="handleBack">
                    <img src="../../../../assets/img/case/case_back.png" alt="">
                    <div class="back-font">返回</div>
                </div>
                <div class="case-header-btn">
                    <img @click="hugeZoom" class="header-btn-img" src="../../../../assets/img/case/case_huge.png" alt="">
                    <img @click="littleZoom" class="header-btn-img" src="../../../../assets/img/case/case_little.png" alt="">
                    <Select v-model="outline_data" @on-change="selectChange">
                        <Option v-for="(item, index) in outline_list" :value="index" :key="index">{{ item.symptom }}</Option>
                    </Select>
                    <div class="header-btn-check" @click="checkCase">查看出题路径</div>
                </div>
            </div>
            <div class="case-header-type">
                <div v-for="(item, index) in case_type" :key="index" class="type-box">
                    <div class="type-box-color" :style="{backgroundColor: item.color}"></div>
                    <div class="type-box-font">{{item.title}}</div>
                </div>
                <Button @click="handleSubmit" type="primary" class="save-btn">保存</Button>
            </div>
        </div>
        <div style="height: calc(100% - 50px)">
            <Row style="height: 100%;">
                <Col style="height: 100%;" span="19" id="mountNode" class="mountNode"></Col>
                <Col span="5" class="content-right">
                    <div class="case-title">
                        <span>依据</span>
                        <div class="case-line"></div>
                    </div>
                    <div class="case-detail">详细病史</div>
                    <div v-if="outline_list[outline_data] && outline_list[outline_data].basis" class="case-box">
                        <div v-for="(item, index) in showGistList(JSON.parse(outline_list[outline_data].basis))" :key="index">
                            <div v-if="item.type == 'inquiry'" class="case-detail-inquiry">
                                <div class="case-detail-inquiry-title">问诊</div>
                                <div class="case-detail-inquiry-content">{{item.ask}}{{item.answer}}</div>
                            </div>
                            <div v-if="item.type == 'physical'" class="case-detail-physical">
                                <div class="case-detail-physical-title">
                                    <div class="physical-title-name">体检</div>
                                    <div class="physical-title-content">{{item.first_name}} > {{item.second_name}}</div>
                                </div>
                                <div class="case-detail-physical-content">{{item.third_name}}</div>
                            </div>
                            <div v-if="item.type == 'diagnose'" class="case-detail-inquiry">
                                <div class="case-detail-inquiry-title" style="background-color:#F6B242;">辅助</div>
                                <div class="case-detail-inquiry-content">{{item.first_name}} > {{item.second_name}}
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <div ref="case_menu" style="display: none;">
                <div ref="case_menu_item" class="case-menu">
                    <div :class="is_init || case_result ? 'case-menu-item-disable' : 'case-menu-item'"
                         @click="handleInquiry">添加问诊
                    </div>
                    <div :class="is_init || case_result ? 'case-menu-item-disable' : 'case-menu-item'"
                         @click="handlePhysical">添加体检
                    </div>
                    <div :class="is_init || case_result ? 'case-menu-item-disable' : 'case-menu-item'"
                         @click="handleDiagnose">添加辅检
                    </div>
                    <div :class="case_result ? 'case-menu-item' : 'case-menu-item-disable'">
                        <span>标记诊断</span>
                        <span class="case-menu-item-menu">></span>
                        <div class="case-menu-item-sign">
                            <div @click="signNode(item)" v-for="(item, index) in diagnosis_type" :key="index"
                                 class="item-sign-box">
                                <div class="item-sign-title">{{item.title}}</div>
                                <Icon type="md-checkmark"
                                      v-if="ev && ev.item._cfg.model.case_type_name == item.title.slice(0, 2)"
                                      style="margin-left: 16px;" color="#474C63"/>
                                <div v-else style="width: 40px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import G6 from '@antv/g6'
    import postData from '../../../../api/postData'
    import inquiryModal from './modal/inquiry'
    import physicalModal from './modal/physical'
    import diagnoseModal from './modal/diagnose'

    export default {
        components: {inquiryModal, physicalModal, diagnoseModal},
        data() {
            return {
                data: {
                    nodes: [{
                        id: '1', x: 200, y: 100, label: '新建病症',
                        list: [{name: 'inquiry', num: 1}, {name: 'diagnose', num: 2}, {name: 'physical', num: 3}],
                        anchorPoints: [[0.5, 0], [0.5, 1]], init: true,
                        degree: 2
                    }],
                },
                img_opacity: 0.3,
                diagnosis_type: [
                    {title: '主要诊断', id: 'PrincipalDiagnosis'},
                    {title: '次要诊断', id: 'SecondaryDiagnosis'},
                    {title: '鉴别诊断', id: 'DifferentialDiagnosis'},
                ],
                case_type: [
                    {color: '#A1CDFF', title: '问诊', short_title: '问诊'},
                    {color: '#60CFD7', title: '体格检查', short_title: '体检'},
                    {color: '#FFC058', title: '辅助检查', short_title: '辅检'},
                    {color: '#BB91FE', title: '诊断', short_title: '诊断'},
                ],
                diagnose_type: [
                    {id: 1, title: '主要诊断'},
                    {id: 2, title: '次要诊断'},
                    {id: 3, title: '鉴别诊断'},
                ],
                outline_data: 0,
                outline_list: [],
                outline: {},
                show_inquiry: false,
                show_physical: false,
                show_diagnose: false,
                is_init: false,
                case_result: false,
                ev: '',
                case_data: {},
                is_have_main: false
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
            handleBack() {
                this.$router.go(-1)
            },
            handleSubmit() {
                // console.log(this.graph.save());
                postData('case/effectCase', {case_id: this.case_data.id}).then(res => {
                    if (res.res_code == 1) {
                        this.$Message.success('保存成功')
                        this.$router.push('case-warehouse')
                    }
                })
            },
            showGistList(val) {
                let list = [], list2 = []
                val.forEach(item => {
                    list = [...list, ...item.content]
                })
                list.forEach(item => {
                    let isInclue = false
                    list2.forEach(item1 => {
                        if(item.id === item1.id && item.type === item1.type) isInclue = true
                    })
                    if(!isInclue) list2.push(item)
                })
                return list
            },
            hugeZoom() {
                this.graph.zoom(1.2)
            },
            littleZoom() {
                this.graph.zoom(0.8)
            },
            modifyCase(basis) {
                basis = basis ? basis : this.outline_list[this.outline_data].basis ? JSON.parse(this.outline_list[this.outline_data].basis) : []
                let data = {
                    id: this.outline.id,
                    outline: JSON.stringify(this.graph.save()),
                    basis: JSON.stringify(basis),
                }
                postData('case/modifyCaseOutline', data).then(res => {
                    if (res.res_code == 1) {

                    }
                })
            },
            inquiryDone(val) {
                let basis = this.outline_list[this.outline_data].basis ? JSON.parse(this.outline_list[this.outline_data].basis) : []
                basis.map(item => {
                    if (val.case_diagnose_ids.indexOf(item.case_diagnose_id) != -1) {
                        item.content.push({
                            type: 'inquiry',
                            ask: val.question,
                            answer: val.answer,
                            node_id: this.ev.item._cfg.id,
                            id: val.id
                        })
                    }
                })
                this.outline_list[this.outline_data].basis = JSON.stringify(basis)
                if (this.ev.item._cfg.model.list) {
                    let isTure = false
                    this.ev.item._cfg.model.list.map(item => {
                        if (item.id == this.ev.item._cfg.id) {
                            item.inquiry += 1
                            isTure = true
                        }
                    })
                    if (!isTure) this.ev.item._cfg.model.list.push({
                        id: this.ev.item._cfg.id,
                        inquiry: 1,
                        physical: 0,
                        diagnose: 0
                    })
                } else {
                    this.ev.item._cfg.model.list = [{
                        id: this.ev.item._cfg.id,
                        inquiry: 1,
                        physical: 0,
                        diagnose: 0
                    }]
                }
                this.modifyCase(basis)
                this.graph.refresh()
            },
            physicalDone(val) {
                let basis = this.outline_list[this.outline_data].basis ? JSON.parse(this.outline_list[this.outline_data].basis) : []
                basis.map(item => {
                    if (val.case_diagnose_ids.indexOf(item.case_diagnose_id) != -1) {
                        item.content.push({
                            type: 'physical',
                            first_name: val.first_name,
                            second_name: val.second_name,
                            third_name: val.third_name,
                            result_text: val.result_text,
                            node_id: this.ev.item._cfg.id
                        })
                    }
                })
                this.outline_list[this.outline_data].basis = JSON.stringify(basis)
                if (this.ev.item._cfg.model.list) {
                    let isTure = false
                    this.ev.item._cfg.model.list.map(item => {
                        if (item.id == this.ev.item._cfg.id) {
                            item.physical += 1
                            isTure = true
                        }
                    })
                    if (!isTure) this.ev.item._cfg.model.list.push({
                        id: this.ev.item._cfg.id,
                        inquiry: 0,
                        physical: 1,
                        diagnose: 0
                    })
                } else {
                    this.ev.item._cfg.model.list = [{
                        id: this.ev.item._cfg.id,
                        inquiry: 0,
                        physical: 1,
                        diagnose: 0
                    }]
                }
                this.modifyCase(basis)
                this.graph.refresh()
            },
            diagnoseDone(val) {
                let basis = this.outline_list[this.outline_data].basis ? JSON.parse(this.outline_list[this.outline_data].basis) : []
                basis.map(item => {
                    if (val.case_diagnose_ids.indexOf(item.case_diagnose_id) != -1) {
                        item.content.push({
                            type: 'diagnose',
                            first_name: val.first_name,
                            second_name: val.second_name,
                            diagnose_type: val.type,
                            reports: val.reports,
                            file: val.file,
                            node_id: this.ev.item._cfg.id
                        })
                    }
                })
                this.outline_list[this.outline_data].basis = JSON.stringify(basis)
                if (this.ev.item._cfg.model.list) {
                    let isTure = false
                    this.ev.item._cfg.model.list.map(item => {
                        if (item.id == this.ev.item._cfg.id) {
                            item.diagnose += 1
                            isTure = true
                        }
                    })
                    if (!isTure) this.ev.item._cfg.model.list.push({
                        id: this.ev.item._cfg.id,
                        inquiry: 0,
                        physical: 0,
                        diagnose: 1
                    })
                } else {
                    this.ev.item._cfg.model.list = [{
                        id: this.ev.item._cfg.id,
                        inquiry: 0,
                        physical: 0,
                        diagnose: 1
                    }]
                }
                this.modifyCase(basis)
                this.graph.refresh()
            },
            checkNodeColor(val, color) {
                val.getInEdges().forEach(item => {
                    item._cfg.model.stroke = color
                    let node = item.getSource()
                    if (node.getInEdges().length) this.checkNodeColor(node, color)
                })
                this.graph.refresh()
            },
            copsCase() {
                let data = {
                    case_id: parseInt(this.$route.query.id),
                    gender: 'Common',
                    age_state: 0,
                }
                postData('case/copyTalks', data).then(res => {
                    console.log(res);
                })
                postData('case/copyPhysical', data).then(res => {
                    console.log(res);
                })
                postData('case/copyAssist', data).then(res => {
                    console.log(res);
                })
            },
            handleInquiry() {
                // this.copsCase()
                this.handleInspects('show_inquiry')
            },
            handlePhysical() {
                this.handleInspects('show_physical')
            },
            handleDiagnose() {
                this.handleInspects('show_diagnose')
            },
            handleInspects(val) {
                if (!this.is_init && !this.case_result) {
                    if (this.ev.item._cfg.model.case_ids && this.ev.item._cfg.model.case_ids.length) {
                        this[val] = true
                        this.$refs.case_menu.style.display = 'none'
                    } else this.$Message.info('请先添加诊断')
                }
            },
            cancelInquiry(val) {
                this.show_inquiry = val
            },
            cancelPhysical(val) {
                this.show_physical = val
            },
            cancelDiagnose(val) {
                this.show_diagnose = val
            },
            selectChange(val) {
                this.data = this.outline_list[val].outline ? JSON.parse(this.outline_list[val].outline) : ''
                this.outline = this.outline_list[val]
                this.graph.data(this.data);
                this.graph.render();
                this.opinionData(this.data)
            },
            signNode(val) {
                if (this.is_have_main && val.title == '主要诊断' && this.ev.item._cfg.model.case_type_name !== val.title.slice(0, 2)) {
                    this.$Message.info('已存在主要诊断')
                } else {
                    let basis = this.outline_list[this.outline_data].basis ? JSON.parse(this.outline_list[this.outline_data].basis) : []
                    if (this.ev.item._cfg.model.case_type_name == val.title.slice(0, 2)) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: '<p>删除后相关联的依据也会同时删除</p>',
                            onOk: () => {
                                postData('case/removeDiagnose', {id: this.ev.item._cfg.model.case_diagnose_id}).then(res => {
                                    if (res.res_code == 1) {
                                        if(val.title == '主要诊断') this.is_have_main = false
                                        basis.forEach((item, index) => {
                                            if (item.id == this.ev.item._cfg.model.case_id) basis.splice(index, 1)
                                        })
                                        this.outline_list[this.outline_data].basis = JSON.stringify(basis)
                                        this.ev.item._cfg.model.case_type_name = ''
                                        this.deleteNode(this.ev.item)
                                        this.graph.refresh()
                                        this.modifyCase()
                                    }
                                })
                                this.ev.item.getInEdges().forEach(item => {
                                    let node = item.getSource()
                                    console.log(node);
                                    // if (node.getInEdges().length) this.checkNodeColor(node, color)
                                })
                            },
                        });
                        this.$refs.case_menu.style.display = 'none'
                    } else if (!this.ev.item._cfg.model.case_type_name) {
                        let data = {
                            case_id: this.outline.case_id,
                            type: val.id,
                            name: this.ev.item._cfg.model.case_name,
                            icd10_id: this.ev.item._cfg.model.case_id,
                        }
                        postData('case/addDiagnose', data).then(res => {
                            if (res.res_code == 1) {
                                basis.push({id: data.icd10_id, case_diagnose_id: res.data.case_diagnose_id, name: data.name, content: [], type: data.type, create_time: new  Date()})
                                if(val.title == '主要诊断') this.is_have_main = true
                                this.ev.item._cfg.model.case_type_name = val.title.slice(0, 2)
                                this.ev.item._cfg.model.case_diagnose_id = res.data.case_diagnose_id
                                this.outline_list[this.outline_data].basis = JSON.stringify(basis)
                                this.checkNode(this.ev.item)
                                this.graph.refresh()
                                this.$refs.case_menu.style.display = 'none'
                                this.modifyCase(basis)
                            }
                        })
                    } else {
                        let data = {
                            case_id: this.outline.case_id,
                            type: val.id,
                            name: this.ev.item._cfg.model.case_name,
                            icd10_id: this.ev.item._cfg.model.case_id,
                            id: this.ev.item._cfg.model.case_diagnose_id,
                        }
                        postData('case/modifyDiagnose', data).then(res => {
                            if (res.res_code == 1) {
                                if(this.ev.item._cfg.model.case_type_name == '主要') this.is_have_main = false
                                if(val.title == '主要诊断') this.is_have_main = true
                                basis.map(item => {
                                    if (item.id == data.icd10_id) {item.type = data.type}
                                })
                                this.outline_list[this.outline_data].basis = JSON.stringify(basis)
                                this.ev.item._cfg.model.case_type_name = val.title.slice(0, 2)
                                this.graph.refresh()
                                this.$refs.case_menu.style.display = 'none'
                                this.modifyCase(basis)
                            }
                        })
                    }
                }
            },
            checkNode(val) {
                val.getInEdges().forEach(item => {
                    let node = item.getSource()
                    if (!node._cfg.model.case_ids) node._cfg.model.case_ids = [this.ev.item._cfg.model.case_diagnose_id]
                    else node._cfg.model.case_ids.push(this.ev.item._cfg.model.case_diagnose_id)
                    if (node.getInEdges().length) this.checkNode(node)
                })
            },
            deleteNode(val) {
                val.getInEdges().forEach(item => {
                    let node = item.getSource()
                    let num = node._cfg.model.case_ids.findIndex((num) => {
                        return num == this.ev.item._cfg.model.case_diagnose_id
                    })
                    node._cfg.model.case_ids.splice(num, 1)
                    if (node.getInEdges().length) this.checkNode(node)
                })
            },
            checkCase() {
                this.$router.push({path: 'case-check', query: {id: this.$route.query.id}})
            },
            getList() {
                postData('case/getCaseDetailAndOutlines', {id: parseInt(this.$route.query.id)}).then(res => {
                    if (res.res_code == 1) {
                        this.case_data = res.data
                        this.outline_list = res.data.outlines
                        this.outline = this.outline_list[0]
                        this.data = JSON.parse(res.data.outlines[0].outline)
                        this.graph.data(this.data);
                        this.graph.render();
                        if (this.outline_data) this.selectChange(this.outline_data)
                        this.opinionData(this.data)
                    }
                })
            },
            opinionData(val) {
                if (val.nodes && val.nodes.length > 0) {
                    this.is_have_main = false
                    val.nodes.forEach(item => {
                        if (item.case_type_name == '主要') this.is_have_main = true
                    })
                }
            },
            initGraph() {
                //注册边
                G6.registerEdge('cubic', {
                    draw(cfg, group) {
                        const startPoint = cfg.startPoint;
                        const endPoint = cfg.endPoint;
                        const stroke = cfg.stroke ? cfg.stroke : '#333';
                        const shape = group.addShape('path', {
                            attrs: {
                                stroke: stroke,
                                path: [
                                    ['M', startPoint.x, startPoint.y],
                                    ['L', startPoint.x, endPoint.y / 3 + 2 / 3 * startPoint.y],
                                    ['L', endPoint.x, endPoint.y / 3 + 2 / 3 * startPoint.y],
                                    ['L', endPoint.x, endPoint.y]
                                ]
                            }
                        });
                        return shape;
                    }
                })
                G6.registerNode('rect', {
                    draw(cfg, group) {
                        const size = cfg.size || [40, 40];
                        const width = size[0];
                        const height = size[1];
                        const rect = group.addShape('rect', {
                            attrs: {
                                x: -width / 2,
                                y: -height / 2,
                                stroke: '#000',
                                width: width,
                                height: height,
                                fill: cfg.fill,
                                radius: 5,
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
                                fill: '#474C63',
                                fontSize: 16
                            }
                        })
                        if (cfg.init) {
                            group.addShape('rect', {
                                attrs: {
                                    x: -width / 2 + 1,
                                    y: -height / 2 + 1,
                                    width: width / 40,
                                    height: height - 2,
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
                                    y: -height / 2 + 1,
                                    width: 5,
                                    height: height - 2,
                                    fill: cfg.case_type,
                                    stroke: cfg.case_type,
                                    radius: [5, 0, 0, 5],
                                }
                            })
                        }
                        if (cfg.list) {
                            if (cfg.list && cfg.list.length) {
                                let list = [], data = {inquiry: 0, physical: 0, diagnose: 0}
                                cfg.list.forEach(item => {
                                    data.inquiry += item.inquiry
                                    data.physical += item.physical
                                    data.diagnose += item.diagnose
                                })
                                if(data.inquiry) list.push({name: 'inquiry', num: data.inquiry})
                                if(data.physical) list.push({name: 'physical', num: data.physical})
                                if(data.diagnose) list.push({name: 'diagnose', num: data.diagnose})
                                list.forEach((item, index) => {
                                    let color = item.name == 'inquiry' ? '#80B2EC' : item.name == 'physical' ? '#52C9D1' : '#F6B242'
                                    const circle1 = group.addShape('circle', {
                                        attrs: {
                                            x: width / 2 - (26 * index) - 20,
                                            y: -24,
                                            r: 10,
                                            stroke: color,
                                            fill: color,
                                        }
                                    });
                                    const text = group.addShape('text', {
                                        attrs: {
                                            x: width / 2 - (26 * index) - 20,
                                            y: -18,
                                            textAlign: 'center',
                                            text: item.num,
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
                        if (cfg.case_type_name) {
                            group.addShape('rect', {
                                attrs: {
                                    x: width / 2 - 50,
                                    y: -30,
                                    width: 40,
                                    height: 20,
                                    fill: '#BB91FE',
                                    stroke: '#BB91FE',
                                    radius: 5,
                                }
                            })
                            const text = group.addShape('text', {
                                attrs: {
                                    x: width / 2 - 30,
                                    y: -14,
                                    textAlign: 'center',
                                    text: cfg.case_type_name,
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
                            x: this.ev.x ? this.ev.x : ev.x,
                            y: this.ev.y ? this.ev.y : ev.y
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

                this.graph = new G6.Graph({
                    container: 'mountNode',
                    width: this.canvas_width,
                    height: this.canvas_height,
                    defaultNode: {
                        shape: 'rect',
                        size: [200, 40],
                        fill: '#fff'
                    },
                    defaultEdge: {
                        shape: 'polyline'
                    },
                    modes: {
                        default: ['click-select', 'drag-canvas', 'activate-relations'],
                        addNode: ['click-add-node', 'click-select', 'drag-canvas', 'activate-relations'],
                        addEdge: ['click-add-edge', 'click-select', 'drag-canvas', 'activate-relations'],
                    },
                });
                this.graph.data(this.data);
                this.graph.render();

                //右击node节点事件
                this.graph.on('node:contextmenu', ev => {
                    if (ev.item) {
                        this.ev = ev
                        let clientX = document.querySelector('#mountNode').clientWidth
                        let clientY = document.querySelector('#mountNode').clientHeight
                        const point = this.graph.getPointByClient(ev.clientX, ev.clientY);
                        this.$refs.case_menu.style.display = 'block'
                        this.$refs.case_menu_item.style.top = point.y + 220 < clientY ? ev.clientY + 'px' : ev.clientY - 200 + 'px'
                        this.$refs.case_menu_item.style.left = point.x + 150 < clientX ? ev.clientX + 'px' : ev.clientX - 120 + 'px'
                        if (ev.item._cfg.model.init) this.is_init = true
                        else this.is_init = false
                        if (ev.item._cfg.model.case_result) this.case_result = true
                        else this.case_result = false
                    }
                })

                //全局点击事件
                this.graph.on('click', ev => {
                    this.$refs.case_menu.style.display = 'none'
                })

                //点击edge事件
                this.graph.on('edge:click', ev => {
                    if (this.edge) this.graph.removeItem(this.edge)
                })

                //点击node事件
                this.graph.on('node:click', ev => {
                    if (this.edge) {
                        this.graph.update(this.edge, {
                            target: ev.item
                        })
                        this.edge = null
                    }
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

                // 鼠标mouseenter事件
                // this.graph.on('node:mouseenter', ev => {
                //     if (ev.item && ev.item._cfg.model.case_result) {
                //         this.checkNodeColor(ev.item, '#bb91fe')
                //     }
                // })

                // 鼠标mouseout事件
                this.graph.on('node:mouseleave', ev => {
                    if (ev.item && ev.item._cfg.model.case_result) {
                        this.checkNodeColor(ev.item, '#000')
                    }
                })

            }
        },
        mounted() {
            this.getList()
            this.initGraph()
        }
    }
</script>

<style scoped lang="less">
    .case-content-font {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 1px;
        text-align: left;
    }

    .case-header {
        height: 50px;
        background: #686F92;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 1000px;

        .header-box {
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
            font-size: 18px
        }

        .case-header-btn {
            margin-left: 30px;
            display: flex;
            align-items: center;

            .header-btn-img {
                margin-right: 16px;
                cursor: pointer;
            }

            .header-btn-check {
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #FFFFFF;
                letter-spacing: 0;
                text-align: center;
                margin-left: 30px;
                text-decoration: underline;
                cursor: pointer;

                &:hover {
                    color: #4098ff;
                }
            }

            /deep/ .ivu-select, /deep/ .ivu-select-selection, /deep/ .ivu-select-selected-value, /deep/ .ivu-select-placeholder {
                width: 250px;
                height: 30px;
                background: #474C63;
                border-radius: 15px;
                border: none;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #FFFFFF;
                letter-spacing: 1.05px;
                line-height: 30px;
            }

            /deep/ .ivu-icon {
                color: #fff;
            }
        }

        .case-header-type {
            display: flex;
            /*position: absolute;*/
            margin-right: 50px;
            align-items: center;

            .type-box {
                display: flex;
                align-items: center;

                .type-box-color {
                    width: 20px;
                    height: 10px;
                    border-radius: 2px;
                    margin: 0 10px 0 15px
                }

                .type-box-font {
                    color: #fff;
                    font-size: 16px
                }
            }

            .save-btn {
                width: 133px;
                height: 34px;
                margin-left: 30px;
            }
        }
    }

    .mountNode {
        height: 100%;
        overflow: hidden;
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
                right: 10px;
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
                width: 160px;
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
                    text-align: center;
                    width: 100%;
                }

                .item-sign-box:hover {
                    .item-sign-title {
                        color: #4098ff;
                    }
                }
            }
        }

        .case-menu-item-disable {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: no-drop;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #C8CCDD;

            .case-menu-item-sign {
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

    .content-right {
        height: 100%;
        box-shadow: 2px 0 10px 0 rgba(0, 0, 0, 0.10);

        .case-title {
            margin-top: 20px;
            font-family: PingFangSC-Regular;
            font-size: 24px;
            color: #A4A9C0;
            letter-spacing: 1.4px;
            text-align: center;
            position: relative;
        }

        .case-line {
            opacity: 0.1;
            background: #4098FF;
            width: 108px;
            height: 8px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 22px;
        }

        .case-detail {
            margin-top: 10px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #686F92;
            margin-bottom: 30px;
        }

        .case-box {
            height: calc(100% - 120px);
            overflow-y: auto;
        }

        .case-detail-inquiry {
            display: flex;
            margin-bottom: 15px;
            /*justify-content: space-between;*/

            .case-detail-inquiry-title {
                background: #80B2EC;
                border-radius: 15px;
                width: 45px;
                height: 20px;
                margin: 0 15px;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #FFFFFF;
            }

            .case-detail-inquiry-content {
                width: calc(100% - 45px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .case-content-font
            }
        }

        .case-detail-physical {
            margin-bottom: 15px;

            .case-detail-physical-title {
                display: flex;

                .physical-title-name {
                    background: #52C9D1;
                    border-radius: 15px;
                    width: 45px;
                    height: 20px;
                    margin: 0 15px;
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #FFFFFF;
                }

                .physical-title-content {
                    width: calc(100% - 45px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: left;
                    .case-content-font
                }
            }

            .case-detail-physical-content {
                text-align: left;
                margin-left: 70px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .case-content-font
            }
        }
    }
</style>
