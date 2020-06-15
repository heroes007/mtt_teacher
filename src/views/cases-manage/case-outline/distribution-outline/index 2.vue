<template>
    <div>
        <Tabs value="name1" class="tabs">
            <TabPane label="待分配" name="name1">
                <div class="top">
                    <Input style="width: 220px;" placeholder="搜索病症/诊断/机构/'创建人"/>
                    <div style="margin-left: 40px;">待分配提纲 <span style="color: #4098ff">21</span></div>
                </div>
                <tables :tabel-height="tableHeight" :isSelection="true" :column="columns1" :table-data="list"/>
                <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
            </TabPane>
            <TabPane label="审核中" name="name2">
                <div class="top">
                    <Input style="width: 220px;" placeholder="搜索病症/诊断/机构/'创建人"/>
                </div>
                <tables :tabel-height="tableHeight" :column="columns2" :table-data="list"/>
                <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
            </TabPane>
            <TabPane label="已审核" name="name3">
                <div class="top">
                    <Select v-model="resultSelect" style="width:200px">
                        <Option v-for="item in resultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Input style="width: 220px;margin-left: 20px;" placeholder="搜索病症/诊断/机构/'创建人"/>
                </div>
                <tables :tabel-height="tableHeight" :column="columns3" :table-data="list"/>
                <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import tables from '../../../../components/tables'
    import pageList from '../../../../components/Page'
    import pageMixin from '../../../mixins/pageMixins'

    export default {
        components: {tables, pageList},
        mixins: [pageMixin],
        data() {
            return {
                tableHeight: null,
                columns1: [{
                    title: '症状',
                    key: 'symptom',
                    align: 'left',
                    minWidth: 200
                },{
                    title: '诊断',
                    key: 'icd10_title',
                    align: 'left',
                    minWidth: 200,
                },{
                    title: '难度',
                    align: 'left',
                    minWidth: 80,
                    render: (h, param) => {
                        let d = param.row.degree == 1 ? '简单' : param.row.degree == 2 ? '适中' : '困难'
                        return h('span', d)
                    }
                },{
                    title: '所属机构',
                    align: 'left',
                    minWidth: 120,
                },{
                    title: '科室',
                    key: 'dept',
                    minWidth: 120
                },{
                    title: '创建人',
                    key: 'realname',
                    minWidth: 120
                },{
                    title: '提交时间',
                    key: 'create_time',
                    minWidth: 200
                },{
                    title: '操作',
                    minWidth: 260,
                    slot: 'operation',
                    operation: [['查看','operation']]
                }],
                list: [
                    {symptom: 1, icd10_title: 2, degree: 2}
                ],
                columns2: [],
                columns3: [],
                resultSelect: '',
                resultList: [
                    {value: 'all', label: '全部结果'},
                    {value: 0, label: '审核失败'},
                    {value: 1, label: '审核通过'},
                ]
            }
        },
        mounted() {
            this.tableHeight = window.innerHeight - 240
            this.columns2 = [...this.columns1]
            this.columns3 = [...this.columns1]
            this.columns2.splice(8, 1, this.$config.copy(this.columns1[8]))
            this.columns2[8].operation.push(['修改分配', 'operation1'])
            this.columns3.splice(8, 1, this.$config.copy(this.columns1[8]))
            this.columns3[8].operation.push(['原因', 'operation1'])
        }
    }
</script>

<style scoped lang="less">
    .tabs{
        /deep/ .ivu-tabs-nav-scroll{
            background-color: rgba(240, 240, 247, 1);
            justify-content: start;
        }
    }
    .top{
        height: 48px;
        display: flex;
        align-items: center;
        padding-left: 20px;
    }
</style>
