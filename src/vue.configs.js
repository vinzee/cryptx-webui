import Vue from 'vue'
import vueConfig from 'vue-config'

const configs = {
  baseURL: 'http://localhost:8080',
  momentFormat: 'MMMM Do YYYY, h:mm:ss a',
  isLoggingEnabled: true
}

Vue.use(vueConfig, configs)
