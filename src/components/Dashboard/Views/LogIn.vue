<template>
  <div class="card">
    <div class="header">
      <h4 class="title">Login</h4>
    </div>
    <div class="content">
      <form>
        <div class="row">
          <div class="col-md-4 col-md-offset-4">
            <fg-input type="email"
                      label="Email"
                      placeholder="Email"
                      v-model="user.email">
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 col-md-offset-4">
            <fg-input type="password"
                      label="password"
                      placeholder="Password"
                      v-model="user.password">
            </fg-input>
          </div>
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="login">
            Log In
          </button>

        </div>

        <br><br>
        <div class="text-center">
          Not registered yet ?<br>
          <a href="#/register" class="btn-rotate btn btn-default btn-fill btn-wd">
            <i class="fa fa-sign-in" aria-hidden="true"></i> Register
          </a>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    methods: {
      login () {
        alert('Your data: ' + JSON.stringify(this.user))
      }
    }
  }

</script>
