<template>
    <div class="main">
        <div class="tabs-view-score tabs-content" :style="`width: ${casePane == 2&&page<4 ? '1061px' : '561px' }`">
            <Tabs @on-click="tabs" v-model="casePane" type="line" size="small" :class="page == 5 ? 'tabs5' : 'tabs'">
                <TabPane name="1" :label="title[page - 1]">
                   <OperationLeft v-if="casePane == 1" @changeState="changeState" :type="page" pane="essential1" />
                </TabPane>
                <TabPane v-if="page < 4" name="2" label="解读分析">
                   <unscramble :type="page" />
                </TabPane>
            </Tabs>
        </div>
        <div class="content let-content" v-show="casePane == 1">
            <ScoreDetails :type="page" v-show="isAdd" />
            <opertionEdit v-show="!isAdd" @changeState="changeState" :typePane="page"/>
        </div>
    </div>
</template>

<script>
    import unscramble from './unscramble'
    import OperationLeft from './operation-left'
    import ScoreDetails from './score-details'
    import opertionEdit from './operation-edit'

    export default {
        components: { unscramble, OperationLeft, ScoreDetails, opertionEdit },
        props: {
            page: {
                type: String,
                default: '',
            },
        },
        watch: {
            page(_new){
                if(_new > 3 ) this.casePane = '1'
            }
        },
        data() {
            return {
                title: ['主要诊断','次要诊断','鉴别诊断','','扣分项'],
                typePane: '',
                casePane: '1',
                isAdd: true

            }
        },
        methods: {
            tabs(name){
                this.typePane = name == 2 ? 'term' : ''
            },
            changeState(val) {
               this.isAdd = val
            }
        },
    }
</script>

<style lang="less" scoped>
    @import '../../details-diagnosis/com/details.less';
    .tabs-view-score{
        height: 647px;
    }
    /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused{
        border-color: #f0f0f7 !important;
    }
    /deep/ .ivu-tabs-tabpane{
        height: 597px;
    }
    .tabs-content{
        box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
        border-radius: 3px;
        .tabs5{
            width: 100%;
            /deep/ .ivu-tabs-tab-active{
                color: #474C63;
            }
            /deep/ .ivu-tabs-ink-bar{
                background-color: #F0F0F7 !important;
            }
            /deep/ .ivu-tabs-nav{
                width: 100%;
                margin: 0 !important;
                /deep/ .ivu-tabs-ink-bar{
                    margin: 0 !important;
                    height: 2px !important;
                    width: 100% !important;
                }
                /deep/ .ivu-tabs-tab{
                     height: 49px !important;
                     width: 100% !important;
                     font-family: PingFangSC-Medium;
                     font-size: 18px;
                     margin: 0 0 2px 0 !important;
                     padding: 0 !important;
                     border: 1px solid #F0F0F7 !important;
                }
            }
        }
        .tabs{
            width: 100%;
            /deep/ .ivu-tabs-nav-scroll{
                justify-content: flex-start;
            }
            /deep/ .ivu-tabs-nav{
                width: 561px;
                margin: 0 !important;
                /deep/ .ivu-tabs-ink-bar{
                    margin: 0 !important;
                    height: 2px !important;
                    width: 100%/2 !important;
                }
                /deep/ .ivu-tabs-tab{
                     height: 49px !important;
                     width: 100%/2 !important;
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
        margin-left: 2px;
    }
</style>
