<template>
    <div class="upload-field" >
        <div class="file-name-field">
            <div class="file-name-field-layout">
                <div class="fileName">
                    <span><span class="dscj-webfont-document"></span>{{ fileName }}</span>
                    <Progress :style="{'visibility':showFileName ? 'visible':'hidden'}" :percent="percentage_improve" class="percentage"></Progress>
                </div>
                <Form>
                    <Button v-bind:disabled="isDisabled" type="primary" class="upload-btn" @click="handleStartUploadFile">点击上传</Button>
                    <input v-bind:disabled="isDisabled" type="file" ref="input" class="upload-input" name="file" v-on:change="handleUploadChange"
                        v-bind:accept="filtersString">
                </Form>
            </div>
        </div>
        <Row type='flex' justify='end' align='middle'>
            <p class="description">最多上传{{maxFileCount}}个{{filtersString}}文件,且不超过{{maxFileSize | file_size_filter}}</p >
        </Row>
    </div>
</template>
<script>
    import { get_sign_4_datacenter } from '../api/modules/ali_oss'
    import axios from 'axios';
    import { Config } from '../config/base'
    export default {
        props: {
            filters: {

            },
            maxFileCount: {

            },
            maxFileSize: {

            },
            currentFileCount: {

            },
            homeworkId: {

            },
            bucket: {
                default: 'jhyl-static-file'
            },
            dir: {
                default: 'user_task'
            }
        },
        data() {
            return {
                ossFileName: '',
                filedata: '',
                fileSize: 0,
                fileName: '',
                upload_address: '',
                showFileName: false,
                percentage: 0,
                isDisabled: false
            }
        },
        computed: {
            filtersString() {
                // return _.toString(_.map(this.filters, this.addDot))
                if (this.filters) {
                    return this.filters.map(this.addDot).toString();
                }
                return '';
            },
            percentage_improve() {
                return this.percentage
            }
        },
        filters: {
            file_size_filter(v) {
                return v / 1024 > 1 ? Math.round(v / 1024) + 'mb' : v + 'kb'
            }
        },
        methods: {
            addDot(item) {
                return item = '.' + item;
            },
            handleUploadChange() {
                this.fileSize = event.target.files[0].size / 1024;
                if (this.fileSize > parseInt(this.maxFileSize)) {
                    this.$Modal.info({
                        title: '提示',
                        content: '文件不能超过${this.maxFileSize}M',
                        onOk: () => {}
                    });
                    return;
                }
                if (this.currentFileCount >= this.maxFileCount) {
                    this.$Modal.info({
                        title: '提示',
                        content: '上传文件数量过多',
                        onOk: () => {}
                    });
                    return;
                }
                this.fileName = event.target.value.substring(event.target.value.lastIndexOf("\\") + 1, event.target.value.length);
                this.showFileName = true;
                this.handleGetassignKey(event.target.files[0]);

            },

            handleStartUploadFile() {
                this.isDisabled = true;
                // 防止用户多点
                setTimeout(() => {
                    this.isDisabled = false;
                }, 5000)
                this.$refs.input.click();
            },

            handleUploadFile(formData, url, headers) {
                // TODO 上传到OSS上
                var vm = this;
                axios({
                    method: 'POST',
                    url: url,
                    data: formData,
                    onUploadProgress: function (progressEvent) {
                        var progress = Math.round(progressEvent.lengthComputable ? progressEvent.loaded *
                            100 / progressEvent.total : 0);
                        vm.percentage = progress;
                    },
                }).then(res => {
                    if (res.statusText == 'OK') {
                        // this.showFileName = false;
                        this.percentage = 100;
                        this.$emit('uploadComplete', this.homeworkId, {
                            name: this.fileName,
                            size: this.fileSize,
                            url: Config.ossHost + this.ossFileName,
                            datetime: new Date()
                        })
                    }
                });
            },

            handleGetassignKey(fileItem) {
                var date = new Date();
                date = date.toGMTString();
                get_sign_4_datacenter(fileItem.type, date, this.bucket, this.dir, fileItem.name, 'POST').then(res => {
                    if (res.data.res_code == 1) {
                        this.ossFileName = res.data.msg.filename;
                        const formData = new FormData();
                        formData.append('key', res.data.data.filename);
                        formData.append('OSSAccessKeyId', res.data.data.accessKeyID);
                        formData.append('success_action_status', '200');
                        formData.append('signature', res.data.data.sign);
                        formData.append('policy', res.data.data.policyBase64);
                        formData.append('file', fileItem);
                        this.handleUploadFile(
                            formData,
                            encodeURI(
                                Config.ossHost,
                            )
                        );
                    }
                })
            },
            handleRemoveFile() {

            }
        }
    }
</script>
<style lang="less">
    .upload-field {
        background-color: #FFFFFF;
        border: 1px solid #E5E5E5;
        padding: 16px 50px;
        .file-name-field {
            display: flex;
            flex-direction: column;
            align-self: center;
            width: 100%;
            margin-top: 9px;
            margin-right: 25px;
            form {
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
            .fileName {
                width: 100%;
                text-align: left;
                font-size: 14px;
                color: #475669;
                letter-spacing: 0;
                line-height: 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .dscj-webfont-document {
                color: #8492A6;
                margin-right: 8px;
            }
            .percentage {
                .el-progress-bar__outer {
                    height: 2px !important;
                }
                .el-progress__text i {
                    // display: none;
                }
                .el-progress-bar {
                    // background-color: #CCCCCC;
                }
                .el-progress-bar__outer {
                    background-color: #CCCCCC;
                }
                .el-progress-bar__inner {
                    background-color: #63758F;
                }
            }
        }
        .file-name-field-layout {
            display: flex;
            justify-content: space-between;
        }
    }

    .upload-input {
        position: absolute;
        top: 0;
        right: 0;
        margin: 0;
        padding: 0;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        z-index: -1;
        filter: alpha(opacity=0);
    }

    .upload-btn {
        margin-bottom: 10px !important;
        margin-left: 12px;
        background: #3DAAFF;
        border-radius: 4px;
        width: 90px;
        height: 28px;
        line-height: 0;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 1px;
        border: none;
        padding: 0 !important;
    }

    .upload-btn:hover {
        background: #3DAAFF;
    }

    .description {
        align-self: center; // height: 28px;
        // line-height: 34px;
        color: #808080;
        text-align: right;
        font-size: 13px;
        color: #757575;
        line-height: 14px;
        letter-spacing: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .remove-file {
        color: skyblue;
        font-size: 12px;
        cursor: pointer;
    }
</style>