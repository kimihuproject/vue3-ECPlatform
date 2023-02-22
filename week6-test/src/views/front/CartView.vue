<template>
  <div class="main">
    <div class="row">
      <div class="col-6 p-3">
        <h4>我的菜籃車</h4>
        <div class="card my-4">
          <!-- 購物車初始防呆：無產品 -->
          <div
            class="position-absolute text-white d-flex align-items-center justify-content-center active"
            style="
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              background-color: rgba(0, 0, 0, 0.65);
              z-index: 100;
            "
            v-if="!cartData.length"
          >
            請先選購商品
          </div>
          <!-- 購物車清單 -->
          <div class="card-body">
            <table class="table text-center">
              <thead>
                <tr>
                  <th width="100">品名</th>
                  <th width="50">單價</th>
                  <th width="100">數量</th>
                  <th width="70">小計</th>
                  <th width="20"></th>
                  <th width="20"></th>
                </tr>
              </thead>
              <tbody v-if="cartData.length > 0" class="align-middle">
                <tr v-for="item in cartData" :key="'cartItem' + item.id">
                  <th class="fw-light">{{ item.product.title }}</th>
                  <th class="fw-light">{{ item.product.price }}</th>
                  <th class="fw-light">
                    <input
                      id="qty"
                      v-model.number="item.qty"
                      type="number"
                      min="1"
                      max="10"
                      class="form-control"
                      @change="adjustCartItem(item)"
                      :disabled="loadingItem === item.product.id || isCheckout"
                    />
                  </th>
                  <th class="fw-light">{{ item.total }}</th>
                  <th class="px-0">
                    <button
                      type="button "
                      class="btn btn-sm px-1"
                      @click="getProductInfo(item.product.id)"
                      :disabled="isCheckout"
                    >
                      <i class="fa-solid fa-eye fw-light text-secondary"></i>
                    </button>
                  </th>
                  <th class="px-0">
                    <button
                      type="button"
                      class="btn btn-sm px-1 m-0"
                      @click="delCartItem(item)"
                      :disabled="isCheckout"
                    >
                      <i
                        class="fa-regular fa-trash-can text-danger fw-light"
                      ></i>
                    </button>
                  </th>
                </tr>
              </tbody>
            </table>
            <div v-if="cartData.length > 0">
              <p class="text-end">
                總金額： NT$
                <span class="fw-bold">{{ cartTotalPrice }} </span>元
              </p>
              <div class="d-flex gap-2 mt-3">
                <button
                  class="btn btn-outline-secondary w-100"
                  type="button"
                  @click="delCartAll"
                  :disabled="isCheckout"
                >
                  刪除所有品項
                </button>
                <button
                  class="btn btn-warning w-100"
                  type="button"
                  @click="toggleCartState('send')"
                  :disabled="isCheckout"
                >
                  前往結帳
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 p-3" v-if="isCheckout">
        <h4>訂購者資訊</h4>
        <div class="card my-3">
          <!-- 表單 -->
          <div class="card-body">
            <v-form v-slot="{ errors }" @submit="sendOrder(orderFormData)">
              <div class="mb-3">
                <label for="name" class="form-label">姓名：</label>
                <v-field
                  id="name"
                  name="姓名"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['姓名'] }"
                  placeholder="請輸入姓名"
                  rules="required"
                  v-model="orderFormData.user.name"
                ></v-field>
                <error-message
                  name="姓名"
                  class="invalid-feedback"
                ></error-message>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">E-mail：</label>
                <v-field
                  id="email"
                  name="email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors['email'] }"
                  placeholder="請輸入Email"
                  rules="required|email"
                  v-model="orderFormData.user.email"
                ></v-field>
                <error-message
                  name="email"
                  class="invalid-feedback"
                ></error-message>
              </div>
              <div class="mb-3">
                <label for="tel" class="form-label">電話：</label>
                <v-field
                  id="tel"
                  name="電話"
                  type="tel"
                  class="form-control"
                  :class="{ 'is-invalid': errors['電話'] }"
                  placeholder="請輸入電話"
                  rules="numeric|required|min:8|max:10"
                  v-model="orderFormData.user.tel"
                ></v-field>
                <error-message
                  name="電話"
                  class="invalid-feedback"
                ></error-message>
              </div>
              <div class="mb-3">
                <label for="address" class="form-label">收件地址：</label>
                <v-field
                  id="address"
                  name="收件地址"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors['收件地址'] }"
                  placeholder="請輸入收件地址"
                  rules="required"
                  v-model="orderFormData.user.address"
                ></v-field>
                <error-message
                  name="收件地址"
                  class="invalid-feedback"
                ></error-message>
              </div>
              <div class="mb-3">
                <label for="message" class="form-label">備註：</label>
                <textarea
                  id="message"
                  type="text"
                  placeholder="請輸入備註"
                  class="form-control"
                  cols="10"
                  rows="5"
                  v-model="orderFormData.user.message"
                >
                </textarea>
              </div>
              <div class="d-flex gap-2 mt-3">
                <button
                  class="btn btn-outline-secondary w-100"
                  type="button"
                  @click="toggleCartState('cancel')"
                >
                  取消結帳
                </button>
                <button
                  class="btn btn-warning w-100"
                  type="submit"
                  :disabled="isLoading"
                >
                  送出訂單
                </button>
              </div>
            </v-form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <UserProductModal
    ref="userProductModal"
    :product-Selected="productSelected"
  ></UserProductModal>
  <OrderInfoModal
    ref="orderInfoModal"
    :order-Data="orderData"
    :pay-Order="payOrder"
  ></OrderInfoModal>
</template>
<script>
// 自定義元件
import UserProductModal from '../../components/UserProductModal.vue'
import OrderInfoModal from '../../components/OrderInfoModal.vue'
// 環境變數
const { VITE_API_URL, VITE_API_PATH } = import.meta.env

// api
const cartUrl = `${VITE_API_URL}/api/${VITE_API_PATH}/cart`
const productUrl = `${VITE_API_URL}/api/${VITE_API_PATH}/product`
const orderUrl = `${VITE_API_URL}/api/${VITE_API_PATH}/order`
const payUrl = `${VITE_API_URL}/api/${VITE_API_PATH}/pay`

export default {
  data () {
    return {
      // product
      productSelected: '',
      // loading
      loadingItem: '',
      isLoading: false,
      // cart
      cartData: [],
      cartTotalPrice: 0,
      isCheckout: false,
      // order
      orderFormData: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      orderData: {
        user: ''
      }
    }
  },
  methods: {
    getCartData () {
      this.cartTotalPrice = 0 // 清空
      this.$http
        .get(cartUrl)
        .then((res) => {
          this.isLoading = false
          this.cartData = res.data.data.carts
          this.cartData.forEach((item) => {
            this.cartTotalPrice += item.total
          })
        })
        .catch((err) => alert(err.response.data.message))
    },
    getProductInfo (id) {
      this.isLoading = true
      this.$http
        .get(`${productUrl}/${id}`)
        .then((res) => {
          this.productSelected = res.data.product
          this.isLoading = false
          this.$refs.userProductModal.openModal()
        })
        .catch((err) => alert(err.response.data.message))
    },
    checkCartItemQty (id) {
      // 防呆：超過預設數量10
      const itemSelectedIndex = this.cartData.findIndex(
        (item) => item.product.id === id
      )
      if (itemSelectedIndex < 0) return id // 車內無此商品，返回新增商品
      // 車內有商品，確認當前選購數量
      if (this.cartData[itemSelectedIndex].qty <= 10) {
        return id
      } else {
        alert('選購數量已超過上限，若有大量採購需求請另洽')
      }
    },
    adjustCartItem (item) {
      // 限制訂購數量
      const productId = this.checkCartItemQty(item.product.id)
      if (!productId) return

      const cartProduct = {
        product_id: productId,
        qty: item.qty
      }
      this.loadingItem = productId
      this.isLoading = true

      this.$http
        .put(`${cartUrl}/${item.id}`, { data: cartProduct })
        .then((res) => {
          alert(res.data.message)
          this.loadingItem = '' // 清空
          this.getCartData() // 重新取得購物車資料
        })
        .catch((err) => alert(err.message))
    },
    delCartItem (cartItem) {
      this.isLoading = true
      this.$http
        .delete(`${cartUrl}/${cartItem.id}`)
        .then((res) => {
          alert(res.data.message)
          this.getCartData()
        })
        .catch((err) => alert(err.message))
    },
    delCartAll () {
      this.isLoading = true
      const delAllUrl = `${cartUrl}s`
      this.$http
        .delete(delAllUrl)
        .then((res) => {
          alert(res.data.message)
          this.getCartData()
        })
        .catch((err) => alert(err.message))
    },
    toggleCartState (state) {
      if (state === 'send') {
        return (this.isCheckout = true)
      } else if (state === 'cancel') {
        this.clickOrderFormData()
        this.isCheckout = false
      }
    },
    clickOrderFormData () {
      // 清空前次暫存資料
      this.orderFormData.message = ''
      Object.keys(this.orderFormData.user).forEach((key) => {
        this.orderFormData.user[key] = ''
      })
    },
    sendOrder (data) {
      this.isLoading = true
      this.$http
        .post(orderUrl, { data })
        .then((res) => {
          this.isLoading = false
          alert(res.data.message)
          // 清空頁面暫存購物車資料
          this.cartData = []
          this.getCartData()
          // 清空頁面暫存訂單資料
          this.clickOrderFormData()
          this.isCheckout = false
          this.isLoading = true
          this.getOrderInfo(res.data.orderId)
        })
        .catch((err) => alert(err.message))
    },
    getOrderInfo (id) {
      this.$http
        .get(`${orderUrl}/${id}`)
        .then((res) => {
          this.isLoading = false
          // 時間戳轉碼
          const timeStamp = new Date(res.data.order.create_at * 1000)
          const orderDate = timeStamp.toLocaleString().split(' ')[0]
          const productsData = []
          // 訂單中產品資料轉陣列
          Object.keys(res.data.order.products).forEach((key) => {
            productsData.push(res.data.order.products[key])
          })
          this.orderData = {
            ...res.data.order,
            orderDate,
            productsData
          }
          this.$refs.orderInfoModal.openModal()
        })
        .catch((err) => alert(err.message))
    },
    payOrder (id) {
      this.isLoading = true
      this.$http
        .post(`${payUrl}/${id}`)
        .then((res) => {
          this.isLoading = false
          alert(res.data.message)
          this.getOrderInfo(id)
        })
        .catch((err) => alert(err.response.data.message))
    }
  },
  components: {
    UserProductModal,
    OrderInfoModal
  },
  mounted () {
    this.getCartData()
  }
}
</script>
