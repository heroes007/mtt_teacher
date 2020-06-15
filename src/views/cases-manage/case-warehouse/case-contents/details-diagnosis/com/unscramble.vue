<template>
    <div class="analysis">
        <div class="analysis-content">
            <Input v-model="treatment_principle" type="textarea" :rows="20" placeholder="请输入请输入解读分析内容" />
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
            type: {
                type: String,  //1 问诊 2 体格检查 3 辅助检查 4 诊疗详情
                default: ''
            },
            diagnosisId: {}
        },
        data() {
            return {
                treatment_principle: '',
                suggestion: '',
                caseKey,
                case_id: +sessionStorage.getItem('CASEID'),
                checkType: {
                    1: 'talk',
                    2: 'physical',
                    3: 'assist'
                }
            }
        },
        watch: {
            type(_new){
                if(_new) this.getData()
            }
        },
        methods: {
             add(){
                 let d = {
                     case_id: this.case_id || null,
                     type: this.checkType[this.type],
                     unscramble: this.treatment_principle,
                     frequency_id: this.diagnosisId
                 }
                 if(this.treatment_principle){
                    PostData('case/setCaseUnscramble', d).then((r) => {
                        if(r&&r.res_code == 1) this.$Message.info(r.msg);
                    })
                 }
             },
             getData(){
                PostData('case/getCaseUnscramble',{frequency_id: this.diagnosisId, case_id: this.case_id, type: this.checkType[this.type]}).then((r) => {
                    if(r&&r.res_code == 1) {
                        this.treatment_principle = r.data ? r.data.unscramble : ''
                    }
                })
            },
        },
        mounted() {
              this.getData()
        }
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
                justify-content: flex-end;
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
        }
    }
</style>
