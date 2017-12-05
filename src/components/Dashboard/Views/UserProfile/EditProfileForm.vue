<template>
  <div class="card">
    <div class="header">
      <h4 class="title">User Profile</h4>
    </div>
    <div class="content">
      <form>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label>Email</label>
              <input v-validate="{required: true, email: true}" class="form-control border-input" name="email" placeholder="Email" :value="user.email" disabled>
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
              <input v-validate="{required: true, regex: /^\d{3}-?\d{2}-?\d{4}$$/}" class="form-control border-input" name="ssn" placeholder="XXX-XX-XXXX" v-model="user.ssn">
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
              <label>Address</label>
              <input class="form-control border-input" name="address" placeholder="Address" v-model="user.address">
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
              <input v-validate="'required'" class="form-control border-input" name="postalCode" placeholder="Postal Code" v-model="user.postalCode" type="number">
              <span v-show="errors.has('postalCode')" class="text-danger">{{ errors.first('postalCode') }}</span>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="updateProfile">
            Update Profile
          </button>
        </div>

        <div class="clearfix"></div>

      </form>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    computed: {
      user () {
        let user = _.cloneDeep(this.$store.getters.currentUser)
        delete user.password
        delete user.portfolio
        delete user.paymentMethods
        delete user.transactions
        delete user.virtualWallet
        delete user.portfolioId
        return user
      },
      passwordConfirmation () {
        return this.user.password
      }
    },
    methods: {
      updateProfile () {
        let self = this
        this.$validator.validateAll().then((isValidated) => {
          if (isValidated) {
            self.$store.dispatch('updateUserProfile', self.user).then(() => {
              self.$notify('User Profile updated', 'ti-user')
            }).catch(function (res) {
              self.$notify('User Profile update failed', 'ti-alert', 'danger')
            })
          }
        })
      }
    }
  }

</script>
<style>

</style>
