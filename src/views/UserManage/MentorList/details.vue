<template>
    <div>
        <div class="top">
            <div class="top-left">
                <img class="left-img" src="https://www.baidu.com/img/baidu_resultlogo@2.png" alt="">
                <div class="left-content">
                    <div style="font-size: 28px">曾志伟</div>
                    <div>用户ID：123</div>
                    <div>科室：内科</div>
                    <div>职称：主治医生</div>
                </div>
                <div class="left-time">
                    <div>注册时间：2020</div>
                </div>
            </div>
            <div class="top-right">
                <div>数据统计截止时间：2020</div>
                <div style="display: flex;margin-top: 40px;justify-content: flex-end">
                    <div>
                        <div style="font-size: 28px">11</div>
                        <div style="font-size: 16px">出病例</div>
                    </div>
                    <div style="margin-left: 40px;">
                        <div style="font-size: 28px">0</div>
                        <div style="font-size: 16px">出提纲</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="content-tabs">
                <div @click="selectTab(1)" style="margin-top: 40px;" :class="tabVal == 1 ? 'content-tab-pane-select' : 'content-tab-pane'">病例</div>
                <div @click="selectTab(2)" :class="tabVal == 2 ? 'content-tab-pane-select' : 'content-tab-pane'">提纲</div>
            </div>
            <div style="flex: 1;">
                <div :style="{'height': tableHeight + 'px'}" class="contents">
                    <div v-for="(item, index) in list" :key="index" class="content-box" @click="checkCase(item)">
                        <div class="box-degree" :style="{backgroundColor: degreeLevel[item.degree].color}">
                            {{degreeLevel[item.degree].title}}
                        </div>
<!--                        <div class="box-img" :style="{transform: item.state == 0 ? 'rotate(450deg)' : item.state == 2 ? 'rotate(408deg)' : 'rotate(334deg)', top: item.state == 0 ? '-3px' : '-20px', right: item.state == 0 ? '3px' : '-38px'}">-->
<!--                            <img :width="item.state == 0 ? '60' : '80'" height="60" :src="selectState(item.state + 2)" alt="">-->
<!--                        </div>-->
                        <div class="content-top">
                            <div class="content-top-symptom">{{item.symptom}}</div>
                            <div class="content-top-content">
                                <div>ID: <span>{{item.id}}</span></div>
                                <div>诊断 <span style="overflow-x: auto">{{item.principal_diagnosis_name}}</span></div>
                            </div>
                        </div>
                        <div class="content-bottom">
                            <div class="bottom-left">
                                <div>科室： <span>{{item.dept}}</span></div>
                                <div>创建人： <span>{{item.realname}}</span></div>
                                <div>创建时间： <span>{{item.create_time}}</span></div>
                            </div>
                            <div class="bottom-right">
                                <div v-if="item.state == 2" style="margin-right: 10px;">
                                    <div>{{item.use_count}}</div>
                                    <div>使用次数</div>
                                </div>
                                <div class="right-btn" v-else-if="item.state == -1">
                                    <Button type="primary" @click="rejectCase(item)">拒绝原因</Button>
                                    <Button style="margin-left: 4px;" type="error" @click="deleteCase(item)">删除</Button>
                                </div>
                                <div class="right-btn" v-else-if="item.state == 0">
                                    <Button type="primary" @click="editCase(item)">编辑</Button>
                                    <Button style="margin-left: 4px;" type="error" @click="deleteCase(item)">删除</Button>
                                </div>
                                <div class="right-btn"  v-else-if="item.state == 1">
                                    <Button type="primary" @click="auditCase(item)">审核</Button>
                                </div>
                                <div class="right-btn"  v-else-if="item.state == 3">
                                    <Button type="primary" @click="distributionCase(item)">分配</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
            </div>
        </div>
    </div>
</template>

<script>
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'

    export default {
        components: {pageList},
        mixins: [pageMixin],
        data() {
            return {
                tabVal: 1,
                tableHeight: null,
                degreeLevel: {
                    1: {color: '#7ED321', title: '简单'},
                    2: {color: '#4098ff', title: '中等'},
                    3: {color: '#FD6C1E', title: '困难'}
                },
                list: []
            }
        },
        methods: {
            selectTab(val) {
                this.tabVal  = val
            },
            selectState(state) {
                return state == 4 ? "" : this['state_' + state]
            },
            getList() {
                let role_id = this.$config.getRoleId()
                let da = role_id > 1 ? this.$config.getOrganizationId() : this.organization_id
                if(role_id == 3) this.columns1[this.columns1.length-1].operation.splice(3, 1)
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: da,
                    dept: this.dept,
                    state: this.state
                }
                PostData('case/getOutlineList', d).then((res) => {
                    this.list = res.data.data
                    this.list.map(item => {
                        let d = ''
                        if(item.icd10_names) JSON.parse(item.icd10_names).forEach(item1 => {
                            d = !d ? item1 :  d + ',' + item1
                        })
                        item.icd10_title = d
                    })
                    this.total = res.data.count
                })
            },
        },
        mounted() {
            this.tableHeight = window.innerHeight - 200
            this.getList()
        }
    }
</script>

<style scoped  lang="less">
    .top{
        height: 188px;
        background-color: rgba(36, 46, 99, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .top-left{
            display: flex;
            color: #fff;

            .left-img{
                width: 150px;
                height: 150px;
                border-radius: 100%;
                margin-left: 100px;
            }
            .left-content{
                margin-left: 100px;
                text-align: left;
                font-size: 14px;
                font-weight: bold;

                div{
                    margin-top: 14px;
                }
            }
            .left-time{
                margin-left: 100px;
                display: flex;
                align-items: flex-end;
                font-size: 14px;
                font-weight: bold;
            }
        }
        .top-right{
            margin-right: 100px;
            color: #fff;
        }
    }
    .content{
        display: flex;

        .content-tabs{
            width: 200px;
        }
        .content-tab-pane{
            color: #333;
            height: 54px;
            line-height: 54px;
            font-size: 18px;
            font-weight: bolder;

            &:hover{
                color: #4098ff;
                cursor: pointer;
            }
        }
        .content-tab-pane-select{
            background-color: #0099ff;
            color: #fff;
            height: 54px;
            line-height: 54px;
            font-size: 18px;
            font-weight: bolder;
        }
    }
    .contents{
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        overflow-y: auto;
        justify-content: center;
        background-color: rgb(242, 242, 242);

        .content-box{
            width: 315px;
            height: 170px;
            margin: 20px;
            background-color: #fff;
            padding: 8px;
            color: #000;
            position: relative;

            &:hover{
                .right-btn{
                    display: flex;
                }
            }
            .right-btn{
                display: none;
            }
        }
        .box-img{
            position: absolute;
            right: -38px;
            top: -20px;
            transform: rotate(335deg);
        }
        .box-degree{
            position: absolute;
            left: 0;
            top: 0;
            width: 30px;
            height: 17px;
            text-align: center;
            line-height: 17px;
            color: #fff;
            font-size: 12px;
        }
        .content-top{
            display: flex;

            .content-top-symptom{
                width: 82px;
                height: 64px;
                background-color:rgba(201, 201, 201, 1);
                display: flex;
                justify-content: center;
                align-items: center
            }
            .content-top-content{
                text-align: left;
                margin-left: 10px;
            }
        }
        .content-bottom{
            display: flex;
            justify-content: space-between;
            position: relative;
            margin-top: 10px;

            .bottom-left{
                text-align: left;
            }
            .bottom-right{
                display: flex;
                flex-direction: column;
                align-items: center;
                position: absolute;
                bottom: -10px;
                right: -6px;

                /deep/ .ivu-btn{
                    font-size: 14px !important;
                }
            }
        }
    }

</style>
