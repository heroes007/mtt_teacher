<template>
    <div class="diagnosis-type">
        <Checkbox @on-change="checkbox" :disabled="disables" class="checkbox" v-model="main">
            <span class="checkbox-title">{{title}}</span>
        </Checkbox>
        <div v-if="main&&!disables" class="main-degree">
            <span class="grey-regular4">重要程度</span>
            <Select @on-change="setSel" v-model="mainDegree" class="sel-degree">
                <Option v-for="(t,i) in selectDegree" :value="t.id" :key="i">
                    {{ t.name }}
                </Option>
            </Select>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            check: {
                type: Boolean,
                default: false
            },
            disables: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: ''
            },
            index: {
                type: Number,
                default: 0
            },
            weight: {
                type: Number,
                default: 0
            },
        },
        data() {
            return {
                main: this.check,
                mainDegree: this.weight,
                selectDegree: [
                    // {id: 0, name: '请选择'},
                    {id: 5, name: '关键依据'},
                    {id: 4, name: '重要依据'},
                    {id: 3, name: '一般依据'},
                    {id: 2, name: '较弱依据'},
                    {id: 1, name: '可疑依据'},
                ]
            }
        },
        watch: {
            check(_new){
                this.main = _new
            },
            weight(_new){
                this.mainDegree = _new
            }
        },
        methods: {
            setSel(){
                if(this.type == 1) this.$emit('selectDegree', this.mainDegree)
                if(+this.type > 1) this.$emit('selectDegree', this.index, this.type, this.mainDegree)
            },
            checkbox(bool){
               if(this.type == 1) this.$emit('contact', bool)
               if(+this.type > 1) this.$emit('contact', bool, this.index, this.type)
            }
        },
    }
</script>

<style lang="less" scoped>
     /deep/ .ivu-checkbox{
        margin-top: 4px !important;
     }
     .diagnosis-type {
        display: flex;
        flex-direction: row;
        align-items: center;
        min-height: 34px;
        margin-bottom: 15px;
        .checkbox {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            flex: 1;
            text-align: left;
            .checkbox-title {
                margin-left: 5px;
                display: inline-block
            }
        }
        .main-degree {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 200px;
            .sel-degree {
                margin-left: 10px;
                width: 130px;
                height: 34px;
            }
        }
    }
</style>