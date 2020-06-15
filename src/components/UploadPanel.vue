<template>
    <Row class="upload-panel">
        <Icon class="icon-colse" v-if="close&&!is_show" type="md-close-circle" @click="closeModal"/>
        <Row class="upload-space" v-show="is_show"
             :style="{width: panelOptions.panelWidth + 'px', height: panelOptions.panelHeight + 'px'}">
            <input type="file" style="font-size: 1.2em; padding: 10px 0;height: 100%;" @change="handleChangeMedia" :accept="types"/>
            <!--<Icon class="md-cloud-upload" :size=56 type="md-cloud-upload" />-->
            <img class="md-cloud-upload" src="../assets/icons/icon/upload.png" alt="">
            <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
        </Row>
        <!-- <vue-cropper v-show="isCropper && !is_show" ref='cropper' :guides="true" :view-mode="2" :drag-mode="crop" :auto-crop-area="1" :min-container-width="250" :min-container-height="180" :background="true" :rotatable="true" :src="this.imgSrc" alt="Source Image" :imgStyle="{width: '100%', height: '200px' }">
    </vue-cropper> -->
        <Row class="img" v-if="type=='image'&&!is_show">
            <img :src="resourse_url" alt=""/>
            <input type="file" accept="*" style="font-size: 1.2em; padding: 10px 0;" @change="handleChangeMedia"/>
        </Row>
        <span style="display: none">{{resourse_url}}</span>
        <Row class="video" v-if="type=='video'&&!is_show">
            <img v-if="resourse_url" @click="deleteVideo" src="../assets/img/close-icon.png" class="upload-img-main-icon" />
            <video ref="vedioPlayer" v-if="resourse_url" :src="resourse_url" controls="controls"/>
            <input v-if="resourse_url" type="file" :accept="types"
                   style="font-size: 1.2em; padding: 10px 0;" @change="handleChangeMedia"/>
        </Row>
        <div class="file-require">
            <slot name="file-require"></slot>
        </div>
        <!-- <Row class="uploaded-files-container" v-show="resultUrl">
      <Row class="uploaded-file"><span class="el-icon-document"></span>{{file_name}}</Row>
    </Row> -->
    </Row>
</template>

<script>
    import {get_sign} from '../api/modules/ali_oss'
    import axios from 'axios'
    const ossHost = 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com';

    export default {
        props: {
            panelOptions: {
                type: Object,
                default: function () {
                    return {
                        panelWidth: '100%',
                        panelHeight: 250
                    }
                }
            },
            uploadConfig: {
                type: Object,
                default: function () {
                    return {
                        bucket: 'jhyl-static-file',
                        dir: 'user_task',
                        type: 1
                    }
                }
            },
            resourse: {},
            close: {
                type: Boolean,
                default: false
            },
            maxFileSize: {
                type: Number,
                default: 0
            },
            types: {
                type: String,
                default: '*'
            }
        },
        data() {
            return {
                teacherManageDialog: true,
                form: {
                    teacher_name: '',
                    teacher_description: '',
                },
                imgSrc: '',
                file_name: '',
                upload_address: '',
                file_list: [],
                show_file_name: false,
                percentage: 0,
                form_data: null,
                is_show: true,
                type: '',
                resourse_url: '',
                fullscreenLoading: null,
                video_url: '',
                fileSize: null
            }
        },
        watch:{
            resourse(val) {
                if(!val) this.is_show = true
                else {
                    if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)/.test(this.resourse)) {
                        this.type = 'image';
                        this.is_show = false;
                    }
                    if (/\.(mp4|wav|mov)/.test(this.resourse)) {
                        this.type = 'video';
                        this.is_show = false;
                    }
                    this.resourse_url = val
                }
            }
        },
        methods: {
            deleteVideo(){
                this.is_show = true
                this.resourse_url = ''
            },
            handleSave() {
                //获取剪切后的图片对象并且上传到服务器
                this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
                    blob.name = this.file_name
                    this.handleGetassignKey(blob);
                })
            },
            closeModal() {
                this.$nextTick(()=>{
                    this.is_show = true;
                    this.resourse_url = '';
                })
                this.$emit('uploadcomplete', "");
            },
            //通过插件显示图片
            handleChangeMedia(e) {
                this.fileSize = e.target.files[0].size / (1024 * 1024);
                if (this.maxFileSize > 0 && this.fileSize > this.maxFileSize) {
                    this.$Modal.info({
                        title: '提示',
                        content: `文件不能超过${this.maxFileSize}M`,
                        onOk: () => {
                        }
                    });
                    return;
                }
                this.fullscreenLoading = this.$LoadingY({message: "", show: true})
                this.handleUploadChange(e);
            },
            // 获取图片名称
            handleUploadChange(event) {
                var filename = event.target.value.substring(event.target.value.lastIndexOf("\\") + 1, event.target.value
                    .length);
                this.show_file_name = true;
                this.file_name = filename;
                if (this.handleCheckMedia(event)) {
                    this.handleGetassignKey(event.target.files[0], event);
                }
            },
            handleCheckMedia(event) {

                var _type = this.uploadConfig.type;
                switch (_type) {
                    case 0:
                        this.type = event.target.files[0].type;
                        return true;
                    case 1:
                        if (!(event.target.files[0].type.indexOf('image') < 0)) {
                            this.type = 'image';
                            return true;
                        } else {
                            this.$Message.warning('只能上传图片！');
                            if (this.fullscreenLoading) this.fullscreenLoading.close()
                            return false;
                        }
                    case 2:
                        if (!(event.target.files[0].type.indexOf('video') < 0)) {
                            this.type = 'video';
                            return true;
                        } else {
                            this.$Message.warning('只能上传视频！');
                            if (this.fullscreenLoading) this.fullscreenLoading.close()
                            return false;
                        }
                    case 3:
                        if (!(event.target.files[0].name.indexOf('.apk') < 0)) {
                            this.type = 'apk';
                            return true;
                        } else {
                            this.$Message.warning('请上传apk后缀文件,请重试');
                            if (this.fullscreenLoading) this.fullscreenLoading.close()
                            return false;
                        }
                    case 4:
                        if (!(event.target.files[0].type.indexOf('video') < 0)) {
                            this.type = 'video';
                            return true;
                        } else {
                            this.$Message.warning('只能上传视频！');
                            if (this.fullscreenLoading) this.fullscreenLoading.close()
                            return false;
                        }
                }
            },
            // 上传到oss上
            handleUploadFile(form_data, url, e) {
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
                    e.target.value = ''
                    this.resourse_url = url + '/' + this.video_url
                    if (this.type == 'video'&&this.uploadConfig.time) {
                        setTimeout(() => {
                            let vedioTime = this.$refs.vedioPlayer.duration
                            this.$emit('vedioTime', vedioTime)
                        }, 500)
                    }
                    this.$emit('getuploadfile', {
                        name: this.file_name,
                        url: this.resourse_url
                    });
                    this.$emit('uploadcomplete', this.resourse_url);
                    if (this.fullscreenLoading) this.fullscreenLoading.close()
                });
            },
            // 从oss上获取assignKey;
            handleGetassignKey(file_item, event) {
                var date = new Date(); //dscj-app,user_task
                date = date.toGMTString();
                get_sign(file_item.type, date, this.uploadConfig.bucket, this.uploadConfig.dir, file_item.name, 'POST')
                    .then(res => {
                        if (res.data.res_code == 1) {
                            const formData = new FormData();
                            this.video_url = res.data.data.filename;
                            formData.append('key', res.data.data.filename);
                            formData.append('OSSAccessKeyId', res.data.data.accessKeyID);
                            formData.append('success_action_status', '200');
                            formData.append('signature', res.data.data.sign);
                            formData.append('policy', res.data.data.policyBase64);
                            formData.append('file', file_item);
                            this.handleUploadFile(formData, encodeURI(ossHost), event);
                        }
                    })
            },
        }
    }
</script>
<style lang="less" scoped>
    .icon-colse {
        position: absolute;
        z-index: 1000;
        right: 0;
        color: white;
        font-size: 20px;
    }
    .icons{
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 20;
        font-size: 20px;
        z-index: 9999;
    }
    .upload-img-main-icon{
        color: #fff;
        .icons;
    }
    /deep/ .md-cloud-upload {
        margin-top: 70px;
    }

    .upload-panel {
        .file-require {
            font-size: 12px;
            color: #757575;
            letter-spacing: 0;
            line-height: 20px;
            text-align: left;
            margin-top: 10px;
        }

        .img {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #d3d3d3;
            background: #fff;

            img {
                width: 100%;
                height: 100%;
            }

            input {
                width: 100%;
                height: 100% !important;
            }
        }

        .video {
            position: relative;
            video {
                width: 100%;
            }
        }

        .upload-space {
            height: 100%;
            background: #F6F6F6;
            border: 1px solid #CCCCCC;
            display: block;
            text-align: center;

            .el-dragger__text {
                font-size: 14px;
                color: #757575;
                letter-spacing: 0;
                line-height: 14px;
                margin-top: 20px;

                em {
                    margin-left: 5px;
                    font-size: 14px;
                    color: #3DAAFF;
                    letter-spacing: 0;
                    line-height: 14px;
                }
            }

            .el-icon-upload {
                font-size: 4em;
                color: #999999;
                margin-top: 40px;
            }
        }

        input[type=file] {
            width: 100%;
            height: 200px;
            position: absolute;
            top: 0;
            right: 0;
            margin: 0;
            padding: 0;
            cursor: pointer;
            opacity: 0;
            filter: alpha(opacity=0);
        }

        .uploaded-files-container {
            margin-top: 40px;
            text-align: left;

            .uploaded-file {
                padding-left: 9px;
                padding-right: 9px;
                display: inline-block;
                height: 30px;
                line-height: 30px;
                border: 1px solid #ccc;
                border-radius: 4px;

                span {
                    margin-right: 10px;
                }
            }
        }
    }
</style>
