<template>
    <Modal v-model="show" :mask-closable="false" :footer-hide="true" width="850" @on-cancel="handleCancel">
        <div class="modal-top">添加问诊检查</div>
        <div style="height: 700px;display: flex">
            <div class="model-left">
                <div class="model-left-title">
                    <span style="background-color:#fff; z-index: 10;">问诊检查项</span>
<!--                    <div style="height: 1px;border-bottom: 1px solid #f0f0f0;transform: translateY(-34px)"></div>-->
                </div>
                <div class="modal-box">
                    <div v-for="(item, index) in title_list" :key="index" @click="handleClick(item, index)" class="panel-content" :class="item.checked ? 'panel-content-checked' : ''">
                        <div class="panel-title">{{item.talk_group}}</div>
                        <Icon :size="24" color="#5399f7" type="md-checkmark" v-if="item.checked"/>
                    </div>
                </div>
            </div>
            <div class="modal-right">
                <div class="right-select">
                    <Input v-model="keyword" placeholder="搜索提问" @on-change="inpueChange">
                        <Icon size="24" type="md-search" slot="prefix" />
                    </Input>
<!--                    <Button type="primary" ghost>添加新提问</Button>-->
                </div>
                <div class="right-list">
                    <div v-if="!talk_list.length" style="text-align: center;font-size: 16px;margin-top: 20px;">暂无数据</div>
                    <div @click="selectList(item, index)" class="right-list-content" v-for="(item, index) in talk_list" :key="index" :class="item.checked ? 'right-list-content-checked' : ''">{{item.question}}</div>
                </div>
                <div class="right-question">
                    <div class="question-title">提问</div>
                    <Input disabled v-model="talk_list_content.question"></Input>
                </div>
                <div class="right-answer">
                    <RadioGroup style="width: 100%;" v-model="ask_data">
                        <div>
                            <Radio label="标准回答"></Radio>
                            <Input style="margin-top: 10px;" v-model="talk_list_content.answer"></Input>
                        </div>
<!--                        <div style="margin-top: 25px;">-->
<!--                            <Radio label="其他回答"></Radio>-->
<!--                            <Input style="margin-top: 10px;" v-model="other_answer"></Input>-->
<!--                        </div>-->
                    </RadioGroup>
                </div>
                <div style="display: flex;justify-content: center;margin-top: 46px;">
                    <Button @click="handleSubmit" style="width: 180px;height: 36px;margin-top: 60px;" type="primary">保存</Button>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
    import postData from '../../../../../api/postData'

    export default {
        data() {
            return {
                show: false,
                collapse: '',
                title_list: [],
                last_check: null,
                keyword: '',
                talk_group: '',
                set_timeout: null,
                talk_list: [],
                last_list_check: null,
                talk_list_content: {
                    question: '',
                    id: null,
                    answer: ''
                },
                other_answer: '',
                ask_data: null,
            }
        },
        props: {
            isShow: {
                type: Boolean,
            },
            outline: {
                type: Object
            },
            ev: {
                type: [Object, String]
            },
        },
        watch: {
            isShow(val) {
                this.show = val
                this.getList()
            },
        },
        methods: {
            InquiryCl(item,index) {

            },
            handleCancel() {
                this.$emit('cancel-inquiry', false)
                this.show = false
            },
            handleClick(item, index) {
                if(this.last_check || this.last_check == 0) this.title_list[this.last_check].checked = false
                item.checked = true
                this.last_check = index
                this.$forceUpdate()
                this.talk_group = item.talk_group
                this.getDataList()
            },
            inpueChange() {
                clearTimeout(this.set_timeout)
                this.set_timeout = setTimeout(() => { this.getDataList() }, 500)
            },
            selectList(item, index) {
                if(this.last_list_check || this.last_list_check == 0) this.talk_list[this.last_list_check].checked = false
                this.ask_data = '标准回答'
                item.checked = true
                this.last_list_check = index
                this.talk_list_content = item
                this.$forceUpdate()
            },
            getDataList() {
                let data = {
                    keyword: this.keyword,
                    talk_group: this.talk_group,
                    page_num: 1,
                    page_size: 99999,
                    case_id: parseInt(this.$route.query.id)
                }
                postData('case/getTalks', data).then(res => {
                    this.talk_list = res.data.data
                })
            },
            handleSubmit() {
                let data = {
                    case_id: this.outline.case_id,
                    template_id: this.outline.id,
                    question: this.talk_list_content.question,
                    answer: this.ask_data == '标准回答' ? this.talk_list_content.answer : this.other_answer,
                    talk_group: this.talk_group,
                    representor: 'Self',
                    case_diagnose_ids: this.ev.item._cfg.model.case_ids,
                    basis_type: 'SupportingBasis'
                }
                if(this.talk_group && this.talk_list_content.question && this.ask_data) {
                    if(this.ask_data == '其他回答' ? this.other_answer : true) {
                        postData('case/addTalkBasis', data).then(res => {
                            if(res.res_code == 1) {
                                data.id = this.talk_list_content.id
                                this.$emit('inquiryDone', data)
                                this.handleCancel()
                                this.talk_list_content = {
                                    question: '',
                                    id: null,
                                    answer: ''
                                }
                                this.ask_data = this.talk_group = ''
                                this.talk_list = []
                                this.other_answer = ''
                            }
                        })
                    }else this.$Message.info('请输入其他回答')
                }else this.$Message.info('请选择问诊问题')
            },
            getList() {
                postData('case/getTalkTree', {case_id: this.$route.query.id}).then(res => {
                    if(res.res_code == 1) this.title_list = res.data
                })
            }
        },
        mounted() {
            this.getList()
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-collapse, /deep/ .ivu-collapse-header, /deep/ .ivu-collapse-item{
        border: none !important;
    }
    /deep/ .ivu-collapse-item{
        line-height: 34px;
    }
    /deep/ .ivu-icon-ios-arrow-forward{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%)
    }
    /deep/ .item-head{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }
    /deep/ .ivu-collapse-content-box{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
        line-height: 34px;
    }
    .modal-top{
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #474C63;
    }
    .model-left{
        background: #FFFFFF;
        box-shadow: 0 0 7px 0 rgba(64,152,255,0.10);
        border-radius: 0 0 0 10px;
        width: 228px;
        height: 100%;

        .model-left-title{
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474C63;
            letter-spacing: 0;
            text-align: center;
            padding-top: 20px;
            position: relative;
        }

        .modal-box{
            height: calc(100% - 47px);
            overflow-y: auto;
        }

        .panel-content{
            padding: 0 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 34px;
            cursor: pointer;
            width: 210px;
            margin-right: 15px;

            &:hover{
                .panel-title{
                    color: #4098ff;
                }
            }
        }
        .panel-title{
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;
        }
        .panel-content-checked{
            background: #F0F0F7;
            border-radius: 100px;
        }
    }
    .modal-right{
        width: 608px;

        .right-select{
            height: 50px;
            background: #F0F0F7;
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0 20px;

            /deep/ .ivu-input{
                border: none;
                background-color: #f0f0f7;
            }
        }
        .right-list{
            height: 188px;
            overflow-y: auto;
            padding: 15px 0;
            border: 1px solid #C8CCDD;

            .right-list-content{
                height: 34px;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
                letter-spacing: 0;
                text-align: justify;
                padding: 0 15px;
                display: flex;
                align-items: center;
                cursor: pointer;
                width: 570px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

            }
            .right-list-content-checked{
                background: #F0F0F7;
                border-radius: 100px;
            }
        }
        .right-question{
            margin-top: 20px;

            .question-title{
                margin-left: 14px;
                font-family: PingFangSC-Regular;
                font-size: 18px;
                color: #474C63;
                letter-spacing: 0;
            }

            /deep/ .ivu-input{
                height: 50px;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
            }
        }
        .right-answer{
            margin-top: 25px;

            /deep/ .ivu-input{
                height: 50px;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
            }
            /deep/ .ivu-radio-group-item{
                font-family: PingFangSC-Regular;
                font-size: 18px;
                color: #474C63;
                letter-spacing: 0;
            }
            /deep/ .ivu-radio-inner{
                height: 24px;
                width: 24px;
            }
            /deep/ .ivu-radio-inner:after{
                width: 14px;
                height: 14px;
                border-radius: 100%;
                left: 4px;
                top: 4px;
            }
            /deep/ .ivu-radio{
                display: none;
            }
        }
    }
</style>
