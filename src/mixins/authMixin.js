import Vue from 'vue'

Vue.mixin({
  methods: {
    login (email, password) {
      let self = this
      // let res = {session: 'session_value'}
      this.$auth.login({ email, password }).then((res) => {
        console.log('login successful !', res.headers['x-auth-token'], res.data)

        this.$store.dispatch('setUserData', res.data)
        // this.$store.dispatch('setTempUserData')
        .then(this.$store.dispatch('login', res.headers['x-auth-token']))
        .then(() => {
          let redirectPath = this.$route.query.redirect == null ? '/' : this.$route.query.redirect
          this.$router.push(redirectPath)
          this.$notify('User Logged In', 'ti-user')
        })
      }).catch(function (res) {
        self.$notify('Error in user login. ', 'ti-alert', 'danger')
      })
    },
    register (userData) {
      let self = this
      this.$auth.register({user: userData}).then(function (res) {
        self.$notify('User registered in sucessfully', 'ti-user')
        self.login(userData.email, userData.password)
      }).catch(function (res) {
        self.$notify('Error in User Registration. ', 'ti-alert', 'danger')
      })
    },
    logout () {
      let self = this
      this.$store.dispatch('logout').then(() => {
        self.$router.push({ path: '/login' })
        self.$notify('User Logged Out', 'ti-user')
      })
    }
  }
})
