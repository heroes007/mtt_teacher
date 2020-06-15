<template>
    <Tabs style="height: 100%" value="name1">
        <TabPane label="数据概览" name="name1">
            <DataOverview/>
        </TabPane>
        <TabPane label="考试分析" name="name2">
            <ExamAnalysis/>
        </TabPane>
        <TabPane label="病例分析" name="name3">
            <CaseAnalysis/>
        </TabPane>
    </Tabs>
</template>

<script>
    import DataOverview from './data-overview'
    import CaseAnalysis from './case-analysis'
    import ExamAnalysis from './exam-analysis'

    export default {
        components: {DataOverview,CaseAnalysis,ExamAnalysis},
        name: '',
        data() {
            return {
                
            }
        }
    }
</script>

<style lang="less" scoped>
  .tab-name, /deep/.ivu-tabs-content, .data-management-main{
    height: 100% !important;
    background-color: #f0f0f7;
  }
  .data-management-main{
    position: relative;
    padding: 10px;
  }
  .case-analysis{
    height: 100% !important;
    background-color: #fff;
  }
</style>