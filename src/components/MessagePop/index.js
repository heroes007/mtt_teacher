import Vue from 'vue';
import MessagePop from './MessagePop.vue'
import store from '../../store';


export var MPop = {
     methods: {
        showPop(text, duration) {
            var el_name = "message-pop";
            var payload = {text:text,duration:duration};
            initVue({ el_name, payload, component: MessagePop });
        }
     }
}

function initVue({ el_name, payload, component }) {
    var element = document.createElement('div');
    element.id = `${el_name}-container`;
    element.innerHTML = `<${el_name} :remove='removeNodeName' :option='option'></${el_name}>`;
    document.getElementById('app').appendChild(element);
    Vue.component(`${el_name}`, component);
    new Vue({
        data: {
            removeNodeName: element.id,
            option: payload
        },
        store
    }).$mount(element);
}
