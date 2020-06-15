<template>
    <div class="screen-box" :style="typeArr.includes('backgroundColor') ? backgroundColor:''">
        <div :class="typeArr.includes('searchDropDown') ? 'screenSearchDrop': 'screen'" :style="typeArr.includes('backgroundColor') ? backgroundColor:''">
            <div v-if="typeArr.includes('back')" class="back"
                 @click="handleBack">
                <img class="back-img" src="../assets/icons/icon/back.png" alt="">
                <div class="back-title">返回</div>
            </div>
            <Select v-if="typeArr.includes('isSuper') && isSuper" v-model="valueSelect1" @on-change="selectChange1" class="select-list" placeholder="请选择机构">
                <Option v-for="(item,i) in select" :value="item.id " :key="i">{{ item.title }}</Option>
            </Select>
            <!-- 下拉科室 -->
            <Select v-if="selectSubjects" v-model="valueSelect3" @on-change="selectChange3" class="select-list" placeholder="请选择学科">
                <Option v-for="(item, i) in select3" :value="item.patient_division" :key="i">{{ item.patient_division }}</Option>
            </Select>
            <!-- 搜索下拉 -->
            <Select v-if="typeArr.includes('select2')" v-model="valueSelect2" @on-change="selectChange2" class="select-list" :placeholder="select2Placeholder">
                <Option v-for="item in select2" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
            <Select v-if="typeArr.includes('select2_1')" v-model="valueSelect2_1" @on-change="selectChange2_1" class="select-list" :placeholder="select2_1Placeholder">
                <Option v-for="item in select2_1" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
            <Select v-if="typeArr.includes('select2_2')" v-model="valueSelect2_2" @on-change="selectChange2_2" class="select-list" :placeholder="select2_2Placeholder">
                <Option v-for="item in select2_2" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
            <!-- 搜索下拉 -->
            <Select v-if="typeArr.includes('searchDropDown')" @on-change="searchDropDownChange" class="select-list2" v-model="searchDrop" multiple filterable remote :remote-method="remoteMethod1" :placeholder="searchDropDownPlaceholder" :loading="loading1">
                <Option v-for="(option, index) in options1" :value="option.id" :key="index">{{option.title}}</Option>
            </Select>
            <Input v-if="typeArr.includes('input')" v-model="valueInput" :placeholder="placehodle ? placehodle : placehodleInput"
                   @on-change="inputChange" class="input">
                <Icon type="md-search" slot="prefix"/>
            </Input>
            <div v-if="typeArr.includes('size1')" class="all-size">
                <span class="all-content">{{sizeTitle1}}</span>
                <span v-if="typeof sizeNum1 == 'number'" class="all-num">{{sizeNum1}}</span>
                <span v-else class="all-num" v-html="handleSizeNum(sizeNum1)"></span>
            </div>
            <div v-if="typeArr.includes('size2') && isSuper" class="money-size">
                <span class="all-content">{{sizeTitle2}}</span>
                <span v-if='sizeNum2 >= 0' class="all-num">{{sizeNum2}}</span>
            </div>
            <div v-if="typeArr.includes('hint_num') && isSuper" class="all-size">
                <span class="all-content" v-html="hint"></span>
            </div>
            <div v-if="typeArr.includes('title')" class="title">
                <div>{{title}}</div>
            </div>
            <Select v-if="typeArr.includes('select3')" v-model="valueSelect4" @on-change="selectChange2" class="select-list4" :placeholder="select2Placeholder">
                <Option v-for="item in select4" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
        </div>
        <Button v-if="typeArr.includes('button1')" :class="visibilityBtn"  @click="handleClick1">{{btnName1}}</Button>
        <Button v-if="typeArr.includes('button')" :class="visibilityBtn"  type="primary" @click="handleClick">{{btnName}}</Button>
    </div>
</template>

<script>
    import postData from '../api/postData'

    export default {
        name: "ScreenFrame",
        data() {
            return {
                searchDrop: [],
                valueSelect1: '',
                valueSelect2: '',
                valueSelect2_1: '',
                valueSelect2_2: '',
                valueSelect3: '',
                valueSelect4: '',
                valueInput: '',
                loading1: false,
                placehodleInput: '搜索用户名/姓名/手机号',
                iconColor: '#9397AD',
                backgroundColor: 'background: #fff',
                isSuper: false,
                select: [{id: 'all', title: '全部机构'}],
                subjectsSelect3: [{patient_division: '全部科室'}],
                select3: [],
                options1: [],
                canRun: null,
                canRun2: null
            }
        },
        props: {
            //types=1：搜索框+数量+按钮； types=2：下拉框+搜索框+数量+按钮； types=3：下拉框+搜索框+数量*2+按钮； types=4：下拉框*2+搜索框+数量+按钮；
            //types=5：下拉框*2+搜索框+付费学员+数量*2； types=6：返回+标题+按钮； types=7：返回+标题； types=8 兑换码--使用记录
            //types = 10 下拉框+标题+按钮; types = 12 下拉框+标题;  types=13：返回+标题+下拉框; types = 14: 下拉框*2+搜索框
            types: {
                type: Number,
                // required: true,
            },
            visibilityBtn: {
                type: String,
                default: 'btn'
            },
            // backgroundColor: 白色背景； back: 返回按钮; isSuper: 选择机构下拉框； select2: 下拉框1; input: 输入框; size1: 数量1; size2: 数量2; title: 标题; select3: 下拉框2； button: 按钮
            typeArr: {
                type: Array,
                default: [],
                // required: true
            },
            searchDropDownPlaceholder: {
                type: String,
                default: ''
            },
            payingStudent: {
                type: Boolean,
                default: false
            },
            selectSubjects: {
                type: Boolean,
                default: false
            },
            // 控制 select
            selectType1: {
                type: Boolean,
                default: false
            },
            selectType2: {
                type: Boolean,
                default: false
            },
            radioType: {
                type: Boolean,
                default: false
            },
            // 控制按钮 的 显示隐藏
            btnType: {
                type: Boolean,
                default: false
            },
            searchDropDown: {
                type: Array
            },
            select1: {
                type: Array
            },
            select2: {
                type: Array
            },
            select2_1: {
                type: Array
            },
            select2_2: {
                type: Array
            },
            select4: {
                type: Array
            },
            sizeTitle1: {
                type: String
            },
            sizeNum1: [Number, String],
            sizeTitle2: {
                type: String
            },
            sizeNum2: {
                type: Number
            },
            btnName: {
                type: String
            },
            btnName1: {
                type: String
            },
            title: {
                type: String
            },
            placehodle: {
                type: String
            },
            codeName: {
                type: String,
                default: ''
            },
            select2Placeholder: {
                type: String,
                default: '请选择'
            },
            select2_1Placeholder: {
                type: String,
                default: '请选择'
            },
            select2_2Placeholder: {
                type: String,
                default: '请选择'
            },
            hint: String
        },
        mounted() {
            this.setlectInit('select2','valueSelect2');
            this.setlectInit('select2_1','valueSelect2_1');
            this.setlectInit('select2_2','valueSelect2_2');
            this.isSuper = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1 ? true : false
            if(this.typeArr.includes('isSuper')&&this.isSuper){
                postData('common/getOrganizations').then((res) => {
                    this.select = [...this.select, ...res.data]
                    this.valueSelect1 = this.select[0].id
                })
            }
            if (this.selectSubjects) this.getSubjectsList()
        },
        methods: {
            setlectInit(list,value){
                if (this[list] && this[list].length) {
                    this[value] = this[list][0].id
                }
            },
            // 付费学员返回事件，click触发，选中返回true
            remoteMethod1(query){
                if (query !== '') {
                    this.loading1 = true;
                    setTimeout(() => {
                        this.loading1 = false;
                        const list = this.searchDropDown.filter(item => {
                            if(item.title.includes(query)){
                                return {
                                    id: item.id,
                                    title: item.title.length>4 ? item.title.slice(0,4)+'...' : item.title
                                }
                            }
                        });
                        this.options1 = list || []
                    }, 200);
                } else {
                    this.options1 = [];
                }
            },
            moneyStudent() {
                this.iconColor = this.iconColor == '#9397AD' ? "#4098ff" : "#9397AD"
                this.$emit('moneyStudent', this.iconColor == '#9397AD' ? 'NO' : 'YES')
            },
            handleSizeNum(s) {
                if (s) {
                    let arr = s.split('/');
                    let s1 = arr[0] && arr[0] != 'null' ? arr[0] : ''
                    let s2 = arr[1] && arr[1] != 'null' ? '/' + arr[1] : ''
                    return s1 + `<span style="color:#9397AD">${s2}</span>`
                }
                return ''
            },
            //一个下拉框，change触发，返回value
            selectChange1(val) {
                if (val == 'all') val = ''
                this.$emit('selectChange1', val)
            },
            //搜索下拉
            searchDropDownChange(val){
                this.$emit('searchDropDownChange', val)
            },
            //第二个下拉框，change触发，返回value
            selectChange2(val) {
                this.$emit('selectChange2', val)
            },
            selectChange2_1(val) {
                if (val == 'all') val = ''
                this.$emit('selectChange2_1', val)
            },
            selectChange2_2(val) {
                this.$emit('selectChange2_2', val)
            },
            //下拉科室
            selectChange3(val) {
                this.$emit('selectChange3', val)
            },
            //输入事件，change触发，返回model
            inputChange() {
                this.canRun&&clearTimeout(this.canRun)
                this.canRun = setTimeout(() => {
                    this.$emit('inputChange', this.valueInput)
                },500)
            },
            //按钮，click触发事件
            handleClick() {
                this.$emit('handleClick')
            },
            handleClick1() {
                this.$emit('handleClick1')
            },
            //返回按钮触发事件
            handleBack() {
                this.$emit('handleBack')
            },
            getSubjectsList() {
                postData('/common/getDepts').then((res) => {
                    this.select3 = [...this.subjectsSelect3, ...res.data]
                    this.$nextTick(() => {
                        this.valueSelect3 = this.select3[0].patient_division
                    })
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .screen-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #F0F0F7;
    }
    .screenSearchDrop{
        min-height: 66px;
        height: auto;
        min-width: 656px;
        background: #F0F0F7;
        display: flex;
        align-items: center;
        position: relative;
        padding-right: 21px;
        position: relative;
    }
    .screen {
        height: 66px;
        min-width: 656px;
        background: #F0F0F7;
        display: flex;
        align-items: center;
        position: relative;
    }

    /deep/ .ivu-select-selection {
        border-radius: 100px;
        height: 36px;
        padding-left: 15px;
    }

    /deep/ .ivu-select-placeholder {
        font-size: 16px !important;
    }

    .input {
        min-width: 200px;
        max-width: 300px;
        height: 36px;
        margin-left: 10px;
    }

    /deep/ .ivu-input {
        border-radius: 100px !important;
        padding-left: 40px;
        font-size: 16px !important;
    }

    /deep/ .ivu-input-prefix {
        margin-left: 10px;
    }

    /deep/ .ivu-icon-md-search {
        font-size: 20px;
    }

    .money-student {
        min-width: 130px;
        width: 130px;
        height: 36px;
        background-color: #fff;
        display: flex;
        align-items: center;
        border-radius: 100px;
        margin-left: 10px;
        cursor: pointer;

        &:hover {
            .money-student-content {
                color: #4098ff;
            }
        }

        /deep/ .ivu-icon-md-radio-button-on {
            margin-left: 16px;
        }

        .money-student-content {
            margin-left: 10px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;
        }
    }

    .all-size {
        margin-left: 20px;
        min-width: 120px;
        display: inline-flex
    }

    .money-size {
        min-width: 102px;
        border-left: 1px solid #CDCED3;
        margin-left: 12px;
        padding-left: 12px;
    }

    .all-content {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
        min-width: 64px;
    }

    .all-num {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #4098FF;
        letter-spacing: 0;
        margin-left: 10px;
    }

    .all-list {
        margin-right: 12px;
    }
    .btn-size{
        width: 110px;
        height: 36px;
    }
    .btn {
        .btn-size;
        margin-right: 34px;
        /*position: absolute;*/
        /*right: 34px;*/
    }
    .btn-hide{
        .btn-size;
        margin-left: 21px;
        visibility: hidden;
    }
    .btn-visible{
        .btn-size;
        margin-left: 21px;
        visibility: visible;
    }
    .select-list {
        width: 200px;
        /*min-width: 200px;*/
        margin-left: 21px;
    }
    .select-list2{
        min-width: 186px !important;
         flex: 1;
         margin-left: 21px;
         height: auto;
        min-width: 100px;
         /deep/.ivu-select-selection{
            height: auto;
         }
    }
    .select-list4 {
        width: 120px;
        position: absolute;
        right: 100px;
    }

    .back {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 40px;
        cursor: pointer;

        .back-img {
            width: 23px;
            height: 19px;
        }

        .back-title {
            margin-left: 10px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;
            min-width: 32px;
        }
    }

    .title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #474C63;
        letter-spacing: 0;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .code_name_text {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        position: absolute;
        right: 40px;
    }

</style>
