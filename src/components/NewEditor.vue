<template>
    <div class="box">
        <div :id="editorId" class="h100"></div>
    </div>
</template>

<script>
    import axios from 'axios'
    import E from './wangEditor'
    import {get_sign} from '../api/modules/ali_oss'
    const ossHost = 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com';
    export default {
        name: "NewEditor",
        data() {
            return {
                resourse_url: '',
                img_url: '',
                host: 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com',
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'user_task',
                    type: 1
                },
                editor: '',
                fileSize: null,
            }
        },
        props: {
            content: {
                type: String,
                default: ''
            },
            editorId: {
                type: String,
                default: 'div'
            }
        },
        watch:{
            content(val) {
                this.editor.txt.html(val)
            }
        },
        beforeDestroy(){
            this.setEditor = null;
            this.handleUploadFile = null;
            this.handleGetassignKey = null;
            this.resourse_url = ''
        },
        methods: {
            handleUploadFile(form_data, url, insert) {
                var vm = this;
                axios({
                    method: 'POST',
                    url: url,
                    data: form_data,
                    onUploadProgress: function (progressEvent) {
                        var progress = Math.round(progressEvent.lengthComputable ? progressEvent.loaded *
                            100 / progressEvent.total : 0);
                        vm.percentage = progress;
                    },
                }).then(res => {
                    this.img_url = url + '/' + this.resourse_url;
                    if(insert) {
                        insert(this.img_url)
                    }
                });
            },
            handleGetassignKey(file_item, insert) {
                this.fileSize = file_item.size / (1024 * 1024);
                if (this.fileSize > 2) {
                    this.$Modal.info({
                        title: '提示',
                        content: `文件不能超过2M`,
                        onOk: () => {
                        }
                    });
                    return;
                }
                var date = new Date();
                date = date.toGMTString();
                get_sign(file_item.type, date, this.uploadConfig.bucket, this.uploadConfig.dir, file_item.name, 'POST')
                    .then(res => {
                        if (res.data.res_code == 1) {
                            const formData = new FormData();
                            this.resourse_url = res.data.data.filename;
                            formData.append('key', res.data.data.filename);
                            formData.append('OSSAccessKeyId', res.data.data.accessKeyID);
                            formData.append('success_action_status', '200');
                            formData.append('signature', res.data.data.sign);
                            formData.append('policy', res.data.data.policyBase64);
                            formData.append('file', file_item);
                            this.handleUploadFile(formData, encodeURI(ossHost), insert);
                        }
                    })
            },
            setEditor(){
                let vm = this
                this.editor = new E(`#${this.editorId}`)
                this.editor.customConfig.menus = ['fontSize', 'bold', 'underline', 'foreColor', 'image', 'justify', 'list']
                this.editor.customConfig.customUploadImg = function (files, insert) {
                    console.log(123);
                    vm.handleGetassignKey(files[0], insert)
                }
                this.editor.customConfig.showLinkImg = false
                this.editor.customConfig.onchange = function (html) {
                    vm.$emit('get-content', html)
                }
                this.editor.customConfig.zIndex = 0
                this.editor.create()
                this.editor.txt.html(this.content)
            }
        },
        mounted() {
            this.setEditor()
        },
    }
</script>

<style scoped>
    .box{
        min-width: 400px;
    }
    .h100{
        height: 100%;
    }
    /deep/ .w-e-text-container{
        height: calc(100% - 44px) !important;
    }
</style>
