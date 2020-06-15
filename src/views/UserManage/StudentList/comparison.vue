<template>
    <Modal class="comparison" :width="936" v-model="modal1" @on-cancel="close" title="学员对比" footer-hide>
        <div class="main">
            <div class="item">
                <div class="title">添加学员</div>
                <Input v-model="search" class="search" suffix="ios-search" placeholder="输入学员ID/姓名" />
                <div class="selects">
                    <Select v-model="grade" style="width:180px" placeholder="请选择年级">
                        <Option v-for="item in select1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="patient_division" style="width:177px;margin-left:10px">
                        <Option v-for="(item, i) in select2" :value="item.patient_division" :key="i">{{ item.patient_division }}</Option>
                    </Select>
                </div>
                <Tables :tabel-height="tableHeight" @operation1="add" :column="columns1" :table-data="list" />
                <Page simple v-if="total>pageSize" :current="current" :total="total" :page-size="pageSize" @on-change="pageList" />
            </div>
            <div class="item right">
                <div class="title">对比名单</div>
                <Tables :tabel-height="tableHeight2" @operation2="deletes" :column="columns2" :table-data="list2" />
                <Button @click="comparison" class="btn">开始对比</Button>
            </div>
        </div>
    </Modal>
</template>

<script>
    import Tables from '../../../components/tables.vue'
    let columnss = () => {
        return [
            {
                title: '学员ID',
                key: 'username',
                align: 'left',
                minWidth: 90
            },
            {
                title: '姓名',
                key: 'realname',
                minWidth: 80
            },
            {
                title: '年级',
                key: '',
                align: 'left',
                minWidth: 80
            },
            {
                title: '科室',
                key: '',
                align: 'left',
                minWidth: 80
            },
        ]
    }
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            },
            isComparisonList: {
                type: Boolean,
                default: false
            },
            // len: {
            //     type: Number,
            //     default: 0
            // }
        },
        components: { Tables },
        data() {
            return {
                modal1: this.show,
                search: '',
                select1: [],
                select2: [],
                patient_division: '',
                grade: '',
                subjectsSelect: [{patient_division: '全部科室'}],
                tableHeight: 450,
                tableHeight2: 550,
                columns1: [
                    ...columnss(),
                    {
                        title: '操作',
                        minWidth: 80,
                        slot: 'operation',
                        isAllHide: true,
                        operation: [['添加', 'operation1']]
                    }
                ],
                list: [],
                columns2: [
                    ...columnss(),
                    {
                        title: '操作',
                        minWidth: 80,
                        slot: 'operation',
                        isAllHide: true,
                        operation: [['删除', 'operation2']]
                    }
                ],
                list2: [],
                current: 1,
                total: null,
                pageSize: 8
            }
        },
        watch: {
            show(_new){
               this.modal1 = _new 
               if(sessionStorage.getItem("STUDENRTCOMPARISON")) this.list2 = JSON.parse(sessionStorage.getItem("STUDENRTCOMPARISON"))
            }
        },
        methods: {
            comparison(){
                if(this.isComparisonList){
                    if(this.list2.length>1) {
                        sessionStorage.setItem('STUDENRTCOMPARISON', JSON.stringify(this.list2))
                        this.$emit('changeCom', this.list2)
                    }else this.$Message.info("添加的学员不能少于2名")
                }else{
                    if(this.list2.length>1){
                        sessionStorage.setItem('STUDENRTCOMPARISON', JSON.stringify(this.list2))
                        let routeData = this.$router.resolve({ name: "student-comparison" });
                        window.open(routeData.href, "_blank")
                    }else this.$Message.info("添加的学员不能少于2名")
                }
            },
            deletes(row,rowIndex){
                this.list2.splice(rowIndex, 1)
                sessionStorage.setItem('STUDENRTCOMPARISON', JSON.stringify(this.list2))
                // console.log(row,rowIndex,'row,rowIndex')
            },
            add(row,rowIndex){
                this.list2.push(row)
                // console.log(row,rowIndex,'row,rowIndex')
            },
            pageList(val) {
                this.current = val
                this.getList()
            },
            close(){
                this.modal1 = false;
                this.$emit('close', false)
            },
            getSubjectsList() {
                PostData('/common/getDepts').then((res) => {
                    this.select2 = [...this.subjectsSelect, ...res.data]
                    this.$nextTick(() => {
                        this.patient_division = this.select2[0].patient_division
                    })
                })
            },
            getList(){
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                }
                PostData('user/getStudentList', d).then((res) => {
                    if(res.res_code == 1){
                        this.list = res.data.list
                        this.total = res.data.count
                    }
                })
            },
        },
        mounted() {
            this.getSubjectsList()
            this.getList()
        },
    }
</script>

<style lang="less" scoped>
    .comparison{
        /deep/ .ivu-modal-body{
            padding: 20px 40px;
        }
        .main{
            display: flex;
            .right{
                margin-left: 30px;
            }
            .item{
                width: 413px;
                // height: 501px;
                background-color: rgba(255, 255, 255, 1);
                border: 1px solid rgba(188, 188, 188, 1);
                display: flex;
                flex-direction: column;
                align-items: center;
                .title{
                    width: 413px;
                    height: 43px;
                    background: inherit;
                    background-color: rgba(215, 215, 215, 1);
                    border: 1px solid rgba(228, 228, 228, 1);
                    line-height: 43px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 14px;
                }
                .search{
                    width: 367px;
                    margin: 10px 0;
                }
                .selects{
                    display: flex;
                    margin-bottom: 10px;
                }
                .btn{
                    width: 100%;
                    height: 44px;
                    color: #FFFFFF;
                    background-color: #4098FF;
                    border: none;
                    border-radius: 0;
                }
            }
        }
    }
</style>