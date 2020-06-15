<template>
    <div style="height: 100%;">
        <div class="case-header">
            <div class="header-box">
                <div class="case-header-back" @click="handleBack">
                    <img src="../../../../assets/img/case/case_back.png" alt="">
                    <div class="back-font">返回</div>
                </div>
                <div class="case-header-btn">
                    <Select v-model="outline_data" @on-change="selectChange">
                        <Option v-for="(item, index) in outline_list" :value="index" :key="index">{{ item.symptom }}</Option>
                    </Select>
                </div>
            </div>
            <div class="case-header-type">
                <div v-for="(item, index) in case_type" :key="index" class="type-box">
                    <div class="type-box-color" :style="{backgroundColor: item.color}"></div>
                    <div class="type-box-font">{{item.title}}</div>
                </div>
            </div>
        </div>
        <div class="case-content">
            <div>
                <div class="case-content-time">
                    <div class="content-time-clock">{{moment(case_data.add_time).format('HH:ss')}}</div>
                    <div class="content-time-title">创建病例</div>
                </div>
                <div class="case-content-box">
                    <div class="content-box-detail">患者信息：{{case_data.patient_name}} | {{case_data.patient_age_list ? JSON.parse(case_data.patient_age_list)[0] ? JSON.parse(case_data.patient_age_list)[0]+'岁' : JSON.parse(case_data.patient_age_list)[1]+'月' : '未知'}} | {{case_data.patient_gender}}  | {{case_data.patient_nation}} | {{case_data.patient_marital_status}}</div>
                    <div class="content-box-detail">病症信息：{{case_data.symptom}} | {{case_data.patient_division}} | {{case_data.chief_complaint}}</div>
                    <div class="content-box-detail">病例设置：{{case_data.degree == 1 ? '简单' : case_data == 2 ? '适中' : '困难'}} | {{case_data.force_unscramble == 0 ? '不强制' : case_data.force_unscramble == 1 ? '问诊结束' : case_data.force_unscramble == 2 ? '体格检查结束' : '辅助检查结束'}} | {{case_data.rediagnosis == 0 ? '复诊' : case_data.rediagnosis == 1 ? '不复诊' : '自定义'}}</div>
                </div>
            </div>
            <div v-for="(item, index) in case_detail" :key="index">
                <div class="case-content-time">
                    <div class="content-time-clock">{{moment(item.create_time).format('HH:ss')}}</div>
                    <div class="content-time-title">{{item.type == 'PrincipalDiagnosis' ? '主要诊断' : item.type == 'SecondaryDiagnosis' ? '次要诊断' : '鉴别诊断'}}：{{item.name}}</div>
                </div>
                <div class="case-content-box-content" :style="index == case_detail.length - 1 ? {border: 'none'}: ''">
                    <div class="case-content-box-gist"  v-for="item1 in item.content">
                        <div v-if="item1.type == 'inquiry'" class="case-detail-inquiry">
                            <div class="case-detail-inquiry-title">问诊</div>
                            <div class="case-detail-inquiry-content">{{item1.ask}}{{item1.answer}}</div>
                        </div>
                        <div v-if="item1.type == 'physical'" class="case-detail-physical">
                            <div class="case-detail-physical-title">
                                <div class="physical-title-name">体检</div>
                                <div class="physical-title-content">{{item1.first_name}} > {{item1.second_name}}</div>
                            </div>
                            <div class="case-detail-physical-content">{{item1.third_name}}</div>
                        </div>
                        <div v-if="item1.type == 'diagnose'" class="case-detail-inquiry">
                            <div class="case-detail-inquiry-title" style="background-color:#F6B242;">辅助</div>
                            <div class="case-detail-inquiry-content">{{item1.first_name}} > {{item1.second_name}}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import postData from '../../../../api/postData'
    import moment from 'moment'

    export default {
        data() {
            return {
                outline_list: [{}],
                outline_data: 0,
                case_type: [
                    {color: '#A1CDFF', title: '问诊', short_title: '问诊'},
                    {color: '#60CFD7', title: '体格检查', short_title: '体检'},
                    {color: '#FFC058', title: '辅助检查', short_title: '辅检'},
                    {color: '#BB91FE', title: '诊断', short_title: '诊断'},
                ],
                case_data: '',
                case_detail: '',
                moment
            }
        },
        methods: {
            handleBack() {
                this.$router.go(-1)
            },
            selectChange(val) {
                this.case_detail = JSON.parse(this.outline_list[val].basis)
            },
            getList() {
                postData('case/getCaseDetailAndOutlines', {id: parseInt(this.$route.query.id)}).then(res => {
                    if(res.res_code == 1) {
                        this.case_data = res.data
                        this.outline_list = res.data.outlines
                        this.case_detail = this.outline_list[0].basis ? JSON.parse(this.outline_list[0].basis) : ''
                    }
                    console.log(this.case_data);
                })
            },
        },
        mounted() {
            this.getList()
        }
    }
</script>

<style scoped lang="less">
    .case-content-font{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 1px;
        text-align: left;
    }
    .case-header {
        height: 50px;
        background: #686F92;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 1000px;

        .header-box{
            display: flex;
            align-items: center;
            height: 100%;
        }

        .case-header-back {
            width: 130px;
            height: 100%;
            background: #4098FF;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .back-img {

            }

            .back-font {
                margin-left: 10px;
                font-size: 18px;
                color: #fff
            }
        }

        .case-header-title {
            margin-left: 30px;
            color: #fff;
            font-size: 18px
        }

        .case-header-btn {
            margin-left: 30px;
            display: flex;
            align-items: center;

            .header-btn-img {
                margin-right: 16px;
                cursor: pointer;
            }
            .header-btn-check{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #FFFFFF;
                letter-spacing: 0;
                text-align: center;
                margin-left: 30px;
                text-decoration: underline;
                cursor: pointer;

                &:hover{
                    color: #4098ff;
                }
            }
            /deep/ .ivu-select, /deep/ .ivu-select-selection, /deep/ .ivu-select-selected-value, /deep/ .ivu-select-placeholder{
                width: 250px;
                height: 30px;
                background: #474C63;
                border-radius: 15px;
                border: none;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #FFFFFF;
                letter-spacing: 1.05px;
                line-height: 30px;
            }
            /deep/ .ivu-icon{
                color: #fff;
            }
        }

        .case-header-type {
            display: flex;
            /*position: absolute;*/
            margin-right: 50px;
            align-items: center;

            .type-box {
                display: flex;
                align-items: center;

                .type-box-color {
                    width: 20px;
                    height: 10px;
                    border-radius: 2px;
                    margin: 0 10px 0 15px
                }

                .type-box-font {
                    color: #fff;
                    font-size: 16px
                }
            }
            .save-btn{
                width: 133px;
                height: 34px;
                margin-left: 30px;
            }
        }
    }
    .case-content{
        text-align: left;
        padding: 50px 150px;
        height: calc(100% - 50px);
        overflow-y: auto;

        .case-content-time{
            display: flex;
            align-items: center;

            .content-time-clock{
                font-family: PingFangSC-Medium;
                font-size: 18px;
                color: #474C63;
            }
            .content-time-title{
                display: inline-block;
                height: 40px;
                line-height: 40px;
                padding: 0 20px;
                background: #F0F0F7;
                border-radius: 4px;
                font-family: PingFangSC-Regular;
                font-size: 18px;
                color: #474C63;
                margin-left: 30px;
            }
        }
        .case-content-box{
            border-left: 1px solid #CDCED3;
            padding: 30px 50px;
            margin-left: 20px;

            .content-box-detail{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
                margin-bottom: 20px;
            }
        }
        .case-content-box-content{
            border-left: 1px solid #CDCED3;
            padding: 10px 50px;
            margin-left: 20px;
        }
        .case-content-box-gist{
            margin-top: 20px;
        }
    }
    .case-detail-inquiry{
        display: flex;
        margin-bottom: 15px;
        /*justify-content: space-between;*/

        .case-detail-inquiry-title{
            background: #80B2EC;
            border-radius: 15px;
            width: 45px;
            height: 20px;
            margin: 0 15px;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #FFFFFF;
            text-align: center;
        }
        .case-detail-inquiry-content{
            width: calc(100% - 45px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .case-content-font
        }
    }
    .case-detail-physical {
        margin-bottom: 15px;

        .case-detail-physical-title {
            display: flex;

            .physical-title-name {
                background: #52C9D1;
                border-radius: 15px;
                width: 45px;
                height: 20px;
                margin: 0 15px;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #FFFFFF;
                text-align: center
            }

            .physical-title-content {
                width: calc(100% - 45px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: left;
                .case-content-font
            }
        }

        .case-detail-physical-content {
            text-align: left;
            margin-left: 70px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .case-content-font
        }
    }
</style>
