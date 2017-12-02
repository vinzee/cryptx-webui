import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import moment from 'moment'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    isLoading: false,
    isBootstrapping: true,
    isAuthenticated: false,
    session: false,
    user: null,
    currencyData: null,
    currencyDataMap: {},
    currencyIconData: {},
    investmentsMap: {},
    topCurrency: {},
    worstCurrency: {},
    currencyPriceSeries: []
  },
  getters: {
    currentUser: state => {
      return state.user
    },
    transactions: state => {
      return state.user.transactions
    },
    paymentMethods: state => {
      return state.user.paymentMethods
    },
    virtualWalletBalance: state => {
      return state.user.virtualWallet.balance
    },
    portfolioNetWorth: state => {
      return state.user.virtualWallet.balance + _.round(_.reduce(state.user.investments, function (sum, investment) {
        return sum + investment.value
      }, 0))
    },
    investments: state => {
      return state.user.investments
    },
    investmentsMap: state => {
      return state.investmentsMap
    },
    isAuthenticated: state => {
      return state.isAuthenticated
    },
    currencyData: state => {
      return state.currencyData
    },
    currencyDataMap: state => {
      return state.currencyDataMap
    },
    topCurrency: state => {
      return state.topCurrency
    },
    worstCurrency: state => {
      return state.worstCurrency
    },
    currencyPriceSeries: state => {
      return state.currencyPriceSeries
    },
    isLoading: state => {
      return state.isLoading
    },
    isBootstrapping: state => {
      return state.isBootstrapping
    },
    isSessionPresent: state => {
      return state.session !== null && state.session !== undefined
    },
    session: state => {
      return state.session
    }
  },
  mutations: {
    fetchSession (state) {
      state.session = Vue.cookie.get('session') // {domain: window.appConfig.BASE_URL}
    },
    deleteSession (state) {
      Vue.cookie.delete('session') // , {domain: this.$config.BASE_URL}
      state.session = null
    },
    setIsBootstrapping (state, isBootstrapping) {
      state.isBootstrapping = isBootstrapping
    },
    setIsLoading (state, isLoading) {
      state.isLoading = isLoading
    },
    setAuth (state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    },
    setUserData (state, user) {
      console.log('setUserData')
      _.each(user.investments, function (investment) {
        state.investmentsMap[investment.currency] = investment
      })

      _.each(user.transactions, function (transaction) {
        transaction.transactionTime = moment(transaction.transactionTime * 1000).format(window.appConfig.momentFormat)
      })

      state.user = user
    },
    updateUserData (state, data) {
      console.log('updateUserData: ', data)
    },
    setCurrencyData (state, currencyData) {
      let topCurrency = null
      let worstCurrency = null

      _.each(currencyData, function (currency) {
        state.currencyDataMap[currency.name] = currency

        if (currency.rank === '1') {
          topCurrency = currency
        }

        if (worstCurrency === null || parseInt(worstCurrency.rank) < parseInt(currency.rank)) {
          worstCurrency = currency
        }
      })

      state.topCurrency = topCurrency
      state.worstCurrency = worstCurrency
      state.currencyData = currencyData

      _.each(state.user.investments, function (investment) {
        let currencyDetails = state.currencyDataMap[investment.currency]

        if (currencyDetails !== undefined) {
          investment.value = _.round(investment.amount * currencyDetails.price_usd, 3)
          investment.price = currencyDetails.price_usd
        } else {
          investment.value = 0
          investment.price = 0
        }
      })
    },
    setCurrencyHistoricPricing (state, data) {
      let priceSeries = {name: data.currency, data: []}

      _.map(data.price, function (p) {
        priceSeries.data.push(p.high)
      })

      state.currencyPriceSeries.push(priceSeries)
    },
    updateVirtualWallet (state, data) {
      Vue.set(state.user.virtualWallet, 'balance', data.virtualWallet.balance)
    },
    addPaymentMethod (state, data) {
      console.log('addPaymentMethod ', data)
      state.user.paymentMethods.push(data)
    },
    deletePaymentMethod (state, data) {
      console.log('deletePaymentMethod ', data)
    },
    updatePortfolio (state, data) {
      console.log('updatePortfolio: ', data)

      state.user.transactions = data.transactions
      state.user.virtualWallet = data.virtualWallet
    }
  },
  actions: {
    sessionAuthenticate ({ commit, getters, dispatch }) {
      return new Promise((resolve, reject) => {
        if (getters.isSessionPresent) {
          dispatch('fetchUserData').then(() => {
            dispatch('getCurrencyData').then(() => {
              commit('setAuth', true)
              commit('setIsBootstrapping', false)
              self.loading = false
              resolve({loggedIn: true})
            }).catch((res) => {
              self.$notify('Error in fetching the latest crypto-currency pricing data', 'ti-alert', 'danger')
            })
          }).catch((err) => {
            console.error('Error in fetchUserData !', err)
            reject(err)
          })
        } else {
          commit('setIsBootstrapping', false)
          resolve({loggedIn: false})
        }
      })
    },
    login ({ commit }, session) {
      console.log('login')
      Vue.cookie.set('session', session, {expires: '1H'}) // , domain: this.$config.BASE_URL
      commit('fetchSession')
      commit('setAuth', true)
    },
    logout ({ commit }) {
      commit('setAuth', false)
      commit('deleteSession')
      commit('setUserData', {})
    },
    setUserData ({ commit }, data) {
      let userData = data.user
      userData.paymentMethods = data.paymentMethods
      userData.transactions = data.transactions
      userData.virtualWallet = data.virtualWallet
      userData.investments = data.investments
      commit('setUserData', userData)
    },
    fetchUserData ({ dispatch }) {
      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.get('/user/profile').then((res) => {
          dispatch('setUserData', res.data.data)
          resolve(res)
        }, (err) => {
          reject(err)
        })
      })
    },
    addPaymentMethod ({ commit }, data) {
      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.post('/payment_method/create', data).then((res) => {
          commit('addPaymentMethod', data)
          resolve(res)
        }, (err) => {
          reject(err)
        })
      })
    },
    deletePaymentMethod ({ commit }, data) {
      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.delete('/payment_method/' + data.id).then((res) => {
          commit('deletePaymentMethod', data)
          resolve(res)
        }, (err) => {
          reject(err)
        })
      })
    },
    getCurrencyData ({ commit }) {
      console.log('getCurrencyData')
      let url = window.appConfig.CRYPTOCOMPARE_API_URL + '/data/histohour'

      return new Promise((resolve, reject) => {
        Vue.axios.all([
          // Vue.axios.get(window.appConfig.CRYPTOCOMPARE_URL + '/api/data/coinlist/')
          Vue.axios.get(window.appConfig.COINMARKETCAP_API_URL + '/v1/ticker/bitcoin/'),
          Vue.axios.get(window.appConfig.COINMARKETCAP_API_URL + '/v1/ticker/ethereum/'),
          Vue.axios.get(window.appConfig.COINMARKETCAP_API_URL + '/v1/ticker/ripple/'),
          Vue.axios.get(window.appConfig.COINMARKETCAP_API_URL + '/v1/ticker/litecoin/'),
          Vue.axios.get(url + '?fsym=BTC&tsym=USD&limit=30&aggregate=1'),
          Vue.axios.get(url + '?fsym=ETH&tsym=USD&limit=30&aggregate=1')
          // Vue.axios.get(url + '?fsym=XRP&tsym=USD&limit=30&aggregate=1'),
          // Vue.axios.get(url + '?fsym=LTC&tsym=USD&limit=30&aggregate=1')
          // Vue.axios.get(url + '?fsym=BCH&tsym=USD&limit=30&aggregate=1'),
        ]).then(Vue.axios.spread(function (bitcoinCurrent, ethereumCurrent, rippleCurrent, litecoinCurrent, bitcoinHistoric, ethereumHistoric, rippleHistoric, litecoinHistoric) {
          console.log('getCurrencyData responses: ', bitcoinCurrent, ethereumCurrent, rippleCurrent, litecoinCurrent, bitcoinHistoric, ethereumHistoric, rippleHistoric, litecoinHistoric)

          let current = {
            bitcoin: bitcoinCurrent.data[0],
            ethereum: ethereumCurrent.data[0],
            ripple: rippleCurrent.data[0],
            litecoin: litecoinCurrent.data[0]
          }

          commit('setCurrencyData', current)
          commit('setCurrencyHistoricPricing', {price: bitcoinHistoric.data.Data, currency: 'Bitcoin'})
          commit('setCurrencyHistoricPricing', {price: ethereumHistoric.data.Data, currency: 'Ethereum'})
          // commit('setCurrencyHistoricPricing', {price: rippleHistoric.data.Data, currency: 'Ethereum'})
          // commit('setCurrencyHistoricPricing', {price: litecoinHistoric.data.Data, currency: 'Ethereum'})

          resolve()
        })).catch((err) => {
          reject(err)
        })
      })
    },
    depositWithdraw ({ commit }, data) {
      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.post('/wallet/' + data.type, data).then((res) => {
          commit('updateVirtualWallet', data)
          resolve(res)
        }, (err) => {
          reject(err)
        })
      })
    },
    buySellCurrency ({ commit }, data) {
      return new Promise((resolve, reject) => {
        if (data.type !== 'buy' && data.type !== 'sell') {
          throw new Error('Invalid currency transaction type in buySellCurrency: ', data.type)
        }

        this._vm.$axiosClient.post('/currency/' + data.type, data).then((res) => {
          commit('updatePortfolio', res.data)
          resolve(res)
        }, (err) => {
          reject(err)
        })
      })
    },
    updateUserProfile ({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.put('/user/update', data).then((res) => {
          commit('updateUserData', res.data.data)
          resolve(res)
        }, (err) => {
          reject(err)
        })
      })
    }
  }
})

export default store
