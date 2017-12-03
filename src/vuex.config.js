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
    portfolioMap: {},
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
    virtualWalletAmount: state => {
      return state.user.virtualWallet.amount
    },
    portfolioNetWorth: state => {
      return state.user.virtualWallet.amount + _.round(_.reduce(state.user.portfolio, function (sum, portfolio) {
        return sum + portfolio.value
      }, 0))
    },
    portfolio: state => {
      return state.user.portfolio
    },
    portfolioMap: state => {
      return state.portfolioMap
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
      Vue.cookie.delete('session') // , {domain: window.appConfig.BASE_URL}
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

      let portfolio = []
      portfolio.push({currency: 'Bitcoin', amount: user.portfolio.bitcoin})
      portfolio.push({currency: 'Litecoin', amount: user.portfolio.litecoin})
      portfolio.push({currency: 'Ethereum', amount: user.portfolio.ethereum})
      user.portfolio = portfolio

      _.each(user.portfolio, function (portfolio) {
        state.portfolioMap[portfolio.currency] = portfolio
      })

      _.each(user.transactions, function (transaction) {
        transaction.transactionTime = moment(transaction.transactionTime * 1000).format(window.appConfig.momentFormat)
      })

      _.each(user.transactions, function (transaction) {
        transaction.transactionTime = moment(transaction.transactionTime * 1000).format(window.appConfig.momentFormat)
      })

      state.user = user
    },
    updateUserData (state, data) {
      console.log('updateUserData: ', data)
      state.user = data.user
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

      _.each(state.user.portfolio, function (portfolio) {
        let currencyDetails = state.currencyDataMap[portfolio.currency]

        if (currencyDetails !== undefined) {
          portfolio.value = _.round(portfolio.amount * currencyDetails.price_usd, 3)
          portfolio.price = currencyDetails.price_usd
        } else {
          portfolio.value = 0
          portfolio.price = 0
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
      Vue.set(state.user.virtualWallet, 'amount', data.virtualWallet.amount)
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
      let self = this

      return new Promise((resolve, reject) => {
        if (getters.isSessionPresent) {
          dispatch('fetchUserData').then(() => {
            dispatch('getCurrencyData').then(() => {
              commit('setAuth', true)
              commit('setIsBootstrapping', false)
              self.loading = false
              resolve({loggedIn: true})
            })
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
      userData.portfolio = data.portfolio
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
    getPortfolioData ({ commit }, data) {
      console.log('getPortfolioData')

      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.get('/portfolio/').then((data) => {
          // console.log('getCurrencyData responses: ', bitcoinHistoric, ethereumHistoric, litecoinHistoric)
          // commit('setCurrencyHistoricPricing', {price: bitcoinHistoric.data.Data, currency: 'Bitcoin'})
          // commit('setCurrencyHistoricPricing', {price: ethereumHistoric.data.Data, currency: 'Ethereum'})
          // commit('setCurrencyHistoricPricing', {price: litecoinHistoric.data.Data, currency: 'Ethereum'})

          resolve()
        }).catch((err) => {
          reject(err)
        })
      })
    },
    getCurrencyData ({ commit }) {
      console.log('getCurrencyData')

      return new Promise((resolve, reject) => {
        Vue.axios.all([
          Vue.axios.get(window.appConfig.COINMARKETCAP_API_URL + '/v1/ticker/bitcoin/'),
          Vue.axios.get(window.appConfig.COINMARKETCAP_API_URL + '/v1/ticker/ethereum/'),
          Vue.axios.get(window.appConfig.COINMARKETCAP_API_URL + '/v1/ticker/litecoin/')
        ]).then(Vue.axios.spread(function (bitcoinCurrent, ethereumCurrent, litecoinCurrent) {
          console.log('getCurrencyData responses: ', bitcoinCurrent, ethereumCurrent, litecoinCurrent)

          commit('setCurrencyData', {
            bitcoin: bitcoinCurrent.data[0],
            ethereum: ethereumCurrent.data[0],
            litecoin: litecoinCurrent.data[0]
          })

          resolve()
        })).catch((err) => {
          reject(err)
        })
      })
    },
    depositWithdraw ({ commit }, data) {
      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.post('/wallet/' + data.type, {
          walletRequest: {
            amount: data.amount,
            paymentMethodId: data.paymentMethodId
          }
        }).then((res) => {
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
