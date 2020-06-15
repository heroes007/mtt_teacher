<template>
    <div class="treatment-right">
        <div class="titles">依据详情</div>
        <div class="operation-left-basiss" v-if="!isEdit">暂无依据</div>
        <div class="treatment-nursing">
            <nursing-drugs :itemType="1" @nursing-drugs-data="nursingDrugsData" :diagnosisTitle="diagnosisTitle" :medicineNum="medicineNum" :diagnosisData="diagnosisData" :isEdit="isEdit" :diagnosisFm="diagnosisFm" :inputContents="inputContents" :drugContents="drugContents" :type="isNursing" />
        </div>
        <div v-if="isEdit" class="case-btn-box">
            <Button class="case-btn" @click="determine" type="primary">确定</Button>
        </div>
    </div>
</template>

<script>
    import NursingDrugs from '../../details-diagnosis/com/nursing-drugs'
    import nursings from '../../details-diagnosis/com/nursing-drug'
    export default {
        components: { NursingDrugs },
        data() {
            return {
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
                isEdit: false,
                case_id: { case_id: +sessionStorage.getItem('CASEID') },
                caseTreatment: +sessionStorage.getItem('CaseTreatment'),
                activeType: null
            }
        },
        methods: {
            nursingDrugsData(d){
                this.diagnosisData = d
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
                    }else this.$Message.info('请选择类别！');
                }
                if(this.isEdit){
                    if(this.verification(2)&&this.verDiagnosisFm('reason', '请输入应用理由！')&&this.verDiagnosisFm('weight', '请选择得分权重！')) fn()
                }
            },
            pleaseWeight(name,text){
                let bool = false
                text = text || '请选择得分权重！'
                name = name || 'weight'
                if(this.diagnosisFm[name]) bool = true
                else this.$Message.info(text);
                return bool
            },
            setItemType(){
                return {
                    item_type: this.actItem.item_type || 1,
                    deduct_reason : this.actItem.deduct_reason,
                    deduct_weight: this.actItem.deduct_weight,
                }
            },
            addSuccess(r){
                this.$Message.success(r.msg);
                $CaseSuccessfulOperation.$emit('CaseSuccessfulOperation', this.activeType)
            },
            addOperation(){
                if(this.pleaseWeight('operation','请输入手术名称!')&&this.verDiagnosisFm('reason', '请输入应用理由！')&&this.pleaseWeight()){
                    let t = this.actItem
                    let d = {
                        ...this.case_id,
                        case_treatment_id: this.caseTreatment,
                        operation: this.diagnosisFm.operation,
                        reason_for_using: this.diagnosisFm.reason,
                        weight: this.diagnosisFm.weight,
                        ...this.setItemType()
                    }
                    if(this.isEdit) d.id = t.id
                    let url = this.isAdd ? 'addOperation' : 'modifyOperation'
                    PostData('case/' + url, d).then((r) => {
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
            addNursing(){
                if(this.verification(3)&&this.velOperation()&&this.verDiagnosisFm('reason', '请输入应用理由！')&&this.verDiagnosisFm('weight', '请选择得分权重！')){
                    let d = this.diagnosisData
                    let da = {
                        ...this.case_id,
                        case_treatment_id: this.caseTreatment,
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
                        ...this.setItemType()
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
                    case_treatment_id: this.caseTreatment,
                   ...this.setItemType()
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
                PostData('case/' + url, d).then((r) => {
                    if(r.res_code == 1){
                        if(this.isAdd) this.actItem = null
                        this.addSuccess(r)
                    }
                })
            },
            determine(){
                if(this.diagnosisTypes == 1) this.addOperation()
                if(this.diagnosisTypes == 2) this.pleaseChoose(() => { this.addDrugs() })
                if(this.diagnosisTypes == 3) this.addNursing()
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
            setEdit(item, t){
                this.isEdit = true
                this.activeType = t.type
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
                console.log(t.weight);
            }
        },
        beforeDestroy () {
            $CaseEdit.$off('CaseEdit', this.setEdit)
        },
        mounted() {
            $CaseEdit.$on('CaseEdit', this.setEdit)
        },
    }
</script>

<style lang="less" scoped>
    .treatment-right{
        width: inherit;
        height: 648px;
        position: relative;
        background-color: #fff;
        margin-left: 2px;
    }
    .treatment-nursing{
        height: 548px;
        overflow: hidden;
        overflow-y: auto;
    }
    .operation-left-basiss{
        height: 150px;
        line-height: 150px;
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
    .case-btn-box{
        width: inherit;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 0;
        height: 50px;
        align-items: center;
        background: #FAFAFC;
        border-top: 1px solid #F0F0F7;
        .case-btn{
            width: 120px;
            height: 36px;
        }
    }
</style>
