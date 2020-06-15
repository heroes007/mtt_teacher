<template>
    <div class="sel-main">
        <Select v-model="valueSelect1" @on-change="selectChange1" class="select-list" placeholder="请选择机构">
            <Option v-for="(item,i) in select" :value="item.id " :key="i">{{ item.title }}</Option>
        </Select>
        <Select v-model="valueSelect2" @on-change="selectChange2" class="select-list" placeholder="请选择年级">
            <Option v-for="(item,i) in select2" :value="item.id " :key="i">{{ item.title }}</Option>
        </Select>
        <Select v-model="valueSelect3" @on-change="selectChange3" class="select-list" placeholder="请选择学科">
            <Option v-for="(item, i) in select3" :value="item.patient_division" :key="i">{{ item.patient_division }}</Option>
        </Select>
        <Select v-model="valueSelect4" @on-change="selectChange4" class="select-list" placeholder="请选择类型">
            <Option v-for="(item,i) in select4" :value="item.id " :key="i">{{ item.title }}</Option>
        </Select>
        <Select v-model="times" @on-change="timeChange" class="select-list" >
                <Option v-for="(item,i) in select5" :value="item.id " :key="i">{{ item.title }}</Option>
        </Select>
        <DatePicker v-if="isDaterange" type="daterange" format="yyyy-MM-dd" placeholder="请选择时间范围"  class="screen-data-picker"
        v-model="data_picker" @on-change="dataPickerChange" ></DatePicker>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                valueSelect1: 'all',
                valueSelect2: 'all',
                valueSelect3: '全部科室',
                valueSelect4: 'all',
                select: [{id: 'all', title: '全部机构'}],
                select2: [{id: 'all', title: '全部年级'}],
                subjectsSelect3: [{patient_division: '全部科室'}],
                select3: [],
                select4: [{id: 'all', title: '全部类型'}],
                isDaterange: false,
                data_picker: [],
                times: 'MONTH',
                select5: [
                    {id: "MONTH", title: '近30天'},
                    {id: "6MONTH", title: '近半年'},
                    {id: "YEAR", title: '近一年'},
                    {id: "CUSTOM", title: '自定义'},
                ],
            }
        },
        mounted(){
            this.getList()
        },
        methods: {
            setCustom(){
                let d = {}
                if(this.times == 'CUSTOM'&&this.data_picker.length==2){
                    d.start_time = this.data_picker[0]
                    d.end_time = this.data_picker[1]
                    d.time_format = this.isCustonMouths() ? 'DAY' : 'MONTH'
                }
                return d
            },
            isCustonMouths(){
                let bool = false
                if(this.times == 'CUSTOM'&&this.data_picker.length==2&&this.data_picker[0]){
                    let da = new Date(this.data_picker[0])
                    let n1 = this.data_picker[1].split('-').join("")
                    let n2 = (this.$config.getDay(29, da)).split('-').join("")
                    bool = +n1 <= (+n2)
                }
                return (this.times=='WEEK'||this.times=='MONTH') ? true : bool
            },
            dataPickerChange(val) {
                this.data_picker = val
                this.$emit('dataPickerChange', this.setCustom())
            },
            timeChange(val){
                this.isDaterange = val =='CUSTOM'
                this.$emit('timeChange', val)
            },
            selectChange1(val){
                this.$emit('selectChange1', val)
            },
            selectChange2(val){
                this.$emit('selectChange2', val)
            },
            selectChange3(val){
                this.$emit('selectChange3', val)
            },
            selectChange4(val){
                this.$emit('selectChange4', val)
            },
            getDate(url, name, d){
                PostData(url).then((res) => {
                    this[name] = [...d, ...res.data]
                })
            },
            getList() {
                this.getDate('common/getDepts', 'select3', this.subjectsSelect3)
                this.getDate('common/getOrganizations', 'select', this.select)
            }
        }
    }
</script>

<style lang="less" scoped>
    .sel-main{
        display: flex;
        .select-list {
            width: 150px;
            margin-right: 10px;
        }
        .screen-data-picker{
            width: 200px !important;
            margin-left: 10px !important;
            /deep/ .ivu-btn{
                display: inline-block !important;
            }
        }
    }
</style>