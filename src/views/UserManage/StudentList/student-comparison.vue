<template>
    <div class="student-comparison">
        <comparison @changeCom="changeCom" isComparisonList :show="showComparison" @close="close" />
        <div class="infos">
            <div class="item">
                <div class="title">基本信息</div>
                <div>对比人数：4人</div>
                <div>最高分显示高亮</div>
                <div class="btns">
                    <Button @click="studentComparison" class="btn">添加对比学员</Button>
                    <Button @click="downExcels" class="btn2">数据导出</Button>
                </div>
            </div>
            <div v-for="(t,i) in list" :key="i" class="item2">
               <div class="item-img">
                   <img class="imgs" src="http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com/production/20200214154000.png"/>
                   <div class="ids">ID：{{t.id_num}}</div>
               </div>
               <div class="item-info">
                   <div class="texts" >{{t.realname}}</div>
                   <div class="texts" >{{t.organization_name}}</div>
                   <div class="texts" >2019级</div>
                   <div class="texts" >消化内科</div>
                   <div class="texts" >住院医师</div>
               </div>
               <div @click="deletes(i)" class="deletes"><Icon :size="20" type="md-close" /></div>
            </div>
        </div>
        <div class="system">
            <div :style="`width: ${(list.length+1)*251}px`" class="system-title">系统能力</div>
            <div class="system-tables">
                <div class="rows">
                    <div class="system-item system-left">系统性</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
                <div class="rows">
                    <div class="system-item system-left">逻辑性</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
                <div class="rows">
                    <div class="system-item system-left">精准性</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
                <div class="rows">
                    <div class="system-item system-left">敏捷性</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
                <div class="rows">
                    <div class="system-item system-left">经济性</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
                <div class="rows">
                    <div class="system-item system-left">综合评分</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
            </div>
        </div>
        <div class="system">
            <div :style="`width: ${(list.length+1)*251}px`" class="system-title">诊疗能力</div>
            <div class="system-tables">
                <div class="rows">
                    <div class="system-item system-left">问诊</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
                <div class="rows">
                    <div class="system-item system-left">体格检查</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
                <div class="rows">
                    <div class="system-item system-left">辅助检查</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
                <div class="rows">
                    <div class="system-item system-left">诊断</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
                <div class="rows">
                    <div class="system-item system-left">治疗</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
                <div class="rows">
                    <div class="system-item system-left">综合评分</div>
                    <div class="system-item" v-for="(t,i) in list" :key="i">{{t.id_type}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import comparison from './comparison'
    export default {
        components: { comparison },
        data() {
            return {
                list: [], showComparison: false,
            }
        },
        methods: {
            changeCom(d){
                this.list = d
                this.close()
            },
            downExcels(){
                let d = [
                    {
                        title: '学员ID',
                        key: 'username',
                    },
                    {
                        title: '姓名',
                        key: 'realname',
                    },
                    {
                        title: '所属机构',
                        key: 'organization_name'
                    }
                ]
                this.$config.downExcel(d, this.list, '学员对比')
            },
            deletes(i){
                if(this.list.length>2){
                    this.list.splice(i, 1)
                    sessionStorage.setItem('STUDENRTCOMPARISON', JSON.stringify(this.list))
                }else this.$Message.info("添加的学员不能少于2名")
            },
            studentComparison(){
                this.showComparison = true
            },
            close(){
                this.showComparison = false
            },
        },
        mounted() {
            this.list = JSON.parse(sessionStorage.getItem("STUDENRTCOMPARISON"))
        },
    }
</script>

<style lang="less" scoped>
    .student-comparison{
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        padding: 30px 99px;
        overflow-y: auto;
        background-color: #f2f2f2;
        .infos{
            display: flex;
            .item2{
                width: 250px;
                height: 170px;
                margin-left: 1px;
                background-color: #fff;
                padding: 20px;
                text-align: left;
                display: flex;
                position: relative;
                .deletes{
                    position: absolute;
                    right: 10px;
                    top: 10px
                }
                .item-img{
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    .ids{
                        margin-top: 20px;
                        text-align: center;
                        font-size: 12px;
                    }
                }
                .item-info{
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .texts{
                        font-size: 12px;
                    }
                }
                .imgs{
                    width: 95px;
                    height: 94px;
                }
            }
            .item{
                .title{
                    font-size: 18px;
                    font-weight: 700;
                }
                width: 250px;
                height: 170px;
                margin-left: 1px;
                background-color: #fff;
                padding: 10px 20px;
                text-align: left;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .btns{
                    display: flex;
                    .btn{
                        width: 116px;
                        height: 34px;
                        font-size: 12px;
                        color: rgb(255, 255, 255);
                        background-color: #4098FF;
                        text-align: center;
                        line-height: 34px;
                        border-radius: 5px;
                        box-shadow: none;
                    }
                    .btn2{
                        width: 96px;
                        height: 34px;
                        color: rgb(102, 102, 102);
                        border: 1px solid #f2f2f2;
                        text-align: center;
                        line-height: 34px;
                        border-radius: 5px;
                        margin-left: 10px;
                        box-shadow: none;
                    }
                }
            }
        }
        .system{
            margin-top: 10px;
            .system-title{
                height: 50px;
                padding-left: 20px;
                line-height: 50px;
                text-align: left;
                background-color: #fff;
                margin-bottom: 1px;
            }
            .tables{
                /deep/.ivu-table td{
                    height: 32px;
                    font-size: 13px;
                }
            }
            .system-tables{
                display: flex;
                flex-direction: column;
                height: 196px;
                border-top: 1px solid #f2f2f2;
                border-bottom: 1px solid #f2f2f2;
                .rows{
                    display: flex;
                    .system-item{
                        width: 251px;
                        height: 32px;
                        border-left: 1px solid #f2f2f2;
                        border-bottom: 1px solid #f2f2f2;
                        background-color: #fff;
                        line-height: 32px;
                    }
                    .system-left{
                        text-align: left;
                        padding-left: 20px;
                    }
                }
            }
        }
    }
</style>