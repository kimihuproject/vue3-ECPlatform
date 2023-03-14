<template>
  <h1 class="h3">產品管理</h1>
  <div class="text-end my-4">
    <button type="button" class="btn btn-warning" @click="openManageModal('add')">新增產品</button>
  </div>
  <div v-if="haveProductsData">
    <table class="table text-center">
      <thead>
        <tr>
          <th width="10">序號</th>
          <th width="70">分類</th>
          <th width="150">產品名稱</th>
          <th width="120">售價</th>
          <th width="120">上架裝態</th>
          <th width="70"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in productsData" :key="product.id" class="align-middle">
          <td>{{ product.num }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td>{{ product.price }}</td>
          <td :class="{ 'text-success': product.is_enabled }">
            {{ product.is_enabled ? '啟用' : '未啟用' }}
          </td>
          <td>
            <button type="button" class="btn btn-sm" @click="openManageModal('edit', product)">
              <i class="bi bi-pen text-secondary fw-light"></i>
            </button>
            <button type=" button" class="btn btn-sm" @click="openManageModal('delete', product)">
              <i class="bi bi-trash3 text-danger fw-light"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      ref="pagination"
      :pages="Pagination"
      :get-per-page-data="getProductsData"
    ></Pagination>
  </div>
  <div v-else>
    <p>目前尚未建立任何產品</p>
  </div>

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
  <DelDataModal
    ref="delProductModal"
    :data-Selected="productSelected"
    :del-data="delProduct"
    :data-Type="dataType"
  ></DelDataModal>
</template>

<script>
// 自定義元件
import Pagination from '@/components/PaginationView.vue'
import AdminProductModal from '@/components/AdminProductModal.vue'
import DelDataModal from '@/components/AdminDelDataModal.vue'

// api
import {
  productsPaginationUrl,
  productUrl,
  existingProductUrl,
  uploadImageUrl
} from '@/api/admin-api.js'

// data
import { productFormData } from '@/data/adminFormData.js'

export default {
  data() {
    return {
      productsData: [],
      haveProductsData: false,
      productSelected: {
        imagesUrl: [],
        category: 0,
        areaCategory: 0,
        ingredientCategory: 0
      },
      productIsNew: true,
      productCategories: {},
      Pagination: {},
      currentPage: 1,
      dataType: '產品'
    }
  },
  methods: {
    getProductsData(currentPage = 1) {
      this.currentPage = currentPage
      this.$http
        .get(productsPaginationUrl(currentPage))
        .then((res) => {
          this.productsData = res.data.products
          this.haveProductsData = this.productsData.length > 0 ? true : false
          if (!this.haveProductsData) return
          this.Pagination = res.data.pagination
        })
        .catch((err) => alert(err.response.data.message))
    },

    openManageModal(state, product) {
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
    uploadImage(event) {
      // 圖片上傳
      const file = event.target.files[0] // 檔案 = 傳來事件的target
      const formData = new FormData() // 建構 FormData 實體
      formData.append('file-to-upload', file) //  利用append 增加欄位與data到表單
      // 如果有檔案的話執行請求
      if (file) {
        this.$http
          .post(uploadImageUrl, formData)
          .then((res) => {
            this.productSelected.imageUrl = res.data.imageUrl
          })
          .catch((err) => alert(err.message))
      }
    },
    addSideImages() {
      // 新增副圖
      this.productSelected.imagesUrl = []
      this.productSelected.imagesUrl.push('') // 有值
    },
    saveProductChange(id) {
      const http = this.productIsNew ? 'post' : 'put'
      const saveProductUrl = this.productIsNew ? productUrl : existingProductUrl(id)
      this.$http[http](saveProductUrl, { data: this.productSelected })
        .then((res) => {
          alert(res.data.message)
          this.$refs.adminProductModal.hideModal()
          this.getProductsData(this.currentPage)
        })
        .catch((err) => alert(err.message))
    },
    delProduct(id) {
      this.$http
        .delete(existingProductUrl(id))
        .then((res) => {
          alert(res.data.message)
          this.$refs.delProductModal.hideModal(this.currentPage)
          this.getProductsData()
        })
        .catch((err) => alert(err.response.data.message))
    }
  },
  components: {
    Pagination,
    AdminProductModal,
    DelDataModal
  },
  mounted() {
    this.getProductsData()
    this.productCategories = { ...productFormData.productCategories }
  }
}
</script>

<style scoped></style>
