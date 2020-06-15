<template>
    <Modal v-model="show" :mask-closable="false" :footer-hide="true" width="850" @on-cancel="handleCancel">
        <div class="modal-top">添加辅助检查</div>
        <div class="modal-content">
            <div class="model-left" style="width: 228px;">
                <div class="model-left-title">辅助检查项</div>
                <Collapse style="height: 100%;overflow-y: auto" v-model='first' :accordion="true" simple @on-change="firstChange">
                    <Panel v-for="(item,index) in treeList" :key="index" :name="String(index)">
                        <span class="item-head">{{item.name}}</span>
                        <Collapse v-if="item.children && item.children[0].children" style="height: 100%;overflow-y: auto" v-model='second' :accordion="true"  simple  slot="content"  @on-change="secondChange(item)">
                            <Panel v-for="(item1,index1) in item.children" :key="index1" :name="String(index1)">
                                <span class="item-head">{{item1.name}}</span>
                                <div v-for="(it, ind) in item1.children" :key="it.id" slot="content" class="panel-content"  @click="handleClick(it, ind, item1)" :class="it.checked ? 'panel-content-checked' : ''" >
                                    <div class="panel-title">{{it.name}}</div>
                                    <Icon :size="24" color="#5399f7" type="md-checkmark" v-if="it.checked"/>
                                </div>
                            </Panel>
                        </Collapse>
                        <div v-else v-for="(it, ind) in item.children" :key="it.id" slot="content" class="panel-content"  @click="handleClick(it, ind, item)" :class="it.checked ? 'panel-content-checked' : ''" >
                            <div class="panel-title">{{it.name}}</div>
                            <Icon :size="24" color="#5399f7" type="md-checkmark" v-if="it.checked"/>
                        </div>
                    </Panel>
                </Collapse>
            </div>
            <div class="modal-right">
                <div class="right-title">
                    <div class="right-title-val">
                        检查：<span v-if="first_name">{{first_name}}</span>
                        <span v-if="second_name"> > {{second_name}}</span>
                    </div>
                    <div class="right-title-input">
                        <div style="width: 70px;">费用</div>
                        <InputNumber style="width: 94px;" v-model="cost" :min="0" />
                        <div style="position: absolute; right: 70px;">元</div>
                    </div>
                </div>
                <div style="width: 610px;">
                    <tables v-if="data_type == 'ExaminationReport'" :tabel-height="tableHeight" :column="columns1" :table-data="list" @inputChange="inputChange"/>
                    <div v-else style="height: 550px;overflow: hidden">
                        <iframe :frameborder="0" class="case-ifram" v-if="data_type == 'ImageData'" :src="officeappsUrl + list[0].report"></iframe>
                    </div>
<!--                    <upload-btn v-if="data_type == 'ImageData'" style="height: 130px;height: 30px;" text="上传文件" class="content-btn-up" type="application/* "-->
<!--                                bucket="jhyl-static-file" @uploadcomplete="uploadType" :maxFileSize="300"-->
<!--                                :dir="'mtt/Data/main/Cases/' + fileDir + '/DefaultAssistantExamination/' + second_name"/>-->
                </div>
                <div style="display: flex;justify-content: center;margin-top: 16px;">
                    <Button @click="handleSubmit" style="width: 180px;height: 36px;" type="primary">保存</Button>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
    import postData from '../../../../../api/postData'
    import tables from '../../../../../components/tables'
    import officeappsUrl from '../../../../../../config/officeapps'
    import uploadBtn from '../../../../../components/UploadButton'

    export default {
        components: {tables, uploadBtn},
        data() {
            return {
                officeappsUrl,
                show: false,
                first: '',
                second: '',
                firstList: [],
                secondList: [],
                thirdList: [],
                last_check: null,
                first_name: '',
                second_name: '',
                third_name: '',
                cost: 0,
                columns1: [
                    {title: '项目', key: 'name', minWidth: 100},
                    {title: '缩写', key: 'abbreviation', minWidth: 50},
                    {title: '检查结果', key: 'value', minWidth: 50, slot: 'input-item'},
                    {title: '参考值', key: 'refvalue', minWidth: 50},
                    {title: '单位', key: 'units', minWidth: 50},
                ],
                list: [],
                tableHeight: 550,
                data_type: '',
                result_data: {},
                treeList: []
            }
        },
        props: {
            isShow: {
                type: Boolean,
            },
            outline: {
                type: Object
            },
            ev: {
                type: [Object, String]
            },
            fileDir: {
                type: String
            }
        },
        watch: {
            isShow(val) {
                this.show = val
            }
        },
        methods: {
            InquiryCl(item,index) {

            },
            handleClick(item, index, item1) {
                item1.children.map(item => {item.checked = false})
                postData('case/getAssisResult', {item_id: item.id, case_id: parseInt(this.$route.query.id)}).then(res => {
                    if(res.res_code == 1) {
                        this.list = res.data.child
                        this.data_type = res.data.type
                    }
                })
                this.result_data = item
                this.secondList.map(item => { item.checked = false })
                item.checked = true
                this.second_name = item.name
                this.$forceUpdate()
            },
            handleCancel() {
                this.$emit('cancel-diagnose', false)
                this.show = false
            },
            firstChange(val) {
                this.second = ''
                // if(val.length) {
                //     postData('case/getAssistTree', {category_id: parseInt(val[0])}).then(res => {
                //         if(res.res_code == 1) this.secondList = res.data
                //         this.firstList.forEach(item => {if(item.id == val) this.first_name = item.name})
                //     })
                // }else this.first_name = ''
                if(val.length) {
                    this.first_name = this.treeList[this.first].name
                }
                this.second_name = ''
            },
            inputChange(row, index) {
                this.list[index] = row
            },
            uploadType(val) {
                this.list[0].report = val.resultName.split('/').splice(4, 4).join('/')
            },
            handleSubmit() {
                let data = {
                    case_id: this.outline.case_id,
                    item_id: this.result_data.id,
                    template_id: this.outline.id,
                    case_diagnose_ids: this.ev.item._cfg.model.case_ids,
                    type: this.data_type,
                    source_name_part_1: this.first_name,
                    source_name_part_2: this.second_name
                }
                if(this.data_type == 'ExaminationReport') data.reports = this.list
                else data.file = this.list[0]
                if(this.data_type && (data.reports || data.file)) {
                    postData('case/addAssisBasis', data).then(res => {
                        if(res.res_code == 1) {
                            [data.id, data.first_name, data.second_name] = [this.result_data.id, this.first_name, this.second_name]
                            this.$emit('diagnoseDone', data)
                            this.handleCancel()
                            this.first = this.first_name = this.second_name = this.data_type = ''
                        }
                    })
                }else this.$Message.info('请选择辅助检查项')
            },
            getList() {
                postData('case/getAssistTree').then(res => {
                    if(res.res_code == 1) {
                        this.firstList = res.data
                    }
                })
                postData('case/getAssistItem', {case_id: this.$route.query.id}).then(res => {
                    if(res.res_code == 1) this.treeList = res.data
                })
            }
        },
        mounted() {
            this.getList()
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-collapse, /deep/ .ivu-collapse-header, /deep/ .ivu-collapse-item{
        border: none !important;
    }
    /deep/ .ivu-collapse-item{
        line-height: 34px;
    }
    /deep/ .ivu-icon-ios-arrow-forward{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%)
    }
    /deep/ .item-head{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
        width: 170px;
        overflow: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    /deep/ .ivu-collapse-content-box{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
        line-height: 34px;
    }
    .modal-top{
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #474C63;
    }
    .modal-content{
        height: 710px;
        display: flex;
    }
    .model-left{
        background: #FFFFFF;
        box-shadow: 0 0 7px 0 rgba(64,152,255,0.10);
        border-radius: 0 0 0 10px;
        height: calc(100% - 47px);

        .model-left-title{
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474C63;
            letter-spacing: 0;
            text-align: center;
            padding-top: 20px;
        }

        .panel-content{
            padding: 0 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 34px;
            cursor: pointer;
            width: 170px;

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
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .panel-content-checked{
            background: #F0F0F7;
            border-radius: 100px;
        }
    }
    .modal-right{
        .right-title{
            height: 50px;
            width: 610px;
            background: #F0F0F7;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: PingFangSC-Regular;
            font-size: 18px;
            color: #474C63;
            letter-spacing: 0;

            .right-title-val{
                margin-left: 20px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .right-title-input{
                display: flex;
                margin-right: 40px;
                align-items: center;

                /deep/ .ivu-input-number-handler-wrap{
                    display: none;
                }
                /deep/ .ivu-input-number-input-wrap{
                    width: 94px;
                }
            }
        }
    }
    .case-ifram{
        width: 100%;
        height: 550px;
    }
</style>
