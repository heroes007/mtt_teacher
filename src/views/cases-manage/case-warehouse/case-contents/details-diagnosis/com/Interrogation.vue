<template>
    <div class="main">
        <div class="tabs-view tabs-content">
            <Tabs @on-click="tabs" v-model="casePane" type="line" size="small" class="tabs">
                <TabPane name="1" :label="setLabel">
                   <OperationLeft :diagnosisId="diagnosisId" v-if="casePane == 1" :type="page" pane="essential1" />
                </TabPane>
                <TabPane name="2" label="问诊详情">
                   <OperationLeft :diagnosisId="diagnosisId" v-if="casePane == 2" :typePane="typePane" :type="page" pane="details1" />
                </TabPane>
                <TabPane name="3" label="解读分析">
                    <unscramble :diagnosisId="diagnosisId" v-if="casePane == 3" :type="page" />
                </TabPane>
            </Tabs>
        </div>
        <div class="content let-content">
            <OperationRight :diagnosisId="diagnosisId" :type="page" />
        </div>
        <Modal v-model="outlineModal" :footer-hide="true" title="查看提纲" width="1100" @on-cancel="modalCancel">
            <outlines v-if="outlineModal" style="height: 700px;"/>
        </Modal>
    </div>
</template>

<script>
    import caseSee from 'src/assets/img/case/case-see.png'
    import caseSeeGrey from 'src/assets/img/case/case-see-grey.png'
    import OperationLeft from './operation-left'
    import OperationRight from './operation-right'
    import unscramble from './unscramble.vue'
    import outlines from 'components/outlines/index'

    export default {
        components: { OperationLeft, OperationRight,  unscramble, outlines},
        props: {
            page: {
                type: String,
                default: ''
            },
            diagnosisId: {}
        },
        data() {
            return {
                actImg: caseSee,
                typePane: '',
                casePane: '1',
                outlineModal: false
            }
        },
        methods: {
            tabs(name){
                this.actImg = this.casePane == '1' ?  caseSee : caseSeeGrey ;
                this.typePane = name == 2 ? 'term' : ''
            },
            setLabel(h, params){
                return h('div',
                {
                   on: {
                       mouseenter: () => {
                          this.actImg = caseSee
                       },
                       mouseleave: () => {
                          this.actImg = this.casePane == '1' ?  caseSee : caseSeeGrey ;
                       }
                   },
                   style: {
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems : 'center',
                            justifyContent: 'center'
                    }
                },
                [
                    h('span', '问诊要素', {style: {'letter-spacing': '1.5px'}}),
                    h('img', {
                        attrs: {
                            src: this.actImg,
                        },
                        style: {
                            width: '15px',
                            height: '15px',
                            marginLeft: '10px'
                        },
                        on: {
                            click: () => {
                                this.outlineModal = true
                            }
                        }
                    }),
                ]);
            },
            modalCancel() {
                this.outlineModal = false
            }
        },
    }
</script>

<style lang="less" scoped>
    @import './details.less';
    /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused{
        border-color: #f0f0f7 !important;
    }
    /deep/ .ivu-tabs-tabpane{
        height: 597px;
    }
    .tabs-content{
        box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
        border-radius: 3px;
        .tabs{
            width: 100%;
            /deep/ .ivu-tabs-nav{
                width: 100%;
                margin: 0 !important;
                /deep/ .ivu-tabs-ink-bar{
                    margin: 0 !important;
                    height: 2px !important;
                    width: 100%/3 !important;
                }
                /deep/ .ivu-tabs-tab{
                     height: 49px !important;
                     width: 100%/3 !important;
                     font-family: PingFangSC-Medium;
                     font-size: 18px;
                     margin: 0 0 2px 0 !important;
                     padding: 0 !important;
                     border: 1px solid #F0F0F7 !important;
                }
            }
        }
    }
    .let-content{
        background: rgba(240,240,247,0.30);
        border-radius: 3px;
    }
</style>
