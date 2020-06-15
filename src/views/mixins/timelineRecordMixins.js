import CaseHead from 'components/case-head.vue'
import postData from 'src/api/postData'
export default{
    data(){
        return{
            mockDiagnoses: [],
            mockDiagnosesInit: [],
            treats: null,
            objectivetests: [],
        }
    },
    components: {
        'TimeLineRecord': () => import('components/time-line-record.vue'),
        CaseHead,
    },
    methods: {
        getTreats(d){
            postData('case/getTreats',{case_id: d || +this.$route.query.case_id}).then((res) => {
                if(res.res_code==1) this.treats = this.$config.setDataK(res.data)
            })
        },
        getObjectivetests(d){
            postData('case/getObjectivetests',{case_id: d || +this.$route.query.case_id}).then((res) => {
                if(res.res_code==1) this.objectivetests = res.data
            })
        },
        getMockDiagnoses(d){
            postData('case/getMockDiagnoses',{case_id: d || +this.$route.query.case_id}).then(async(res) => {
                if(res.res_code==1) {
                    this.mockDiagnoses = res.data;
                    this.mockDiagnosesInit = this.$config.copy(res.data,[])
                    let asyncWorker = (t,i) => {
                        postData('case/getBasis',{case_id: d || +this.$route.query.case_id, case_diagnose_id: t.id}).then((res) => {
                            if(res.res_code==1) {
                                this.mockDiagnoses.splice(i,1,{...t,...res.data})
                            }
                        })
                    }
                    let results = await Promise.all(this.mockDiagnoses.map(async (item,i) => {
                      return await asyncWorker(item,i);
                    }));
                }
            })
        }
    },
}
