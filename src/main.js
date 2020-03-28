import VueCardCarousel from './components/VueCardCarousel.vue'

const plugin = {
  install (Vue, options) {
    Vue.component(VueCardCarousel.name, VueCardCarousel)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
export { VueCardCarousel }
