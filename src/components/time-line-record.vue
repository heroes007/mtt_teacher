<template>
    <Timeline :class="isShowBtn ? 'time-lines': 'time-lines2'">
        <!-- 查看  问诊/体格检查/辅助检查 -->
        <SeeCase :showModal="showModal" :type="type" :detailData="detailData" @close-modal="closeModal"/>

        <!-- 诊断 -->
        <TimelineItem v-if="mockDiagnoses&&mockDiagnoses.length>0">
            <img slot="dot" src="../assets/case/diagnosis.png"/>
            <Card class="case-card">
                <p slot="title"><span class="grey-regular5">诊断</span><span class="item-number">（共{{mockDiagnoses.length}}项）</span>
                </p>
                <div v-for="(t,i) in mockDiagnoses" :key="i">
                    <div class="case-card-title grey-medium2" v-if="mockDiagnosesShow">
                        <div :class="'circular'+t.diagnosis_type"></div>
                        {{$config.getDiagnosisName(t.type)}}诊断：{{t.name}}
                    </div>
                    <Card class="specific-item" v-if="mockDiagnosesShow">
                        <p slot="title"><span class="grey-regular1">诊断依据</span></p>
                        <!-- 问诊 -->
                        <div v-if="t.talks&&t.talks.length>0&&l.qa" class="card-item" @click="seeCase(1,l.qa)"
                             v-for="l in t.talks" :key="l.id">
                            <img class="card-img" src="../assets/case/correct.png"/><img class="card-img2"
                                                                                         src="../assets/case/interrogation.png"/>
                            <p class="card-text">{{l.qa.question}}</p>
                        </div>
                        <!-- 体检 -->
                        <div v-if="t.physiques&&t.physiques.length>0" class="card-item" @click="seeCase(2,p)"
                             v-for="p in t.physiques" :key="p.id">
                            <img class="card-img" src="../assets/case/correct.png"/><img class="card-img2"
                                                                                         src="../assets/case/physical-examination.png"/>
                            <p class="card-text">{{p.source_name_part_1}} <span v-if="p.source_name_part_2">> {{p.source_name_part_2}}</span>
                            </p>
                        </div>
                        <!-- 辅检 -->
                        <!-- 最后一条数据 -->
                        <div v-if="t.assist&&t.assist.length>0" class="card-item" @click="seeCase(3,s)"
                             v-for="s in t.assist" :key="s.id">
                            <img class="card-img" src="../assets/case/correct.png"/><img class="card-img2"
                                                                                         src="../assets/case/accessory-examination.png"/>
                            <p class="card-text">{{s.source_name_part_1}} <span v-if="s.source_name_part_2">> {{s.source_name_part_2}}</span>
                            </p>
                        </div>
                    </Card>
                    <!-- <Icon v-else-if="!mockDiagnosesShow&&mockDiagnoses[mockDiagnoses.length-1]" type="ios-loading" size=24 class="loadingIcon demo-spin-icon-load"></Icon> -->
                </div>
            </Card>
        </TimelineItem>
        <!-- 处置治疗 -->
        <TimelineItem v-if="treats">
            <img slot="dot" src="../assets/case/disposition-treatment.png"/>
            <Card class="case-card">
                <p slot="title"><span class="grey-regular5">处置治疗</span><span
                        class="item-number">（共{{itemNumber()}}项）</span></p>
                <!-- 处置原则 -->
                <Card v-if="treats&&treats.treatment_principle" class="specific-item disposition-treatment">
                    <p slot="title"><span class="grey-regular1">处置原则</span></p>
                    <div class="card-item"><p class="card-text log-and-answer-content">
                        处置原则：{{treats.treatment_principle}}</p></div>
                </Card>
                <!-- 护理 -->
                <Card class="specific-item disposition-treatment" v-if="treats&&nurse&&setNurse()">
                    <p slot="title" v-if="nurse.nursing_level"><span class="grey-regular1">护理 > {{nurse.nursing_level.nursing_level}}</span>
                    </p>
                    <div class="card-item" v-if="nurse.nursing_routine"><p class="card-text">
                        护理常规：{{nurse.nursing_routine.nursing_routine}}</p></div>
                    <div class="card-item" v-if="nurse.treatment_diet&&nurse.treatment_diet.length>0"><p
                            class="card-text">膳食：
                        <span v-for="d in nurse.treatment_diet" :key="d.id"> {{d.diet}}</span></p>
                    </div>
                    <div class="card-item" v-if="nurse.treatment_position"><p class="card-text">
                        体位：{{nurse.treatment_position.position}}</p></div>
                    <div class="card-item" v-if="nurse.treatment_nursing&&nurse.treatment_nursing.length>0"><p
                            class="card-text">护理项目：
                        <span v-for="n in nurse.treatment_nursing" :key="n.id"> {{n.nursing}}</span></p>
                    </div>
                    <div class="card-item" v-if="nurse.treatment_manipulation&&nurse.treatment_manipulation.length>0"><p
                            class="card-text">操作：
                        <span v-for="n in nurse.treatment_manipulation" :key="n.id"> {{n.manipulation}}</span></p>
                    </div>
                    <!-- 最后一条数据 -->
                    <div class="card-item2" v-if="nursingReasons()">
                        <p class="card-text log-and-answer-content">应用理由：<span v-html="nursingReasons()"></span></p>
                    </div>
                </Card>
                <!-- 西药 -->
                <div v-if="treats&&treats.western_medicines">
                    <Card class="specific-item disposition-treatment" v-for="w in treats.western_medicines" :key="w.id">
                        <p slot="title"><span class="grey-regular1">西药分类 > {{w.primary_classification}} > {{w.secondary_classification}}</span>
                        </p>
                        <div class="card-item"><p class="card-text">药物名称：{{w.medicine_name}}</p></div>
                        <div class="card-item"><p class="card-text">药物用法：{{w.usage}}</p></div>
                        <div class="card-item"><p class="card-text">药物剂量：{{w.dosage}}</p></div>
                        <div class="card-item"><p class="card-text">时间间隔：{{w.frequency}}</p></div>
                        <!-- 最后一条数据 -->
                        <div class="card-item2" v-if="w.reason_for_using">
                            <p class="card-text log-and-answer-content">应用理由：{{w.reason_for_using}}</p>
                        </div>
                    </Card>
                </div>
                <!-- 手术 -->
                <div v-if="treats&&treats.treatment_operations">
                    <Card class="specific-item disposition-treatment" v-for="w in treats.treatment_operations"
                          :key="w.id">
                        <p slot="title"><span class="grey-regular1">手术</span></p>
                        <div class="card-item"><p class="card-text">手术名称：{{w.operation}}</p></div>
                        <!-- 最后一条数据 -->
                        <div class="card-item2">
                            <p class="card-text log-and-answer-content">应用理由：{{w.reason_for_using}}</p>
                        </div>
                    </Card>
                </div>
                <!-- 建议 -->
                <Card class="specific-item disposition-treatment" v-if="treats&&treats.treatment_suggestion">
                    <p slot="title"><span class="grey-regular1">建议</span></p>
                    <!-- 最后一条数据 -->
                    <div class="card-item2">
                        <p class="card-text log-and-answer-content">
                            建议内容：{{treats.treatment_suggestion.other_content}}</p>
                    </div>
                </Card>
            </Card>
        </TimelineItem>
        <!-- 模拟考试 -->
        <TimelineItem v-if="objectivetests&&objectivetests.length>0">
            <img slot="dot" src="../assets/case/mock-exam.png"/>
            <Card class="case-card">
                <p slot="title"><span class="grey-regular5">模拟考试</span><span class="item-number">（共{{objectivetests.length}}项）</span>
                </p>
                <div class="case-card-title2 grey-regular1">客观题</div>
                <Card class="specific-item objectivetests" v-for="(o, j) in objectivetests" :key="o.id">
                    <p slot="title"><span class="grey-regular1">{{j+1}}. {{o.question}}（{{$config.setABC(o.right_index)}}）</span>
                    </p>
                    <div :class="lastItem(o.options.length,p)" v-for="(op, p) in o.options" :key="op.id">
                        <img class="card-img" v-if="p == o.right_index" src="../assets/case/correct.png"/>
                        <img class="card-img" v-else-if="isShowBtn" src="../assets/case/error.png"/>
                        <img class="card-img" v-else src="../assets/case/no-choice.png"/>
                        <p class="card-text">{{$config.setABC(p)}}. {{op.option_name}}</p>
                    </div>
                </Card>
            </Card>
        </TimelineItem>
    </Timeline>
</template>
<script>
    import SeeCase from 'components/see-case.vue'
    import postData from 'src/api/postData'
    import {async} from 'q';

    export default {
        components: {SeeCase},
        props: {
            mockDiagnosesEnd: {
                type: Array,
                default: []
            },
            mockDiagnosesInit: {
                type: Array,
                default: []
            },
            treats: {
                type: Object,
            },
            objectivetests: {
                type: Array,
                default: []
            },
        },
        data() {
            return {
                showModal: false,
                mockDiagnosesShow: false,
                detailData: {},
                type: null,
                mockDiagnoses: []
            }
        },
        computed: {
            nurse() {
                return this.treats && this.treats.nurse
            },
            isShowBtn() {
                return this.$route.name == 'view-cases'
            },
        },
        watch: {
            mockDiagnosesInit(_new) {
                this.mockDiagnoses = _new
            },
            mockDiagnosesEnd(_new) {
                this.$nextTick(() => {
                    this.mockDiagnoses = _new
                    this.mockDiagnosesShow = true
                })
            },
        },
        methods: {
            setNurse() {
                return this.treats.mockDiagnosesStudent && Object.keys(this.treats.mockDiagnosesStudent).length > 0
            },
            // 处理最后一条数据的样式
            lastItem(len, i) {
                return (len - 1) == i ? 'card-item2' : 'card-item'
            },
            closeModal() {
                this.showModal = false;
            },
            setReasonForUsing(flied) {
                let text = ''
                if (this.nurse[flied] && this.nurse[flied].length > 0) {
                    this.nurse[flied].forEach(t => {
                        text += t.reason_for_using
                    });
                }
                return text
            },
            nursingReasons() {
                let t1 = this.nurse.nursing_level && this.nurse.nursing_level.reason_for_using
                t1 += this.nurse.nursing_routine && this.nurse.nursing_routine.reason_for_using
                t1 += this.nurse.treatment_position && this.nurse.treatment_position.reason_for_using
                if (this.treats && this.nurse) {
                    t1 += this.setReasonForUsing('treatment_diet')
                    t1 += this.setReasonForUsing('treatment_nursing')
                    t1 += this.setReasonForUsing('treatment_manipulation')
                }
                if (t1 == 0) return ''
                return t1
            },
            itemNumber() {
                if (this.treats) {
                    let l1 = this.nurse ? 1 : 0;
                    let l2 = this.treats.treatment_suggestion ? 1 : 0;
                    let l3 = this.treats.treatment_principle ? 1 : 0;
                    let l4 = this.treats.western_medicines && this.treats.western_medicines.length > 0 ? this.treats.western_medicines.length : 0
                    let l5 = this.treats.treatment_operations && this.treats.treatment_operations.length > 0 ? this.treats.treatment_operations.length : 0
                    return l1 + l2 + l3 + l4 + l5
                }
                return 0
            },
            closePatient(val) {
                this.patientInfoShow = val
            },
            seePatientInfo() {
                this.patientInfoShow = true
            },
            seeCase(type, data) {
                this.type = type
                this.showModal = true
                this.detailData = data
            },
        },
    }
</script>
<style lang="less" scoped>
    .loadingIcon {
        vertical-align: baseline;
        display: inline-block;
        color: red;
    }

    .objectivetests {
        margin-bottom: 20px;
    }

    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /deep/ .ivu-card-head {
        padding: 15px 30px;
        height: 57px;
        line-height: 28px;

        p {
            position: relative;
            top: 3px;
            font-weight: normal;
        }
    }

    /deep/ .ivu-timeline {
        padding: 60px 30px 0 163px;
        margin: 0;
    }

    /deep/ .ivu-timeline-item-head-custom {
        width: 54px;
        margin-top: 24px;
    }

    /deep/ .ivu-timeline-item-content {
        padding: 1px 1px 10px 75px;
    }

    /deep/ .ivu-timeline-item-tail {
        left: 13px;
    }

    /deep/ .ivu-timeline-item:last-child .ivu-timeline-item-tail {
        display: block;
        top: -20px;
    }

    /deep/ .ivu-card {
        text-align: left;
    }

    .size {
        width: 14px;
        height: 14px;
        border-radius: 7px;
        margin-right: 12px;
    }

    .disposition-treatment {
        margin-top: 29px;
    }

    .tl {
        padding-top: 10px;
        padding-left: 163px;
    }

    .time-lines2 {
        height: 100%;
        .tl;
    }

    .time-lines {
        height: 100%;
        padding-bottom: 200px;
        .tl;
    }

    .case-card {
        background: #FFFFFF;
        box-shadow: 0 0 8px 0 rgba(64, 152, 255, 0.25);
        border-radius: 8px;
        border-radius: 8px;
        width: 100%;

        /deep/ .ivu-card:hover {
            box-shadow: none;
        }

        /deep/ .ivu-card-body {
            padding: 0 30px 45px 30px;
        }

        .item-number {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #6D7183;
            letter-spacing: 0.93px;
        }

        .circular1 {
            background: #A876F9;
            .size;
        }

        .circular2 {
            background: #FFA003;
            .size;
        }

        .circular3 {
            background: #0AC7E6;
            .size;
        }

        &-title2 {
            margin: 15px 0;
            height: 25px;
            line-height: 25px;
        }

        &-title {
            display: inline-flex;
            height: 28px;
            align-items: center;
            margin: 20px 0;
        }

        .specific-item {
            background: #FAFAFD;
            border-radius: 10px;
            border-radius: 10px;

            /deep/ .ivu-card-body {
                padding: 30px;
            }

            .card-item {
                margin-bottom: 20px;
            }

            .card-item, .card-item2 {
                display: flex;
                align-items: center;

                .card-img {
                    margin-right: 26px;
                    width: 18px;
                    height: 18px;
                }

                .card-img2 {
                    margin-right: 10px;
                }

                .card-text {
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #474C63;
                    letter-spacing: 0.93px;
                }
            }
        }
    }

    /deep/ .ivu-card-head {
        cursor: pointer;

        p {
            height: 28px;
        }
    }
</style>

