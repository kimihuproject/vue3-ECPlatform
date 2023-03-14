<template>
  <div class="login-bg text-center">
    <div class="container">
      <div class="row justify-content-center bg-light bg-opacity-75 py-4">
        <h1 class="h3 fw-normal m-0">管理者登入</h1>
        <p class="m-1 fs-6 text-muted">請先登入</p>
        <div class="col-8">
          <form id="loginForm" class="w-100 p-3 m-auto form-login" @submit.prevent="signIn">
            <div class="form-floating mb-3">
              <input
                type="email"
                class="form-control"
                id="loginAccount"
                placeholder="name@example.com"
                v-model="user.username"
                required
                autofocus
              />
              <label for="loginAccount">Email address</label>
            </div>
            <div class="form-floating mb-3">
              <input
                type="password"
                class="form-control"
                id="loginPassword"
                placeholder="Password"
                v-model="user.password"
                required
              />
              <label for="loginPassword">Password</label>
            </div>
            <button type="submit" class="btn btn-md btn-warning w-100">登入</button>
            <RouterLink to="/" type="button" class="btn btn-md btn-secondary w-100 my-3">
              回到前台
            </RouterLink>
          </form>
        </div>
        <p class="text-body-tertiary fw-light">&copy; Globetrotting Table since 2023</p>
      </div>
    </div>
  </div>
</template>

<script>
import { adminSignInUrl } from '@/api/admin-api'

export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    signIn() {
      this.$http
        .post(adminSignInUrl, this.user)
        .then((res) => {
          // 從res.data 中將 token,expired取出
          const { token, expired } = res.data
          // 將token expires值寫入cookie
          document.cookie = `tableProjectToken =${token};expires=${expired}`
          // 導向產品列表
          this.$router.push('/admin')
        })
        .catch((err) => {
          alert(err.message)
        })
    }
  }
}
</script>
<style>
.login-bg {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(https://images.unsplash.com/photo-1531234799389-dcb7651eb0a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80);
  background-size: 100% auto;
}
.form-login {
  max-width: 400px;
}
</style>
