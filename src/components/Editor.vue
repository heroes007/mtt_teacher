<template>
    <div class='editor'>
        <!-- <Vueditor ref='text_editor_main'></Vueditor> -->
        <VueUEditor @ready='editorReadyHandler'></VueUEditor>
        <Row class='editor-btns' type='flex' justify='start' align='middle'>
            <btn-upload text='插入图片' type='image/gif, image/jpeg, image/png' :host='host'
                        @uploadcomplete='uploadImgComplete'></btn-upload>
        </Row>
    </div>
</template>
<script>

  import UploadBtn from './UploadButton.vue'
  import {Config} from '../config/base'
  import VueUEditor from 'vue-ueditor'

  export default {
    data() {
      return {
        host: Config.ossHost,
        editor: null,
      }
    },
    props: {
      content: {
        type: String
      }
    },
    computed: {
      editorContent() {
        return this.content;
      }
    },
    mounted() {
      var vm = this;
      if (this.editorContent && !this.editor.getContent()){
        setTimeout(function () {
          this.editor.setContent(vm.editorContent)
        }, 100);
      }
    },
    methods: {
      editorReadyHandler(editor) {
        this.editor = editor;
        var vm = this;
        if (this.editorContent && !this.editor.getContent()){
          setTimeout(function () {
            vm.editor.setContent(vm.editorContent)
          }, 100);
        }
      },
      uploadImgComplete(result) {
//                var oldStr = this.$refs.main.getContent();
//                oldStr += '<img src="' + url + '">';
//                this.$refs.main.setContent(oldStr);
        // this.$refs.text_editor_main.$store.dispatch('execCommand', {name: 'insertHTML', value: `<img src="${result.url}">`});
        this.editor.execCommand('insertimage', {src: result.url})
      }
    },
    watch: {
      editorContent(val) {
        // this.$refs.text_editor_main.setContent(val);
        var vm = this;
        if (this.editor && !this.editor.getContent()){
          setTimeout(function () {
            vm.editor.setContent(val)
          }, 100);
        }
      }
    },
    components: {
      'btn-upload': UploadBtn,
      VueUEditor
    }
  }

</script>
<style lang="less">
    .editor {
        .vueditor {
            height: 250px;
            text-align: left;
        }

        .edui-editor {
            width: 100% !important;
            /*width: 647px !important;*/
            .edui-toolbar {
                text-align: left;
            }

            .edui-editor-iframeholder {
                width: 100% !important;
            }
        }

        .editor-btns {
            margin-top: 10px;
        }
    }
</style>
