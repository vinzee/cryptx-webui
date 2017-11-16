import Vue from 'vue'

Vue.mixin({
  methods: {
    // isAuthenticated () {
    //   let session = this.$cookie.get('session', {domain: this.$config.baseURL})
    //   let isAuthenticated = session !== null && session !== undefined
    //   this.$store.dispatch('initAuth', isAuthenticated)

    //   return isAuthenticated
    // },
    // getSessionToken () {
    //   return this.$cookie.get('session', {domain: this.$config.baseURL})
    // },
    login (email, password) {
      console.log('login attempt')
      let self = this

      // this.$auth.login({ email, password }).then(function (res) {
      //   if (res.success) {
      let res = {session: 'vineet'}
      console.log('login successful !')

      self.$store.dispatch('login', res.session)
      self.$cookie.set('session', res.session, {expires: '1H'}) // , domain: this.$config.baseURL
      self.$router.push('/')
      self.$notify('User logged in sucessfully !', 'ti-bank')
      //   } else {
      //     throw new Error('Error in user login: ', res)
      //   }
      // })
    },
    register (name, email, password) {
      console.log('register attempt')
      let self = this
      this.$auth.register({ name, email, password }).then(function () {
        self.$notify('User registered in sucessfully !', 'ti-bank')
        self.login(email, password)
      })
    },
    logout () {
      this.$cookie.delete('session') // , {domain: this.$config.baseURL}
      this.$store.dispatch('logout')
      this.$router.push({ path: '/login' })

      this.$notify('User logged out sucessfully !', 'ti-bank')
    }
  }
})
