<template>
    <div class="container">
        <div class="header">依据详情</div>
        <div class="operation-edit-content">
            <div v-if="type == 'talk'" class="content-talk">
                <div class="talk-box">
                    <div>提问</div>
                    <Input v-model="content.question" class="talk-input" />
                </div>
                <div class="talk-box">
                    <div>回答</div>
                    <Input v-model="content.answer" class="talk-input" type="textarea" :rows="4"/>
                </div>
            </div>
            <div class="physicals" v-if="type == 'physical'">
                <div class="phy-item" style="margin-bottom: 30px;"><HeightTitle :title="thirdName" /></div>
                <div class="physicals-content">
                    <Input v-model="content.result_text"  style="width: 440px;" type="textarea" :rows="4"/>
                    <div class="file-type">* 支持jpg/png图片、mp3音频、mp4/mov/avi视频，且大小不超过300M，只能上传多个同类型文件</div>
                    <div class="right-content-btn">
                        <div style="width: 300px;">
                            <div v-for="(item, index) in upload_file" :key="index" class="file_item" >
                                <img class="media-img" :src="mediaImg[fileType]" />
                                <div class="upload-name">{{item.media_name}}</div>
                                <Icon class="upload-delete" @click="deleteUpload(index)" type="ios-close" size="20"/>
                            </div>
                        </div>
                        <upload-btn text="上传文件" class="content-btn-up" bucket="jhyl-static-file" type="image/jpeg,image/png,image/jpg,video/mp4,video/mov,audio/mpeg "
                                    @uploadcomplete="uploadImg" :maxFileSize="300" :dir="'mtt/Data/main/Cases/' + fileDir + '/DefaultPhysicalExaminationResult/' + thirdName"/>
                    </div>
                </div>
            </div>
            <div v-if="type == 'assist'">
                <div class="phy-item"><HeightTitle :title="thirdName" /></div>
                <div class="upload-hint">* 支持jpg/png图片、mp3音频、mp4/mov/avi视频，大小不超过300M,只能上传一个文件</div>
                <div v-if="content.type == 'ImageData'" style="margin: 2px 20px 0 20px;" class="right-content-btn">
                    <div :class="media&&media.media_name ? 'show-media' : 'hide-media'" style="width: 300px;">
                        <div class="file_item" >
                            <img class="media-img" :src="wordImg" />
                            <div class="upload-name">{{media&&media.media_name}}</div>
                            <Icon class="upload-delete" @click="deleteMediaUpload" type="ios-close" size="20"/>
                        </div>
                    </div>
                    <upload-btn text="上传文件" class="content-btn-up" type="application/* "
                                bucket="jhyl-static-file" @uploadcomplete="uploadType" :maxFileSize="300"
                                :dir="'mtt/Data/main/Cases/' + fileDir + '/DefaultAssistantExamination/' + thirdName"/>
                </div>
                <div v-else class="upload-mold">
                    <div class="mold-head">
                        <div class="mold-head-content" v-for="(item, index) in mold_head" :key="index"
                             :style="{'width': item.width}">{{item.title}}
                        </div>
                    </div>
                    <div v-for="(item, index) in assisTable" class="mold-content" :key="index">
                        <img class="content-img" :src="deleteImg" alt="" @click="deleteTable(index)">
                        <div style="display: flex;">
                            <Input v-model="item[item1.model]" v-for="(item1, index1) in mold_head" :key="index1"
                                   class="content-edit"
                                   :style="{'width': item1.width, 'padding-left': item1.model == 'name' ? '10px' : ''}"
                                   autocomplete="off">
                            </Input>
                        </div>
                    </div>
                    <div class="btn-box">
                        <Button class="modal-add-btn" @click="addTable">添加</Button>
                    </div>
                </div>
            </div>
            <support v-if="support != 'deduction'" class="support" :support="support" :weight="weight" @rateChange="rateChange"/>
            <div class="phy-item" v-else>
                <HeightTitle title="扣分权重" />
                <div style="margin-left: 10px"><RateStar @setStar="setStar" :weight="content.deduct_weight"/></div>
                <HeightTitle title="扣分理由" />
                <Input v-model="content.deduct_reason"  style="width: 440px;margin-left: 10px" type="textarea" :rows="4"/>
            </div>
        </div>
        <div class="footer">
            <Button @click="backAdd" class="back-btn btn">返回添加</Button>
            <Button @click="determine" type="primary" class="btn">确定</Button>
        </div>
    </div>
</template>

<script>
    import support from './components/support'
    import deleteImg from '../../../../../../assets/img/templater/delete.png'
    import wordImg from '../../../../../../assets/img/templater/word.png'
    import audioImg from '../../../../../../assets/img/templater/audio.png'
    import videoImg from '../../../../../../assets/img/templater/video.png'
    import pictureImg from '../../../../../../assets/img/templater/picture.png'
    import UploadBtn from '../../../../../../components/UploadButton'
    import HeightTitle from '../../details-diagnosis/com/height-title'
    import RateStar from '../../../../../../components/rate-star'

    export default {
        props: {
            typePane: {}
        },
        components: { support, UploadBtn, HeightTitle, RateStar },
        data(){
            return {
                upload_file: [],
                thirdName: '',
                type: '',
                support: '',
                weight: 0,
                content: {},
                fileDir: JSON.parse(sessionStorage.getItem('CaseContentMsg')).symptom || '',
                wordImg, deleteImg,
                mediaImg: {
                    'Picture': pictureImg,
                    'Video': videoImg,
                    'Audio': audioImg
                },
                fileType: '',
                upload_file: [],
                actItem: null,
                diagnosessData: {},
                case_id: +sessionStorage.getItem('CASEID'),
                mold_head: [
                    {title: '项目', width: '156px', model: 'name'},
                    {title: '缩写', width: '72px', model: 'abbreviation'},
                    {title: '检查结果', width: '86px', model: 'value'},
                    {title: '参考值', width: '90px', model: 'refvalue'},
                    {title: '单位', width: '73px', model: 'units'},
                ],
                media: null,
                element_id: '',
                assisTable: []
            }
        },
        methods: {
            setStar(i){
                this.content.deduct_weight = i
            },
            deleteMediaUpload(){
                this.media = null
            },
            deleteTable(index) {
                let {abbreviation, name, refvalue, units, value} = this.assisTable[index]
                if (abbreviation || name || refvalue || units || value) this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除该项内容',
                    onOk: () => {
                        this.assisTable.splice(index, 1)
                    },
                });
                else this.assisTable.splice(index, 1)
            },
            uploadType(val) {
                let arr = val.resultName.split('/');
                this.media = {
                    media_name: val.name,
                    report: arr.splice(4, arr.length).join('/')
                }
            },
            setDiagnosesItem(type = false){
                let d = this.diagnosessData
                return [{
                    case_diagnose_id: d.id,
                    basis_type: type ? 'SupportingBasis' : 'NonSupportingBasis',  // true 支持
                    weight: this.content.weight,
                }]
            },
            getCaseDiagnoses(){
                let bool = this.support == 'supported'
                return this.typePane == 5 ? [] : this.setDiagnosesItem(bool)
            },
            addSuccess(r){
                this.$Message.success(r.msg);
                $CaseSuccessfulOperation.$emit('CaseSuccessfulOperation', this.element_id)
            },
            physicalExam(){
                let d = {}
                d = this.actItem;
                d.physical_id = d.id;
                d.case_id = this.case_id
                d.item_type = this.typePane == 5 ? 3 : 1
                d.datas = this.upload_file;
                d.result_text = this.content.result_text;
                d.case_diagnoses = this.getCaseDiagnoses()
                d.result_media_type = this.fileType
                d.weight = this.content.weight
                d.deduct_reason = this.content.deduct_reason
                d.deduct_weight = this.content.deduct_weight
                d.action_type = 'modify'
                PostData("case/operatePhysicalBasis", d).then((r) => {
                    if(r&&r.res_code == 1){
                        if(this.isAdd) this.actItem = null
                        this.addSuccess(r)
                    }
                })
            },
            Interrogation(){
                let da = {
                    case_id: this.case_id,
                    talk_group: this.content.talk_group,
                    question: this.content.question,
                    talk_id: this.content.id
                }
                let d = {
                    ...da,
                    answer: this.content.answer,
                    case_diagnoses: this.getCaseDiagnoses(),
                    question_index: this.content.question_index,
                    item_type: this.typePane == 5 ? 3 : 1,
                    deduct_reason : this.content.deduct_reason,
                    deduct_weight: this.content.deduct_weight,
                    weight: this.content.weight,
                    action_type: 'modify'
                }
                // PostData('case/isExistBasis',da).then((r) => {
                //     if(r&&r.res_code == 1) {
                        PostData('case/operateTalkBasis', d).then((r) => {
                            if(r.res_code == 1) this.addSuccess(r)
                        })
                //     }
                // })
            },
            supplementaryExam(){
                let d = {}
                d = this.actItem
                d.assist_id = d.id
                d.case_id = this.case_id
                d.item_type = this.typePane == 5 ? 3 : 1
                if(this.content.type == 'ImageData')  d.media = this.media
                if(this.content.type == 'ExaminationReport')  d.media = this.assisTable
                d.case_diagnoses = this.getCaseDiagnoses()
                d.type = d.media&&d.media.length>0 ? this.content.type : 'None'
                d.weight = this.content.weight
                d.deduct_reason = this.content.deduct_reason
                d.deduct_weight = this.content.deduct_weight
                d.action_type = 'modify'
                PostData('case/operateAssistBasis',d).then((r) => {
                    if(r.res_code == 1) this.addSuccess(r)
                })
            },
            determine(){
                if(this.type == 'physical') this.physicalExam()
                if(this.type == 'talk') this.Interrogation()
                if(this.type == 'assist') this.supplementaryExam()
            },
            setUploadImg(val){
                this.fileType = val.type;
                let arr = val.resultName.split('/');
                this.upload_file.push({
                    media_name: val.name,
                    result_media_url: arr.splice(4, arr.length).join('/')
                })
            },
            uploadImg(val) {
                let imgs = ['jpeg','jpg','png']
                let videos = ['mp4', 'mov' , 'avi']
                let types = val.url.split('.')[val.url.split('.').length - 1]
                val.type = imgs.includes(types) ? 'Picture' : videos.includes(types) ? 'Video'  : 'Audio'
                if(this.fileType){
                    if(this.fileType == 'None' || this.fileType == val.type ) this.setUploadImg(val)
                    else this.$Message.info('只能上传多个同类型文件！')
                }else this.setUploadImg(val)
            },
            rateChange(val) {
                this.weight = val
                this.content.weight = val
            },
            backAdd(){
                this.$emit('changeState', true)
                $CaseScoreDetails.$emit('CaseScoreDetails', this.diagnosessData)
            },
            deleteUpload(index) {
                this.upload_file.splice(index, 1)
                if(this.upload_file&&this.upload_file.length == 0) this.fileType = ''
            },
            setEdit(t, it, support) {
                this.element_id = t&&t.id
                this.support = support
                this.type = it.type
                this.weight = it.weight || 0
                this.content = {...it.content, ...{weight: it.weight}}
                this.thirdName = it.content.third_name
                this.upload_file = it.content.media || []
                this.media = it.content.media || {}
                this.assisTable = it.content.media || []
                this.actItem = it.content
                this.diagnosessData = t
                this.fileType = it.content.result_media_type
            },
            addTable() {
                this.content.media.push({abbreviation: "", name: "", refvalue: "", units: "", value: "",})
            },
            setWeight(w){
                if(this.support != 'deduction') this.rateChange(w)
                if(this.support === 'deduction') this.setStar(w)
            },
        },
        beforeDestroy () {
            $CaseEdit.$off('CaseEdit', this.setEdit)
            $CaseScoreWeight.$off('CaseScoreWeight', this.setWeight)
        },
        mounted() {
            $CaseScoreWeight.$on('CaseScoreWeight', this.setWeight)
            $CaseEdit.$on('CaseEdit', this.setEdit)
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-input{
        border-radius: 4px !important;
    }
    .show-media{
        visibility: visible;
    }
    .hide-media{
        visibility: hidden;
    }
    .container{
        background-color: #fff;
        box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
        height: 100%;
    }
    .header{
        line-height: 50px;
        text-align: center;
        height: 50px;
        border-bottom: 1px solid #F0F0F7;
        font-size: 18px;
        color: #474C63;
        letter-spacing: 1.05px;
    }
    .footer{
        height: 50px;
        background: #FAFAFC;
        display: flex;
        align-items: center;
        justify-content: center;

        .btn{
            width: 100px;
            font-size: 14px !important;
        }
        .back-btn{
            background: #FFFFFF;
            color: #2D3662;
            border: 1px solid #686F92;
            margin-right: 20px;
        }
    }
    .operation-edit-content{
        height: calc(100% - 100px);
        overflow: hidden;
        overflow-y: auto;
        .support{
            margin-top: 50px;
        }
    }
    .content-talk{
        margin: 0 30px;

        .talk-box{
            display: flex;
            padding-top: 30px;
            justify-content: space-between
        }
        .talk-input{
            width: 380px;
        }
    }

    .phy-item{
        margin-top: 15px;
        margin-left: 20px;
        text-align: left;
    }
    .physicals{
        .file-type{
            margin: 8px 0;
            font-family: PingFangSC-Regular;
            font-size: 10px;
            color: #A4A9C0;
            text-align: left;
        }
        .physicals-content{
            margin: 0 30px;
        }
    }

    .right-content-btn{
        display: flex;
        justify-content: space-between;
        .content-btn-up{
            background-color:#fff;
            width: 96px;
            height: 30px;
        }
        .content-btn-read{
            margin-right: 20px;
            color: #4098ff;
            height: 30px;
        }
    }

    .file_item{
        width: 300px;
        display: flex;
        align-items: center;
        margin-right: 30px;
        justify-content: space-between;
        margin-bottom: 8px;
        background: rgba(240,240,247,0.50);
        border: 1px solid rgba(175,179,201,0.50);
        padding: 3px 10px;
        .upload-name{
            flex: 1;
            text-align: left;
            margin-left: 10px;
            overflow: hidden;
        }
        .media-img{
            width: 14px;
            height: 16px;
        }
    }
    .upload-hint {
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #a4a9c0;
        letter-spacing: 0;
        margin: 10px 20px;
        text-align: left;
    }
    .upload-mold {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

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
        .btn-box{
            margin-top: 10px;
            width: 100%;

            .modal-add-btn{
                background-color: #fff;
                width: 60px;
                height: 22px;
                font-size: 12px !important;
                color: #474C63;
                margin-left: 14px;
            }
        }
    }
</style>
