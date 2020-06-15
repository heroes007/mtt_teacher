<template>
     <Table :height="tableHeight" :columns="columns1" :data="tableData"></Table>
</template>
<script>
import types from 'src/types'
export default {
    props:{
        tableHeight: types.PropsNumber(),
        tableData: types.PropsArray(),
    },
    mixins: [],
    mounted() {
        // document.querySelector('.ivu-table th').style.paddingLeft = '20px'
    },
    data(){
        return{
            columns1: [
                {
                    title: '名称',
                    key: 'name',
                    align: 'left',
                    minWidth: 220,
                    // render: (h, params) => {
                    //     let d = params.row.name
                    //     return h('span',{style:{'paddingLeft': '20px'}}, d)
                    // }
                },
                {
                    title: '缩写',
                    key: 'abbreviation',
                    minWidth: 80,
                    align: 'center',
                },
                {
                    title: '检查结果',
                    key: 'value',
                    minWidth: 150,
                    align: 'center',
                },
                {
                    title: '参考值',
                    key: 'refvalue',
                    align: 'center',
                    minWidth: 120,
                },
                {
                    title: '单位',
                    key: 'units',
                    align: 'center',
                    minWidth: 260
                },
                // {
                //     title: '费用（元）',
                //     key: 'cost',
                //     align: 'center',
                // },
            ],
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-table th, /deep/ .ivu-table td{
    font-size: 16px;
}
</style>

