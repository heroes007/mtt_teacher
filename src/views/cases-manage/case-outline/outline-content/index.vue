<template>
    <div style="height: 100%;">
        <div class="case-header">
            <div class="case-header-left">
                <div class="case-header-back" @click="handleBack">
                    <img src="../../../../assets/img/case/case_back.png" alt="">
                    <div class="back-font">返回</div>
                </div>
                <div class="case-header-title">绘制提纲</div>
                <div class="case-header-btn">
<!--                    <img class="header-btn-img" :style="{opacity: img_opacity}" src="../../../../assets/img/case/case_behind.png" alt="">-->
<!--                    <img class="header-btn-img" :style="{opacity: img_opacity}" src="../../../../assets/img/case/case_front.png" alt="">-->
                    <img @click="hugeZoom" class="header-btn-img" src="../../../../assets/img/case/case_huge.png" alt="">
                    <img @click="littleZoom" class="header-btn-img" src="../../../../assets/img/case/case_little.png" alt="">
                </div>
            </div>
            <div class="case-header-type">
                <div v-for="(item, index) in case_type" :key="index" class="type-box" @click="handleCursor(item, index)" v-if="index != 5">
                    <div class="type-box-color" :style="{backgroundColor: item.color}"></div>
                    <div class="type-box-font">{{item.title}}</div>
                </div>
                <div style="display: flex;align-items: center; margin-left: 30px;">
                    <Button v-if="showSave" @click="handleSubmit" class="save-btn-save">{{caseTypeName == 'check' ? '复制提纲' : '保存草稿'}}</Button>
                    <Button @click="handleCommit" type="primary" class="save-btn">{{caseTypeName == 'check' ? '新建提纲' : '提交审核'}}</Button>
                </div>
            </div>
        </div>
        <outline ref="outline" :menuObj="menuObj" @node-contextmenu="nodeContextmenu" @edge-contextmenu="edgeContextmenu" @node-mouseenter="nodeMouseenter"
            @node-click="nodeClick" @click="outlineClick" @dblclick="dblclick"/>
    </div>
</template>

<script>
    import outline from 'components/outlines'
    import mouse_img1 from "assets/img/case/1.png";
    import mouse_img2 from "assets/img/case/2.png";
    import mouse_img3 from "assets/img/case/3.png";
    import mouse_img4 from "assets/img/case/4.png";
    import mouse_img5 from "assets/img/case/6.png";
    import mouse_img6 from "assets/img/case/5.png";
    import audioPlay from "assets/img/case/audioPlay.png";
    import audioPause from "assets/img/case/audioPause.png";
    import add_content from "assets/img/case/addContent.png";
    import key_explain from "assets/img/case/keyExplain.png";
    import explain_outline from "assets/img/case/explain_outline.png";
    import postData from "../../../../api/postData";

    export default {
        components: {outline},
        data() {
            return {
                mouse_img1, mouse_img2, mouse_img3, mouse_img4, mouse_img5, mouse_img6, audioPlay, audioPause, add_content, key_explain, explain_outline,
                caseTypeName: '',
                case_type: [
                    {color: '#A1CDFF', fill_color: '#ECF5FF', title: '问诊', short_title: '问诊'},
                    {color: '#60CFD7', fill_color: '#DFF5F7', title: '体格检查', short_title: '体检'},
                    {color: '#FFC058', fill_color: '#FFF2DE', title: '辅助检查', short_title: '辅检'},
                    {color: '#9BDD4A', fill_color: '#EBF8DB', title: '治疗', short_title: '治疗'},
                    {color: '#BB91FE', fill_color: '#F1E9FF', title: '鉴别要素', short_title: '鉴别要素'},
                    {color: '#E08049', fill_color: '#F9E6DB', title: '病种', short_title: '病种'},
                ],
                showSave: true,
                menuObj: {
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
                },
                symptom: '新建病症',
                icd10_ids: [],
                icd10_names: [],
                degree: 2,
            }
        },
        methods: {
            degreeChange() {

            },
            handleBack() {
                if(sessionStorage.getItem('caseType') == 'check') this.$Modal.confirm({
                    title: '提示',
                    content: '请确认返回上一层',
                    onOk: () => {
                        this.$router.go(-1)
                    },
                });
                else this.$router.go(-1)
            },
            handleCursor(item, index) {
                if(index == 5) return
                let imgList = {
                    0: this.mouse_img1,
                    1: this.mouse_img2,
                    2: this.mouse_img3,
                    3: this.mouse_img4,
                    4: this.mouse_img5,
                    5: this.mouse_img6,
                }
                let img = imgList[index]
                document.querySelector('#mountNode').children[0].style.cursor = `url(${img}), progress `
                this.signColor = {...item, ...{cursor:  `url(${img}), progress`}}
            },
            hugeZoom() {
                this.$refs.outline.graph.zoom(1.2)
            },
            littleZoom() {
                this.$refs.outline.graph.zoom(0.8)
            },
            handleSubmit() {
                this.$refs.outline.graph.save().nodes.forEach(item => {
                    if(item.init) this.symptom = item.label;
                    if(item.case_result && item.case_id) {
                        this.icd10_ids.push(item.case_id)
                        this.icd10_names.push(item.all_label)
                    }
                })
                let data = {
                    outline: JSON.stringify(this.$refs.outline.graph.save()),
                    symptom: this.symptom,
                    degree: this.degree,
                    icd10_ids: JSON.stringify(this.icd10_ids),
                    icd10_names: JSON.stringify(this.icd10_names),
                    dept: JSON.parse(sessionStorage.getItem('caseOutline')).dept,
                    desc: JSON.parse(sessionStorage.getItem('caseOutline')).desc,
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
                    postData('case/modifyOutline', {...data, state: 0}).then(res => {
                        this.$Message.success(res.msg)
                        if(res.res_code == 1) this.$router.go(-1)
                    })
                }else{
                    postData('case/addOutline', {...data, state: 0}).then(res => {
                        this.$Message.success(res.msg)
                        if(res.res_code == 1) this.$router.go(-1)
                    })
                }
            },
            handleCommit() {
                let has_result = false
                this.$refs.outline.graph.save().nodes.forEach(item => {
                    if(item.case_result) {
                        this.icd10_ids.push(item.case_id)
                        this.icd10_names.push(item.all_label)
                        // this.icd10_names += this.icd10_names ? ',' + item.case_name : item.case_name
                    }
                    if(item.stroke == '#E08049') has_result = true
                })
                let data = {
                    outline: JSON.stringify(this.$refs.outline.graph.save()),
                    symptom: this.symptom,
                    degree: this.degree,
                    icd10_ids: JSON.stringify(this.icd10_ids),
                    icd10_names: JSON.stringify(this.icd10_names),
                    isAudit: 1,
                    dept: JSON.parse(sessionStorage.getItem('caseOutline')).dept,
                    desc: JSON.parse(sessionStorage.getItem('caseOutline')).desc,
                }
                if(this.caseTypeName == 'check') {
                    // window.open(`/dashboard/outline-content?caseId=${this.$route.query.id}`)
                    window.open(`/dashboard/outline-content`)
                    return
                }
                if(this.$route.query.id) {
                    data.id = parseInt(this.$route.query.id)
                    postData('case/modifyOutline', {...data, state: 3}).then(res => {
                        this.$Message.success(res.msg)
                        if(res.res_code == 1) this.$router.go(-1)
                    })
                }else{
                    if(has_result) {
                        postData('case/addOutline', {...data, state: 3}).then(res => {
                            this.$Message.success(res.msg)
                            if(res.res_code == 1) this.$router.go(-1)
                        })
                    }else this.$Message.info('请至少添加一个病种')
                }
            },
            nodeContextmenu(evt) {
                const shape = evt.target;
                if(shape.get('className') === 'child'){
                    let menuObj = {
                        deleteGather: evt.item.getModel().children.length === 1 ? 'unable' : 'able',
                        editGather: 'able',
                    }
                    this.menuObj = menuObj
                }else{
                    let menuObj = {
                        edit: 'able',
                        add: 'able',
                        line: 'able',
                        copy: 'able',
                        explain: 'able',
                        sign: 'able',
                        delete: 'able',
                        deleteGather: 'able',
                        result: 'able',
                    }
                    this.menuObj = menuObj
                }
                if (evt.item._cfg.model.init) this.$refs.outline.is_init = true
                else this.$refs.outline.is_init = false
            },
            edgeContextmenu(evt) {
                let menuObj = {
                    editEdge: 'able',
                }
                this.menuObj = menuObj
            },
            nodeMouseenter(evt) {
                const {item} = evt
                const model = item.getModel()
                if(model.type == 'gather') {
                    model.add = true
                }
                this.$refs.outline.graph.refreshItem(item)
            },
            nodeClick(evt) {
                const {item} = evt;
                const shape = evt.target;
                if (shape.get('className') === 'add-group') {
                    item._cfg.model.add = false
                    item._cfg.model.children.push({
                        id: String(new Date().getTime()), label: '添加内容'
                    })
                }
                if (shape.get('className') === 'packUp') {
                    item._cfg.model.pack = !item._cfg.model.pack
                    item._cfg.model.add = false
                }
                this.$refs.outline.graph.refreshItem(item)
                this.$refs.outline.graph.layout()
            },
            outlineClick() {
                this.$refs.outline.is_init = false
            },
            dblclick(evt) {
                this.$refs.outline.evt = evt
                this.$refs.outline.editNode()
            }
        },
        mounted() {
            this.caseTypeName = JSON.parse(sessionStorage.getItem('caseType'))
            this.showSave = (this.caseTypeName === 'check') || (JSON.parse(sessionStorage.getItem('caseOutline')).state == 0) || !this.$route.query.id
            if(this.$route.query.id) {
                let data = JSON.parse(sessionStorage.getItem('caseOutline'))
                this.$refs.outline.data = JSON.parse(data.outline)
                this.symptom = data.symptom
                this.degree = data.degree
                this.graphType = 'manual'
                this.$refs.outline.graph.read(JSON.parse(data.outline))
            }else{
                let data = JSON.parse(sessionStorage.getItem('caseOutline'))
                this.degree = this.$refs.outline.data.nodes[0].degree = data.degree
                this.symptom = this.$refs.outline.data.nodes[0].label = data.symptom
                this.$refs.outline.graph.translate(document.querySelector('#mountNode').offsetWidth / 2 - 60, 0)
                this.$refs.outline.updateGraph()
            }
        }
    }
</script>

<style lang="less" scoped>
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
                /*margin-left: 30px;*/
                color: #4098ff;
                background-color:#fff;
            }
            .save-btn{
                width: 133px;
                height: 34px;
            }
        }
    }
</style>
