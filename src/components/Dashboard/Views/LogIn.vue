<template>
  <div class="card">
    <div class="header">
      <h4 class="title">Login</h4>
    </div>
    <div class="content">
      <form>
        <div class="row">
          <div class="col-md-4 col-md-offset-4">
            <div class="form-group">
              <label>Email</label>
              <input v-validate="'required'" class="form-control border-input" name="email" placeholder="Email" v-model="user.email">
              <span v-show="errors.has('email')" class="text-danger">{{ errors.first('email') }}</span>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 col-md-offset-4">
            <div class="form-group">
              <label>Password</label>
              <input v-validate="'required'" class="form-control border-input" name="password" placeholder="Password" v-model="user.password">
              <span v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</span>
            </div>
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
        user: {

        }
      }
    },
    methods: {
      login () {
        this.$validator.validateAll()
        .then((isValidated) => {
          if (isValidated) {
            this.$store.dispatch('login', this.user)
          }
        })
      }
    }
  }

</script>
