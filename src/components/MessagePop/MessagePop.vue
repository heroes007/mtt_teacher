<template>
    <div>
        <transition name="message-pop-fade">
            <div class='message-pop' v-if='showPop'>
                <h2>{{option.text}}</h2>
            </div>
        </transition>
    </div>
</template>

<script>
  import { RemoveModal } from '../../views/dialogs/mixins'
  export default {
    mixins: [RemoveModal],
    data() {
      return {
        showPop: true
      }
    },
    props: {
      remove: {
        type: String
      },
      option: {}
    },
    methods: {},
    mounted() {
      var vm = this;
      if (!this.option.duration)
        this.option.duration = 1000;
      setTimeout(function () {
        vm.showPop = false;
        vm.handleRemoveModal(vm.remove);
      }, this.option.duration)
    }
  }

</script>

<style lang="less">
    #message-pop-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        margin: 0;
        z-index:9999;
        background-color: rgba(0,0,0,0.7);
        text-align: center;
        .message-pop {
            margin-top: 40vh;
            z-index: 99999;
            background-color: #ffffff;
            display: inline-block;
            width: 180px;
            height: 90px;
            border-radius: 4px;
            line-height: 90px;

            h2 {
            font-size: 20px;
            color: #3DAAFF;
            letter-spacing: 0;
            margin: 0;
            }

            transition: opacity .2s ease-in
        }
    }
.message-pop-fade-enter, .message-pop-fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  transition: bounce-out 1s ease-in;
}
.message-pop-fade-active, .message-pop-fade-active {
  transition: bounce-in 1s ease-in;
}
@keyframes bounce-in {
  0% { opacity: 0; }
  50% { opacity: 0.5; }
  100% { opacity: 1;}
}
@keyframes bounce-out {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 0;}
}
</style>
