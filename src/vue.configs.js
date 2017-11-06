import Vue from 'vue'
import vueConfig from 'vue-config'

const configs = {
  baseURL: '',
  momentFormat: 'MMMM Do YYYY, h:mm:ss a',
  isLoggingEnabled: true
}

Vue.use(vueConfig, configs)
