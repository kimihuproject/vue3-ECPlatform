// 0 引入Vue3的createApp
import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// 1 api url
const baseUrl = "https://vue3-course-api.hexschool.io/v2/";

const adminSignInUrl = `${baseUrl}admin/signin`;

// 2  vue3執行內容
const app = {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    signIn() {
      axios
        .post(adminSignInUrl, this.user)
        .then((res) => {
          // 從res.data 中將 token,expired取出
          const { token, expired } = res.data;
          // 將token expires值寫入cookie
          document.cookie = `tableProjectToken =${token};expires=${expired}`;
          // 導向產品列表
          window.location = "productListAdmin.html";
        })
        .catch((err) => {
          alert("登入失敗！請檢查您的帳號密碼是否輸入正確");
        });
    },
  },
};

// 3 掛載
createApp(app).mount("#app");
