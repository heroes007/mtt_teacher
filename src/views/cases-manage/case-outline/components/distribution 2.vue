<template>
    <Modal class="comparison" :width="936" v-model="modal1" @on-cancel="close" title="分配审核" footer-hide>
        <div class="main">
            <div class="item">
                <div class="title">选择分配学员</div>
                <Input v-model="search" class="search" suffix="ios-search" placeholder="搜索姓名" />
                <Tables style="width: 100%;" :isSelection="true" :tabel-height="tableHeight" @operation1="add" :column="columns1" :table-data="list"
                @select-tables="selectTables" @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll" />
                <Page simple v-if="total>pageSize" :current="current" :total="total" :page-size="pageSize" @on-change="pageList" />
            </div>
            <div class="item right">
                <div class="title">已选择</div>
                <div style="height: 550px; width: 100%;overflow-y: auto">
                    <div v-for="(item, index) in list2" class="right-box">
                        <div>{{item.realname}}</div>
                        <Icon type="md-close" style="cursor: pointer" @click="deleteList(index)"/>
                    </div>
                </div>
                <Button @click="comparison" class="btn">确认</Button>
            </div>
        </div>
    </Modal>
</template>

<script>
    import Tables from '../../../../components/tables.vue'

    export default {
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            outline_id: Number
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
                tableHeight: 484,
                tableHeight2: 550,
                columns1: [
                    {
                        title: '姓名',
                        key: 'realname',
                        minWidth: 80,
                        align: 'left',
                    },
                ],
                list: [],
                list2:[],
                current: 1,
                total: null,
                pageSize: 9
            }
        },
        watch: {
            show(_new){
                this.modal1 = _new
            }
        },
        methods: {
            selectTables(val, row) {
                let isSave = false
                this.list2.map((item, index) => {
                    if(item.id == row.id) {
                        this.list2.splice(index, 1)
                        isSave = true
                    }
                })
                if(!isSave) this.list2.push(row)
            },
            selectAll(val) {
                if(!this.list2.length) this.list2 = val
                val.forEach(item => {
                    var isSave = false
                    this.list2.forEach(item1 => {
                        if(item.id == item1.id) isSave = true
                    })
                    if(!isSave) this.list2.push(item)
                })
            },
            selectAllCancel(val) {
                this.list.forEach(item => {
                    this.list2.forEach((item1, index1) => {
                        if(item.id == item1.id) this.list2.splice(index1, 1)
                    })
                })
            },
            setSelect() {
                this.list2.forEach(item => {
                    this.list.map(item1 => {
                        if(item.id == item1.id) item1._checked = true
                    })
                })
            },
            comparison(){
                console.log(this.list2);
                let data = {
                    teacher_id: this.list2[0].id,
                    outline_ids: [this.outline_id]
                }
                PostData('case/distributeOutlines', data).then(res => {
                    if(res.res_code == 1) {
                        this.close()
                        this.$emit('handleCancel')
                    }
                })
            },
            deletes(row,rowIndex){
                this.list2.splice(rowIndex, 1)
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
            deleteList(index) {
                this.list2.splice(index, 1)
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
                PostData('case/getOutlineTeachersList', {organization_id: +sessionStorage.getItem('organizationId')}).then((res) => {
                    if(res.res_code == 1){
                        // this.list = res.data.list
                        // this.total = res.data.count
                        this.list = res.data
                        this.setSelect()
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
            .right-box{
                height: 43px;
                background-color: rgba(242, 242, 242, 1);
                border-bottom: 1px solid rgb(204, 204, 204);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
            }
        }
    }
</style>
