<template>
    <div>
        <case-outline ref="outline" :style="{height: caseHeight}" :menuObj="menuObj" class="case-outline" @saveData="saveData" @node-contextmenu="nodeContextmenu"
                      @edge-contextmenu="edgeContextmenu" @node-mouseenter="nodeMouseenter" @node-click="nodeClick" @click="outlineClick" @dblclick="dblclick"/>
        <div class="case-btn-box">
            <Button class="case-btn-last" @click="handleLast" type="primary">上一步</Button>
            <Button class="case-btn" @click="handleNext(false)" type="primary">下一步</Button>
        </div>
        <Modal v-model="hintModal" :footer-hide="true" title="添加病种提示">
            <div class="modal-box">
                <div class="modal-title">新增病种：<span class="modal-name" v-for="item in icd10_name" :key="item">{{item}}</span></div>
                <div class="modal-content">您在病种库中添加了新的病种，请在提纲中添加，并完善提纲。</div>
            </div>
            <div class="modal-btn">
                <Button class="btn" type="primary" @click="handleClose">去添加</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import caseOutline from 'components/outlines'
    // import caseOutline from './case-outline'

    export default {
        components: {caseOutline},
        data() {
            return {
                caseHeight: '627px',
                dataList: [],
                hintModal: false,
                icd10_name: [],
                outline: null,
                data: '',
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
            }
        },
        methods: {
            handleLast() {
                this.$emit('handleNavigate', 3)
            },
            handleNext(save) {
                this.outline.outline = JSON.stringify(this.$refs.outline.graph.save())
                PostData('case/saveCaseOutline', {...{elements: this.setElements()}, ...this.outline}).then(res => {
                    this.saveData(this.$refs.outline.graph.save(), save)
                })
            },
            setElements() {
                let da = this.$refs.outline.graph.save()
                let node = da.nodes;
                console.log(node, 'node');
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
                            if(fillCol.includes(t.fill)&&t.label){
                                ele.push({
                                    code: t.id + '|' + sessionStorage.getItem('CASEID'),
                                    element_name: t.label,
                                    type: types[t.fill]
                                })
                            }
                        }
                    })
                }
                return ele
            },
            saveData(val, save) {
                let list = []
                this.icd10_name = []
                val.nodes.forEach((item) => {
                    if(item.fill == "#F9E6DB") {
                        list.push(item.case_id)
                    }
                })
                let isHas = true
                this.dataList.forEach(item => {
                    if(!list.includes(item.icd10_id)) {
                        isHas = false
                        this.icd10_name.push(item.name)
                        this.hintModal = true
                    }
                })
                if(isHas) {
                    if(!save) this.$emit('handleNavigate', 5)
                    else this.$Message.success('保存成功')
                }
            },
            handleClose() {
                this.hintModal = false
            },
            preservation(index){
                if(index == 4) this.handleNext(true)
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
        beforeDestroy () {
            $CasePreservation.$off('CasePreservation', this.preservation)
        },
        mounted() {
            PostData('case/getMockDiagnoses', {case_id: parseInt(sessionStorage.getItem('CASEID'))}).then(res => {
                if(res.res_code == 1) {
                    this.dataList = res.data
                }
            })
            PostData('case/getCaseDetailAndOutlines', {id: parseInt(sessionStorage.getItem('CASEID'))}).then(res => {
                if(res.res_code == 1) {
                    this.outline = res.data.outlines[0]
                    this.$refs.outline.data = JSON.parse(res.data.outlines[0].outline)
                    this.$refs.outline.graph.read(JSON.parse(res.data.outlines[0].outline))
                }
            })
            $CasePreservation.$on('CasePreservation', this.preservation)
        }
    }
</script>
<style lang="less" scoped>
    .case-outline{
        margin-top: 10px;
    }
    .case-btn-box {
        display: flex;
        margin-top: 26px;
        justify-content: center;
        .case-btn-last {
            width: 150px;
            height: 38px;
            background-color: #fff;
            color: #4098ff;
        }
        .case-btn {
            width: 150px;
            height: 38px;
            margin-left: 20px;
        }
    }
    .modal-box{
        margin: 10px 20px;
        line-height: 28px;

        .modal-title{
            font-weight: 700;
            color: #666666;
            font-size: 16px;
        }
        .modal-content{
            font-size: 14px;
            color: #999;
        }
        .modal-name{
            margin-right: 10px;
            color: #f00;
        }
    }
    .modal-btn{
        margin-top: 30px;
        height: 50px;
        border-top: 1px solid rgba(228, 228, 228, 1);
        position: relative;

        .btn{
            position: absolute;
            right: 10px;
            top: 10px;
        }
    }
</style>
