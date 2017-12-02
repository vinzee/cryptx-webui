<template>
  <div>
    <!--Stats cards-->
    <div class="row">
      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div class="icon-big text-center icon-success" slot="header">
            <i class="ti-wallet"></i>
          </div>
          <div class="numbers" slot="content">
            <p style="font-size: 15px">Virtual Wallet</p>
            ${{virtualWalletBalance}}
          </div>
          <div slot="footer" class="stats"><i class="ti-reload"></i> Updated now
          </div>
        </stats-card>
      </div>

      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div slot="header" class="icon-big text-center icon-warning">
            <i class="ti-briefcase"></i>
          </div>
          <div slot="content" class="numbers">
            <p style="font-size: 15px;">Net Worth</p>
            ${{portfolioNetWorth}}
          </div>
          <div slot="footer" class="stats"><i class="ti-reload"></i> Updated now
          </div>
        </stats-card>
      </div>
      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div slot="header" class="icon-big text-center icon-info"><i class="ti-stats-up"></i></div>
          <div slot="content" class="numbers">
            <p style="font-size: 15px;">Top Currency</p>
            {{topCurrency.name}}
          </div>
          <div slot="footer" class="stats"><i class="ti-money"></i> {{topCurrency.price_usd}}
          </div>
        </stats-card>
      </div>
      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div slot="header" class="icon-big text-center icon-danger"><i class="ti-stats-down"></i></div>
          <div slot="content" class="numbers">
            <p style="font-size: 15px;">Worst Currency</p>
            {{worstCurrency.name}}
          </div>
          <div slot="footer" class="stats"><i class="ti-money"></i> {{worstCurrency.price_usd}}
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">

      <div class="col-xs-12">
        <chart-card :chart-data="userPerformanceChartData" :chart-options="userPerformanceChartOptions">
          <h4 class="title" slot="title">Portfolio</h4>
          <span slot="subTitle">Performance from beggining of time</span>
          <span slot="footer">
            <i class="ti-reload"></i> Updated 3 minutes ago</span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Open
            <i class="fa fa-circle text-danger"></i> Click
            <i class="fa fa-circle text-warning"></i> Click Second Time
          </div>
        </chart-card>
      </div>

      <div class="col-md-12 col-xs-12">
        <chart-card :chart-data="currentPricesChartData" :chart-options="currentPricesChartOptions">
          <h4 class="title" slot="title">Current Prices</h4>
          <span slot="subTitle">USD</span>
          <span slot="footer">
            <i class="ti-check"></i> Data from <a target="_blank" href="http://www.cryptocompare.com">cryptocompare.com</a></span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Bitcoin
            <i class="fa fa-circle text-warning"></i> Litecoin
          </div>
        </chart-card>
      </div>

    </div>

    <div class="row">
      <div class="col-md-6 col-xs-12">
        <chart-card :chart-data="investmentsChartData" :chart-options="investmentsChartOptions" :chart-responsive-options="investmentsChartResponsiveOptions" chart-type="Pie">
          <h4 class="title" slot="title">Investments</h4>
          <span slot="subTitle">Investment split (USD)</span>
          <span slot="footer"><i class="ti-timer"></i> Last investment 2 days ago</span>
        </chart-card>
      </div>

      <div class="col-md-6 col-xs-12">
        <div class="card">
          <paper-table title="Investments" sub-title="" :data="investmentsTableData" :columns="investmentsTableColumns" :columnNames="investmentsTableColumnNames"></paper-table>

          <div class="row">
            <div class="col-xs-4 col-xs-offset-4 text-center">
              <button type="button" class="btn btn-block btn-info btn-fill" data-toggle="modal" data-target="#buySellCurrencyModal">Buy / Sell</button>
              <br>
            </div>
          </div>

        </div> <!-- card -->
      </div>

    </div> <!-- row -->

    <!-- sell currency modal -->
    <div class="modal" id="buySellCurrencyModal" tabindex="-1" role="dialog" aria-labelledby="buySellCurrencyModal" aria-hidden="true" data-backdrop="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.stop.prevent="buySellCurrencySubmit">

          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" id="buySellCurrencyModalLabel">Buy / Sell Currency</h4>
          </div>

          <div class="modal-body">

              <div class="row">
                <div class="col-md-4 col-md-offset-2">

                  <div class="form-group">
                    <label>Currency</label>
                    <select v-validate="'required'" class="form-control" v-model="buySellCurrency.currency" name="currency">
                      <option v-for="investment in investments" :value="investment.currency">{{investment.currency}}</option>
                    </select>
                    <span v-show="errors.has('currency')" class="text-danger">{{ errors.first('currency') }}</span>
                  </div>

                  <div class="form-group">
                    <label class="text-info">${{selectedCurrencyPrice}} per coin</label>
                  </div>

                  <div class="form-group">
                    <label>Number of Coins</label>
                    <input v-validate="'required'" class="form-control border-input" type="number" name="amount" label="Amount" placeholder="Amount" v-model="buySellCurrency.amount" min="0.001" step="0.001">
                    <span v-show="errors.has('amount')" class="text-danger">{{ errors.first('amount') }}</span>
                  </div>

                </div>

                <div class="col-md-4">

                  <div class="form-group">
                    <label>Total ($)</label>
                    <input class="form-control border-input" type="number" label="Amount" placeholder="Amount" v-model="buySellCurrency.value" min="0.001" step="0.001" disabled="disabled">
                  </div>

                  <div class="form-group">
                    <label class="text-success">Virtual Wallet Balance: ${{virtualWalletBalance}}</label>
                  </div>

                  <div class="btn-group" data-toggle="buttons">
                    <label for="buyCurrency" class="btn btn-info active" @click="changeTransactionType('buy')">
                      <input type="radio" id="buyCurrency" value="buy" v-model="buySellCurrency.type" autocomplete="off" checked>
                      Buy
                    </label> &nbsp;

                    <label for="sellCurrency" class="btn btn-info" @click="changeTransactionType('sell')">
                      <input type="radio" id="sellCurrency" value="sell" v-model="buySellCurrency.type" autocomplete="off">
                      Sell
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
    <!-- end sell currency modal -->

  </div>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
  import PaperTable from 'components/UIComponents/PaperTable.vue'
  import _ from 'lodash'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      StatsCard,
      ChartCard,
      PaperTable
    },
    /**
     * Chart data used to render stats, charts. Should be replaced with server data
     */
    data () {
      return {
        buySellCurrency: {
          amount: 0,
          currency: 'Bitcoin',
          type: 'buy'
        },
        userPerformanceChartOptions: {
          low: 0,
          high: 1000,
          showArea: true,
          height: '245px',
          axisX: {
            showGrid: false
          },
          lineSmooth: this.$Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false
        },
        currentPricesChartOptions: {
          // seriesBarDistance: 10,
          // axisX: {
          //   showGrid: false
          // },
          height: '245px',
          showArea: true,
          showLine: false,
          showPoint: false,
          fullWidth: true,
          axisX: {
            showLabel: false,
            showGrid: false
          }
        },
        investmentsChartOptions: {
          labelInterpolationFnc (value) {
            return value
          }
          // plugins: [
          //   this.$Chartist.plugins.legend()
          // ]
        },
        investmentsChartResponsiveOptions: [
          ['screen and (min-width: 640px)', {
            chartPadding: 30,
            labelInterpolationFnc: function (value) {
              return value
            }
          }],
          ['screen and (min-width: 1024px)', {
            labelPosition: 'outside',
            labelOffset: 20,
            chartPadding: 30
          }]
        ],
        investmentsTableColumns: ['currency', 'amount', 'price', 'value'],
        investmentsTableColumnNames: ['Currency', 'Amount', 'Price', 'Value'],
        currentPricesTableColumns: ['Currency', 'Price']
      }
    },
    mounted () {
      this.buySellCurrency.amount = 0.1
    },
    watch: {
      'buySellCurrency.amount': function () {
        this.buySellCurrency.value = _.round(this.investmentsMap[this.buySellCurrency.currency].price * this.buySellCurrency.amount, 3)
      }
    },
    computed: {
      selectedCurrencyPrice () {
        if (this.buySellCurrency.currency === null || this.buySellCurrency.currency === '') {
          return 0
        } else {
          return this.investmentsMap[this.buySellCurrency.currency].price
        }
      },
      investmentsChartData () {
        let data = {
          labels: [],
          series: []
        }

        _.each(this.investments, function (investment) {
          if (investment.value === undefined) {
            console.error('ERROR in Overview: investment value not calculated: ', investment)
            return data
          }

          if (investment.amount > 0) {
            data.labels.push(investment.currency)
            data.series.push(investment.value)
          }
        })

        data.labels.push('Virtual Wallet')
        data.series.push(this.virtualWalletBalance)

        console.log('investmentsChartData: ', data)

        return data
      },
      investmentsTableData () {
        let data = []

        _.each(this.investments, function (investment) {
          data.push({
            currency: investment.currency,
            amount: investment.amount,
            price: '$' + investment.price,
            value: '$' + investment.value
          })
        })

        return data
      },
      currentPricesTableData () {
        let temp = _.map(this.currencyData, function (currency) {
          return {
            currency: currency.name,
            price: currency.price_usd
          }
        })

        return temp
      },
      currentPricesChartData () {
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          series: this.currencyPriceSeries
        }
      },
      userPerformanceChartData () {
        return {
          labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
          series: [
            [287, 385, 490, 562, 594, 626, 698, 895, 952],
            [67, 152, 193, 240, 387, 435, 535, 642, 744],
            [23, 113, 67, 108, 190, 239, 307, 410, 410]
          ]
        }
      },
      ...mapGetters([
        'virtualWalletBalance',
        'portfolioNetWorth',
        'investments',
        'currencyData',
        'currencyDataMap',
        'investmentsMap',
        'topCurrency',
        'worstCurrency',
        'currencyPriceSeries'
      ])
    },
    methods: {
      buySellCurrencySubmit () {
        console.log('buySellCurrency: ', this.buySellCurrency)
        let self = this

        if (this.buySellCurrency.type === 'buy' && this.buySellCurrency.value > this.virtualWalletBalance) {
          self.$notify('Insufficient balance in Virtual Wallet', 'ti-money', 'danger')
          return
        }

        this.$store.dispatch('buySellCurrency', this.buySellCurrency).then((res) => {
          self.$notify('Currency ' + this.buySellCurrency.type + ' successfull', 'ti-money')
        }).catch(() => {
          self.$notify('Error in currency ' + this.buySellCurrency.type, 'ti-money', 'danger')
        })
      },
      changeTransactionType (type) {
        this.buySellCurrency.type = type
      }
    }
  }

</script>
