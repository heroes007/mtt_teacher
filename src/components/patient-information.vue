<template>
      <Modal :styles="{'top':'20%'}" width="600" class="patient-modal" ref="patientInfoModal" v-model="patientInfoShow"
        @on-ok="ok" :footer-hide="footerHide" @on-cancel="cancel">
        <p class="patient-modal-title">{{cases}}</p>
        <Divider class="patient-divider" />
        <div class="patient-modal-main">
          <div class="patient-modal-Left">
            <img class="patient-modal-left-img" :src="patientData.patient_head_portrait_url" alt="患者头像" />
            <h3 class="patient-modal-left-name">{{patientData.patient_name}}</h3>
            <Divider class="patient-left-divider" />
            <div class="patient-left-info">
              <div class="patient-left-item"><span>性别：{{$config.setSex(patientData.patient_gender)}}</span></div>
              <div class="patient-left-item"><span>民族：{{patientData.patient_nation}}</span></div>
              <div class="patient-left-item"><span>年龄：{{patientData.patient_age}}</span></div>
              <div class="patient-left-item"><span>婚姻状态：{{patientData.patient_marital_status}}</span></div>
            </div>
          </div>
          <div class="patient-modal-content">
              <div class="patient-content-item"><span class="patient-content-tilte">职业身份：</span><span class="patient-content-details">{{patientData.patient_occupation}}</span></div>
              <div class="patient-content-item"><span class="patient-content-tilte">联系电话：</span><span class="patient-content-details">{{patientData.patient_contact}}</span></div>
              <div class="patient-content-item"><span class="patient-content-tilte">支付方式：</span><span class="patient-content-details">{{patientData.patient_pay_pattern}}</span></div>
              <div class="patient-content-item patient-content-margin"><span class="patient-content-tilte">家庭住址：</span><span class="patient-content-details">{{patientData.patient_addr}}</span></div>
              <div class="patient-content-item"><span class="patient-content-tilte">患者病症：</span><span class="patient-content-details">{{patientData.symptom}}</span></div>
              <div class="patient-content-item"><span class="patient-content-tilte">就诊科室：</span><span class="patient-content-details">{{patientData.patient_division}}</span></div>
              <div class="patient-content-item"><span class="patient-content-tilte">病情描述：</span><span class="patient-content-details">{{patientData.name}}</span></div>
              <div class="patient-content-item"><span class="patient-content-tilte">病情描述者：</span><span class="patient-content-details">{{$config.setSelf(patientData.medical_history_representor)}}</span></div>
              <div class="patient-content-item"><span class="patient-content-tilte">就诊时间：</span><span class="patient-content-details">{{patientData.case_date}}</span></div>
          </div>
        </div>
    </Modal>
</template>
<script>
import types from 'src/types'
export default {
  props: {
    patientShow: {
      ...types.PropsBoolean()
    },
    patientData:{
      ...types.PropsObject()
    }
  },
  watch: {
    patientShow (_new) {
      this.patientInfoShow = _new
    }
  },
  data () {
    return {
      patientInfoShow: false,
      cases: '患者信息',
      footerHide: true,
    }
  },
  beforeDestroy(){
    this.$refs.patientInfoModal = null
  },
  methods: {
    cancel () {
      this.patientInfoShow = false
      this.$emit('close', false)
    },
    ok () {
      this.cancel()
    }
  },
  mounted () {
    this.patientInfoShow = this.patientShow
  }
}
</script>
<style scoped>
.patient-modal>.ivu-modal-wrap>.ivu-modal>.ivu-modal-content>.ivu-modal-body{
  padding: 20px;
  color: #474C63;
}
.patient-content-margin{
  margin-bottom: 40px !important;
}
.patient-modal-title{
    height: 28px;
    line-height: 28px;
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
}
.patient-divider.ivu-divider-horizontal{
  margin: 0px;
  background:#F0F0F7;
}
.patient-left-divider.ivu-divider-horizontal{
  margin: 0px;
  background:#CDCED3;
}
.patient-modal-main{
  display: flex;
  flex-wrap: nowrap;
  padding-top: 20px;
}
.patient-modal-Left{
  width: 180px;
  height: 369px;
  padding: 20px 15px;
  background: #F0F0F7;
  border-radius: 4px;
}
.patient-modal-content{
  padding-left: 30px;
  flex: 1
}
.patient-modal-left-img{
  width: 120px;
  height: 120px;
  margin-left: 15px;
}
.patient-modal-left-name{
  height: 25px;
  line-height: 25px;
  text-align: center;
  color: #474C63;
  margin: 15px;
  font-size: 18px;
}
.patient-left-info{
  margin: 15px 15px 5px 15px;
}
.patient-left-item{
  height: 22px;
  line-height: 22px;
}
.patient-left-item,.patient-content-item{
  margin-bottom: 15px;
  font-size: 16px;
  color: #474C63;
}
.patient-content-item{
  height: auto;
}
.patient-content-item{
  display: flex;
}
.patient-content-tilte{
  min-width: 80px;
  height: 22px;
  font-size: 16px;
}
.patient-content-details{
   padding-left: 10px;
   flex:1;
   font-size: 16px;
   letter-spacing: 0;
   text-align: justify;
   line-height: 25px;
}
</style>

