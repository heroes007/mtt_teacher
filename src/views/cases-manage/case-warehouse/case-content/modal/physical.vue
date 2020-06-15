<template>
    <Modal v-model="show" :mask-closable="false" :footer-hide="true" width="850" @on-cancel="handleCancel">
        <div class="modal-top">添加体格检查</div>
        <div class="modal-content">
            <div class="model-left" style="width: 228px;">
                <div class="model-left-title">体格检查项</div>
                <Collapse style="height: 100%;overflow-y: auto" v-model='first' :accordion="true" simple @on-change="firstChange">
                    <Panel v-for="(item,index) in treeList" :key="index" :name="String(index)">
                        <span class="item-head">{{item.name}}</span>
                        <Collapse style="height: 100%;overflow-y: auto" v-model='second' :accordion="true"  simple  slot="content"  @on-change="secondChange(item)">
                            <Panel v-for="(item1,index1) in item.children" :key="index1" :name="String(index1)">
                                <span class="item-head">{{item1.name}}</span>
                                <div v-for="(it, ind) in item1.children" :key="it.id" slot="content" class="panel-content"  @click="handleClick(it, ind, item1)" :class="it.checked ? 'panel-content-checked' : ''" >
                                    <div class="panel-title">{{it.name}}</div>
                                    <Icon :size="24" color="#5399f7" type="md-checkmark" v-if="it.checked"/>
                                </div>
                            </Panel>
                        </Collapse>
                    </Panel>
                </Collapse>
            </div>
            <div class="modal-right">
                <div class="right-title">
                    <div class="right-title-val">
                        检查：<span v-if="first_name">{{first_name}}</span>
                        <span v-if="second_name"> > {{second_name}}</span>
                        <span v-if="third_name"> > {{third_name}}</span>
                    </div>
                    <div class="right-title-input">
<!--                        <div style="width: 70px;">费用</div>-->
<!--                        <InputNumber style="width: 94px;" v-model="cost" :min="0" />-->
<!--                        <div style="position: absolute; right: 70px;">元</div>-->
                    </div>
                </div>
                <div class="right-content">
                    <div class="right-content-title">检查结果</div>
                    <Input v-model="input_result" class="right-content-input" type="textarea" placeholder="请输入检查结果..."/>
                    <div class="right-content-btn">
<!--                        <Button class="content-btn-up">上传文件</Button>-->
                        <upload-btn text="上传文件" class="content-btn-up" bucket="jhyl-static-file" type="image/jpeg,image/png,image/jpg,video/mp4,video/mov,audio/mpeg "
                                    @uploadcomplete="uploadImg" :maxFileSize="300" :dir="'mtt/Data/main/Cases/' + fileDir + '/DefaultPhysicalExaminationResult/' + third_name"/>
                        <div style="width: 300px;">
                            <div v-for="(item, index) in upload_file" style="display: flex; align-items: center;margin-right: 30px;justify-content: space-between">
                                <div class="upload-name">{{item.name}}</div>
                                <Icon class="upload-delete" @click="deleteUpload(index)" type="ios-trash" size="20"/>
                            </div>
                        </div>
<!--                        <Button class="content-btn-read" type="text">阅读全文</Button>-->
                    </div>
                </div>
                <div class="right-btn">
                    <Button @click="handleSubmit" type="primary" style="width: 180px;height: 36px;">保存</Button>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
    import uploadBtn from '../../../../../components/UploadButton'
    import postData from '../../../../../api/postData'

    export default {
        components: {uploadBtn},
        data() {
            return {
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
                part_name: '',
                cost: 0,
                tool_region: {},
                input_result: '',
                upload_file: [],
                treeList: [],
                result_data: [],
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
                this.getList()
            }
        },
        methods: {
            InquiryCl(item,index) {

            },
            uploadImg(val) {
                val.type = val.url.split('.')[val.url.split('.').length - 1] ==  'jpeg' || 'jpg' || 'png' ? 'Picture' : val.url.split('.')[val.url.split('.').length - 1] == 'mp4' || 'mov' ? 'Video' : 'Audio'
                this.upload_file.push({
                    name: val.name,
                    result_media_url: val.resultName.split('/').splice(4, 4).join('/')
                })
            },
            deleteUpload(index) {
                this.upload_file.splice(index, 1)
            },
            handleClick(item, index, item1) {
                this.upload_file = []
                item1.children.map(item => {item.checked = false})
                postData('case/getPhysicalResult', {item_id: item.id, case_id: parseInt(this.$route.query.id)}).then(res => {
                    if(res.res_code == 1) {
                        this.result_data = res.data
                        this.input_result = res.data[0].result_text
                        if(res.data[0].child && res.data[0].child.length) res.data[0].child.forEach(item => {
                            this.upload_file.push({
                                name: item.result_media_url.split("/")[item.result_media_url.split("/").length - 1],
                                result_media_url: item.result_media_url,
                                result_media_type: item.result_media_type
                            })

                        })
                    }
                })
                // this.thirdList.map(item => {item.checked = false})
                item.checked = true
                this.third_name = item.name
                this.part_name = item.name
                this.tool_region = item
                this.$forceUpdate()
            },
            handleCancel() {
                this.$emit('cancel-physical', false)
                this.show = false
            },
            firstChange(val) {
                this.second = ''
                if(val.length) {
                    this.first_name = this.treeList[this.first].name
                }
                this.second_name = this.third_name = this.part_name = ''
            },
            secondChange(val) {
                if(this.second.length) {
                    this.second_name = val.children[this.second].name
                    val.children[this.second].children.map(item => {item.checked = false})
                    this.third_name = this.part_name = ''
                }else this.second_name = this.third_name = this.part_name = ''
            },
            getList() {
                postData('case/getPhysicalItem', {case_id: this.$route.query.id}).then(res => {
                    if(res.res_code == 1) this.treeList = res.data
                })
            },
            handleSubmit() {
                let data = {
                    case_id: this.outline.case_id,
                    template_id: this.outline.id,
                    case_diagnose_ids: this.ev.item._cfg.model.case_ids,
                    tool_region_id: this.tool_region.id,
                    result_text: this.input_result,
                    result_media_type: (this.upload_file[0] && this.upload_file[0].type) ? this.upload_file[0].type : 'None',
                    // result_media_url: this.upload_file.resultName ? this.upload_file.resultName.split('/').splice(4, 4).join('/') : '',
                    result_media_urls: [],
                    source_name_part_1: this.second_name,
                    source_name_part_2: this.part_name
                }
                this.upload_file.forEach(item => {
                    data.result_media_urls.push({report: item.result_media_url})
                })
                console.log(data, this.upload_file);
                if(this.tool_region && this.input_result && this.upload_file.length) {
                    postData('case/addPhysicalBasis', data).then(res => {
                        if(res.res_code == 1){
                            data.id = this.tool_region.id
                            data.first_name = this.first_name
                            data.second_name = this.second_name
                            data.third_name = this.third_name
                            this.$emit('physicalDone', data)
                            this.handleCancel()
                            this.upload_file = {}
                            this.first = this.second = this.input_result = this.first_name = this.second_name = this.third_name = ''
                        }
                    })
                }else this.$Message.info('请选择体格检查')
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
            width: 144px !important;

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
        .right-content{
            margin-top: 20px;
            margin-left: 20px;

            .right-content-title{
                font-family: PingFangSC-Regular;
                font-size: 18px;
                color: #474C63;
                letter-spacing: 0;
                text-align: justify;
            }
            .right-content-input{
                margin-top: 15px;
                width: 570px;
                height: 373px;

                /deep/ .ivu-input{
                    height: 100%;
                }
            }
        }
        .right-content-btn{
            margin-top: 20px;
            display: flex;
            justify-content: space-between;

            .content-btn-up{
                background-color:#fff;
                width: 130px;
                height: 30px;
            }
            .content-btn-read{
                margin-right: 20px;
                color: #4098ff;
                height: 30px;
            }
        }
        .right-btn{
            margin-top: 100px;
            display: flex;
            justify-content: center;
        }
    }
    .upload-name{
        margin-right: 10px;
        font-size: 14px;
        font-family: PingFangSC-Medium;
        max-width: 220px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .upload-delete:hover{
        cursor: pointer;
    }
</style>
