<template>
   <div class="diagnosis">
        <div class="dia-left">
            <div class="item item-1">
                <img :src="diagnosisImg" class="diagnosis-img" />
                <span class="item-title">诊疗详情</span>
            </div>
           <div class="main-seconds">
                <div @click="selSeconds(i, t)" v-for="(t, i) in seconds" :key="i" :class="t.active&&t.num != 1 ? 'item-act' : ''" class="item item-2">
                    <img @click.stop="deletes(i, t)" v-if="i" :src="deletesImg" class="deletes-img" />
                    <span :class="t.active ? 'item-title-act' : 'item-title-de'" class="item-title2">第{{t.num}}次诊疗</span>
                </div>
           </div>
            <div class="item-btn">
                <Button @click="add">+  添加诊疗</Button>
            </div>
        </div>
        <div class="btns">
            <div>
                <Button @click="selType(t,i)" :class="t.active ? 'act-btn' : 'de-btn'" v-for="(t,i) in btns" :key="i">{{t.title}}</Button>
            </div>
        </div>
        <div>
            <div class="main">
                <SceneDescription :diagnosisId="diagnosisId" page="0" v-if="page === 0" />
                <Interrogation :diagnosisId="diagnosisId" page="1" v-if="page == 1"  />
                <PhysicalExam :diagnosisId="diagnosisId" page="2" v-if="page == 2" />
                <SupplementaryExam :diagnosisId="diagnosisId" page="3" v-if="page == 3"  />
                <diagnosis :diagnosisId="diagnosisId" page="4" v-if="page == 4" />
            </div>
            <div class="case-btn-box">
                <Button class="case-btn-last" @click="handleLast" type="primary">上一步</Button>
                <Button class="case-btn" @click="handleNext(false)" type="primary">下一步</Button>
            </div>
        </div>
   </div>
</template>
<script>
import Interrogation from './com/Interrogation'
import PhysicalExam from './com/physical-exam'
import SupplementaryExam from './com/supplementary-exam'
import diagnosis from './com/diagnosis'
import SceneDescription from './com/scene-des'
import diagnosisImg from '../../../../../assets/img/case/diagnosis.png'
import deletesImg from '../../../../../assets/case/deletes.png'
import addImg from '../../../../../assets/case/add.png'

export default {
    components: { Interrogation, PhysicalExam, SupplementaryExam, diagnosis, SceneDescription },
    data() {
        return {
            page: 0, 
            diagnosisId: 0,
            diagnosisImg, deletesImg, addImg,
            case_id: +sessionStorage.getItem('CASEID'),
            btns: [
                { title: '场景描述', active: true },
                { title: '问诊', active: false },
                { title: '体格检查', active: false },
                { title: '辅助检查', active: false },
                { title: '防治与诊疗计划', active: false },
            ],
            activeSeconds: 1,
            seconds: [
                { num: 1, active: true },
            ],
        }
    },
    mounted() {
        $CasePreservation.$on('CasePreservation', this.preservation)
        this.getDiagnoseFrequency()
    },
    beforeDestroy () {
        $CasePreservation.$off('CasePreservation', this.preservation)
    },
    methods: {
        getDiagnoseFrequency(){
            PostData('case/getDiagnoseFrequency', {case_id: this.case_id}).then((r) => {
                if(r.res_code == 1){
                    let d = []
                    if(r.data.length>0){
                        this.diagnosisId = r.data[0].id
                        r.data.map((t, i) => {
                            d.push({num: i + 1, active: i ? false : true, ...t})
                        })
                        this.seconds = d
                    }
                }
            })
        },
        selSeconds(i, t){
           this.diagnosisId = t.id
           this.activeSeconds = i + 1
           this.seconds.map((t, l) => {
               t.active = l === i
           })
           this.btns.map((it, k) => {
               it.active = k ? false : true
           })
           this.page = 0
        },
        deletes(i, t){
            PostData('case/removeDiagnoseFrequency', {id: t.id}).then((r) => {
                if(r.res_code == 1){
                    this.seconds.splice(i, 1)
                    if(this.seconds.length == 1) {
                        this.seconds[0].active = true
                    }
                }
            })
        },
        add(){
            PostData('case/addDiagnoseFrequency', {case_id: this.case_id}).then((r) => {
                if(r.res_code == 1){
                    let index = this.seconds.length;
                    this.seconds.push({ num: index + 1, active: false, id: r.data.id})
                }
            })
        },
        preservation(index){
            if(index == 5) this.handleNext(true)
        },
        selType(t, i){
            this.page = i;
            this.btns.map((it, l) => {
                if(l === i) it.active = true;
                else it.active = false
            })
        },
        handleLast() {
            this.$emit('handleNavigate', 4)
        },
        hasContent(d){
            let bool = true
            d.map((t) => {
                if(t.frequency_id&&t.usage_id) bool = bool&&true
                else bool = bool&&false
            })
            return bool
        },
        getData(len, save){
            PostData('case/getCaseUnscramble',{case_id: this.case_id}).then((r) => {
                if(r&&r.res_code == 1) {
                   if(r.data.length !== len) this.$Message.info('请完善解读分析！');
                   else this.isFinish(save)
                }
            })
        },
        isFinish(save){
            PostData('case/getListByType',{type: "medicine", case_id: +sessionStorage.getItem('CASEID')}).then((r) => {
                if(r.res_code == 1) {
                    if(r.data&&r.data.length>0){
                       if(this.hasContent(r.data)) this.$emit('handleNavigate', 6)
                       else this.$Message.info('请完善药品的内容！');
                    }else {
                        if(!save) this.$emit('handleNavigate', 6)
                        else this.$Message.success('保存成功')
                    }
                }
            })
        },
        handleNext(save) {
            let d = JSON.parse(sessionStorage.getItem('CaseContentMsg'))
            let da = Array.isArray(d.force_unscramble_content) ? d.force_unscramble_content :  JSON.parse(d.force_unscramble_content)
            if(+d.force_unscramble&&da&&da.length>0){
                this.getData(da.length, save)
            }else this.isFinish(save)
        }
    },
}
</script>
<style lang="less" scoped>
    .diagnosis{
        display: flex;
        height: 100%;
    }
    .deletes-img{
        width: 20px;
        height: 20px;
        position: absolute;
        left: 11px;
        display: none;
    }
    .dia-left{
        width: 142px;
        background-color: rgba(51, 55, 68, 1);
        height: 100%;
        position: relative;
        .main-seconds{
            width: 142px;
            height: 561px;
            overflow-y: auto;
        }
        .item{
            display: flex;
            align-items: center;
            height: 51px;
            width: 100%;
            // border-bottom: 1px solid #d7dde4;
        }
        .item-1{
            padding-left: 11px;
            background-color: #000;
            .diagnosis-img{
                width: 20px;
                height: 20px;
                margin-right: 11px;
            }
            .item-title{
                font-weight: 400;
                font-style: normal;
                font-size: 16px;
                color: #CCCCCC;
            }
        }
        .item-2{
            justify-content: center;
            .item-title2{
                font-weight: 700;
                font-style: normal;
                font-size: 14px;
                cursor: pointer;
            }
            .item-title-act{
                color: #FFFFFF;
            }
            &:hover .deletes-img{
                display: block
            }
        }
        .item-act{
            background-color: #000;
        }
        .item-de{
            color: #CCCCCC;
        }
        .item-btn{
            position: absolute;
            bottom: 10px;
            left: 15px;
            box-shadow: none !important;
        }
    }
    .btn{
        width: 142px;
        height: 51px;
        // margin-bottom: 15px;
        font-size: 18px;
        // border: none;
        border: 1px solid rgba(228, 228, 228, 1);
        border-radius: 0;
    }
    .main{
        display: flex;
        flex-direction: row;
    }
    .btns{
        width: 142px;
        height: 100%;
        background-color: #F0F0F7;
        .act-btn{
            .btn;
            // background-color:#4098FF;
            color: #4098FF;
            background-color: #fff;
            box-shadow: none;
            // box-shadow: 0 0 5px 0 rgba(64,152,255,0.40);
        }
        .de-btn{
            .btn;
            background-color: #F0F0F7;
            color: #9397AD;
            box-shadow: none;
        }
        .case-types{
            display: flex;
            flex-direction: column;
            align-items: center;
            .actvie-btn{
                width: 142px;
                height: 51px;
                background-color: #666;
                color: #fff;
                box-shadow: none !important;
                border: 1px solid #000;
                border-radius: 0;
                position: relative;
                &:hover .deletes-img{
                    display: block
                }
                .img-postion{
                    top: 16px;
                }
                .icons{
                    position: absolute;
                    right: 11px;
                    top: 16px
                }
            }
            .btn{
                width: 107px;
                height: 35px;
                margin-top: 15px;
                color: #333333;
                border-radius: 5px;
                font-size: 14px !important;
                box-shadow: none !important;
                .add-img{
                    width: 15px;
                    height: 15px;
                    position: relative;
                    top: 2px
                }
            }
        }
    }
    .case-btn-box{
        display: flex;
        margin-top: 15px;
        justify-content: center;
        .case-btn-last{
            width: 150px;
            height: 38px;
            background-color: #fff;
            color: #4098ff;
        }

        .case-btn{
            width: 150px;
            height: 38px;
            margin-left: 20px;
        }
    }
</style>
