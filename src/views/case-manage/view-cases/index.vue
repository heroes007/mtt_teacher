<template>
   <div class="case">
        <!-- 患者信息弹框 -->
        <PatientInfo @close="closePatient" :patient-data="patientData" :patient-show="patientInfoShow" />
        <CaseHead :patient-data="patientData" @seePatientInfo="seePatientInfo"  />
        <TimeLineRecord :treats="treats" :objectivetests="objectivetests" :mockDiagnosesEnd="mockDiagnoses" :mockDiagnosesInit="mockDiagnosesInit" />
   </div>
</template>
<script>
import postData from 'src/api/postData'
import timelineRecordMixins from 'mix/timelineRecordMixins'
import PatientInfo from 'components/patient-information.vue'

import { async } from 'q';
export default {
    components: { PatientInfo },
    mixins: [ timelineRecordMixins ],
    data(){
        return{
            mockDiagnoses: [],
            mockDiagnosesInit: [],
            treats: null,
            objectivetests: [],
            patientInfoShow: false,
            patientData: {}
        }
    },
    methods: {
        closePatient (val) {
            this.patientInfoShow = val
        },
        seePatientInfo(){
            this.patientInfoShow = true
        },
        getHeadData(){
            let loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
            postData('case/getCaseBaseInfo',{case_id: +this.$route.query.case_id}).then((res) => {
                if(res.res_code==1) {
                    this.patientData = res.data
                    if(loadingInstance) loadingInstance.close()
                }
            })
        }
    },
    created(){
        new Promise((resolve,reject) => {
            this.getHeadData()
            resolve()
        }).then(() => {
            this.getMockDiagnoses()
            return true
        }).then(() => {
            this.getTreats()
            return true
        }).then(() => {
            this.getObjectivetests()
        })
    }
}
</script>
<style lang="less" scoped>
.case{
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
}
</style>


