<template>
    <div class="operation-right">
    <SeeCase v-if="type == 3" :showModal="showModal" :type="filesType " :detailData="detailData" @close-modal="closeModal"/>
    <div v-if="type == 2 || type == 3 || type == 4" class="title">{{title}}{{typeTit[+type - 1]}}</div>
    <div v-if="allAdd">
        <div class="add-form">
            <!-- <div class="item-sel">
                <div class="items">
                    <span class="items-text">性别</span>
                    <Select v-model="sex" class="items-check" >
                        <Option v-for="item in selectSex" :value="item.id" :key="item.title">{{ item.title }}</Option>
                    </Select>
                </div>
                <div class="items item-right">
                    <span class="items-text">年龄</span>
                    <Select v-model="age" class="items-check">
                        <Option v-for="item in selectAge" :value="item.id" :key="item.title">{{ item.title }}</Option>
                    </Select>
                </div>
            </div> -->
            <div class="item-sel" style="margin-top: 12px">
                <div class="items">
                    <span class="items-text">类型</span>
                    <Cascader transfer @on-change="cascaderType" @on-visible-change="handleChangeOnSelect" :change-on-select="changeOnSelect" :data="selList" :load-data="loadDatas" v-model="modelType" class="items-check"></Cascader>
                </div>
                <div v-if="type == 2 || type == 3 || type == 4&&isAdd&&diagnosisTypes==2" class="items item-right">
                    <Input v-model="serach" @on-change="getSerach"  style="width:223px" placeholder="请输入搜索内容"  />
                </div>
            </div>
        </div>
    </div>
    <div v-if="allAdd" class="line"></div>
    <div class="main-right" :class="setClass">
        <div v-if="type == 1" class="title">{{title}}{{typeTit[+type - 1]}}</div>
        <div v-if="isAdd || isEdit">
            <div :class="allAdd ? 'main-types' : 'main-type1'" ref="MainView" class="main-view">
                <div v-if="type == 1">
                    <div class="item-form">
                        <span class="item-type">类型</span>
                        <Select @on-change="selType" v-model="caseType" class="case-type">
                            <!-- <Option :value="0" label="请选择"/> -->
                            <Option v-for="(item, i) in selectList" :value="item.talk_group" :key="i">{{ item.talk_group }}</Option>
                        </Select>
                    </div>
                    <div class="item-form">
                        <span class="item-type">提问</span>
                        <div class="case-type">
                            <select-input @set-sel="selQus" :diagnosisId="diagnosisId" :querys="anyQuestions" placeholder="请输入问题" name="question" :caseType="caseType" :case_id="case_id" :isTerm="this.isTerm()" :heights="380"/>
                        </div>
                    </div>
                    <div class="item-form">
                        <span class="item-type">回答</span>
                        <Input v-model="answers" placeholder="请输入回答" class="case-type"/>
                    </div>
                </div>
                <div class="phy" v-if="type == 2&&isEdit || type == 3&&isEdit">
                    <div class="phy-item">{{phyItem}}</div>
                    <Input v-if="type == 2" v-model="result_text" type="textarea" :rows="4" placeholder="请输入检查结果" />
                    <div class="term" v-if="setFileType">
                        <span class="term-title grey-regular4">设为</span>
                        <RadioGroup v-model="data_type">
                            <Radio label="ImageData">使用文件</Radio>
                            <Radio label="ExaminationReport">使用模板</Radio>
                        </RadioGroup>
                    </div>
                    <div v-if="type == 2&&isEdit || type == 3&&isEdit&&data_type == 'ImageData'" class="file-type">{{fileText[type - 2]}}</div>
                    <div v-if="type == 2&&isEdit" class="right-content-btn">
                        <div style="width: 300px;">
                            <div v-for="(item, index) in upload_file" :key="index" class="file_item" >
                                <img class="media-img" :src="mediaImg[fileType]" />
                                <div class="upload-name">{{item.media_name}}</div>
                                <Icon class="upload-delete" @click="deleteUpload(index)" type="ios-close" size="20"/>
                            </div>
                        </div>
                        <upload-btn v-if="type == 2" text="上传文件" class="content-btn-up" bucket="jhyl-static-file" type="image/jpeg,image/png,image/jpg,video/mp4,video/mov,audio/mpeg "
                        @uploadcomplete="uploadImg" :maxFileSize="300" :dir="'mtt/Data/main/Cases/' + fileDir + '/DefaultPhysicalExaminationResult/' + thirdName"/>
                    </div>
                </div>
                <div v-if="type == 3&&isEdit">
                    <div v-if="data_type == 'ExaminationReport'" class="upload-mold tables">
                        <div class="mold-head">
                            <div class="mold-head-content" v-for="(item, index) in mold_head" :key="index"
                                :style="{'width': item.width}">{{item.title}}
                            </div>
                        </div>
                        <div v-if="assisTable&&assisTable.length>0">
                            <div v-for="(item, index) in assisTable" class="mold-content" :key="index">
                                <img class="content-img" :src="deleteImg" alt="" @click="deleteTable(index)">
                                <div style="display: flex;">
                                    <Input v-model="item[item1.model]" v-for="(item1, index1) in mold_head" :key="index1"
                                        class="content-edit" :class="item1.model == 'name' ? 'table-name1' : ''"
                                        :style="{'width': item1.width, 'padding-left': item1.model == 'name' ? '10px' : ''}"
                                        autocomplete="off">
                                    </Input>
                                </div>
                            </div>
                        </div>
                        <div v-else class="assis-table-no">暂无数据</div>
                        <div class="btn-box">
                            <Button class="modal-add-btn" @click="addTable">添加列表</Button>
                        </div>
                    </div>
                        <!-- <div v-else style="height: 550px;overflow: hidden">
                            <iframe :frameborder="0" class="case-ifram" v-if="data_type == 'ImageData'" :src="officeappsUrl + assisTable[0].report"></iframe>
                        </div> -->
                    <div v-if="data_type == 'ImageData'" style="margin: 2px 20px 0 20px;" class="right-content-btn">
                        <div :class="media&&media.media_name ? 'show-media' : 'hide-media'" style="width: 300px;">
                            <div class="file_item"  @click="seeFile(media)">
                                <img class="media-img" :src="wordImg" />
                                <div class="upload-name">{{media&&media.media_name}}</div>
                                <Icon class="upload-delete" @click="deleteMediaUpload" type="ios-close" size="20"/>
                            </div>
                        </div>
                        <upload-btn text="上传文件" class="content-btn-up" type="application/* "
                        bucket="jhyl-static-file" @uploadcomplete="uploadType" :maxFileSize="300"
                        :dir="'mtt/Data/main/Cases/' + fileDir + '/DefaultAssistantExamination/' + thirdName"/>
                    </div>
                </div>
                <div v-if="isLineShow" class="line"></div>
                <nursing-drugs v-if="type==4" :itemType="item_type" @nursing-drugs-data="nursingDrugsData" :diagnosisTitle="diagnosisTitle" :medicineNum="medicineNum" :diagnosisData="diagnosisData" :isEdit="isEdit" :diagnosisFm="diagnosisFm" :inputContents="inputContents" :drugContents="drugContents" :type="isNursing" />
                <div v-if="(isAddForm()||isDiagnosis)&&phyList.length>0">
                    <div v-for="(it,i) in phyList" :key="i">
                        <div :class="actPhy === i&&!it.is_exist ? 'act-phy-view' : it.is_exist ? 'dis-phy-view' : 'de-phy-view'" @click="selPhyItem(it,i)" class="phy-view">{{i+1}}、 {{it.third_name || it.name}}</div>
                    </div>
                </div>
                <div v-if="(isAddForm()||isDiagnosisNo)&&phyList.length==0">
                    <img :src="caseNO" class="case-no2" />
                    <div v-if="type == 4" class="case-no-text">请选择类型/暂无数据</div>
                    <div v-else class="case-no-text">请选择类别/暂无数据</div>
                </div>
                <div class="term" style="margin-left: 40px;margin-bottom: 15px;" v-if="setItemType">
                    <span class="term-title grey-regular4">设为</span>
                    <RadioGroup v-model="item_type">
                        <Radio :label="1">{{type == 4 ? '得分项' : '诊断依据'}}</Radio>
                        <Radio :label="2">干扰项</Radio>
                        <Radio :label="3">减分项</Radio>
                    </RadioGroup>
                </div>
                <div class="diagnosis" v-if="item_type == 1&&isDiagnosisShow()">
                    <div class="support" v-if="mainData&&mainData.name || secondData.length>0 || threeData.length>0">
                        <img :src="correct" class="img"/>
                        <div class="support-details">
                            <p class="grey-medium5 diagnosis-title">支持诊断</p>
                            <DiagnosisType v-if="mainData&&mainData.name" :weight="mainData.weight" type="1" @selectDegree="selectMainDegree" @contact="mainContact" :check="mainData.check" :title="`主要-${mainData.name}`" />
                            <div v-for="(t,i) in secondData" :key="i + 100">
                                <DiagnosisType :weight="t.weight" @selectDegree="selectDegree" :index="i" :check="t.check" type="2" :disables="t.disables" @contact="contact1" :title="`次要-${t.name}`" />
                            </div>
                            <div v-for="(it, index) in threeData" :key="index + 200">
                                <DiagnosisType :weight="it.weight"  @selectDegree="selectDegree" :index="index" :check="it.check" type="3" :disables="it.disables"  @contact="contact1" :title="`鉴别-${it.name}`" />
                            </div>
                        </div>
                    </div>
                    <div class="support" v-if="secondData2.length>0 || threeData2.length>0">
                        <img :src="error" class="img"/>
                        <div class="support-details">
                            <p class="grey-medium5 diagnosis-title">排除诊断</p>
                            <!-- <div v-for="(t,i) in secondData2" :key="i + 300">
                                <DiagnosisType :weight="t.weight"  @selectDegree="selectDegree" :index="i" :check="t.check" type="4" @contact="contact1" :disables="t.disables" :title="`次要-${t.name}`" />
                            </div> -->
                            <div v-for="(it, index) in threeData2" :key="index + 500">
                                <DiagnosisType :weight="it.weight"  @selectDegree="selectDegree" :index="index" :check="it.check" type="5" @contact="contact1" :disables="it.disables" :title="`鉴别-${it.name}`"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="diagnosis" v-if="item_type == 3">
                    <div class="item-weigh">
                        <span class="item-type">扣分权重</span>
                        <Select v-model="deduct_weight" style="width:130px">
                            <Option v-for="item in weightList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                        </Select>
                    </div>
                    <div class="item-weigh">
                        <span class="item-type">扣分理由</span>
                        <Input v-model="deduct_reason" :rows="4" style="flex: 1" type="textarea" placeholder="请输入回答" class="case-type"/>
                    </div>
                </div>
            </div>
            <div v-if="showBtn" class="case-btn-box">
                <Button class="case-btn-last" @click="clear" type="primary">清空</Button>
                <Button class="case-btn" @click="determine" type="primary">确定</Button>
            </div>
        </div>
        <div class="operation-no" :class="isAddForm() ? 'operation-rights' : 'operation-right1'" v-else>
            <img :src="caseNO" class="case-no" />
            <div class="case-no-text">请从左侧选择“添加{{typeTit[+type - 1]}}”</div>
        </div>
    </div>
    </div>
</template>

<script>
    import DiagnosisType from './diagnosis-type'
    import SelectInput from '../../../../../../components/select-input'
    import UploadBtn from '../../../../../../components/UploadButton'
    import tables from '../../../../../../components/tables'
    import NursingDrugs from './nursing-drugs'
    import nursings from './nursing-drug'
    import correct from '../../../../../../assets/case/correct2.png'
    import error from '../../../../../../assets/case/error2.png'
    import caseNO from '../../../../../../assets/case/case-no.png'
    // import officeappsUrl from '../../../../../../../config/officeapps'
    import deleteImg from '../../../../../../assets/img/templater/delete.png'
    import wordImg from '../../../../../../assets/img/templater/word.png'
    import audioImg from '../../../../../../assets/img/templater/audio.png'
    import videoImg from '../../../../../../assets/img/templater/video.png'
    import pictureImg from '../../../../../../assets/img/templater/picture.png'
    import SeeCase from '../../../../../../components/see-case'
    export default {
        components: { DiagnosisType, SelectInput, UploadBtn, tables, NursingDrugs, SeeCase },
        props: {
            type: {
                type: String,  //1 问诊 2 体格检查 3 辅助检查 4 诊疗详情
                default: ''
            },
            diagnosisId: {}
        },
        data() {
            return {
                filesType: null,
                detailData: null,
                showModal: false,
                drugInput: nursings.drugInput,
                nursingInput: nursings.nursingInput,
                medicineNum: 0,
                diagnosisTitle: '',
                changeOnSelect: false,
                diagnosisFm: { reason: '', weight: 0, operation: '' },
                diagnosisData: new Array(6).fill(null),
                drugContents: new Array(6).fill(null),
                inputContents: [],
                diagnosisTypes: 0,
                isNursing: 0,
                deleteImg,wordImg,audioImg,videoImg,pictureImg,
                mediaImg: {
                    'Picture': pictureImg,
                    'Video': videoImg,
                    'Audio': audioImg
                },
                mold_head: [
                    {title: '项目', width: '34%', model: 'name'},
                    {title: '缩写', width: '15%', model: 'abbreviation'},
                    {title: '检查结果', width: '18%', model: 'value'},
                    {title: '参考值', width: '15%', model: 'refvalue'},
                    {title: '单位', width: '18%', model: 'units'},
                ],
                tableHeight: 550,
                fileText: ['* 支持jpg/png图片、mp3音频、mp4/mov/avi视频，且大小不超过300M，只能上传多个同类型文件','* 支持word文件，且大小不超过300M，只能上传一个文件'],
                fileDir: JSON.parse(sessionStorage.getItem('CaseContentMsg')).symptom || '',
                actPhy: '',
                thirdName: '',
                data_type: 'ImageData',
                actItem: null,
                phyList: [],
                selectSex: [
                    {id: 'all', title: '全部性别'},
                    {id: 'Common', title: '通用'},
                    {id: 'Male', title: '男'},
                    {id: 'Female', title: '女'},
                ],
                selectAge: [
                    {id: 0, title: '通用'},
                    {id: 1, title: '婴幼儿(0-6岁)'},
                    {id: 2, title: '少儿(7-15岁)'},
                    {id: 3, title: '青年(16-35岁)'},
                    {id: 4, title: '中年(36-60岁)'},
                    {id: 5, title: '老年(61-99岁)'},
                ],
                anyQuestions: '',
                modelType: [],
                serach: '',
                age: '',
                sex: '',
                selList: [],
                weightList: [
                    {id: 1, title: '不重要'},
                    {id: 2, title: '稍微重要'},{id: 3, title: '一般重要'},
                    {id: 4, title: '比较重要'},{id: 5, title: '非常重要'},
                ],
                deduct_weight: 0,
                deduct_reason: '',
                title: '添加',
                typePane: '',
                mainData: {},
                secondData: [],
                threeData: [],
                secondData2: [],
                threeData2: [],
                typeTit: ['问诊','查体','辅检','诊疗'],
                caseNO,
                case_id: { case_id: +sessionStorage.getItem('CASEID') },
                loading1: false,
                isEdit: false,
                isAdd: false,
                item_type: 1,
                caseType: '',
                correct,
                error,
                answers: '',
                talk_id: null,
                element_id: 0,
                question_index: 0,
                selectList: [],
                creatItem: null,
                phyItem: '',
                result_text: '',
                upload_file: [],
                fileType: '',
                assisTable: [],
                selectedData: [],
                media: null,
                editItem: null
            }
        },
        computed: {
            setItemType(){
                return this.type == 1&&this.isTerm() || this.type == 2&&this.isTerm()&&this.isEdit || this.type == 3&&this.isTerm()&&this.isEdit || this.type == 4&&this.isTerm()&&this.isNursing
            },
            setFileType(){
                return this.type == 3&&this.isEdit
            },
            isDiagnosis(){
                return this.type == 4&&this.isAdd&&this.diagnosisTypes == 2
            },
            isDiagnosisNo(){
                if(this.type == 4&&this.isAdd)  return this.diagnosisTypes == 0 || this.diagnosisTypes == 2
                return false
            },
            allAdd(){
                return this.type == 2&&this.isAdd || this.type == 3&&this.isAdd || this.type == 4&&this.isAdd
            },
            isLineShow(){
                return this.type == 1 || this.type == 2&&this.isEdit || this.type == 3&&this.isEdit
            },
            allEdit(){
                return this.type == 2&&this.isEdit || this.type == 3&&this.isEdit || this.type == 4&&this.isEdit
            },
            setClass(){
                return this.allAdd ? 'operation-right4' : this.allEdit ? 'operation-right-edit' : 'operation-right1'
            },
            showBtn(){
                if(this.type == 2&&this.isAdd || this.type == 3&&this.isAdd) return false
                return true
            }
        },
        methods: {
            seeFile(t){
                this.filesType = 6
                this.showModal = true
                let d = {
                    detail: [{report: t.report}],
                    type: 'ImageData'
                }
                this.detailData = d
            },
            closeModal(){
                this.showModal = false
            },
            nursingDrugsData(d){
                this.diagnosisData = d
            },
            handleChangeOnSelect (value) {
              this.changeOnSelect = value
            },
            loadDatas(item, callback) {
                item.loading = true;
                setTimeout(() => {
                    if (item.value == 9) {
                        PostData('case/getMedicineCategoryTree',{medicine_type: item.value, frequency_id: this.diagnosisId}).then((r) => {
                            if(r&&r.data) item.children = r.data
                            item.loading = false;
                            callback();
                        })
                    }
                }, 100);
            },
            deleteUpload(index) {
                this.upload_file.splice(index, 1)
            },
            cascaderType(v,selectedData){
                this.modelType = v
                this.selectedData = selectedData
                if(this.isAddForm()) this.getPhyList()
                else this.getSelTreat()
            },
            getSerach(){
                if(this.isAddForm()) this.getPhyList()
                else this.getSerachTreat()
            },
            getSerachTreat(){
               if(this.modelType&&this.modelType.length == 4) this.getSelTreat()
               else this.$Message.info('请选择类型！');
            },
            getSelTreatData(){
                let id1 = this.modelType[0]
                if(this.isTerm()) this.element_id = id1 == 1 ? 3 :  id1 == 2 ? 1 :  id1 == 3 ? 2 : ''
                this.diagnosisTypes = id1
                if(id1 == 3 || id1 == 1)  {
                    this.isNursing = id1
                }
                if(id1 == 2) {
                    this.isNursing = 0
                    if(this.modelType.length == 4){
                        let d = {
                            category_id: this.modelType[3],
                            medicine_type: this.modelType[1],
                            keyword: this.serach,
                            frequency_id: this.diagnosisId,
                            ...this.case_id,
                            case_treatment_id: +sessionStorage.getItem('CaseTreatment')
                        }
                        PostData('case/getMedicineList', d).then((r) => {
                            if(r&&r.data) {
                                this.phyList = r.data
                                if(r.data.length == 0) this.$Message.info('暂无数据！');
                                this.actPhy = ''
                            }
                        })
                    }
                }
            },
            getSelTreat(){
                this.$nextTick(() => { this.getSelTreatData() })
            },
            addTable() {
                this.assisTable.push({abbreviation: "", name: "", refvalue: "", units: "", value: "",})
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
            deleteMediaUpload(){
                this.media = null
            },
            inputChange(row, index) {
                this.assisTable[index] = row
            },
            uploadType(val) {
                let arr = val.resultName.split('/');
                this.media = {
                    media_name: val.name,
                    report: arr.splice(4, arr.length).join('/')
                }
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
                    if(this.fileType == val.type) this.setUploadImg(val)
                    else this.$Message.info('只能上传多个同类型文件！')
                }else this.setUploadImg(val)
            },
            selPhyItem(t,i){
                if(t.is_exist == 0){
                    this.actPhy = i
                    this.actItem = t
                    if(this.type == 2 || this.type == 3){
                        let text = t.second_name&&t.second_name != 'null' ? t.second_name + '>' : ''
                        t.item = t.first_name + '>' + text + t.third_name
                        this.setEdit(this.editItem, t, this.typePane)
                    }
                }else this.$Message.info('已存在！')
            },
            getPhyData(){
                if(this.isTerm()) this.element_id = this.modelType[0]
                let len = this.modelType.length
                let da = len&&len==1 ? {first_id: this.modelType[0]} : len&&len==2 ? { second_id: this.modelType.length>0&&this.modelType[1] } : {}
                let d = {
                    ...this.case_id,
                    ...da,
                    keyword: this.serach,
                    frequency_id: this.diagnosisId
                }
                let url = ['getItemListBySecondId','getItemListByParentId']
                PostData('case/' + url[this.type - 2], d).then((r) => {
                    if(r&&r.data) {
                        this.phyList = r.data
                        this.actPhy = ''
                    }
                })
            },
            getPhyList(){
                this.$nextTick(() => { this.getPhyData() })
            },
            isAddForm(){
                return this.type == 2&&this.isAdd || this.type == 3&&this.isAdd
            },
            isDiagnosisShow(){
                return this.type == 1 || this.type == 2&&this.isEdit || this.type == 3&&this.isEdit
            },
            isTerm(){
                return this.typePane&&this.typePane == 'term'
            },
            selType(){
            //    if(!this.isEdit) this.talk_id = null;
               if(this.type == 1&&this.isTerm()) this.element_id = this.caseType
            },
            setDisable(i, bool, name, type = ''){
                let d1 = this.$config.copy(this[name][i])
                let d2 = this.$config.copy(this[name+'2'][i])
                if(type&&type == 'exclude'){
                    d2.check = bool
                    d1.disables = bool
                }else{
                    d1.check = bool
                    d2.disables = bool
                }
                this[name][i] = d1
                this[name+'2'][i] = d2
            },
            selectMainDegree(weight){
                this.mainData.weight = weight;
            },
            setDegree(i, weight, name){
                let d1 = this.$config.copy(this[name][i])
                d1.weight = weight
                this[name][i] = d1
            },
            selectDegree(i, type ,weight){
                if(type == 2) this.setDegree(i, weight, 'secondData')
                if(type == 4) this.setDegree(i, weight, 'secondData2')
                if(type == 3) this.setDegree(i, weight, 'threeData')
                if(type == 5) this.setDegree(i, weight, 'threeData2')
            },
            contact1(bool, i, type){
                if(type == 2) this.setDisable(i, bool, 'secondData')
                if(type == 4) this.setDisable(i, bool, 'secondData' ,'exclude')
                if(type == 3) this.setDisable(i, bool, 'threeData')
                if(type == 5) this.setDisable(i, bool, 'threeData', 'exclude')
                this.$forceUpdate()
            },
            mainContact(bool){
                this.mainData.check = bool;
            },
            selQus(t){
                if(typeof t == 'string'){
                    this.anyQuestions = t
                    // if(!this.isEdit) this.talk_id = null
                }else{
                    this.talk_id = t.id
                    this.question_index = t.question_index
                    this.caseType = t.talk_group
                    if(this.type == 1&&this.isTerm()) this.element_id = t.talk_group
                    this.anyQuestions = t.question
                    this.answers = t.answer
                }
            },
            getSel() {
                PostData('case/getTalkTree', {...this.case_id, frequency_id: this.diagnosisId}).then((r) => {
                    if (r && r.data && r.data.length > 0) this.selectList = r.data;
                })
            },
            clearData(name){
                if(this[name]&&this[name].length>0){
                    this[name].map((t) => {
                        t.check = false;
                        t.disables = false;
                    })
                }
            },
            clearForm(){
                this.diagnosisFm = { reason: '', weight: 0, operation: '' }
                this.diagnosisData = new Array(6).fill(null)
                this.drugContents = new Array(6).fill(null)
                this.inputContents = []
            },
            clear(){
                this.caseType = ''
                this.talk_id = null
                this.answers = ''
                this.mainData.check = false;
                this.anyQuestions = ''
                this.deduct_reason = ''
                this.deduct_weight = 0
                this.clearData('secondData')
                this.clearData('secondData2')
                this.clearData('threeData')
                this.clearData('threeData2')
                this.upload_file = []
                this.result_text = ''
                this.modelType = []
                this.selectedData = []
                this.serach = ''
                this.actPhy = ''
                this.phyList = []
                this.assisTable = []
                this.media = null
                if(this.type == 4) this.clearForm()
            },
            setDiagnosesItem(d, type = false){
                let name = ['id','case_diagnose_id','case_diagnose_id'][this.type - 1]
                return {
                    case_diagnose_id: d[name],
                    basis_type: type ? 'SupportingBasis' : 'NonSupportingBasis',  // true 支持
                    weight: d.weight,
                }
            },
            getDiagnosesData(){
                let arr = []
                if(this.mainData.check) arr.push(this.setDiagnosesItem(this.mainData, true))
                this.secondData.map((t) => {
                    if(t.check) arr.push(this.setDiagnosesItem(t, true))
                })
                this.secondData2.map((t) => {
                    if(t.check) arr.push(this.setDiagnosesItem(t))
                })
                this.threeData.map((t) => {
                    if(t.check) arr.push(this.setDiagnosesItem(t, true))
                })
                this.threeData2.map((t) => {
                    if(t.check) arr.push(this.setDiagnosesItem(t))
                })
                return arr
            },
            addSuccess(r){
                this.$Message.success(r.msg);
                console.log(this.element_id,'this.element_id')
                $CaseSuccessfulOperation.$emit('CaseSuccessfulOperation', this.element_id)
            },
            addInterrogation(d){
                PostData('case/operateTalkBasis', {...d, frequency_id: this.diagnosisId}).then((r) => {
                    if(r.res_code == 1) this.addSuccess(r)
                })
            },
            verInterrogation(name, text){
                if(this[name]) return true
                else {
                   this.$Message.info(text); 
                   return false
                }
            },
            sendInterrogation(d){
                if(this.verInterrogation('caseType','请选择类型！')&&this.verInterrogation('anyQuestions','请输入提问！')&&this.verInterrogation('answers','请输入回答！')){
                    this.addInterrogation(d)
                }
            },
            isDiagnosesNo(fn){
                if(this.item_type === 1){
                    let d1 = this.getDiagnosesData()
                    if(d1.length>0) fn()
                    else this.$Message.info('请选择诊断！');
                }else if(this.item_type == 2) fn()
                else if(this.item_type == 3){
                    if(this.deduct_weight) fn()
                    else this.$Message.info('请选择扣分权重！');
                }
            },
            Interrogation(){
                let da = {
                    ...this.case_id,
                    talk_group: this.caseType,
                    question: this.anyQuestions,
                    talk_id: this.talk_id,
                    frequency_id: this.diagnosisId
                }
                let d = {
                    ...da,
                    answer: this.answers,
                    case_diagnoses: this.getDiagnosesData(),
                    question_index: this.question_index,
                    element_id: this.element_id,
                    item_type: this.item_type,
                    deduct_reason : this.deduct_reason,
                    deduct_weight: this.deduct_weight,
                }
                // PostData('case/isExistBasis',da).then((r) => {
                //     if(r&&r.res_code == 1) this.sendInterrogation(d)
                // })
                this.sendInterrogation(d)
            },
            physicalExam(){
                let d = { }
                if(this.actItem&&this.actItem.id&&this.isEdit){
                    d = this.actItem;
                    d.physical_id = d.id;
                    d.element_id = this.element_id
                    d.item_type = this.item_type
                    if(this.isEdit) {
                        d.datas = this.upload_file;
                        d.result_text = this.result_text;
                        d.case_diagnoses = this.getDiagnosesData()
                        d.result_media_type = this.fileType || 'None'
                        d.deduct_reason = this.deduct_reason
                        d.deduct_weight = this.deduct_weight
                    }
                    PostData("case/operatePhysicalBasis", {...d, frequency_id: this.diagnosisId}).then((r) => {
                        if(r&&r.res_code == 1){
                            if(this.isAdd) this.actItem = null
                            this.addSuccess(r)
                        }
                    })
                }else this.$Message.info('请选择类别！');
            },
            supplementaryExam(){
                let d = {}
                if(this.actItem&&this.actItem.id){
                    d = this.actItem
                    d.element_id = this.element_id
                    d.assist_id = d.id
                    d.item_type = this.item_type
                    if(this.isEdit){
                        if(this.data_type == 'ImageData')  d.media = this.media
                        if(this.data_type == 'ExaminationReport')  d.media = this.assisTable
                        d.type = d.media&&d.media.length>0 ? this.data_type : 'None'
                        d.case_diagnoses = this.getDiagnosesData()
                        d.deduct_reason = this.deduct_reason
                        d.deduct_weight = this.deduct_weight
                    }
                    if(this.isAdd) d.action_type = 'add'
                    if(this.isEdit) d.action_type = 'modify'
                    PostData('case/operateAssistBasis', {...d, frequency_id: this.diagnosisId}).then((r) => {
                        if(r.res_code == 1) this.addSuccess(r)
                    })
                }else this.$Message.info('请选择类别！');
            },
            verification(type){
                let bool = true;
                let d = type == 2 ? this.drugInput : this.nursingInput;
                for (let i=0; i < d.length; i++) {
                    let t = this.drugContents[i]
                    if(t&&t != null&&t != 'null'){
                        if(Array.isArray(t)){
                            if(t.length>0) bool = bool&&true
                            else {
                                this.$Message.info(d[i].hint);
                                bool = bool&&false;
                            }
                        }else bool = bool&&true
                    } else {
                        this.$Message.info(d[i].hint);
                        bool = bool&&false;
                    }
                    if(!bool) break;
                }
                return bool
            },
            verDiagnosisFm(name, text){
                let bool = false
                if(this.diagnosisFm[name]) bool = true
                else this.$Message.info(text);
                return bool
            },
            pleaseChoose(fn){
                let t = this.actItem
                if(this.isAdd){
                    if(t&&t.id){
                        fn()
                    }else this.$Message.info('请选择类型！');
                }
                if(this.isEdit){
                    if(this.verification(2)&&this.verDiagnosisFm('reason', '请输入应用理由！')&&this.isNursingBasis()) fn()
                }
            },
            pleaseWeight(name,text){
                let bool = false
                text = text || '请选择得分权重！'
                name = name || 'weight'
                if(this.diagnosisFm[name] || name=='weight'&&this.item_type == 2 || name=='weight'&&this.item_type == 3) bool = true
                else this.$Message.info(text);
                return bool
            },
            addOperation(){
                if(this.pleaseWeight('operation','请输入手术名称!')&&this.verDiagnosisFm('reason', '请输入应用理由！')&&this.isNursingBasis()){
                    let t = this.actItem
                    let d = {
                        ...this.case_id,
                        case_treatment_id: +sessionStorage.getItem('CaseTreatment'),
                        operation: this.diagnosisFm.operation,
                        element_id: this.element_id,
                        reason_for_using: this.diagnosisFm.reason,
                        weight: this.diagnosisFm.weight,
                        item_type: this.item_type,
                        deduct_reason : this.deduct_reason,
                        deduct_weight: this.deduct_weight,
                    }
                    if(this.isEdit) d.id = t.id
                    let url = this.isAdd ? 'addOperation' : 'modifyOperation'
                    PostData('case/' + url, {...d, frequency_id: this.diagnosisId}).then((r) => {
                        if(r.res_code == 1) {
                            if(this.isAdd) this.actItem = null
                            this.addSuccess(r)
                        }
                    })
                }
            },
            setFiled(i, name1, name2){
                let d = this.diagnosisData[i]
                if(d&&d.length>0) {
                    let arr = []
                    d.map((t,l) => {
                        let da = {}
                        da[name1] = t.value
                        da[name2] = t.label
                        if(name2 == 'manipulation') da.manipulation_content = this.inputContents[l]
                        arr[l] = da
                    })
                    return arr
                }
                return null
            },
            velOperation(){
                let bool = true
                let d = this.drugContents[5]
                if(this.inputContents&&this.inputContents.length>0){
                    for (let i=0; i < d.length; i++) {
                        if(this.inputContents[i]) bool = bool&&true
                        else {
                            this.$Message.info('请输入操作内容！');
                            bool = bool&&false;
                        }
                        if(!bool) break;
                    }
                }else {
                    this.$Message.info('请输入操作内容！');
                    bool = bool&&false;
                }
                return bool
            },
            isNursingBasis(){
                if(this.item_type == 1) return this.verDiagnosisFm('weight', '请选择得分权重！')
                else if(this.item_type == 2) return true
                else if(this.item_type == 3){
                    if(this.deduct_weight) return true
                    else {
                        this.$Message.info('请选择扣分权重！');
                        return false
                    }
                }
            },
            addNursing(){
                if(this.verification(3)&&this.velOperation()&&this.verDiagnosisFm('reason', '请输入应用理由！')&&this.isNursingBasis()){
                    let d = this.diagnosisData
                    let da = {
                        ...this.case_id,
                        case_treatment_id: +sessionStorage.getItem('CaseTreatment'),
                        reason_for_using: this.diagnosisFm.reason,
                        diets: this.setFiled(2,'diet_id','diet'),
                        manipulations: this.setFiled(5,'manipulation_id','manipulation'), //{manipulation, manipulation_id},//操作 case_treatment_manipulation(多选)
                        nursings: this.setFiled(4,'nursing_id','nursing'),//{nursing, nursing_id},//护理 case_treatment_nursing(多选)
                        nursing_level: d[0]&&d[0].label || null,
                        nursing_level_id: this.drugContents[0],//护理等级case_treatment_nursing_level
                        nursing_routine: this.drugContents[1],//护理常规 case_treatment_nursing_routine
                        position: d[3]&&d[3].label || null,
                        position_id: this.drugContents[3],//体位 case_treatment_position
                        weight: this.diagnosisFm.weight,
                        element_id: this.element_id,
                        item_type: this.item_type,
                        deduct_reason : this.deduct_reason,
                        deduct_weight: this.deduct_weight,
                        frequency_id: this.diagnosisId
                    }
                    if(this.isEdit) da.id = this.actItem.id
                    PostData('case/operateNursing',da).then((r) => {
                        if(r.res_code == 1) this.addSuccess(r)
                    })
                }
            },
            addDrugs(){
                let t = this.actItem
                let dl = this.diagnosisData
                let da = {
                    ...this.case_id,
                    case_treatment_id: +sessionStorage.getItem('CaseTreatment'),
                    element_id: this.element_id,
                    item_type: this.item_type,
                    deduct_reason : this.deduct_reason,
                    deduct_weight: this.deduct_weight,
                }
                let d = {}
                if(this.isAdd){
                     d = {
                        ...da,
                        medicine_id: t.id,
                        medicine_name: t.name,
                        medicine_type: this.modelType[1],
                        primary_id: this.modelType[2],
                        secondary_id: this.modelType[3],
                        primary_classification: this.selectedData[2].label,
                        secondary_classification: this.selectedData[3].label
                    }
                }
                if(this.isEdit){
                    d = {
                        ...da,
                        id: t.id,
                        usage_id: this.drugContents[0],
                        usage: dl[0]&&dl[0].label || null,
                        dosage: this.drugContents[1],
                        frequency_id: this.drugContents[2],
                        frequency: dl[2]&&dl[2].label || null,
                        reason_for_using: this.diagnosisFm.reason,
                        weight: this.diagnosisFm.weight,
                    }
                }
                let url = this.isAdd ? 'addMedicine' : 'modifyMedicine'
                PostData('case/' + url, {...d, frequency_id: this.diagnosisId}).then((r) => {
                    if(r.res_code == 1){
                        if(this.isAdd) this.actItem = null
                        if(this.phyList&&this.phyList.length>0){
                            let t = this.phyList[this.actPhy]
                            t.is_exist = 1
                            this.phyList.splice(this.actPhy,1,t)
                        }
                        this.addSuccess(r)
                    }
                })
            },
            diagnosisDetails(){
                if(this.diagnosisTypes == 1) this.addOperation()
                if(this.diagnosisTypes == 2) this.pleaseChoose(() => { this.addDrugs() })
                if(this.diagnosisTypes == 3) this.addNursing()
            },
            determine(){
                if(this.type <4 ){
                    this.isDiagnosesNo(() => {
                        if(this.type == 1) this.Interrogation()
                        if(this.type == 2) this.physicalExam()
                        if(this.type == 3) this.supplementaryExam()
                    })
                }
                if(this.type == 4) this.diagnosisDetails()
            },
            editInitDiagnose(t, type1, type2, name){
                let d1 = this.$config.copy(this[name], [])
                let name2 = name.includes('2') ? name.slice(0,name.length-1) : name + '2'
                let d2 = this.$config.copy(this[name2], [])
                if(t.type == type1){
                    if(t.basis_type == type2) {
                        d1.map((it) => {
                            if(it.id == t.case_diagnose_id) {
                                it.check = true
                                it.disables = false
                                it.weight = t.weight
                            }
                        })
                        d2.map((it) => {
                            if(it.id == t.case_diagnose_id) {
                                it.check = false
                                it.disables = true
                            }
                        })
                    }
                }
                this[name] = d1
                this[name2] = d2
            },
            getTalkDiagnose(question_index){
               let url = ['getTalkDiagnose','getPhysicalDiagnose','getAssistDiagnose'][this.type - 1]
               let d = this.type == 1 ? {question_index} :
               this.type == 2&&this.isEdit ? {physical_id: this.actItem&&this.actItem.id} :
               this.type == 3&&this.isEdit ? {assist_id: this.actItem&&this.actItem.id} : {}
               PostData('case/' + url, {...this.case_id,...d, frequency_id: this.diagnosisId}).then((r) => {
                   if(r&&r.data&&r.data.length>0){
                        r.data.map((t) => {
                            if(t.type == 'PrincipalDiagnosis'&&t.basis_type == 'SupportingBasis')  {
                                this.mainData.check = true
                                this.mainData.weight = t.weight || 0
                            }
                            if(t.basis_type == 'SupportingBasis'){
                                this.editInitDiagnose(t, 'SecondaryDiagnosis', 'SupportingBasis', 'secondData')
                                this.editInitDiagnose(t, 'DifferentialDiagnosis', 'SupportingBasis', 'threeData')
                            }
                            if(t.basis_type == 'NonSupportingBasis'){
                                this.editInitDiagnose(t, 'SecondaryDiagnosis', 'NonSupportingBasis', 'secondData2')
                                this.editInitDiagnose(t, 'DifferentialDiagnosis', 'NonSupportingBasis', 'threeData2')
                            }
                            this.$forceUpdate()
                        })
                   }
               })
            },
            getDetail(){
                // let url = this.type == 1 ? 'case/getMockDiagnoses' : this.type == 2 ? 'case/getPhysicalDiagnose' : ''
                // let d = this.type == 1 ? this.case_id : this.type == 2&&this.isEdit ? {...this.case_id, physical_id: this.actItem&&this.actItem.id} : {}
                PostData('case/getMockDiagnoses', {...this.case_id, frequency_id: this.diagnosisId}).then((r) => {
                    if(r&&r.data){
                        this.mainData = {}
                        this.secondData = []
                        this.secondData2 = []
                        this.threeData = []
                        this.threeData2 = []
                        r.data.map((t) => {
                            t.case_diagnose_id = t.id
                            t.check = false;
                            if(t.type == 'SecondaryDiagnosis' || t.type == 'DifferentialDiagnosis') t.disables = false
                            if(t.type == "PrincipalDiagnosis") this.mainData = t;
                            if(t.type == 'SecondaryDiagnosis') {
                                this.secondData.push(t)
                                this.secondData2.push(t)
                            }
                            if(t.type == 'DifferentialDiagnosis') {
                                this.threeData.push(t)
                                this.threeData2.push(t)
                            }
                        })
                    }
                })
            },
            editType2(item, t){
                let type = this.type == 2
                let name = this.isTerm() ? 'first_id' : 'id'
                this.element_id = item[name]
                this.phyItem = t.item
                if(type) this.result_text = t.result_text
                let url = type ? 'case/getResultById' : 'case/getAssistResultById'
                PostData(url, {id: t.id, frequency_id: this.diagnosisId}).then((r) => {
                    if(r&&r.data)  {
                        this.actItem = r.data
                        this.thirdName = r.data.third_name
                        let d = r.data.media || []
                        if(type) this.upload_file = d
                        else{
                            this.data_type = r.data.type
                            this.assisTable = []
                            this.media = null
                            if(r.data.type == 'ExaminationReport') this.assisTable = d
                            else if(r.data.type == 'ImageData') {
                                this.media = d
                                if(!d.media_name&&d.report){
                                    let arr = d.report.split('/')
                                    this.media.media_name = arr[arr.length-1];
                                }
                            }
                        }
                        this.item_type = r.data.item_type || 1
                        this.deduct_reason = r.data.deduct_reason
                        this.deduct_weight = r.data.deduct_weight
                        if(d&&d.length>0)  this.fileType = d[0].result_media_type
                        this.getTalkDiagnose()
                    }
                })
            },
            editType1(item, t){
                this.element_id = item.id
                this.question_index = t.question_index
                this.$nextTick(() => {
                    this.caseType = this.isTerm() ? item.talk_group : t.talk_group
                })
                this.talk_id = t.id
                this.answers = t.answer
                this.anyQuestions = t.question
                if(t.question_index) this.getTalkDiagnose(t.question_index)
                if(t.item_type == 3) {
                    this.deduct_reason = t.deduct_reason
                    this.deduct_weight = t.deduct_weight
                }
            },
            getIds(d, id){
                let arr = []
                d.map((k) => { arr.push(k[id]) })
                return arr
            },
            setEditItem(t, name, name2, name3){
                let arr = []
                this.inputContents = []
                if(t[name]&&t[name].length>0){
                    t[name].map((t) => {
                        arr.push({
                            value: t[name2],
                            label: t[name3]
                        })
                        if(name == 'manipulations') {
                            this.inputContents.push(t.manipulation_content)
                        }
                    })
                }
                return arr
            },
            editType4(item, t){
                this.element_id = item.id
                if(t.type == 'operation') {
                    this.isNursing = 1
                    this.diagnosisTypes = 1
                    this.diagnosisFm.operation = t.operation
                    this.diagnosisTitle = '手术'
                }
                if(t.type == 'treat'){
                    this.diagnosisData = [
                        {value: t.nursing_level_id , label: t.nursing_level},
                        null,
                        this.setEditItem(t, 'diets', 'diet_id', 'diet'),
                        {value: t.position_id , label: t.position},
                        this.setEditItem(t, 'nursings', 'nursing_id', 'nursing'),
                        this.setEditItem(t, 'manipulations', 'manipulation_id', 'manipulation'),
                    ]
                    this.isNursing = 3
                    this.diagnosisTypes = 3
                    this.diagnosisTitle = '护理'
                    this.drugContents = [
                        t.nursing_level_id, t.nursing_routine, this.getIds(t.diets, 'diet_id'),
                        t.position_id, this.getIds(t.nursings, 'nursing_id'), this.getIds(t.manipulations, 'manipulation_id')
                    ]
                    this.inputContents = this.getIds(t.manipulations, 'manipulation_content')
                }
                if(t.type == 'medicine') {
                    this.diagnosisData = [{value: t.usage_id , label: t.usage},null,{value: t.frequency_id , label: t.frequency}]
                    this.isNursing = 2
                    this.diagnosisTypes = 2
                    this.medicineNum = t.medicine_type == '西药' ? 6 : t.medicine_type == '中药' ? 9 : ''
                    this.drugContents = [t.usage_id, t.dosage, t.frequency_id]
                    this.diagnosisTitle = t.content
                }
                this.actItem = t
                this.diagnosisFm.reason = t.reason_for_using
                this.diagnosisFm.weight = t.weight
            },
            setEdit(item, t, typePane){
                console.log(t,'tt')
                this.clear()
                this.item_type = 1
                this.isEdit = true
                this.isAdd = false
                this.title = '编辑'
                if(this.type == 1) this.editType1(item, t)
                if(this.type == 2 || this.type == 3) this.editType2(item, t)
                if(this.type == 4) this.editType4(item, t)
                this.typePane = typePane
                if(this.isTerm()) {
                    if(t.item_type>1) this.item_type = t.item_type
                }
            },
            getPhyTypes(url){
                PostData(url, {...this.case_id, frequency_id: this.diagnosisId}).then((r) => {
                    if(r&&r.data) this.selList = r.data
                })
            },
            getTreatTypes(){
                let o1 = (n, name, children) => {
                    return  {
                        value: n,
                        label: name,
                        children: children ? children : [],
                    }
                }
                let childrens = [{...o1(6,'西药'), loading: false},{...o1(9,'中成药'), loading: false}]
                let d = [o1(1,'手术'),o1(2,'药品',childrens),o1(3,'护理')]
                PostData('case/getMedicineCategoryTree',{medicine_type: 6, frequency_id: this.diagnosisId}).then((r) => {
                    if(r&&r.data){
                        d[1].children[0].children = r.data
                        this.selList = d
                    }else  this.selList = d
                })
            },
            setCascader(d){
                if(d[0].hasOwnProperty('children')&&d[0].children.length>0){
                    let d1 = d[0].children;
                    this.modelType.push(d1[0].value)
                    this.selectedData.push({value: d1[0].value, label: d1[0].label})
                    if(d1[0].hasOwnProperty('children')&&d1[0].children.length>0){
                        let d2 = d1[0].children;
                        this.modelType.push(d2[0].value)
                        this.selectedData.push({value: d2[0].value, label: d2[0].label})
                        if(this.type == 4) this.getSelTreatData()
                    }
                }
            },
            setCascaderInit(id){
                if(this.selList.length>0){
                    this.modelType = [];
                    this.selectedData = [];
                    this.selList.map((t,i) => {
                        if(t.value == id) {
                            if(t.hasOwnProperty('children')&&t.children.length>0){
                                let d = t.children;
                                this.modelType = [id, d[0].value]
                                this.selectedData = [{value: t.value, label: t.label},{value: d[0].value, label: d[0].label}]
                                this.setCascader(d)
                                if(this.type == 2 || this.type == 3) this.getPhyData()
                            }else{
                                this.modelType = [id]
                                this.selectedData = [{value: t.value, label: t.label}]
                                if(this.type == 2 || this.type == 3) this.getPhyData()
                            }
                        }
                    })
                }
            },
            setCaseAdd(id, typePane, t){
                console.log(t,"kk", id)
                if(this.$refs.MainView) this.$refs.MainView.scrollTop = 0
                this.editItem = t
                this.isNursing = 0
                this.item_type = 1
                this.typePane = typePane
                this.isAdd = true
                this.isEdit = false
                this.element_id = id
                this.clear()
                this.title = '添加'
                if(this.isTerm()){
                    this.$nextTick(() => {
                        if(this.type == 1) this.caseType = id
                        if(this.type == 2) this.setCascaderInit(id)
                        if(this.type == 3) this.setCascaderInit(id)
                        if(this.type == 4){
                            let arr = {'operation':1 ,'medicine': 2,'treat': 3}
                            let id1 = arr[t.type]
                            this.element_id = id1 == 1 ? 3 :  id1 == 2 ? 1 :  id1 == 3 ? 2 : ''
                            this.diagnosisTypes = id1
                            console.log(id1,'id1')
                            if(id1 == 3 || id1 == 1)  {
                                this.isNursing = id1
                                this.modelType = [id1]
                            }
                            if(id1 == 2) this.setCascaderInit(2) 
                        }
                    })
                }
            }
        },
        beforeDestroy () {
            $CaseEdit.$off('CaseEdit', this.setEdit)
            $CaseAdd.$off('CaseAdd', this.setCaseAdd)
        },
        mounted() {
            this.getDetail()
            if(this.type == 1) this.getSel()
            if(this.type == 2) this.getPhyTypes('case/getPhysicalTreeByCaseId')
            if(this.type == 3) this.getPhyTypes('case/getAssistTreeByCaseId')
            if(this.type == 4) this.getTreatTypes()
            $CaseEdit.$on('CaseEdit', this.setEdit)
            $CaseAdd.$on('CaseAdd', this.setCaseAdd)
        }
    }
</script>

<style lang="less" scoped>
        /deep/ .operation-right-edit{
            height: 598px;
        }
        .line {
            margin-top: 20px;
            height: 1px;
            border-bottom: 1px dashed #ABB7C5;
            margin-bottom: 20px;
        }
        .media-img{
            width: 14px;
            height: 16px;
        }
        /deep/.table-name1{
            .ivu-input{
                text-align: left !important;
            }
        }
        .assis-table-no{
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-add-btn {
            width: 86px;
            height: 30px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #474C63;
            background-color: #fff;
            margin-right: 10px;
        }
        .btn-box {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
      .upload-mold {
        margin-top: 10px;
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
    }
    .tables{
        margin: 0 5px
    }
    /deep/.ivu-table-cell{
        font-size: 14px !important
    }
    .show-media{
        visibility: visible;
    }
    .hide-media{
        visibility: hidden;
    }
    .case-ifram{
        width: 100%;
        height: 550px;
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
    .act-phy-view{
        background-color: rgba(240,240,247,0.8);
        color: #4098FF;
    }
    .dis-phy-view{
        background-color: #f3f3f3;
    }
    .de-phy-view{
        color: #474C63;
        &:hover{
            .act-phy-view;
        }
    }
    .phy-view{
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 0 20px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        padding-left: 20px;
        cursor: pointer;
    }
    .case-no{
        width: 232px;
        height: 174px;
    }
    .case-no2{
        width: 232px;
        height: 174px;
        margin-top: 60px;
    }
    .case-no-text{
        margin-top: 10px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #9397AD;
    }
    .phy{
        margin: 0 20px;
        .phy-item{
           margin: 10px 0;
           text-align: left;
        }
        .file-type{
            margin: 8px 0;
            font-family: PingFangSC-Regular;
            font-size: 10px;
            color: #A4A9C0;
            text-align: left;
        }
    }
    .titles{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
        height: 49px;
        width: inherit;
        line-height: 49px;
        text-align: center;
        border-bottom: 1px solid #f0f0f7;
    }
    .title {
        .titles;
    }
    .add-form{
        height: 54px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 0 20px;
        .item-sel{
            display: flex;
            flex-direction: row;
            .items{
                width: 223px;
                height: 34px;
                line-height: 34px;
                display: flex;
                flex-direction: row;
                .items-text{
                    margin-right: 10px;
                }
                .items-check{
                    width: 183px
                }
            }
            .item-right{
                margin-left: 14px;
                text-align: right;
            }
        }
    }
    .size{
        width: inherit;
    }
    .item{
        margin-top: 15px;
        display: flex;
        flex-direction: row;
    }
    .operation-right{
       .size;
    }
    .operation-right4{
        height: 503px;
    }
    .operation-rights{
        height: 544px;
    }
    .operation-right1{
        height: 648px;
    }
    .operation-no{
       .size;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
       position: relative;
    }
    /deep/ .ivu-input,
    /deep/.ivu-select {
        border-radius: 4px !important;
    }
    /deep/ .ivu-radio-wrapper{
        margin-right: 30px !important;
    }
    /deep/ .ivu-radio{
        margin-right: 10px !important;
    }
    .img {
        width: 16px;
        height: 16px;
    }
    .main-right {
        .size;
        position: relative;
        .main-types{
            height: 445px;
        }
        .main-type1{
            height: 531px;
        }
        .main-view{
            width: inherit;
            overflow: hidden;
            overflow-y: auto;
            .term{
                height: 34px;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                .term-title{
                    margin-right: 30px;
                }
            }
            .diagnosis {
                padding: 0 40px;
                .item-weigh{
                    .item;
                    justify-content: flex-start;
                    margin-bottom: 15px;
                    .item-type {
                        margin-top: 10px;
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #474C63;
                        margin-right: 10px;
                    }
                }
                .support {
                    display: flex;
                    flex-direction: row;
                    .support-details {
                        display: flex;
                        flex-direction: column;
                        margin-left: 8px;
                        flex: 1;
                        .diagnosis-title {
                            height: 16px;
                            line-height: 16px;
                            text-align: left;
                            margin-bottom: 15px;
                        }
                    }
                }
            }
            .item-form {
                .item;
                height: 34px;
                align-items: center;
                justify-content: center;
                .item-type {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #474C63;
                }
                .case-type {
                    width: 380px;
                    height: 34px;
                    margin-left: 10px;
                    border-radius: 4px;
                }
            }
        }
    }
    .case-btn-box{
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 10px;
        margin-left: 120px;
        .case-btn-last{
            width: 120px;
            height: 36px;
            background-color: #fff;
            color: #4098ff;
        }
        .case-btn{
            width: 120px;
            height: 36px;
            margin-left: 20px;
        }
    }
</style>
