<template>
    <div>
        <div class="case-explain-box" @click="caseExplain">
            <img class="explain-img" :src="explain_outline" alt="">
            <div class="explain-content">操作帮助</div>
        </div>
        <Modal v-model="explainModal" :footer-hide="true" title="操作帮助" width="560">
            <div v-for="(item, index) in contentList" :key="index" class="modal-box">
                <div class="box-num">{{index + 1}}</div>
                <div class="box-content">
                    <img v-if="item.img" style="height: 37px; margin-bottom: 10px;" :src="case_banner" alt="">
                    <div style="width: 430px;">
                        <span style="color: #f00">{{item.title}}</span>
                        <span style="color: #333;">{{item.content}}</span>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    import explain_outline from '../../../../../assets/img/case/explain_outline.png'
    import case_banner from '../../../../../assets/img/case/case_banner.png'

    export default {
        data() {
            return {
                explain_outline, case_banner,
                explainModal: false,
                contentList: [
                    {
                        img: case_banner,
                        title: '设置诊疗要素：',
                        content: '方法一，分别点击问诊、体格检查、辅助检查、治疗在提纲中设置对应的问诊要素、查体要素、辅检要素、治疗要素。 方法二，在提纲中选择一项，单击右键，选择标注，标注诊疗要素。'
                    },
                    {
                        title: '设置病种：',
                        content: '在提纲中选择一项，单击右键，选择添加诊断，在新增的病种框内，输入病种名称，可模糊搜索ICD10库中的病种，并选择一项病种设置为病种。'
                    }
                ]
            }
        },
        methods: {
            caseExplain() {
                this.explainModal = true
            }
        }
    }
</script>

<style scoped lang="less">
    .case-explain-box{
        display: flex;
        align-items: center;
        cursor: pointer;

        .explain-img{
            width: 40px;
            height: 40px;
        }
        .explain-content{
            font-size: 16px;
            color: #0066FF;
            margin-left: 10px;
        }
        .explain-content:hover {
            color: rgba(0, 153, 255, 0.75);
        }
    }
    .modal-box{
        display: flex;
        margin-top: 20px;
        margin-bottom: 60px;

        .box-num{
            width: 30px;
            height: 30px;
            color: #fff;
            background-color: rgb(246, 139, 18);
            line-height: 30px;
            text-align: center;
            border-radius: 100%;
            font-size: 20px;
        }
        .box-content{
            margin-left: 10px;
        }
    }
    /deep/ .ivu-modal-body{
        padding: 34px;
    }
</style>
