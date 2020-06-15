<template>
    <Page v-if="total>pageSize" :current="current" :total="total" :page-size="pageSize" @on-change="onChange"></Page>
</template>

<script>
  export default {
    props: {
      current: {
        type: Number
      },
      total: {
        type: Number
      },
      pageSize: {
        type: Number
      }
    },
    methods: {
      onChange(val){
        $ActivePage.$emit('ActivePage',val, this.pageSize)
        this.$emit('page-list', val)
      }
    }
  }
</script>

<style scoped>

</style>
