<template>
  <div class="card">
    <div class="header">
      <h4 class="title">Register</h4>
    </div>
    <div class="content">
      <form>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label>Email</label>
              <input v-validate="{required: true, email: true}" class="form-control border-input" name="email" placeholder="Email" v-model="user.email">
              <span v-show="errors.has('email')" class="text-danger">{{ errors.first('email') }}</span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label>Password</label>
              <input v-validate="'required'" class="form-control border-input" name="password" type="password" placeholder="Password" v-model="user.password">
              <span v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label>Password Confirmation</label>
              <input v-validate="'required|confirmed:password'" class="form-control border-input" name="passwordConfirmation" type="password" placeholder="Password Confirmation" v-model="passwordConfirmation" data-vv-as="password">
              <span v-show="errors.has('passwordConfirmation')" class="text-danger">{{ errors.first('passwordConfirmation') }}</span>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label>Full Name</label>
              <input v-validate="'required'" class="form-control border-input" name="name" placeholder="First Name" v-model="user.name">
              <span v-show="errors.has('name')" class="text-danger">{{ errors.first('name') }}</span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label>SSN</label>
              <input v-validate="{regex: /^\d{3}-?\d{2}-?\d{4}$$/}" class="form-control border-input" name="ssn" placeholder="XXX-XX-XXXX" v-model="user.ssn">
              <span v-show="errors.has('ssn')" class="text-danger">{{ errors.first('ssn') }}</span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label>Phone</label>
              <input v-validate="{required: true, regex: /^(()?\d{3}())?(-|\s)?\d{3}(-|\s)?\d{4}$/}" class="form-control border-input" name="phone" placeholder="Phone" v-model="user.phone">
              <span v-show="errors.has('phone')" class="text-danger">{{ errors.first('phone') }}</span>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Home Address</label>
              <input class="form-control border-input" name="address" placeholder="Home Address" v-model="user.address">
              <span v-show="errors.has('address')" class="text-danger">{{ errors.first('address') }}</span>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label>City</label>
              <input class="form-control border-input" name="city" placeholder="City" v-model="user.city">
              <span v-show="errors.has('city')" class="text-danger">{{ errors.first('city') }}</span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label>Country</label>
              <input class="form-control border-input" name="country" placeholder="Country" v-model="user.country">
              <span v-show="errors.has('country')" class="text-danger">{{ errors.first('country') }}</span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label>Postal Code</label>
              <input class="form-control border-input" name="postalCode" placeholder="Postal Code" v-model="user.postalCode" type="number">
              <span v-show="errors.has('postalCode')" class="text-danger">{{ errors.first('postalCode') }}</span>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="submitRegisterForm">
            Register
          </button>
        </div>

        <br><br>
        <div class="text-center">
          Already a user ?<br>
          <a href="#/login" class="btn-rotate btn btn-default btn-fill btn-wd">
            <i class="fa fa-sign-in" aria-hidden="true"></i> Login
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
        user: {},
        passwordConfirmation: ''
      }
    },
    methods: {
      submitRegisterForm () {
        let self = this
        this.$validator.validateAll().then((isValidated) => {
          if (isValidated) {
            self.register(self.user)
          }
        })
      }
    }
  }

</script>
