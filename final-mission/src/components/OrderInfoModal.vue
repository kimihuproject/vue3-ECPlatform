<template>
  <div
    ref="modal"
    class="modal fade"
    id="orderInfoModal"
    tabindex="-1"
    aria-labelledby="orderInfoModal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">訂單明細：{{ orderData.id }}</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row">
              <ul class="list-unstyled">
                <li>訂單編號：{{ orderData.id }}</li>
                <li>成立時間：{{ orderData.orderDate }}</li>
                <li>訂單金額：{{ orderData.total }}</li>
                <li>付款狀態：{{ orderData.is_paid ? '已付款' : '未付款' }}</li>
              </ul>
            </div>
            <div class="row my-3">
              <div class="col-md-6">
                <h6>訂購明細</h6>
                <div class="card">
                  <div class="card-body">
                    <table class="table align-middle">
                      <thead>
                        <tr>
                          <th>品名</th>
                          <th>數量</th>
                          <th>小計</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="cartItem in orderData.productsData"
                          :key="'orderProducts' + cartItem.id"
                        >
                          <td>{{ cartItem.product.title }}</td>
                          <td>{{ cartItem.qty }}</td>
                          <td>{{ cartItem.total }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="col-md-6 mf-3">
                <h6>訂購者資訊</h6>
                <div class="card">
                  <div class="card-body">
                    <table class="table align-middle">
                      <tbody>
                        <tr>
                          <th scope="row">姓名</th>
                          <td>{{ orderData.user.name }}</td>
                        </tr>
                        <tr>
                          <th scope="row">Email</th>
                          <td>{{ orderData.user.email }}</td>
                        </tr>
                        <tr>
                          <th scope="row">電話</th>
                          <td>{{ orderData.user.tel }}</td>
                        </tr>
                        <tr>
                          <th scope="row">地址</th>
                          <td>{{ orderData.user.address }}</td>
                        </tr>
                        <tr>
                          <th scope="row">備註</th>
                          <td>
                            {{ orderData.user.message ? orderData.user.message : '無備註' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">確認訂單</button>
          <button
            type="button"
            class="btn btn-warning"
            @click="payOrder(orderData.id)"
            :disabled="orderData.is_paid"
          >
            {{ orderData.is_paid ? '已完成付款' : '付款' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Modal from 'bootstrap/js/dist/modal'
export default {
  props: ['orderData', 'payOrder'],
  data() {
    return {
      modal: ''
    }
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: 'static'
    })
  },
  methods: {
    openModal() {
      this.modal.show()
    },
    hideModal() {
      this.modal.hide()
    }
  }
}
</script>
