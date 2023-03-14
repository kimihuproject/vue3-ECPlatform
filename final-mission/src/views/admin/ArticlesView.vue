<template>
  <h1 class="h3">主題文章管理</h1>
  <p class="text-secondary fw-lighter">前台顯示：依時而食</p>
  <div class="text-end my-4">
    <button type="button" class="btn btn-warning" @click="openManageModal('add')">新增文章</button>
  </div>
  <div v-if="haveArticlesData">
    <table class="table text-center">
      <thead>
        <tr>
          <th>序號</th>
          <th>標題</th>
          <th>建立日期</th>
          <th>到期日</th>
          <th>撰稿者</th>
          <th>狀態</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-for="article in articlesData" :key="article.id" class="align-middle fs-6">
        <tr>
          <td>{{ article.num }}</td>
          <td>{{ article.title }}</td>
          <td>{{ article.createDate }}</td>
          <td>{{ article.dueDate }}</td>
          <td>{{ article.author }}</td>
          <td :class="{ 'text-success': article.isPublic }">
            {{ article.isPublic ? '啟用' : '未啟用' }}
          </td>
          <td>
            <button
              type="button "
              class="btn btn-sm px-1"
              @click="openManageModal('edit', article)"
            >
              <i class="bi bi-pen text-secondary fw-light"></i>
            </button>
            <button type="button " class="btn btn-sm px-1" @click="openManageModal('del', article)">
              <i class="bi bi-trash3 text-danger fw-light"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      ref="pagination"
      :pages="pagination"
      :get-per-page-data="getArticlesData"
    ></Pagination>
  </div>
  <div v-else>
    <p>目前尚未建立文章</p>
  </div>
  <ArticleModal
    ref="articleModal"
    :article-Selected="articleSelected"
    :is-New-Article="isNewArticle"
    :save-Article="saveArticle"
    :add-side-images="addSideImages"
    :upload-image="uploadImage"
  ></ArticleModal>
  <DelDataModal
    ref="delArticleModal"
    :data-Selected="articleSelected"
    :del-Data="delArticle"
    :data-Type="dataType"
  ></DelDataModal>
</template>

<script>
// component
import Pagination from '@/components/PaginationView.vue'
import DelDataModal from '@/components/AdminDelDataModal.vue'
import ArticleModal from '@/components/AdminArticleModal.vue'

// api
import {
  articlesPaginationUrl,
  adminArticleUrl,
  adminExistingArticleUrl,
  uploadImageUrl
} from '@/api/admin-api.js'

export default {
  data() {
    return {
      articlesData: [],
      haveArticlesData: false,
      pagination: {},
      currentPage: 1,
      articleSelected: {
        imagesUrl: [],
        tag: []
      },
      isNewArticle: true,
      dataType: '文章'
    }
  },
  methods: {
    getArticlesData(currentPage = 1) {
      this.currentPage = currentPage
      this.$http
        .get(articlesPaginationUrl(currentPage))
        .then((res) => {
          this.articlesData = res.data.articles
          this.haveArticlesData = this.articlesData.length > 0 ? true : false
          if (!this.haveArticlesData) return
          this.pagination = res.data.pagination
          this.articlesData.forEach((item) => {
            // 時間轉換
            item.dueDate = this.transformTime(item.due_date)
            item.createDate = this.transformTime(item.create_at)
          })
        })
        .catch((err) => alert(err))
    },
    transformTime(originalTime) {
      const timeStamp = new Date(originalTime * 1000)
      return timeStamp.toLocaleString().split(' ')[0]
    },
    openManageModal(state, data) {
      if (state === 'add') {
        this.isNewArticle = true
        this.articleSelected = {
          imagesUrl: [],
          tag: []
        }
        this.$refs.articleModal.openModal()
      } else if (state === 'edit') {
        this.isNewArticle = false
        //找出特定資料
        this.$http
          .get(adminExistingArticleUrl(data.id))
          .then((res) => {
            if (res.data.success) {
              this.articleSelected = res.data.article
              this.$refs.articleModal.openModal()
            }
          })
          .catch((err) => alert(err.response.data.message))
      } else if (state === 'del') {
        this.articleSelected = data
        this.$refs.delArticleModal.openModal()
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
            this.articleSelected.imageUrl = res.data.imageUrl
          })
          .catch((err) => alert(err.message))
      }
    },
    addSideImages() {
      // 新增副圖
      this.articleSelected.imagesUrl = []
      this.articleSelected.imagesUrl.push('') // 有值
    },
    saveArticle(data) {
      const http = this.isNewArticle ? 'post' : 'put'
      const saveUrl = this.isNewArticle ? adminArticleUrl : adminExistingArticleUrl(data.id)
      this.$http[http](saveUrl, { data })
        .then((res) => {
          alert(res.data.message)
          this.$refs.articleModal.hideModal()
          this.getArticlesData()
        })
        .catch((err) => alert(err.response.data.message))
    },
    delArticle(id) {
      this.$http
        .delete(adminExistingArticleUrl(id))
        .then((res) => {
          alert(res.data.message)
          this.$refs.delArticleModal.hideModal()
          this.getArticlesData(this.currentPage)
        })
        .catch((err) => alert(err.response.data.message))
    }
  },
  components: {
    Pagination,
    DelDataModal,
    ArticleModal
  },

  mounted() {
    this.getArticlesData()
  }
}
</script>
