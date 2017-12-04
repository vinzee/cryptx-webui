<template>
    <div>
      <div class="row">

        <div class="col-lg-8 col-md-7">
          <edit-profile-form></edit-profile-form>
        </div>

        <div class="col-lg-4 col-md-5">
          <stats-card>
            <div class="icon-big text-center icon-success" slot="header">
              <i class="ti-wallet"></i>
            </div>
            <div class="numbers" slot="content">
              <p style="font-size: 15px">Virtual Wallet</p>
              ${{virtualWalletAmount}}
            </div>
            <div class="stats" slot="footer">

              <button type="button" class="btn btn-sm btn-info btn-fill" data-toggle="modal" data-target="#depositWithdrawModal">
                Deposit / Withdraw
              </button>
            </div>
          </stats-card>

          <payment-methods-card></payment-methods-card>
        </div>
      </div>

      <!-- Deposit / Withdraw money modal -->
      <div class="modal" id="depositWithdrawModal" tabindex="-1" role="dialog" aria-labelledby="depositWithdrawModal" aria-hidden="true" data-backdrop="false">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <form @submit.stop.prevent="depositWithdrawSubmit">

            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 class="modal-title" id="myModalLabel">Deposit / Withdraw Money</h4>
            </div>

            <div class="modal-body">

                <div class="row">
                  <div class="col-md-4 col-md-offset-4">

                    <div class="form-group">
                      <label>Amount ($)</label>
                      <input v-validate="'required'" class="form-control border-input" type="number" name="amount" label="Amount" placeholder="Amount" v-model="depositWithdraw.amount" min="10" step="0.01">
                      <span v-show="errors.has('amount')" class="text-danger">{{ errors.first('amount') }}</span>

                    </div>

                    <div class="form-group">
                      <label>Payment Method</label>
                      <select v-validate="'required'" class="form-control" v-model="depositWithdraw.cardid" name="paymentMethod">
                        <option v-for="paymentMethod in paymentMethods" :value="paymentMethod.cardid">{{paymentMethod.nickName}}</option>
                      </select>
                      <span v-show="errors.has('paymentMethod')" class="text-danger">{{ errors.first('paymentMethod') }}</span>
                    </div>

                    <div class="btn-group" data-toggle="buttons">
                      <label for="depositCurrency" class="btn btn-info active" @click="changeTransactionType('deposit')">
                        Deposit
                        <input type="radio" id="depositCurrency" value="deposit" v-model="depositWithdraw.type" autocomplete="off" checked>
                      </label> &nbsp;

                      <label for="withdrawCurrency" class="btn btn-info" @click="changeTransactionType('withdraw')">
                        Withdraw
                        <input type="radio" id="withdrawCurrency" value="withdraw" v-model="depositWithdraw.type" autocomplete="off">
                      </label>
                    </div>

                  </div>
                </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Submit</button>
            </div>

            </form>
          </div>
        </div>
      </div>
      <!-- end Deposit / Withdraw money modal -->

    </div>
</template>
<script>
  import EditProfileForm from './UserProfile/EditProfileForm.vue'
  import UserCard from './UserProfile/UserCard.vue'
  import PaymentMethodsCard from './UserProfile/PaymentMethodsCard.vue'
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import $ from 'jquery'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      EditProfileForm,
      UserCard,
      PaymentMethodsCard,
      StatsCard
    },
    data () {
      return {
        depositWithdraw: {
          amount: 100,
          type: 'deposit'
        }
      }
    },
    computed: {
      ...mapGetters([
        'virtualWalletAmount',
        'paymentMethods'
      ])
    },
    methods: {
      depositWithdrawSubmit () {
        let self = this

        this.$validator.validateAll()
        .then((isValidated) => {
          if (isValidated) {
            if (self.depositWithdraw.type !== 'deposit' && self.depositWithdraw.type !== 'withdraw') {
              throw new Error('Invalid transaction type: ', self.depositWithdraw.type)
            } else if (self.depositWithdraw.type === 'withdraw' && self.depositWithdraw.amount > self.virtualWalletAmount) {
              self.$notify('Insufficient balance in Virtual Wallet', 'ti-money', 'danger')
              return
            }

            self.$store.dispatch('depositWithdraw', self.depositWithdraw).then(() => {
              self.$notify(self.depositWithdraw.type + ' $' + self.depositWithdraw.amount + ' to virtual wallet', 'ti-money')
              $('#depositWithdrawModal').modal('hide')
            }).catch((res) => {
              self.depositWithdraw.amount = 100
              self.$notify('Error in processing deposit/withdraw to virtual wallet !', 'ti-money', 'danger')
            })
          }
        })
      },
      changeTransactionType (type) {
        this.depositWithdraw.type = type
      }
    }
  }

</script>
<style>

</style>
