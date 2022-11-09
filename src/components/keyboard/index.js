
import keyboardIndex from './keyboardIndex.vue'

const keyboard = {
    install(Vue) {
        Vue.component('vue-virtual-keyboard-cn', keyboardIndex)
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(keyboard);
}

export default keyboard