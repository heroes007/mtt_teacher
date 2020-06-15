<template>
    <div>
        <screen :type-arr="typeArr" @handleBack="handleBack" :select2="select2" :select2_1="select2_1" @selectChange2="selectChange2" @selectChange2_1="selectChange2_1" :select2Placeholder="select2Placeholder"
                :select2_1Placeholder="select2_1Placeholder" @inputChange="inputChange" :placehodle="placehodle" :sizeTitle1="sizeTitle1" :sizeNum1="total"></screen>
        <tables  :column="columns1" :table-data="list" @operation1="appraise"></tables>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import tables from '../../../components/tables'
    import pageList from '../../../components/Page'
    import pageMixins from '../../mixins/pageMixins'
    import postData from 'src/api/postData'

    export default {
        components: {screen, tables, pageList},
        mixins: [pageMixins],
        data() {
            const tit = this.$route.query.type == 1 ? '考试' : '作业'
            const selects = this.$route.query.type == 1 ? [{title: '全部', id: 'all'},{title: '考试中', id: 1}, {title: '已结束', id: 2}, {title: '未开始', id: 0}]
            : [{title: '全部', id: 'all'},{title: '未开始', id: 0},{title: '已开始', id: 1}, {title: '已结束', id: 2}]
            return {
                typeArr: ['backgroundColor', 'back', 'select2', 'select2_1', 'input', 'size1'],
                select2: selects,
                select2Placeholder: `请选择${tit}状态`,
                select2_1: [{title: '选择评分状态', id: 'all'},{title: '未评分', id: 0},{title: '已评分', id: 1}],
                select2_1Placeholder: '请选择评分状态',
                placehodle: '搜索学员姓名/账号',
                sizeTitle1: `${tit}人数`,
                sizeNum1: 10,
                columns1: [
                    {title: '用户ID', key: 'username'},
                    {title: '真实姓名', key: 'realname'},
                    {
                        title: '状态', key: 'exam_state',
                        render: (h, params) => {
                            let d = this.$route.query.type == 1 ?  params.row.exam_state : params.row.hw_state,  text = '-'
                            selects.forEach(t => {
                                if(t.id == d) text = t.title
                            });
                            return h('span', text)
                        }
                    },
                    {title: '评分', key: 'score'},
                    {title: `${tit}耗时`, key: 'duration'},
                    {title: `提交时间`, key: 'end_time'},
                    {
                        title: '操作',
                        minWidth: 260,
                        operation_state: true,
                        slot: 'operation',
                        operation: [[['查看','评分'],'operation1']],
                    }
                ],
                list: [],
                keyword: '',
                exam_state: 'all',
                score_state: 'all',
            }
        },
        computed: {
            type(){
                // type 1 考试  2 作业
                 return this.$route.query.type
            },
        },
        mounted() {
            this.getList()
        },
        methods: {
            handleBack() {
                let url = this.type == 1 ? 'exam-manage' : 'homework-manage'
                this.$router.replace(url)
            },
            selectChange2(val) {
                this.exam_state = val
                this.getList()
            },
            selectChange2_1(val) {
                this.score_state = val
                this.getList()
            },
            inputChange(val) {
                this.keyword = val;
                this.getList()
            },
            appraise(row,index) {
                 // state 1--查看 2--评分
                let exam_state = row.exam_state
                let state = row.score_state===1 ? 1 : row.score_state===0 ? 2 : 0;
                let id = this.type==1 ? {room_id: +this.$route.query.id} : { homework_id: +this.$route.query.id }
                let querys = {id: row.user_id, ...id, type: +this.type + 1, state, back: 'check-exam', exam_state, score_state: row.score_state}
                let query = row.score_state === 1 ? {...querys, score: row.score} : querys
                let d = { query, name: "view-reports"}
                this.$router.replace(d)
            },
            getList(){
                let id = +this.$route.query.id
                let url = this.type == 1 ? 'exam/getStudentExamList' : 'homework/getStudentHomeworkList'
                let state = this.$config.setSelVal(this.exam_state)
                let d1 = this.type == 1 ? {room_id: id} : {homework_id: id}
                let d2 = this.type == 1 ? {exam_state: state} : {hw_state: state}
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    score_state: this.$config.setSelVal(this.score_state),
                    ...d1,
                    ...d2
                }
                postData(url, d).then((res)=> {
                    if(res.res_code==1){
                        this.list = res.data.list
                        this.total = res.data.count
                        if(this.type == 2&&this.list&&this.list.length>0){
                            this.list.map((t) => t.exam_state = t.hw_state)
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
