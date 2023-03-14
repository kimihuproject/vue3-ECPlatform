<template>
  <div
    class="modal fade"
    id="adminOrderModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="adminOrderModal"
    ref="modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header bg-warning bg-opacity-75">
          <h5 class="modal-title" id="modalLabel">編輯訂單</h5>
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
                <li class="my-3">訂單編號：{{ orderSelected.id }}</li>
                <li class="my-3">成立時間：{{ orderSelected.orderDate }}</li>
                <li class="my-3">訂單金額：{{ orderSelected.total }}</li>
                <li class="my-3">付款狀態：{{ orderSelected.is_paid ? '已付款' : '未付款' }}</li>
                <li v-if="orderSelected.is_paid" class="my-3">
                  付款時間：{{ orderSelected.paidDate }}
                </li>
                <li class="d-flex my-3">
                  <label for="order-state" class="form-label">訂單狀態：</label>
                  <select
                    id="order-state"
                    class="form-select w-50"
                    aria-label="select order-state"
                    v-model="orderSelected.state"
                  >
                    <option v-for="item in orderState" :key="item" :value="item">
                      {{ item }}
                    </option>
                  </select>
                </li>
                <li class="my-3 d-flex">
                  出貨狀態：
                  <div class="form-check">
                    <input
                      id="is_delivery"
                      v-model="orderSelected.isDelivery"
                      class="form-check-input"
                      type="checkbox"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="is_delivery">是否出貨</label>
                  </div>
                </li>
              </ul>
            </div>
            <hr />
            <div class="row">
              <div class="col-6">
                <h6>訂購者資訊</h6>
                <div class="card">
                  <div class="card-body">
                    <table class="table align-middle">
                      <tbody>
                        <tr>
                          <th scope="row">姓名</th>
                          <td>{{ orderSelected.user.name }}</td>
                        </tr>
                        <tr>
                          <th scope="row">Email</th>
                          <td>{{ orderSelected.user.email }}</td>
                        </tr>
                        <tr>
                          <th scope="row">電話</th>
                          <td>{{ orderSelected.user.tel }}</td>
                        </tr>
                        <tr>
                          <th scope="row">地址</th>
                          <td>{{ orderSelected.user.address }}</td>
                        </tr>
                        <tr>
                          <th scope="row">備註</th>
                          <td>
                            {{ orderSelected.user.message ? orderSelected.user.message : '無備註' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <h6>訂單商品明細</h6>
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
                          v-for="productItem in orderSelected.productsData"
                          :key="'orderProducts' + productItem.id"
                        >
                          <td>{{ productItem.product.title }}</td>
                          <td>{{ productItem.qty }}</td>
                          <td>{{ productItem.total }}</td>
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
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消編輯</button>
          <button type="button" class="btn btn-warning" @click="saveOrder(orderSelected.id)">
            儲存變更
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Modal from 'bootstrap/js/dist/modal'
export default {
  props: ['orderSelected', 'saveOrder', 'orderState'],
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
