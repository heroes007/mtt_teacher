<template>
    <div style="height: 100%;">
        <div class="header">
            <div class="header-left" @click="handleBack">
                <img class="header-back-img" :src="content_back" alt="">
                <div class="header-back-font">返回</div>
            </div>
            <div class="header-right">
                <div class="header-right-box" @click="handleSave">
                    <img class="header-right-img" :src="content_save" alt="">
                    <div class="header-right-font">保存</div>
                </div>
                <div class="header-right-box" @click="handleSumit">
                    <img class="header-right-img" :src="content_submit" alt="">
                    <div class="header-right-font">提交</div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="navigate">
                <div v-for="(item, index) in navigate" @click="setNavigate(index)" :key="index" :class="opinionNavigate(index)">
                    <div class="navigate-left"><span/></div>
                    <div class="navigate-content">{{item.title}}</div>
                    <div class="navigate-right"><span/></div>
                </div>
            </div>
            <content-message v-if="progress == 1" @handleNavigate="handleNavigate"/>
            <content-summarize v-if="progress == 2" @handleNavigate="handleNavigate"/>
            <content-diagnose v-if="progress == 3" @handleNavigate="handleNavigate"/>
            <arrangement style="width: 100%;" v-if="progress == 4" @handleNavigate="handleNavigate" />
            <DetailsDiagnosis v-if="progress == 5" @handleNavigate="handleNavigate" />
            <OutlineSee style="width: 100%;" v-if="progress == 6" @handleNavigate="handleNavigate" />
            <ScoreSet v-if="progress == 7" @handleNavigate="handleNavigate" />
        </div>
    </div>
</template>

<script>
    import content_save from '../../../../assets/img/case/content_save.png'
    import content_submit from '../../../../assets/img/case/content_submit.png'
    import content_back from '../../../../assets/img/case/content_back.png'
    import contentMessage from './case-content-message'
    import contentSummarize from './case-content-summarize'
    import contentDiagnose from './case-content-diagnose'
    import DetailsDiagnosis from './details-diagnosis'
    import arrangement from './arrangement'
    import ScoreSet from './score-set'
    import OutlineSee from './outline-see'

    export default {
        components: {contentMessage, contentSummarize, contentDiagnose, DetailsDiagnosis, arrangement, ScoreSet, OutlineSee},
        data() {
            return {
                content_save, content_submit, content_back,
                progress: 1,
                maxProgress: 1,
                navigate: [
                    {title: '病例信息'},
                    {title: '患者概述'},
                    {title: '创建诊断'},
                    {title: '提纲整理'},
                    {title: '诊疗详情'},
                    {title: '提纲查看'},
                    {title: '评分设置'},
                ]
            }
        },
        methods: {
            opinionNavigate(index) {
                if(index == 0) return this.progress == 1 ? 'navigate-first-check' : 'navigate-first'
                else{
                    if(index == this.progress - 1) return 'navigate-other-check'
                    else if(index > this.maxProgress - 1) return 'navigate-other'
                    else if(index < this.maxProgress) return 'navigate-other-checked'
                }
            },
            setNavigate(index){
                if(index < this.maxProgress) this.handleNavigate(index+1)
            },
            handleNavigate(index) {
              PostData('case/getStep', {case_id: +sessionStorage.getItem('CASEID')}).then(res => {
                  if(index > res.data.step || !res.data.step) PostData('case/setStep', {case_id: +sessionStorage.getItem('CASEID'), step: index}).then(res => {
                      if(res.res_code == 1) {
                          sessionStorage.setItem('CaseActiveMaxStep',index)
                          this.maxProgress = index
                      }
                  })
              })
              this.progress = index
              sessionStorage.setItem('CaseActiveStep',index)
            },
            handleBack() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认返回上一层</p>',
                    onOk: () => {
                        // this.handleSave()
                        this.$router.push('case-warehouse')
                    },
                    onCancel: () => {
                        // this.$router.push('case-warehouse')
                    }
                })
            },
            handleSave() {
                (async () => {
                        // let d = sessionStorage.getItem('CaseActiveStep') || 1
                        // await $CasePreservation.$emit('CasePreservation', d)
                        let state = +JSON.parse(sessionStorage.getItem('CaseContentSum')).state
                        if(!state || state == 1) {
                            let d = sessionStorage.getItem('CaseActiveStep') || 1
                            await $CasePreservation.$emit('CasePreservation', d)
                            await PostData('case/approveCase',{id: +sessionStorage.getItem('CASEID'), state: 0}).then((r) => {
                                // if(r.res_code == 1) this.$Message.success('已提交审核!')
                            })
                        }else this.$Message.info('不能保存为草稿')
                    }
                )()
            },
            handleSumit() {
                if(this.maxProgress == 7) {
                    let state = +JSON.parse(sessionStorage.getItem('CaseContentSum')).state
                    console.log(state, '111');
                    if(state === -1 || state === 2) this.$Message.info('该病例已通过审核')
                    else {
                        PostData('case/approveCase',{id: +sessionStorage.getItem('CASEID'), state: 1}).then((r) => {
                            if(r.res_code == 1) this.$Message.success('已提交审核!')
                        })
                    }
                }
                else this.$Message.info('请完成该病例信息')
            }
        },
        mounted() {
            if(sessionStorage.getItem('CaseActiveStep')) this.progress = +sessionStorage.getItem('CaseActiveStep')
            if(sessionStorage.getItem('CaseActiveMaxStep')) this.maxProgress = +sessionStorage.getItem('CaseActiveMaxStep')
        },
    }
</script>

<style scoped lang="less">
    .header{
        height: 50px;
        background: #686F92;
        display: flex;
        justify-content: space-between;

        .header-left{
            width: 133px;
            background-color: #4098ff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .header-back-img{
                width: 24px;
                height: 24px;
            }
            .header-back-font{
                font-size: 18px;
                color: #FFFFFF;
                letter-spacing: 1.05px;
                margin-left: 10px;
            }
        }
        .header-right{
            display: flex;
            align-items: center;

            .header-right-box{
                display: flex;
                align-items: center;
                cursor: pointer;
                margin-right: 50px;
                margin-left: -10px;
            }
            .header-right-img{
                width: 20px;
                height: 20px;
            }
            .header-right-font{
                margin-left: 10px;
                font-size: 16px;
                color: #FFFFFF;
            }
        }
    }
    .content{
        display: flex;
        flex-direction: column;
        align-items: center;
        height: calc(100% - 50px);
        overflow-y: auto;

        .navigate{
            margin: 30px 0;
            display: flex;

            .navigate-first-check{
                display: flex;
                cursor: pointer;
                .navigate-content{
                    height: 40px;
                    width: 92px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    background-color: #4098ff;
                }
                .navigate-left{
                    width: 20px;
                    height: 40px;
                    background-color: #4098ff;
                }
                .navigate-right{
                    z-index: 1;
                    width: 20px;
                    border: 20px solid;
                    border-color: transparent transparent transparent #4098ff;
                }
            }
            .navigate-other-check{
                display: flex;
                position: relative;
                margin-left: -30px;
                cursor: pointer;
                .navigate-content{
                    height: 40px;
                    width: 112px;
                    padding-left: 20px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    background-color: #4098ff;
                }
                .navigate-left{
                    width: 20px;
                    border: 20px solid;
                    border-color: transparent transparent transparent #fff;
                    position: absolute;
                }
                .navigate-right{
                    z-index: 1;
                    width: 20px;
                    border: 20px solid;
                    border-color: transparent transparent transparent #4098ff;
                }
            }
            .navigate-first{
                display: flex;
                cursor: pointer;
                .navigate-content{
                    height: 40px;
                    width: 92px;
                    color: #4098FF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    background-color: #fff;
                    border-top: 1px solid #4098ff;
                    border-bottom: 1px solid #4098ff;
                }
                .navigate-left{
                    width: 20px;
                    height: 40px;
                    background-color: #fff;
                    border: 1px solid #4098ff;
                    border-right: none;
                }
                .navigate-right{
                    z-index: 1;
                    border: 20px solid;
                    border-color: transparent transparent transparent #4098ff;
                    position: relative;

                    span{
                        z-index: 1;
                        border: 19px solid;
                        border-color: transparent transparent transparent #fff;
                        position: absolute;
                        left: -20px;
                        top: -19px;
                    }
                }
            }
            .navigate-other{
                display: flex;
                position: relative;
                margin-left: -30px;
                cursor: pointer;
                .navigate-content{
                    height: 40px;
                    width: 112px;
                    padding-left: 20px;
                    color: #9397AD;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    background-color: #F0F0F7;
                }
                .navigate-left{
                    width: 20px;
                    border: 20px solid;
                    border-color: transparent transparent transparent #fff;
                    position: absolute;
                }
                .navigate-right{
                    z-index: 1;
                    width: 20px;
                    border: 20px solid;
                    border-color: transparent transparent transparent #F0F0F7;
                }
            }
            .navigate-other-checked{
                display: flex;
                position: relative;
                margin-left: -30px;
                cursor: pointer;
                .navigate-content{
                    height: 40px;
                    width: 112px;
                    padding-left: 20px;
                    color: #4098ff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    background-color: #fff;
                    border-top: 1px solid #4098ff;
                    border-bottom: 1px solid #4098ff;
                }
                .navigate-left{
                    width: 20px;
                    border: 20px solid;
                    border-color: transparent transparent transparent #4098ff;
                    position: absolute;

                    span{
                        border: 19px solid;
                        border-color: transparent transparent transparent #fff;
                        position: absolute;
                        left: -20px;
                        top: -19px;
                    }
                }
                .navigate-right{
                    z-index: 1;
                    width: 20px;
                    border: 20px solid;
                    border-color: transparent transparent transparent #4098ff;
                    position: relative;

                    span{
                        border: 19px solid;
                        border-color: transparent transparent transparent #fff;
                        position: absolute;
                        left: -20px;
                        top: -19px;
                    }
                }
            }
        }
    }
</style>
