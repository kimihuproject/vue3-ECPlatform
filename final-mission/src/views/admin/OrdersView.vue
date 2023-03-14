<template>
  <h1 class="h3">訂單管理</h1>
  <div v-if="haveOrdersData">
    <div class="text-end my-4">
      <button type="button" class="btn btn-sm btn-secondary" @click="openManageModal('delAll')">
        刪除所有訂單
      </button>
    </div>
    <table class="table text-center">
      <thead>
        <tr>
          <th>序號</th>
          <th>讀取</th>
          <th>日期</th>
          <th>編號</th>
          <th>金額</th>
          <th>付款</th>
          <th>進度</th>
          <th>出貨</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-for="order in ordersData" :key="order.id" class="align-middle fs-6">
        <tr :class="{ 'text-secondary': order.state === orderState[3] }">
          <td>{{ order.num }}</td>
          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`paidSwitch${order.id}`"
                v-model="order.isRead"
                @change="toggleOrderIsRead(order)"
              />
              <label class="form-check-label" :for="`paidSwitch${order.id}`">
                <span v-if="order.isRead">已讀取</span>
                <span v-else class="text-danger">未讀取</span>
              </label>
            </div>
          </td>
          <td>{{ order.orderDate }}</td>
          <td>{{ order.id }}</td>
          <td>{{ order.total }}</td>
          <td>{{ order.is_paid ? '已付款' : '未付款' }}</td>
          <td :class="{ 'text-danger': order.state === orderState[0] }">
            {{ order.state }}
          </td>
          <td>{{ order.isDelivery ? '已出貨' : '備貨中' }}</td>
          <td>
            <button type="button " class="btn btn-sm px-1" @click="openManageModal('edit', order)">
              <i class="bi bi-pen text-secondary fw-light"></i>
            </button>
            <button type="button " class="btn btn-sm px-1" @click="openManageModal('del', order)">
              <i class="bi bi-trash3 text-danger fw-light"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      ref="pagination"
      :pages="pagination"
      :get-per-page-data="getOrdersData"
    ></Pagination>
  </div>
  <div v-else-if="!haveOrdersData">
    <p>目前未有任何訂單</p>
  </div>
  <DelOrderModal
    ref="delOrderModal"
    :is-Del-All-Order="isDelAllOrder"
    :order-Selected="orderSelected"
    :del-Order="delOrder"
    :del-All-Orders="delAllOrders"
  ></DelOrderModal>
  <AdminOrderModal
    ref="editOrderModal"
    :order-Selected="orderSelected"
    :save-Order="saveOrder"
    :order-State="orderState"
  ></AdminOrderModal>
</template>

<script>
// component
import Pagination from '@/components/PaginationView.vue'
import DelOrderModal from '@/components/AdminDelOrderModal.vue'
import AdminOrderModal from '@/components/AdminOrderModal.vue'

// api
import { ordersPaginationUrl, orderUrl, ordersAllUrl } from '@/api/admin-api.js'

// data
import { orderFormData } from '@/data/adminFormData.js'

export default {
  data() {
    return {
      ordersData: [],
      haveOrdersData: false,
      pagination: {},
      currentPage: 1,
      orderState: [],
      orderSelected: {
        user: ''
      },
      isDelAllOrder: false
    }
  },
  methods: {
    getOrdersData(currentPage = 1) {
      this.currentPage = currentPage
      this.$http
        .get(ordersPaginationUrl(currentPage))
        .then((res) => {
          this.ordersData = res.data.orders
          this.haveOrdersData = this.ordersData.length > 0 ? true : false
          if (!this.haveOrdersData) return
          this.pagination = res.data.pagination
          this.ordersData.forEach((item) => {
            // 時間轉換
            item.orderDate = this.transformTime(item.create_at)
            if (item.paid_date) {
              item.paidDate = this.transformTime(item.paid_date)
            }
            // 商品資料轉陣列
            const productsData = []
            Object.keys(item.products).forEach((key) => {
              productsData.push(item.products[key])
            })
            item.productsData = productsData
            // 預設訂單狀態
            if (!item.state) {
              item.state = this.orderState[0]
            }
            if (!item.isDelivery) {
              item.isDelivery = false
            }
            if (!item.isRead) {
              item.isRead = false
            }
          })
        })
        .catch((err) => alert(err))
    },
    transformTime(originalTime) {
      const timeStamp = new Date(originalTime * 1000)
      return timeStamp.toLocaleString().split(' ')[0]
    },
    toggleOrderIsRead(order) {
      this.orderSelected = order
      this.$http
        .put(orderUrl(order.id), { data: this.orderSelected })
        .then((res) => {
          this.getOrdersData(this.currentPage)
        })
        .catch((err) => alert(err.response.data.message))
    },
    openManageModal(state, data) {
      if (state === 'edit') {
        this.orderSelected = { ...data }
        if (!this.orderSelected.isRead) {
          this.orderSelected.isRead = true
          this.toggleOrderIsRead(this.orderSelected)
        }
        this.$refs.editOrderModal.openModal()
      } else if (state === 'del') {
        this.isDelAllOrder = false
        this.orderSelected = { ...data }
        this.$refs.delOrderModal.openModal()
      } else if (state === 'delAll') {
        this.isDelAllOrder = true
        this.$refs.delOrderModal.openModal()
      }
    },
    saveOrder(id) {
      this.$http
        .put(orderUrl(id), { data: this.orderSelected })
        .then((res) => {
          alert(res.data.message)
          this.$refs.editOrderModal.hideModal()
          this.getOrdersData(this.currentPage)
        })
        .catch((err) => alert(err.response.data.message))
    },
    delOrder(id) {
      this.$http
        .delete(orderUrl(id))
        .then((res) => {
          alert(res.data.message)
          this.$refs.delOrderModal.hideModal()
          this.getOrdersData(this.currentPage)
        })
        .catch((err) => alert(err.response.data.message))
    },
    delAllOrders() {
      this.$http
        .delete(ordersAllUrl)
        .then((res) => {
          alert(res.data.message)
          this.$refs.delOrderModal.hideModal()
          this.getOrdersData()
        })
        .catch((err) => alert(err.response.data.message))
    }
  },
  components: {
    Pagination,
    AdminOrderModal,
    DelOrderModal
  },

  mounted() {
    this.getOrdersData()
    this.orderState = orderFormData.orderState
  }
}
</script>
