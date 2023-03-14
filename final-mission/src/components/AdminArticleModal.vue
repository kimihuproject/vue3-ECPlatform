<template>
  <!-- 要記得設定ref -->
  <div
    class="modal fade"
    id="adminArticleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="adminArticleModal"
    ref="modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header bg-warning bg-opacity-75">
          <h5 class="modal-title" id="modalLabel">
            {{ isNewArticle ? '新增文章' : '編輯文章' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <!-- 基本資料區 -->
            <div class="col-sm-8" id="edit-content-from">
              <div class="row">
                <div class="col-md-8">
                  <div class="mb-3">
                    <label for="title" class="form-label">文章標題</label>
                    <input
                      id="title"
                      v-model="tempArticle.title"
                      type="text"
                      class="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label for="title" class="form-label">撰稿者</label>
                    <input
                      id="title"
                      v-model="tempArticle.author"
                      type="text"
                      class="form-control"
                      placeholder="請輸入撰稿者"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="create_at">建立日期</label>
                    <input type="date" class="form-control" id="create_at" v-model="create_at" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="due_date">預定下架日期</label>
                    <input type="date" class="form-control" id="due_date" v-model="due_date" />
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">簡述</label>
                <textarea
                  id="description"
                  v-model="tempArticle.description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入簡述"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <label for="tag" class="form-label">標籤</label>
                <div class="row gx-1 mb-3">
                  <div
                    class="col-md-2 mb-1"
                    v-for="(label, index) in tempArticle.tag"
                    :key="'tag' + index"
                  >
                    <div class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control form-control"
                        id="tag"
                        v-model="tempArticle.tag[index]"
                        placeholder="請輸入標籤"
                      />
                      <button
                        type="button"
                        class="btn btn-outline-danger"
                        @click="tempArticle.tag.splice(index, 1)"
                      >
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                  <div
                    class="col-md-2 mb-1"
                    v-if="tempArticle.tag[tempArticle.tag.length - 1] || !tempArticle.tag.length"
                  >
                    <button
                      class="btn btn-outline-warning btn-sm d-block w-100"
                      type="button"
                      @click="tempArticle.tag.push('')"
                    >
                      新增標籤
                    </button>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <ckeditor
                  :editor="editor"
                  :config="editorConfig"
                  v-model="tempArticle.content"
                ></ckeditor>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="isPublic"
                    v-model="tempArticle.isPublic"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="true"
                    :false-value="false"
                  />
                  <label class="form-check-label" for="isPublic">是否上架</label>
                </div>
              </div>
            </div>
            <!-- 圖片區 -->
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="imageUrl " class="form-label">主圖(請輸入網址或上傳圖片)</label>
                <input
                  v-model="tempArticle.imageUrl"
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

                <img class="img-fluid rounded" :src="tempArticle.imageUrl" />
                <!-- 主圖有值下出現新增副圖btn :無副圖屬性或副圖無值 -->
                <template v-if="tempArticle.imageUrl">
                  <hr />
                  <div
                    v-if="
                      Object.keys(tempArticle).indexOf('imagesUrl') < 0 ||
                      !tempArticle.imagesUrl.length
                    "
                  >
                    <button
                      class="btn btn-outline-warning btn-sm d-block w-100 mt-1"
                      @click="addSideImages"
                    >
                      新增副圖
                    </button>
                  </div>
                </template>
              </div>
              <!-- 多圖 :是陣列且有值-->
              <template v-if="Array.isArray(tempArticle.imagesUrl) && tempArticle.imagesUrl.length">
                <!-- 圖片 card -->
                <div
                  class="mb-1"
                  v-for="(image, index) in tempArticle.imagesUrl"
                  :key="'sideImage' + index"
                >
                  <div class="mb-3">
                    <label for="imageUrl" class="form-label">副圖網址：</label>
                    <input
                      v-model="tempArticle.imagesUrl[index]"
                      type="text"
                      class="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img class="img-fluid rounded" :src="image" />
                  <!-- 刪除該張照片選項： 該筆有內容時-->
                  <button
                    v-if="tempArticle.imagesUrl[tempArticle.imagesUrl.length - 1]"
                    class="btn btn-outline-danger btn-sm d-block w-100 m-1"
                    @click="tempArticle.imagesUrl.splice(index, 1)"
                  >
                    刪除本張副圖
                  </button>
                  <hr />
                </div>
                <!--再新增一筆副圖選項：陣列中最後一筆是有內容時-->
                <div v-if="tempArticle.imagesUrl[tempArticle.imagesUrl.length - 1]">
                  <button
                    class="btn btn-outline-warning btn-sm d-block w-100 m-1"
                    @click="tempArticle.imagesUrl.push('')"
                  >
                    新增副圖
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ isNewArticle ? '取消新增' : '取消編輯' }}
          </button>
          <button type="button" class="btn btn-warning" @click="saveArticle(tempArticle)">
            {{ isNewArticle ? '新增文章' : '儲存變更' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Modal from 'bootstrap/js/dist/modal'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  props: ['articleSelected', 'isNewArticle', 'addSideImages', 'uploadImage', 'saveArticle'],
  data() {
    return {
      modal: '',
      tempArticle: {
        imagesUrl: [],
        tag: []
      },
      create_at: null,
      due_date: null,
      editor: ClassicEditor,
      editorConfig: {
        toolbar: ['heading', 'bold', 'italic', '|', 'link']
      }
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
  },
  watch: {
    articleSelected() {
      this.tempArticle = this.articleSelected
      if (this.isNewArticle) {
        this.due_date = null
        this.create_at = null
      } else {
        // 改為 YYYY-MM-DD
        ;[this.due_date] = new Date(this.tempArticle.due_date * 1000).toISOString().split('T')
        ;[this.create_at] = new Date(this.tempArticle.create_at * 1000).toISOString().split('T')
      }
    },
    due_date() {
      this.tempArticle.due_date = Math.floor(new Date(this.due_date) / 1000)
    },
    create_at() {
      this.tempArticle.create_at = Math.floor(new Date(this.create_at) / 1000)
    }
  }
}
</script>
