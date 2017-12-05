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
    portfolioHistoricData: [],
    currencyHistoricData: []
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
    portfolioHistoricData: state => {
      return state.portfolioHistoricData
    },
    currencyHistoricData: state => {
      return state.currencyHistoricData
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
    updateUserData (state, data) {
      state.user = data
    },
    setPaymentMethod (state, data) {
      Vue.set(state.user, 'paymentMethods', data)
    },
    setUserData (state, user) {
      state.user = state.user || user

      if (user.portfolio !== null && user.portfolio !== undefined) {
        let portfolio = []
        portfolio.push({currency: 'Bitcoin', amount: user.portfolio.bitcoin})
        portfolio.push({currency: 'Litecoin', amount: user.portfolio.litecoin})
        portfolio.push({currency: 'Ethereum', amount: user.portfolio.ethereum})

        user.portfolioId = user.portfolio.portfolioId
        user.portfolio = portfolio

        _.each(user.portfolio, function (portfolio) {
          state.portfolioMap[portfolio.currency] = portfolio
        })
      }

      if (user.transactions !== null && user.transactions !== undefined) {
        user.transactions = user.transactions.reverse()

        _.each(user.transactions, function (transaction) {
          transaction.transactionTime = moment(transaction.transactionTime * 1000).format(window.appConfig.momentFormat)
        })
      }

      _.each(user, (v, k) => {
        Vue.set(state.user, k, v)
      })

      if (state.user.paymentMethods === null || state.user.paymentMethods === undefined) {
        Vue.set(state.user, 'paymentMethods', [])
      }

      if (state.user.transactions === null || state.user.transactions === undefined) {
        Vue.set(state.user, 'transactions', [])
      }
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
    },
    setPortfolioValue (state, data) {
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
    setPortfolioHistoricData (state, data) {
      if (data.amount === null || data.amount.length === 0) {
        state.portfolioHistoricData = []
      } else {
        state.portfolioHistoricData = [
          {pricing: data.bitcoin, name: 'Bitcoin'},
          {pricing: data.ethereum, name: 'Ethereum'},
          {pricing: data.litecoin, name: 'Litecoin'},
          {pricing: data.amount, name: 'Overall'}
        ]
      }
    },
    setCurrencyHistoricData (state, data) {
      state.currencyHistoricData = [
        {pricing: data.bitcoin, name: 'Bitcoin'},
        {pricing: data.ethereum, name: 'Ethereum'},
        {pricing: data.litecoin, name: 'Litecoin'}
      ]
    }
  },
  actions: {
    sessionAuthenticate ({ commit, getters, dispatch }) {
      let self = this

      return new Promise((resolve, reject) => {
        if (getters.isSessionPresent) {
          dispatch('fetchUserData').then(() => {
            Promise.all([
              dispatch('getCurrencyData'),
              dispatch('getCurrencyHistoricData'),
              dispatch('getPortfolioHistoricData')
            ]).then(() => {
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
      Vue.cookie.set('session', session, {expires: '1H'}) // , domain: this.$config.BASE_URL
      commit('fetchSession')
      commit('setAuth', true)
    },
    logout ({ commit }) {
      commit('setAuth', false)
      commit('deleteSession')
      commit('updateUserData', {})
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
        this._vm.$axiosClient.post('/payment_method/create', {
          paymentMethod: {
            nickName: data.nickName,
            cardNumber: data.number,
            cardName: data.name,
            cvv: data.cvv,
            cardExpiryDate: data.expiry
          }
        }).then((res) => {
          commit('setPaymentMethod', res.data.data)
          resolve(res)
        }, (err) => {
          reject(err)
        })
      })
    },
    deletePaymentMethod ({ commit }, data) {
      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.delete('/payment_method/' + data.id).then((res) => {
          commit('setPaymentMethod', res.data.data)
          resolve(res)
        }, (err) => {
          reject(err)
        })
      })
    },
    getPortfolioHistoricData ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.get('/portfoliohistory/' + state.user.portfolioId).then((data) => {
          commit('setPortfolioHistoricData', data.data)
          resolve()
        }).catch((err) => {
          reject(err)
        })
      })
    },
    getCurrencyHistoricData ({ commit }, data) {
      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.get('/currencyhistory').then((data) => {
          commit('setCurrencyHistoricData', data.data)

          resolve()
        }).catch((err) => {
          reject(err)
        })
      })
    },
    getCurrencyData ({ commit }) {
      return new Promise((resolve, reject) => {
        Vue.axios.all([
          Vue.axios.get(window.appConfig.COINMARKETCAP_API_URL + '/v1/ticker/bitcoin/'),
          Vue.axios.get(window.appConfig.COINMARKETCAP_API_URL + '/v1/ticker/ethereum/'),
          Vue.axios.get(window.appConfig.COINMARKETCAP_API_URL + '/v1/ticker/litecoin/')
        ]).then(Vue.axios.spread(function (bitcoinCurrent, ethereumCurrent, litecoinCurrent) {
          commit('setCurrencyData', {
            bitcoin: bitcoinCurrent.data[0],
            ethereum: ethereumCurrent.data[0],
            litecoin: litecoinCurrent.data[0]
          })
          commit('setPortfolioValue')

          resolve()
        })).catch((err) => {
          reject(err)
        })
      })
    },
    depositWithdraw ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.post('/wallet/' + data.type, {
          walletRequest: {
            amount: data.amount,
            cardid: data.cardid,
            portfolioId: state.user.portfolioId
          }
        }).then((res) => {
          commit('setUserData', res.data.data)
          resolve(res)
        }, (err) => {
          reject(err)
        })
      })
    },
    buySellCurrency ({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        if (data.type !== 'buy' && data.type !== 'sell') {
          throw new Error('Invalid currency transaction type in buySellCurrency: ', data.type)
        }

        this._vm.$axiosClient.post('/currency/' + data.type, {
          transactionRequest: {
            currency: data.currency,
            numberOfCoins: data.amount,
            transactionAmount: data.value,
            transactionTime: Math.round((new Date()).getTime() / 1000),
            cardid: data.cardid,
            portfolioId: state.user.portfolioId
          }
        }).then((res) => {
          commit('setUserData', res.data.data)
          commit('setPortfolioValue')
          resolve(res)
        }, (err) => {
          reject(err)
        })
      })
    },
    updateUserProfile ({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        this._vm.$axiosClient.put('/user/update', {user: data}).then((res) => {
          commit('setUserData', res.data.data)
          resolve(res)
        }, (err) => {
          reject(err)
        })
      })
    }
  }
})

export default store
