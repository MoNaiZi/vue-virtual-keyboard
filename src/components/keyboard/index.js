
import vueKeyboard from './keyboardIndex.vue'

const keyboard = {
    install(Vue) {
        Vue.component('vueKeyboard', vueKeyboard)
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(keyboard);
}

export default keyboard