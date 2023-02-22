<!-- eslint-disable vue/no-mutating-props -->
<template>
  <!-- 要記得設定ref -->
  <div
    class="modal fade"
    id="adminProductModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="adminProductModal"
    ref="modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header bg-warning bg-opacity-75">
          <h5 class="modal-title" id="modalLabel">
            {{ productIsNew ? '新增產品' : '編輯產品' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- {{ productSelected }} -->
          <div class="row">
            <!-- 基本資料區 -->
            <div class="col-sm-8" id="edit-content-from">
              <div class="mb-3">
                <label for="title" class="form-label">產品名稱</label>
                <input
                  id="title"
                  v-model="productSelected.title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                />
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="main-category" class="form-label">主分類</label>
                  <select
                    id="main-category"
                    class="form-select"
                    aria-label="select main-category"
                    v-model="productSelected.category"
                  >
                    <option :value="0" disabled selected>請選擇菜式</option>
                    <option
                      v-for="item in productCategories.mainCategories"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </option>
                  </select>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input
                    id="unit"
                    v-model="productSelected.unit"
                    type="text"
                    class="form-control"
                    placeholder="請輸入單位"
                  />
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="area-category" class="form-label">地域分類</label>
                  <select
                    id="area-category"
                    class="form-select"
                    aria-label="select area-category"
                    v-model="productSelected.areaCategory"
                  >
                    <option :value="0" disabled selected>請選擇地域</option>
                    <option
                      v-for="item in productCategories.areaCategories"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </option>
                  </select>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="ingredient-category" class="form-label"
                    >食材風格分類</label
                  >
                  <select
                    id="ingredient-category"
                    class="form-select"
                    aria-label="select ingredient-category"
                    v-model="productSelected.ingredientCategory"
                  >
                    <option :value="0" disabled selected>請選擇食材</option>
                    <option
                      v-for="item in productCategories.ingredientCategories"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    id="origin_price"
                    v-model.number="productSelected.origin_price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入原價"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    id="price"
                    v-model.number="productSelected.price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入售價"
                  />
                </div>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">內容描述</label>
                <textarea
                  id="description"
                  v-model="productSelected.description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入產品描述，ex:內容物"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  id="content"
                  v-model="productSelected.content"
                  type="text"
                  class="form-control"
                  placeholder="請輸入說明內容"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="is_enabled"
                    v-model="productSelected.is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                  />
                  <label class="form-check-label" for="is_enabled"
                    >是否上架</label
                  >
                </div>
              </div>
            </div>
            <!-- 圖片區 -->
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="imageUrl " class="form-label"
                  >主圖(請輸入網址或上傳圖片)</label
                >
                <input
                  v-model="productSelected.imageUrl"
                  type="text"
                  class="form-control my-2"
                  placeholder="請輸入圖片連結"
                />
                <input
                  class="form-control my-2"
                  type="file"
                  name="file-to-upload"
                  @change="(event) => uploadImage(event)"
                />

                <img
                  class="img-fluid rounded"
                  :src="productSelected.imageUrl"
                />
                <!-- 主圖有值下出現新增副圖btn :無副圖屬性或副圖無值 -->
                <template v-if="productSelected.imageUrl">
                  <hr />
                  <div
                    v-if="
                      Object.keys(productSelected).indexOf('imagesUrl') < 0 ||
                      !productSelected.imagesUrl.length
                    "
                  >
                    <button
                      class="btn btn-outline-primary btn-sm d-block w-100 mt-1"
                      @click="addSideImages"
                    >
                      新增副圖
                    </button>
                  </div>
                </template>
              </div>
              <!-- 多圖 :是陣列且有值-->
              <template
                v-if="
                  Array.isArray(productSelected.imagesUrl) &&
                  productSelected.imagesUrl.length
                "
              >
                <!-- 圖片 card -->
                <div
                  class="mb-1"
                  v-for="(image, index) in productSelected.imagesUrl"
                  :key="'sideimage' + index"
                >
                  <div class="mb-3">
                    <label for="imageUrl" class="form-label">副圖網址：</label>
                    <input
                      v-model="productSelected.imagesUrl[index]"
                      type="text"
                      class="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img class="img-fluid rounded" :src="image" />
                  <!-- 刪除該張照片選項： 該筆有內容時-->
                  <button
                    v-if="
                      productSelected.imagesUrl[
                        productSelected.imagesUrl.length - 1
                      ]
                    "
                    class="btn btn-outline-danger btn-sm d-block w-100 m-1"
                    @click="productSelected.imagesUrl.splice(index, 1)"
                  >
                    刪除本張副圖
                  </button>
                  <hr />
                </div>
                <!--再新增一筆副圖選項：陣列中最後一筆是有內容時-->
                <div
                  v-if="
                    productSelected.imagesUrl[
                      productSelected.imagesUrl.length - 1
                    ]
                  "
                >
                  <button
                    class="btn btn-outline-primary btn-sm d-block w-100 m-1"
                    @click="productSelected.imagesUrl.push('')"
                  >
                    新增副圖
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            {{ productIsNew ? '取消新增' : '取消編輯' }}
          </button>
          <button
            type="button"
            class="btn btn-warning"
            @click="saveProductChange(productSelected.id)"
          >
            {{ productIsNew ? '新增產品' : '儲存變更' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Modal from 'bootstrap/js/dist/modal'
export default {
  props: [
    'productSelected',
    'productIsNew',
    'productCategories',
    'addSideImages',
    'saveProductChange',
    'uploadImage'
  ],
  data () {
    return {
      modal: ''
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: 'static'
    })
  },
  methods: {
    openModal () {
      this.modal.show()
    },
    hideModal () {
      this.modal.hide()
    }
  }
}
</script>

<style></style>
