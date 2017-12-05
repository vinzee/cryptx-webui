import Vue from 'vue'
import vueConfig from 'vue-config'

const configs = {
  LOGIN_URL: '/login',
  REGISTER_URL: '/register',
  momentFormat: 'MMMM Do YYYY, h:mm:ss a',
  isLoggingEnabled: true,
  COINMARKETCAP_API_URL: 'https://api.coinmarketcap.com',
  updateIntervals: {
    currency: 10 * 1000, //  = 10 sec
    currencyHistoric: 30 * 1000, // 30 sec
    portfolioHistoric: 60 * 60 * 1000 // 60 min
  }
}

if (process.env.NODE_ENV === 'production') {
  configs.BASE_URL = 'http://169.55.144.76:8080'
} else {
  configs.BASE_URL = 'http://10.0.0.93:8080'
}

Vue.use(vueConfig, configs)

window.appConfig = configs
