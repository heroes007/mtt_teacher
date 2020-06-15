<template>
    <div class="analysis">
        <div v-if="isEmpty" class="empty">
            <img :src="caseKey" class="case-key" />
            <div class="empty-text">暂无诊疗处置</div>
        </div>
        <div v-else class="analysis-content">
            <div class="title">处置原则</div>
            <Input v-model="treatment_principle" type="textarea" :rows="8" placeholder="请输入处置原则" />
            <div class="title title2">诊疗建议</div>
            <Input v-model="suggestion"  type="textarea" :rows="8" placeholder="请输入诊疗建议" />
            <div class="m-btns">
                <Button class="btns" @click="add">保存</Button>
            </div>
        </div>

    </div>
</template>

<script>
    import caseKey from '../../../../../../assets/case/case-key.png'
    export default {
        props: {
            diagnosisId: {}
        },
        data() {
            return {
                treatment_principle: '',
                suggestion: '',
                case: null,
                isEmpty: true, // true 为空
                caseKey,
                case_id: { case_id: +sessionStorage.getItem('CASEID') }, // 139
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
             add(){
                 let d = {
                    id: this.case.id || null, 
                    treatment_principle: this.treatment_principle,
                    suggestion: this.suggestion,
                    frequency_id: this.diagnosisId
                 }
                 PostData('case/setTreatDisposition', d).then((r) => {
                     if(r&&r.res_code == 1) {
                         this.$Message.info(r.msg);
                     }
                 })
             },
             getData(){
                PostData('case/getTreatDisposition',{...this.case_id, frequency_id: this.diagnosisId}).then((r) => {
                    if(r&&r.res_code == 1) {
                        if(!r.data) this.modal1 = true
                        this.case = r.data
                        if(r.data){
                            this.isEmpty = false
                            this.treatment_principle = r.data.treatment_principle
                            this.suggestion = r.data.suggestion
                        }
                    }
                })
            },
        },
    }
</script>

<style lang="less" scoped>
    .analysis{
        width: inherit;
        height: 584px;
        position: relative;
        .empty{
            width: inherit;
            height: inherit;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .case-key{
                width: 213px;
                height: 134px;
            }
            .empty-text{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #9397AD;
            }
        }
        .analysis-content{
            width: inherit;
            height: inherit;
            padding: 20px 30px;
            .m-btns{
                height: 36px;
                margin-top: 30px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                .btns{
                    width: 150px;
                    height: 36px;
                    background-color: #fff;
                    color: #4098ff;
                }
            }
            .title{
                text-align: left;
                font-family: PingFangSC-Medium;
                font-size: 18px;
                color: #474C63;
                margin-bottom: 15px;
            }
            .title2 {
                margin-top: 40px;
            }
        }
    }
</style>