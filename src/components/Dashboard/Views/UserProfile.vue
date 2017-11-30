<template>
    <div>
      <div class="row">

        <div class="col-lg-8 col-md-7">
          <edit-profile-form></edit-profile-form>
        </div>

        <div class="col-lg-4 col-md-5">
          <!-- <user-card></user-card> -->
          <stats-card>
            <div class="icon-big text-center icon-success" slot="header">
              <i class="ti-wallet"></i>
            </div>
            <div class="numbers" slot="content">
              <p style="font-size: 15px">Virtual Wallet</p>
              ${{virtualWalletBalance}}
            </div>
            <div class="stats" slot="footer">
              <button type="button" class="btn btn-sm btn-info btn-fill" data-toggle="modal" data-target="#depositRedeemModal">
                Deposit / Redeem
              </button>
            </div>
          </stats-card>

          <payment-methods-card></payment-methods-card>
        </div>
      </div>

      <!-- Deposit / Redeem money modal -->
      <div class="modal" id="depositRedeemModal" tabindex="-1" role="dialog" aria-labelledby="depositRedeemModal" aria-hidden="true" data-backdrop="false">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <form @submit.stop.prevent="depositRedeem">

            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 class="modal-title" id="myModalLabel">Deposit / Redeem Money</h4>
            </div>

            <div class="modal-body">

                <div class="row">
                  <div class="col-md-4 col-md-offset-4">

                    <div class="form-group">
                      <label>Amount ($)</label>
                      <input v-validate="'required'" class="form-control border-input" type="number" name="amount" label="Amount" placeholder="Amount" v-model="virtualWalletDepositRedeem.amount" min="10" step="10">
                      <span v-show="errors.has('amount')" class="text-danger">{{ errors.first('amount') }}</span>

                    </div>

                    <div class="form-group">
                      <label>Payment Method</label>
                      <select v-validate="'required'" class="form-control" v-model="virtualWalletDepositRedeem.bank_id" name="paymentMethod">
                        <option v-for="paymentMethod in paymentMethods" :value="paymentMethod.id">{{paymentMethod.name}}</option>
                      </select>
                      <span v-show="errors.has('paymentMethod')" class="text-danger">{{ errors.first('paymentMethod') }}</span>
                    </div>


                    <div class="form-group">
                      <input type="radio" id="depositCurrency" value="deposit" v-model="transactionType">
                      <label for="depositCurrency">Deposit</label> &nbsp;
                      <input type="radio" id="redeemCurrency" value="redeem" v-model="transactionType">
                      <label for="redeemCurrency">Redeem</label>
                      <br>
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
      <!-- end Deposit / Redeem money modal -->

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
        virtualWalletDepositRedeem: {
          amount: 100,
          bank_id: 1
        },
        transactionType: 'deposit'
      }
    },
    computed: {
      ...mapGetters([
        'virtualWalletBalance',
        'paymentMethods'
      ])
    },
    methods: {
      depositRedeem () {
        this.$validator.validateAll()
        .then((isValidated) => {
          if (isValidated) {
            let type = this.transactionType === 'deposit' ? 'virtualWalletDepositRedeem' : 'virtualWalletRedeem'

            this.$store.dispatch(type, {amount: this.virtualWalletDepositRedeem.amount}).then(() => {
              this.$notify('Added $' + this.virtualWalletDepositRedeem.amount + ' to virtual wallet from !', 'ti-money')
              $('#depositRedeemModal').modal('hide')
            }).catch(() => {
              this.$notify('Error in processing deposit/redeem to virtual wallet !', 'ti-money', 'danger')
            })
          }
        })
      }
    }
  }

</script>
<style>

</style>
