
import VueHzjKeyboard from './VueHzjKeyboard.vue'

const keyboard = {
    install(Vue, options) {
        Vue.component('VueHzjKeyboard', VueHzjKeyboard)
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(keyboard);
}

export default keyboard