<template>
  <div class="row justify-content-between">
    <!-- 左側 -->
    <div class="col-md-8 m-0">
      <h4>世界菜譜</h4>
      <!-- 產品列表 -->
      <div class="row">
        <div
          class="col-6 my-3"
          v-for="product in productsData"
          :key="'productList' + product.id"
        >
          <div class="card">
            <img
              :src="product.imageUrl"
              class="card-img card-img-top rounded img-fluid object-fit-cover"
              :alt="product.title"
              style="height: 300px"
            />
            <div class="card-body">
              <h5 class="card-title">{{ product.title }}</h5>
              <p class="card-text">
                <span
                  class="badge bg-secondary bg-opacity-75 text-body-emphasis me-2"
                  >{{ product.category }}</span
                >
                <span
                  class="badge bg-secondary bg-opacity-75 text-body-emphasis me-2"
                  >{{ product.areaCategory }}</span
                >
                <span
                  class="badge bg-secondary bg-opacity-75 text-body-emphasis me-2"
                  >{{ product.ingredientCategory }}</span
                >
              </p>
              <p class="card-text">
                <span class="text-decoration-line-through fw-light me-3"
                  >原價：{{ product.origin_price }}元</span
                >
                <span class="fw-semibold">售價：{{ product.price }}元</span>
              </p>
            </div>
            <div class="card-footer">
              <div class="d-flex gap-1">
                <RouterLink
                  :to="`product/${product.id}`"
                  type="button"
                  class="btn btn-sm btn-sm btn-outline-secondary w-100"
                  >查看產品細節
                </RouterLink>
                <button
                  type="button"
                  class="btn btn-sm btn-sm btn-outline-warning w-100"
                  @click="addToCart(product.id)"
                >
                  加入菜籃車
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3 m-0">
      <h4 class="text-muted">尋找美味單</h4>
      <span class="text-muted">分類選單，先不做</span>
    </div>
  </div>
  <!-- 元件：分頁 -->
  <Pagination
    ref="pagination"
    :pages="page"
    :get-per-product="getProductsData"
    @change-page="getProductsData"
  >
  </Pagination>
</template>

<script>
import { RouterLink } from 'vue-router'
// 自定義元件
import Pagination from '../../components/PaginationView.vue'
// 環境變數
const { VITE_API_URL, VITE_API_PATH } = import.meta.env

// api
const productsUrl = `${VITE_API_URL}/api/${VITE_API_PATH}/products`
const cartUrl = `${VITE_API_URL}/api/${VITE_API_PATH}/cart`

export default {
  data () {
    return {
      // products
      productsData: [],
      productsNum: 0,
      page: {},
      productSelected: '',
      // cart
      cartData: [],
      cartTotalPrice: 0,
      isLoading: false,
      isCheckout: false
    }
  },
  methods: {
    getProductsData (page = 1) {
      this.isLoading = false
      const productsPaginationUrl = `${productsUrl}/?page=${page}`
      this.$http
        .get(productsPaginationUrl)
        .then((res) => {
          this.productsData = res.data.products
          this.productsNum = this.productsData.length
          this.page = res.data.pagination
        })
        .catch((err) => alert(err.message))
    },
    getCartData () {
      this.cartTotalPrice = 0
      this.$http
        .get(cartUrl)
        .then((res) => {
          this.isLoading = false
          this.cartData = res.data.data.carts
          this.cartData.forEach((item) => {
            this.cartTotalPrice += item.total
          })
        })
        .catch((err) => alert(err.message))
    },
    addToCart (id) {
      // 確認並限制車內既有商品訂購數量
      id = this.checkCartItemQty(id)
      if (!id) return
      const cartProduct = {
        product_id: id,
        qty: 1
      }
      this.isLoading = true
      this.$http
        .post(cartUrl, { data: cartProduct })
        .then((res) => {
          alert(res.data.message)
          this.getCartData() // 重新取得購物車資料
        })
        .catch((err) => alert(err.message))
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
    }
  },
  components: {
    Pagination,
    RouterLink
  },
  mounted () {
    this.getProductsData()
    this.getCartData()
  }
}
</script>
