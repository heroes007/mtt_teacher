<template>
    <Modal v-model="show" :footer-hide="true" :title="title" @on-cancel="handleCancel" width="600">
        <div class="state">
            <Button :type="state == 'in' ? 'primary' : 'default'" @click="handleCheck('in')">导入</Button>
            <Button :type="state == 'out' ? 'primary' : 'default'" @click="handleCheck('out')">导出</Button>
        </div>
        <div v-if="state == 'in'" style="margin-top: 60px; height: 280px;">
            <div>1、下载模板文件，根据文件模板填写用户信息。 <a :href="dataUrl.mould">下载模版</a></div>
            <div style="margin-top: 20px;">2、上传文件： <input ref="upload" type="file" 
            accept=".xls,.xlsx" @change="handleChange"></div>
            <div style="display: flex;justify-content: center;margin-top: 140px;">
                <Button type="primary" style="width: 120px;" @click="handleSubmit">确认</Button>
            </div>
        </div>
        <div v-else style="height: 280px; display: flex;align-items: center;justify-content: center">
            <a  :href="downUrl">点击下载文件</a>
        </div>
    </Modal>
</template>

<script>
    import XLSX from 'xlsx'

    export default {
        data() {
            return {
                show: false,
                title: '用户导入/导出',
                state: 'in',
                workbook: {},
                upData: null,
                studentUrl: {
                    import: 'user/importStudentsFromExcel',
                    export: 'user/exportStudentsToExcel',
                    mould: 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com/user_task/20200219103242.xls'
                },
                teacherUrl: {
                    import: 'user/importTeachersFromExcel',
                    export: 'user/exportTeachersToExcel',
                    mould: 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com/user_task/20200219103219.xls'
                },
                dataUrl: {
                    import: '',
                    export: '',
                    mould: ''
                }
            }
        },
        props: {
            showTransfer: Boolean,
            downUrl: String,
            mould: String,
            type: String
        },
        computed: {
            getOrganizationId(){
                let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
                return role_id !== 1 ? +sessionStorage.getItem('organizationId') : ''
            },
        },
        watch: {
            showTransfer(val) {
                this.show = val
                this.dataUrl = this.type == 'teacher' ? this.teacherUrl : this.studentUrl
            },
            organization_id(val) {
                let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
                let org = role_id === 1 ?val : this.getOrganizationId
            },
        },
        methods: {
            handleCancel() {
                this.$emit('transferCancel', false)
            },
            handleCheck(val) {
                this.state = val
            },
            handleChange(val) {
                let reader = new FileReader()
                reader.onload = (e) => {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {type: 'binary'});
                    // console.log(workbook,'workbookworkbook')
                    let da = JSON.stringify(workbook.Sheets)
                    if(!da.includes('填写说明')){
                        PostData(this.dataUrl.import, {data: da}).then((r) => {
                            if(r.res_code == 1) this.$Message.info('导入成功!')
                        })
                    }else this.$Message.info('请删除表格内的填写说明！')
                };
                reader.readAsBinaryString(this.$refs.upload.files[0]);
            },
            handleSubmit() {
                this.$emit('transferCancel', false, true)
            }
        }
    }
</script>

<style scoped lang="less">
    .state{
        display: flex;

        /deep/ .ivu-btn{
            border-radius: 0;
        }
    }
</style>
