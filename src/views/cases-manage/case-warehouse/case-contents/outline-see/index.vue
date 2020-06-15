<template>
    <div>
        <caseOutline ref="outline" :style="{height: caseHeight}" class="case-outline" @saveData="saveData"/>
        <div class="case-btn-box">
            <Button class="case-btn-last" @click="handleLast" type="primary">上一步</Button>
            <Button class="case-btn" @click="handleNext(false)" type="primary">下一步</Button>
        </div>
    </div>
</template>

<script>
    // import caseOutline from './case-outline'
    import caseOutline from 'components/outlines'

    export default {
        components: {caseOutline},
        data() {
            return {
                caseHeight: '627px',
                outline: null,
                dataList: [],
            }
        },
        beforeDestroy () {
            $CasePreservation.$off('CasePreservation', this.preservation)
        },
        mounted() {
            $CasePreservation.$on('CasePreservation', this.preservation)
            PostData('case/getAllOutlineTalk',{"case_id": JSON.parse(sessionStorage.getItem('CASEID')),}).then(res => {
                this.changeOutlineList(res.data)
            }).then(() => {
                PostData('case/getCaseDetailAndOutlines', {id: parseInt(sessionStorage.getItem('CASEID'))}).then(res => {
                    if(res.res_code == 1) {
                        this.outline = res.data.outlines[0]
                        this.$refs.outline.data = JSON.parse(res.data.outlines[0].outline)
                        this.$refs.outline.graph.read(JSON.parse(res.data.outlines[0].outline))
                        this.setData(this.dataList, this.$refs.outline.data)
                        // this.graph.translate(document.querySelector('#mountNode').offsetWidth / 2 - 160, 0)
                    }
                })
            })
        },
        methods: {
            preservation(index){
                if(index == 6) this.handleNext(true)
            },
            handleLast() {
                this.$emit('handleNavigate', 5)
            },
            handleNext(save) {
                this.outline.outline = JSON.stringify(this.$refs.outline.graph.save())
                PostData('case/saveCaseOutline', {...{elements: this.setElements()}, ...this.outline}).then(res => {
                    this.saveData(save)
                })
            },
            saveData(save) {
                if(!save) this.$emit('handleNavigate', 7)
                else this.$Message.success('保存成功')
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
            setData(data, list) {
                list.nodes.map((item) => {
                    for(let i in data) {
                        if(item.id == i && data[i][0].content.length) {
                            item.topic = {content: data[i][0]}
                        }
                    }
                })
                this.$refs.outline.data = list
                this.$refs.outline.graph.read(list)
            },
            setElements() {
                let da = this.$refs.outline.graph.save()
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
        },
        created() {
            // this.caseHeight = document.body.clientHeight + 'px'
        },
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
</style>
