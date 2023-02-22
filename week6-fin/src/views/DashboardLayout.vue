<template>
  <div class="row m-0 p-0">
    <header
      class="col-2 m-0 bg-warning bg-opacity-25 d-flex flex-column align-items-center"
      style="height: 100vh"
    >
      <nav class="navbar">
        <div class="container-fluid container-fluid">
          <ul
            class="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-column align-items-center"
          >
            <li class="nav-item">
              <router-link to="/admin" class="nav-link">後台首頁</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/products" class="nav-link"
                >產品管理</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/admin/coupons" class="nav-link"
                >優惠券管理</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/admin/articles" class="nav-link"
                >文章管理</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/admin/orders" class="nav-link"
                >訂單管理</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/admin/analysis" class="nav-link"
                >銷售分析</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/" class="nav-link">回到前台</router-link>
            </li>
            <li class="nav-item">
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary mt-2 px-3"
                @click="logOut"
              >
                登出
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <main class="col-10 m-0 p-0 d-flex flex-column justify-content-between">
      <div class="container my-3 px-3">
        <RouterView v-if="checkSuccess"></RouterView>
      </div>
    </main>
  </div>
</template>
<script>
import { RouterView } from 'vue-router'
const { VITE_API_URL } = import.meta.env
const userCheckUrl = `${VITE_API_URL}api/user/check` // 登入驗證
export default {
  data () {
    return {
      checkSuccess: false
    }
  },
  methods: {
    checkLogIn () {
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
    logOut () {
      // 清空cookie
      document.cookie = 'tableProjectToken=;expires=;'
      alert('已登出')
      this.$router.push('/login')
    }
  },
  components: {
    RouterView
  },
  mounted () {
    this.checkLogIn()
  }
}
</script>
