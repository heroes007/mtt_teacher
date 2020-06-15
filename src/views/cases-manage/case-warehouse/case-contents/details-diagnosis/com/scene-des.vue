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
        <div>
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
        <Button class="scene-btns" @click="Preservation">保存</Button>
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
            page: {},
            diagnosisId: {},
        },
        data() {
            return {
                deletesImg,
                panes: '2',
                scene: '',
                times: 0,
                modal1: false,
            }
        },
        watch: {
            diagnosisId(_new){
                this.getDateils()
            },
            page(_new){
                if(_new === 0) this.getDateils()
            }
        },
        methods: {
            selMenu(name){
                this.panes = name
            },
            Preservation(){
                let d = {
                    scence_desc: this.scene,
                    time_limit: this.times,
                    id: this.diagnosisId
                }
                if(this.scene){
                    if(this.times) {
                        PostData('case/saveScenceDesc',d).then((r) => {
                            if(r.res_code == 1){
                                this.$Message.info(r.msg);
                            }
                        })
                    }else this.$Message.info('请输入操作限时！');
                }else this.$Message.info('请输入场景描述！')
            },
            getDateils(){
                PostData('case/getScenceDesc', {id: this.diagnosisId}).then((r) => {
                    if(r.res_code == 1) {
                        sessionStorage.setItem("FrequencyId", r.data.id)
                        this.scene = r.data.scence_desc
                        this.times = r.data.time_limit
                    }
                })
            }
        },
        mounted() {
            if(this.diagnosisId) this.getDateils()
        },
    }
</script>

<style lang="less" scoped>
    .scene-des{
        .scene-btns{
            margin-top: 50px;
            width: 150px;
            height: 36px;
            background-color: #fff;
            color: #4098ff;
        }
        width: 1061px;
        height: 648px;
        padding: 30px 55px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
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