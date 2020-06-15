<template>
    <Modal v-model="isShow" title="分配学员" :styles="{'top':'50px'}" @on-cancel="close" :mask-closable="false" :footer-hide="true" width="1000">
        <screen :type-arr="typeArr" @inputChange="inputChange" placehodle="搜索学员账号/姓名"></screen>
        <Row style="height: 650px;">
            <Col :span="14" style="height: 629px;">
                <tables :isSelection="true" :column="columns1" :table-data="list" :select-index="selectIndex"  :delete-data="deleteList"
                        :tabel-height="tableHeight" @select-tables="selectTable" @on-select-all="selectAllTable"/>
                <page-list :current="current" :total="total" :page-size="11" @page-list="pageList"/>
            </Col>
            <Col :span="10" style="height: 629px;border: 1px solid #f0f0f7;">
                <div class="select-student">已选学员（{{changeList.length}}）</div>
                <div v-if="changeList.length == 0" class="none-student">暂未选择学员</div>
                <div v-else style="height: 560px;">
                    <div style="height: 480px; overflow-y: auto">
                        <div class="change-student" v-for="(item, index) in changeList" :key="index">
                            <div class="change-name">{{item.phone}}</div>
                            <div class="change-num">{{item.realname}}</div>
                            <img class="change-img" @click="deletStudent(item, index)" :src="deleteImg" alt="">
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
        <div style="text-align: center">
            <Button type="primary" class="btn" @click="submit">保存</Button>
        </div>
    </Modal>
</template>

<script>
    import tables from '../../../components/tables'
    import screen from '../../../components/ScreenFrame'
    import pageList from '../../../components/Page'
    import pageMixins from '../../mixins/pageMixins'
    import deleteImg from '../../../assets/icons/img/deleteData.png'
    import postData from '../../../api/postData'

    export default {
        components: {tables, screen, pageList},
        mixins: [pageMixins],
        data() {
            return {
                // 'select2', 'select2_1', 
                typeArr: ['input'],
                isShow: false,
                department: '',
                departmentList: [{id: 1, title: '内科'}, {id: 2, title: '外科'}],
                grade: '',
                gradeList: [{id: 1, title: '一年级'}, {id: 2, title: '二年级'}],
                input: '',
                columns1: [
                    {
                        title: '学员账号',
                        key: 'phone',
                        minWidth: 150,
                        align: "left"
                    },
                    {
                        title: '姓名',
                        key: 'realname',
                        minWidth: 100,
                    },
                    {
                        title: '性别',
                        key: '',
                        minWidth: 80,
                        render: (h, params) => {
                            let d = this.$config.setSex(params.row.sex)
                            return h('span', d)
                        }
                    },
                ],
                list: [],
                tableHeight: 578,
                selectIndex: null,
                changeList: [],
                selectList: [],
                studentList: [],
                deleteList: true,
                keyword: '',
                deleteImg
            }
        },
        props: {
            show: {
                type: Boolean
            },
            organization_id: {
                type: Number
            },
            type: {
                type: Number
            },
            editList: {
                type: Array,
                default: []
            }
        },
        watch: {
            show(val) {
                this.isShow = val
                if (val) this.getList()
            },
            editList(val) {
                this.changeList = val
            }
        },
        methods: {
            close() {
                this.$emit('close', false)
            },
            sure() {
                this.close()
            },
            inputChange(val){
                this.keyword = val;
                this.getList()
            },
            getList() {
                let data = {
                    page_size: 11,
                    page_num: this.current,
                    organization_id: this.organization_id,
                    product_id: this.product_id,
                    keyword: this.keyword
                }
                let url = this.type == 1 ? 'exam/getStudents' : 'homework/getStudents' 
                postData(url, data).then(res => {
                    if (res.res_code == 1) {
                        res.data.list.forEach(item => {
                            this.changeList.forEach(item1 => {
                                if (item.id == item1.id) item._checked = true
                            })
                        })
                        this.total = res.data.count
                        this.list = res.data.list
                    }
                })
            },
            selectTable(selection, row) {
                if (this.changeList.length) {
                    let add = false
                    this.changeList.forEach((item, index) => {
                        if(item.id == row.id) {
                            this.changeList.splice(index, 1)
                            add = true
                        }
                    })
                    if(!add) this.changeList.push(row)
                } else this.changeList = selection
            },
            selectAllTable(selection, row) {
                if(!selection.length) {
                    this.list.forEach((item, index) => {
                        this.changeList.forEach((item1, index1) => {
                            if(item.id == item1.id) this.changeList.splice(index1, 1)
                        })
                    })
                }
                if (this.changeList.length) {
                    selection.forEach(item => {
                        let add = false
                        this.changeList.forEach(item1 => {
                            if (item.id == item1.id) add = true
                        })
                        if(!add) this.changeList.push(item)
                    })
                } else this.changeList = selection
            },
            deletStudent(item, index) {
                this.changeList.splice(index, 1)
                this.list.forEach((item1, index1) => {
                    if(item.id == item1.id) {
                        this.selectIndex = index1
                        this.deleteList = !this.deleteList
                    }
                })
            },
            submit() {
                this.$emit('allot', this.changeList)
                this.close()
            }
        },
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-table-overflowX {
        overflow-x: unset;
    }

    /deep/ .ivu-page {
        padding: 10px !important;
        border-left: 1px solid rgb(240, 240, 247) !important;
        border-bottom: 1px solid rgb(240, 240, 247) !important;
        margin-top: 0 !important;
    }

    /deep/ .ivu-table:before {
        height: 0;
    }

    /deep/ .ivu-table:after {
        height: 0;
    }

    /deep/ .ivu-table-wrapper {
        border-left: 1px solid rgb(240, 240, 247) !important;
    }

    .select-student {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F0F0F7;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
    }

    .none-student {
        height: calc(100% - 50px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #9397AD;
        border: 1px solid #F0F0F7;
    }

    .change-student {
        display: flex;
        align-items: center;
        height: 48px;
        border-bottom: 1px solid #f0f0f7;
        justify-content: space-around;

        &:hover {
            .change-img {
                opacity: 1;
            }
        }
    }

    .change-name {
        width: 120px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }

    .change-num {
        width: 120px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }

    .change-img {
        width: 17.5px;
        height: 17.5px;
        opacity: 0;
        cursor: pointer;
    }

    .btn {
        width: 150px;
        height: 38px;
        margin: 10px auto;
    }
</style>
