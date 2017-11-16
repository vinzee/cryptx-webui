import Vue from 'vue'

Vue.mixin({
  methods: {
    login (email, password) {
      // this.$auth.login({ email, password }).then((res) => {
      //   if (res.success) {
      let res = {session: 'vineet'}
      console.log('login successful !')
      this.$cookie.set('session', res.session, {expires: '1H'}) // , domain: this.$config.baseURL
      this.$store.dispatch('authenticate', res.session).then(() => {
        this.$router.push('/')
        this.$notify('User logged in sucessfully !', 'ti-bank')
      })
      //   } else {
      //     throw new Error('Error in user login: ', res)
      //   }
      // })
    },
    register (userData) {
      this.$auth.register(userData).then(function (res) {
        this.$notify('User registered in sucessfully !', 'ti-bank')
        this.login(userData.email, userData.password)
      })
    },
    logout () {
      this.$cookie.delete('session') // , {domain: this.$config.baseURL}

      this.$store.dispatch('logout').then(() => {
        this.$router.push({ path: '/login' })
        this.$notify('User logged out sucessfully !', 'ti-bank')
      })
    }
  }
})
