<template>
  <h2 class="h3">{{ product.title }}</h2>
  <div class="main">
    <div class="row">
      <div class="col-sm-8">
        <div class="row">
          <img
            :src="product.imageUrl"
            class="rounded img-fluid object-fit-cover"
            :alt="product.title"
            style="height: 60vh"
          />
        </div>
      </div>
      <div class="col-sm-4">
        <div
          class="d-flex flex-column justify-content-center"
          style="height: 60vh"
        >
          <div>
            <ul class="list-unstyled">
              <li>菜式風格：{{ product.category }}</li>
              <li>地域風味：{{ product.areaCategory }}</li>
              <li>食材主題：{{ product.ingredientCategory }}</li>
              <li>份量單位：{{ product.unit }}</li>
              <li>內容物：{{ product.content }}</li>
              <li class="text-decoration-line-through fw-light">
                原價：{{ product.origin_price }}元
              </li>
              <li>售價：{{ product.price }}元</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="my-3">
      <p>{{ product.description }}</p>
    </div>
    <template
      v-if="Array.isArray(product?.imagesUrl) && product?.imagesUrl.length"
    >
      <div
        class="row my-3"
        v-for="image in product.imagesUrl"
        :key="'side-image' + image"
      >
        <div class="col-sm-3 me-3">
          <img
            :src="image"
            class="rounded img-fluid object-fit-cover img-thumbnail"
            :alt="product.title"
            style="height: 40vh"
          />
        </div>
      </div>
    </template>
  </div>
  <div class="my-3 d-flex justify-content-end gap-1">
    <RouterLink
      to="/productsList"
      type="button"
      class="btn btn-outline-secondary btn-sm"
      >回產品列表
    </RouterLink>
    <button
      type="button"
      class="btn btn-outline-warning btn-sm"
      @click="addToCart(product.id)"
    >
      加入菜籃車
    </button>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
// 環境變數
const { VITE_API_URL, VITE_API_PATH } = import.meta.env
// api
const productUrl = `${VITE_API_URL}/api/${VITE_API_PATH}/product`
const cartUrl = `${VITE_API_URL}/api/${VITE_API_PATH}/cart`
export default {
  data () {
    return {
      product: {},
      // cart
      cartData: [],
      cartTotalPrice: 0,
      loadingItem: '',
      isLoading: false,
      isCheckout: false
    }
  },
  methods: {
    getProductInfo () {
      const { id } = this.$route.params // 注意，要用解構取值。
      this.$http
        .get(`${productUrl}/${id}`)
        .then((res) => {
          this.product = res.data.product
        })
        .catch((err) => alert(err.message))
    },
    getCartData () {
      this.cartTotalPrice = 0 // 清空
      this.$http
        .get(cartUrl)
        .then((res) => {
          this.isLoading = false
          this.cartData = res.data.data.carts
          this.cartData.forEach((item) => {
            this.cartTotalPrice += item.total
          }) // 重新計算
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
      this.loadingItem = id
      this.isLoading = true
      this.$http
        .post(cartUrl, { data: cartProduct })
        .then((res) => {
          alert(res.data.message)
          this.loadingItem = '' // 清空
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
    RouterLink
  },
  mounted () {
    this.getProductInfo()
    this.getCartData()
  }
}
</script>
