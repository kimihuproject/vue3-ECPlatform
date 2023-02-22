<template>
  <!-- 打開model的方式和直接套用BS5不同 -->
  <div class="text-end my-4">
    <button type="button" class="btn btn-warning" @click="openModal('add')">
      新增產品
    </button>
  </div>
  <table class="table text-center">
    <thead>
      <tr>
        <th width="10">序號</th>
        <th width="70">分類</th>
        <th width="120">產品名稱</th>
        <th width="120">售價</th>
        <th width="120">上架裝態</th>
        <th width="120">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(product, index) in productsData"
        :key="product.id"
        class="align-middle"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ product.category }}</td>
        <td>{{ product.title }}</td>
        <td>{{ product.price }}</td>
        <td :class="{ 'text-success': product.is_enabled }">
          {{ product.is_enabled ? '啟用' : '未啟用' }}
        </td>
        <td>
          <button
            type="button"
            class="btn btn-outline-primary btn-sm m-1"
            @click="openModal('edit', product)"
          >
            編輯
          </button>
          <button
            type=" button"
            class="btn btn-outline-danger btn-sm m-1"
            @click="openModal('delete', product)"
          >
            刪除
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <Pagination
    ref="pagination"
    :pages="page"
    :get-per-product="getAdminProductsData"
    @change-page="getAdminProductsData"
  >
  </Pagination>
  <AdminProductModal
    ref="adminProductModal"
    :product-Selected="productSelected"
    :product-is-new="productIsNew"
    :product-categories="productCategories"
    :add-side-images="addSideImages"
    :save-product-change="saveProductChange"
    :upload-image="uploadImage"
  >
  </AdminProductModal>
  <DelProductModal
    ref="delProductModal"
    :product-Selected="productSelected"
    :del-product="delProduct"
  ></DelProductModal>
</template>

<script>
// 自定義元件
import Pagination from '../../components/PaginationView.vue'
import AdminProductModal from '../../components/AdminProductModal.vue'
import DelProductModal from '../../components/DelProductModal.vue'

// 環境變數
const { VITE_API_URL, VITE_API_PATH } = import.meta.env

// api
const adminUrl = `${VITE_API_URL}api/${VITE_API_PATH}/admin` // 管理者url
const adminAllProductsUrl = `${adminUrl}/products` // 所有產品
const adminProductUrl = `${adminUrl}/product` // 單筆產品

export default {
  data () {
    return {
      productCategories: {
        mainCategories: [
          '主食',
          '主菜',
          '副菜',
          '前菜冷盤',
          '湯品',
          '鍋物',
          '甜點',
          '點心',
          '飲品',
          '漬物乾貨'
        ],
        areaCategories: ['臺灣', '亞洲', '歐洲', '美洲', '非洲', '大洋洲'],
        ingredientCategories: [
          '地上跑的',
          '土裡長的',
          '搧翅膀的',
          '水裡游的',
          '湯湯水水',
          '涮嘴小點',
          '甜滋滋',
          '喝起來'
        ]
      },
      productsData: [],
      productsNum: 0,
      productSelected: {
        imagesUrl: []
      },
      productIsNew: true,
      page: {}
    }
  },
  methods: {
    getAdminProductsData (page = 1) {
      const productsPaginationUrl = `${adminAllProductsUrl}/?page=${page}`
      this.$http
        .get(productsPaginationUrl)
        .then((res) => {
          this.productsData = res.data.products
          this.productsNum = this.productsData.length
          this.page = res.data.pagination
        })
        .catch((err) => alert(err.response.data.message))
    },
    delProduct (id) {
      //   4-1 刪除產品
      const delProductUrl = `${adminProductUrl}/${id}`
      this.$http
        .delete(delProductUrl)
        .then((res) => {
          alert(res.data.message)
          this.$refs.delProductModal.hideModal()
          this.getAdminProductsData()
        })
        .catch((err) => alert(err.response.data.message))
    },
    openModal (state, product) {
      // 4 打開modal並依狀態分流
      if (state === 'add') {
        this.productIsNew = true
        this.productSelected = {
          imagesUrl: [],
          category: 0,
          areaCategory: 0,
          ingredientCategory: 0
        }
        this.$refs.adminProductModal.openModal()
      } else if (state === 'edit') {
        this.productSelected = { ...product }
        this.productIsNew = false
        this.$refs.adminProductModal.openModal()
      } else if (state === 'delete') {
        this.productSelected = { ...product }
        this.$refs.delProductModal.openModal()
      }
    },
    uploadImage (event) {
      // 圖片上傳
      const file = event.target.files[0] // 檔案 = 傳來事件的target
      const formData = new FormData() // 建構 FormData 實體
      formData.append('file-to-upload', file) //  利用append 增加欄位與data到表單
      // 如果有檔案的話執行請求
      if (file) {
        this.$http
          .post(`${adminUrl}/upload`, formData)
          .then((res) => {
            this.productSelected.imageUrl = res.data.imageUrl
          })
          .catch((err) => alert(err.message))
      }
    },
    addSideImages () {
      // 新增副圖
      this.productSelected.imagesUrl = []
      this.productSelected.imagesUrl.push('') // 有值
    },
    saveProductChange (id) {
      //   5 儲存變更
      //   狀態分流
      const http = this.productIsNew ? 'post' : 'put'
      const saveProductUrl = this.productIsNew
        ? adminProductUrl
        : ` ${adminProductUrl}/${id}`
      this.$http[http](saveProductUrl, { data: this.productSelected })
        .then((res) => {
          alert(res.data.message)
          this.$refs.adminProductModal.hideModal()
          this.getAdminProductsData()
        })
        .catch((err) => alert(err.message))
    }
  },
  components: {
    Pagination,
    AdminProductModal,
    DelProductModal
  },
  mounted () {
    this.getAdminProductsData()
  }
}
</script>

<style scoped></style>
