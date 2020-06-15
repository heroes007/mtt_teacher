import Vue from 'vue';
import Loadings from './loading.vue';
const LoadingConstructor = Vue.extend(Loadings);

const Loading = (options) => {
    options = options || {};
    if (typeof options === 'string') {
        options = {
            message: options
        };
    };
    const instance = new LoadingConstructor({
        data: options
    });
    instance.vm = instance.$mount()
    document.body.appendChild(instance.vm.$el);
    instance.vm.$on('close', () => {
        if(instance.vm.show){
            instance.vm.show = false;
            document.body.removeChild(instance.vm.$el);
        }
    });
    return instance.vm
}
export default Loading;
