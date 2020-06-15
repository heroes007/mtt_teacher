<template>
    <div class="scene-des">
        <div>
            <span>场景描述</span>
            <Tooltip :max-width="300" content="医患在交流时的场景以及患者的病情状态" placement="bottom">
                <Icon class="help" :size="20" type="ios-help-circle-outline" />
            </Tooltip>
            <span class="scene-example" @click="modal1 = true">模板示例</span>
        </div>
        <Input class="inputs" v-model="scene" type="textarea" :rows="5" placeholder="请生动形象描述当前场景" />
        <div v-if="showSet" class="scenes-set">
            <span>场景设置：</span>
            <RadioGroup v-model="scenes">
                <Radio :label="0">指定场景</Radio>
                <Radio :label="1">固定场景</Radio>
            </RadioGroup>
            <Tooltip :max-width="410" content="指定场景: 经过上一次诊疗，设置本场景发生的重要治疗因素。固定场景：设置本场景为病情演进的固定场景" placement="bottom">
                    <Icon class="help" :size="20" type="ios-help-circle-outline" />
            </Tooltip>
        </div>
        <div v-if="showTimes">
            <div>
                <span>操作限时</span>
                <Tooltip :max-width="350" content="本次诊疗操作限制时间，可体现学员的诊疗效率" placement="bottom">
                    <Icon class="help" :size="20" type="ios-help-circle-outline" />
                </Tooltip>
            </div>
            <div style="margin-top: 10px;text-align: left;">
                <InputNumber class="times" :min="0" v-model="times"></InputNumber>
                <span>分钟</span>
            </div>
        </div>
        <div class="scenes-f" v-else>
            <div class="left">
                <div class="title">治疗因素</div>
            </div>
            <div class="right">
                <div class="title">药品（3）</div>
                <div class="details"> 
                   <div class="item">
                        <p class="tit">2.头孢替安</p>
                        <div class="btn">得分项</div>
                   </div>
                   <div class="deletes"><img class="deletes-img" :src="deletesImg" /></div>
                </div>
            </div>
        </div>


        <Modal class="scene-modals" footer-hide v-model="modal1" width="506">
            <Menu @on-select="selMenu" class="menus" mode="horizontal" theme="light" :active-name="panes">
                <MenuItem name="1">第1次诊疗模板</MenuItem>
                <MenuItem name="2">第2次诊疗模板</MenuItem>
            </Menu>
            <div v-if="panes == 1" class="content">
                <p>1、门诊室进来一位中年男子，黑胖胖的脸上留着短须，身形消瘦，精神萎靡。</p>
                <Divider />
                <p>2、一位年轻的女士在男士的陪同下，手捂着肚子，表情十分痛苦，缓慢的走进门诊室。</p>
            </div>
            <div v-if="panes == 2" class="content">
                <p style="margin-bottom:15px">【病情好转】</p>
                <p>术后10天后，患者精神状态良好，可带药出院。</p>
                <Divider />
                <p style="margin-bottom:15px">【病情恶化】</p>
                <p>术后5天，患者精神状态不佳，面色发黄，仍不可下床行走。</p>
                <Divider />
                <p style="margin-bottom:15px">【未见好转】</p>
                <p>术后5天，患者精神状态依然不佳，面色发黄，病情未见好转迹象，仍不可下床行走。</p>
            </div>
        </Modal>
    </div>
</template>

<script>
    import deletesImg from '../../../../../../assets/img/case/deletes.png'
    export default {
        props: {
            page: {
                type: String,
                default: ''
            },
            activeSeconds: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                deletesImg,
                scenes: 0,
                panes: '2',
                scene: '',
                times: 0,
                modal1: false,
            }
        },
        methods: {
            selMenu(name){
                this.panes = name
            }
        },
        computed: {
            showTimes(){
                return this.activeSeconds === 1 || this.scenes === 1
            },
            showSet(){
                return this.activeSeconds&&this.activeSeconds > 1
            }
        },
    }
</script>

<style lang="less" scoped>
    .scene-des{
        width: 1061px;
        height: 648px;
        padding: 30px 55px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .scenes-set{
            margin-bottom: 20px;
        }
        .help{
            margin: 0 30px;
        }
        .inputs{
            margin-top: 10px;
            border-radius: 3px;
            margin-bottom: 10px;
        }
        .times{
            width: 83px !important;
            margin-right: 10px;
        }
        .scene-example{
            color: #4098ff;
        }
        .scenes-f{
            width: 100%;
            height: 412px;
            display: flex;
            .title{
                border-top: 1px solid rgb(233, 233, 233);
                border-bottom: 1px solid rgb(233, 233, 233);
                width: 100%;
                height: 38px;
                color: rgb(51, 51, 51);
                background-color: rgb(249, 249, 249);
                font-size: 16px;
                line-height: 38px;
            }
            .details{
                height: 75px;
                width: 100%;
                border-top: 1px solid rgb(233, 233, 233);
                border-bottom: 1px solid rgb(233, 233, 233);
                padding-left: 20px;
                padding-top: 10px;
                text-align: left;
                display: flex;
                &:hover .deletes{
                    display: block
                }
                .item{
                    flex: 1;
                }
                .tit{
                    font-size: 12px;
                    color: rgb(51, 51, 51);
                }
                .btn{
                    font-size: 14px;
                    width: 84px;
                    height: 20px;
                    margin-top: 15px;
                }
                .deletes{
                    width: 60px;
                    height: 63px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    display: none;
                    .deletes-img{
                        width: 24px;
                        height: 18px;
                        margin-top: 22px;
                    }
                }
            }
            .left{
                width: 50%;
                height: 412px;
                border: 1px solid rgba(233, 233, 233, 1);
            }
            .right{
                width: 50%;
                height: 412px;
                border: 1px solid rgba(233, 233, 233, 1);
            }
        }
    }
    .scene-modals{
        /deep/ .ivu-modal-close{
            z-index: 2001 !important;
        }
        .menus{
            width: 475px;
            position: absolute;
            top: 0;
        }
        .content{
            margin-top: 80px;
            padding: 15px;
        }
    }
</style>