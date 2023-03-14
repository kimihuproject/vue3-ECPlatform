<template>
  <!-- notice 設定 側欄 position-fixed 會影響子元件中modal開啟遮罩效果，解法：把整個主元件z-index拉高大於modal-backdrop-->
  <div class="row" style="z-index: 9999" v-if="checkSuccess">
    <header class="col-2 bg-warning bg-opacity-50 position-fixed top-0 bottom-0 start-0">
      <nav class="navbar">
        <div class="container-fluid d-flex flex-column align-items-center">
          <div>
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-column align-items-center">
              <li class="nav-item">
                <router-link to="/admin" class="nav-link">後台首頁</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/admin/products" class="nav-link">產品管理</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/admin/orders" class="nav-link">訂單管理</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/admin/coupons" class="nav-link">優惠券管理</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/admin/articles" class="nav-link">文章管理</router-link>
              </li>
              <!-- <li class="nav-item">
                <router-link to="/admin/analysis" class="nav-link">銷售分析</router-link>
              </li> -->
              <li class="nav-item">
                <router-link to="/" class="nav-link">回到前台</router-link>
              </li>
            </ul>
          </div>
          <button type="button" class="btn btn-sm btn-outline-secondary mt-2 px-3" @click="logOut">
            登出
          </button>
        </div>
      </nav>
    </header>
    <main class="col-10 position-absolute top-0 bottom-0 end-0 overflow-visible">
      <div class="container p-4">
        <RouterView></RouterView>
      </div>
    </main>
  </div>
</template>

<script>
import { userCheckUrl } from '@/api/admin-api.js'

export default {
  data() {
    return {
      checkSuccess: false
    }
  },
  methods: {
    checkLogIn() {
      // 取 TokenToken
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)tableProjectToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      )
      // 預設：每次請求時帶入token驗證
      this.$http.defaults.headers.common.Authorization = token
      if (!token) {
        alert('尚未登入。')
        this.$router.push('/login')
        return
      }
      this.$http
        .post(userCheckUrl)
        .then((res) => (this.checkSuccess = true))
        .catch((err) => {
          alert('err', err)
          this.checkSuccess = false
          this.logOut()
        })
    },
    logOut() {
      // 清空cookie
      document.cookie = 'tableProjectToken=;expires=;'
      alert('已登出')
      this.$router.push('/login')
    }
  },
  mounted() {
    this.checkLogIn()
  }
}
</script>
