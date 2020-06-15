<template>
   <div>
        <Input class="vSearchinput" @on-change="setChange" @on-focus="focuss" v-model="query" :placeholder="placeholder" :style="`width: ${heights}px`" />
        <div v-if="show" class="selects vSearchInquiringsInter" :style="`width: ${heights}px`">
            <div v-if="options1&&options1.length>0">
                <div @click="setSelect(t)" v-for="(t,i) in options1" :key="i" class="option">
                    <span>{{setTitle(t)}}</span>
                </div>
            </div>
            <div v-else class='no'>暂无匹配</div>
        </div>
   </div>
</template>

<script>
    export default {
        props: {
            heights: {
                type: Number,
                default: 34,
            },
            isTerm: {},
            caseType: {},
            case_id: {},
            name: {},
            placeholder: {},
            querys: {},
			diagnosisId: {}
        },
        data() {
            return {
                show: false,
                query: this.querys,
                options1: [],
            }
        },
        watch: {
            caseType(_new){
               this.getData(this.query)
            },
            querys(_new){
                this.query = _new
            },
            show(_new){
                let doc = document.querySelector('.vSearchInquiringsInter')
                let doc2 = document.querySelector('.vSearchinput')
                let bod = document.body;
                if(_new) {
                    this.setCancelBubble(doc)
                    this.setCancelBubble(doc2)
                    if(bod) bod.onclick = () => { this.show = false }
                }else{
                    doc.onclick = null;
                    doc2.onclick = null;
                    bod.onclick = null;
                }
            }
        },
        methods: {
            setCancelBubble(doc){
                 if(doc){
                    doc.onclick = (e) => {
                        if (e && e.stopPropagation)  e.stopPropagation()
                        if (window.event) window.event.cancelBubble = false
                    }
                 }
            },
            setTitle(t){
                return t[this.name]
            },
            setSelect(t){
                this.query = t[this.name]
                this.show = false
                this.$emit('set-sel', t)
            },
            setChange(){
                this.remoteMethod1(this.query)
                this.$emit('set-sel',this.query)
            },
            focuss(){
                this.show = true
            },
            getData(query){
                setTimeout(() => {
                    let d = { talk_group: this.caseType ? this.caseType : '' , ...this.case_id, keyword: query }
                    PostData('case/getTalksByKeyword', {...d,frequency_id: this.diagnosisId}).then((r) => {
                        if(r&&r.data) this.options1 = r.data
                    })
                }, 200);
            },
            remoteMethod1(query) {
                if (query !== '') this.getData(query)
                else {
                    this.options1 = [];
                }
            },
        },
    }
</script>

<style lang="less" scoped>
    .no{
        .item;
        text-align: center;
    }
    .item{
        width: inherit;
        margin: 0;
        line-height: normal;
        padding: 7px 16px;
        clear: both;
        color: #657180;
        font-size: 14px !important;
        white-space: nowrap;
        list-style: none;
        cursor: pointer;
        background: #fff;
    }
    .selects{
        display: flex;
        flex-direction: column;
        position: absolute;
        z-index: 900;
        background-color: #fff;
        max-height: 200px;
        overflow: auto;
        margin: 5px 0;
        padding: 5px 0;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        .option{
            .item;
            text-align: left;
            &:hover{
                background: #f3f3f3
            }
        }
    }
</style>