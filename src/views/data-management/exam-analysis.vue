<template>
    <div class="data-management-main">
        <div class="sel-heads">
            <selects @dataPickerChange="dataPickerChange" @timeChange="timeChange" 
            @selectChange1="selectChange1" @selectChange2="selectChange2" 
            @selectChange3="selectChange3" @selectChange4="selectChange4" />
        </div>
    </div>
</template>

<script>
    import SellectsMixins from './sellects-mixins'
    export default {
        mixins: [SellectsMixins],
        name: '',
        data() {
            return {
                
            }
        },
        methods: {
            getList(){
                let d = {
                    ...this.timesDate
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .sel-heads{
        display: flex;
        width: 100%;
        padding: 10px 40px;
        background-color: #fff;
    }
</style>