<template>
  <div>
    <div class="card">
      <div class="header">
        <h4 class="title">Payment Methods</h4>
      </div>
      <div class="content">
        <ul class="list-unstyled team-members">
          <li>
            <div class="row" v-for="paymentMethod in paymentMethods">
              <div class="col-xs-3">
                <i class="fa fa-lg fa-credit-card"></i>
              </div>
              <div class="col-xs-6">
                {{paymentMethod.nickName}}
                <br>
                <span class="text-success">
                  <small>{{paymentMethod.accountNumber}}</small>
                </span>
              </div>

              <div class="col-xs-3 text-right">
                <button class="btn btn-sm btn-success btn-icon" @click="deletePaymentMethod(paymentMethod.paymentMethodId)">
                  <i class="fa fa-lg fa-trash"></i>
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div class="text-center">
          <button type="button" class="btn btn-info btn-fill" data-toggle="modal" data-target="#addAccountModal">
            Add
          </button>
        </div>


      </div>
    </div>

    <!-- add Account modal -->
    <div class="modal" id="addAccountModal" tabindex="-1" role="dialog" aria-labelledby="addAccountModal" aria-hidden="true" data-backdrop="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form name="addPaymentMethodForm" @submit.stop.prevent="addPaymentMethod">

          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" id="myModalLabel">Add Payment Method</h4>
          </div>

          <div class="modal-body">

            <div class='card-wrapper'></div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Full Name</label>
                  <input v-validate="'required'" class="form-control border-input" name="name" placeholder="Full Name" v-model="newPaymentMethod.name">
                  <span v-show="errors.has('name')" class="text-danger">{{ errors.first('name') }}</span>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label>Payment Method Nick Name</label>
                  <input v-validate="'required'" class="form-control border-input" name="nickName" placeholder="Payment Method 1" v-model="newPaymentMethod.nickName">
                  <span v-show="errors.has('nickName')" class="text-danger">{{ errors.first('nickName') }}</span>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label>Card Number</label>
                  <input v-validate="'required'" class="form-control border-input" name="number" placeholder="Amount" v-model="newPaymentMethod.number">
                  <span v-show="errors.has('number')" class="text-danger">{{ errors.first('number') }}</span>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>Expiry</label>
                  <input v-validate="'required'" class="form-control border-input" name="expiry" placeholder="Amount" v-model="newPaymentMethod.expiry">
                  <span v-show="errors.has('expiry')" class="text-danger">{{ errors.first('expiry') }}</span>

                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label>CVV</label>
                  <input v-validate="'required'" class="form-control border-input" name="cvc" placeholder="Amount" v-model="newPaymentMethod.cvc">
                  <span v-show="errors.has('cvc')" class="text-danger">{{ errors.first('cvc') }}</span>

                </div>
              </div>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click.prevent="addPaymentMethod">Add Payment Method</button>
          </div>

        </form>
        </div>
      </div>
    </div>
    <!-- end add Account modal -->

  </div>
</template>
<script>
  import Card from 'card'
  import $ from 'jquery'
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        newPaymentMethod: {
          name: '',
          account_no: '',
          card_number: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'paymentMethods'
      ])
    },
    mounted () {
      this.newPaymentMethod.name = this.$store.getters.currentUser.name

      // eslint-disable-next-line
      var card = new Card({
        form: 'form[name="addPaymentMethodForm"]',
        container: '.card-wrapper',
        formSelectors: {
          numberInput: 'input[name="number"]',
          expiryInput: 'input[name="expiry"]',
          cvcInput: 'input[name="cvc"]',
          nameInput: 'input[name="name"]'
        },
        messages: {
          validDate: 'valid\ndate', // optional - default 'valid\nthru'
          monthYear: 'mm/yyyy' // optional - default 'month/year'
        },
        // Default placeholders for rendered fields - optional
        placeholders: {
          number: '•••• •••• •••• ••••',
          name: 'Full Name',
          expiry: '••/••',
          cvc: '•••'
        },
        // if true, will log helpful messages for setting up Card
        debug: true // optional - default false
      })
    },
    methods: {
      addPaymentMethod () {
        let self = this

        this.$validator.validateAll()
        .then((isValidated) => {
          if (isValidated) {
            self.$store.dispatch('addPaymentMethod', self.newPaymentMethod).then((res) => {
              $('#addAccountModal').modal('hide')
              self.$notify('Added new Payment Method', 'ti-bank')
            }).catch(() => {
              self.$notify('Error in adding Payment Method', 'ti-bank', 'danger')
            })
          }
        })
      },
      deletePaymentMethod (paymentMethodId) {
        let self = this

        if (confirm('Are you sure you want to delete ?')) {
          this.$store.dispatch('deletePaymentMethod', {id: paymentMethodId}).then((res) => {
            self.$notify('Payment Method deleted', 'ti-bank')
          }).catch(() => {
            self.$notify('Error in deleting Payment Method', 'ti-bank', 'danger')
          })
        }
      }
    }
  }

</script>
<style>

</style>
