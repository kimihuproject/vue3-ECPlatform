// 0 引入Vue3的createApp
import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// 1 api url
const baseUrl = "https://vue3-course-api.hexschool.io/v2/";
const userCheckUrl = `${baseUrl}api/user/check`;
const apiPath = "kimi_project";
const adminProductUrl = `${baseUrl}api/${apiPath}/admin/products/`;

// 2  vue3執行內容
const app = {
  data() {
    return {
      productsData: [],
      productsNum: 0,
      productsSelected: {},
    };
  },
  methods: {
    checkSingIn() {
      axios
        .post(userCheckUrl)
        .then((res) => this.getAdminProductsData())
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "login.html"; //導回登入頁
        });
    },
    getAdminProductsData() {
      axios
        .get(adminProductUrl)
        .then((res) => {
          this.productsData = res.data.products;
          this.productsNum = this.productsData.length;
        })
        .catch((err) => alert(err.response.data.message));
    },
    viewProductInfo(product) {
      this.productsSelected = product;
    },
  },
  mounted() {
    // 取 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)tableProjectToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // 預設：每次請求時帶入token驗證
    axios.defaults.headers.common.Authorization = token;
    //  確認是否登入狀態
    this.checkSingIn();
  },
};

// 3 掛載
createApp(app).mount("#app");
