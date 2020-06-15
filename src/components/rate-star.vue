<template>
    <div>
        <div v-if='stops' class="star">
            <div @click.stop="setStar(i)" class="item" v-for="(t, i) in star" :key="i">
                <Icon :size="20" :color="i < weights ? '#f5a623' : '#e9e9e9'" type="ios-star" />
            </div>
        </div>
        <div v-else class="star">
            <div @click="setStar(i)" class="item" v-for="(t, i) in star" :key="i">
                <Icon :size="20" :color="i < weights ? '#f5a623' : '#e9e9e9'" type="ios-star" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            weight: {
                type: Number,
                default: 0
            },
            stops: {
                type: Boolean,
                stops: false
            }
        },
        data() {
            return {
                star: new Array(5).fill(false),
                weights: this.weight,
            }
        },
        watch: {
            weight(_new){
                this.weights = _new
            }
        },
        methods: {
            setStar(i){
                this.$emit('setStar', i + 1)
            },
        },
        mounted() {
            this.weights = this.weight
        }
    }
</script>

<style lang="less" scoped>
    .star{
        display: flex;
        flex-direction: row;
        .item{
            margin-right: 8px;
        }
    }
</style>
