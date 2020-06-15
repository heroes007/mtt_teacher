import selects from './com/selects.vue'
export default {
    components: { selects },
    name: '',
    data() {
        return {
            valueSelect1: '',
            valueSelect2: '',
            valueSelect3: '',
            valueSelect4: '',
            timesDate: '',
            times: ''
        }
    },
    methods: {
        dataPickerChange(val) {
            this.timesDate = val
            this.getList()
        },
        timeChange(val){
            this.times = val
            this.getList()
        },
        selectChange1(val){
            this.valueSelect1 = val
            this.getList()
        },
        selectChange2(val){
            this.valueSelect2 = val
            this.getList()
        },
        selectChange3(val){
            this.valueSelect3 = val
            this.getList()
        },
        selectChange4(val){
            this.valueSelect4 = val
            this.getList()
        },
    },
}