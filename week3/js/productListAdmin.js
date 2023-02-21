// 0 引入Vue3的createApp
import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// 0 api url
const baseUrl = "https://vue3-course-api.hexschool.io/v2/";
const userCheckUrl = `${baseUrl}api/user/check`; //登入驗證
const apiPath = "kimi_project";
const adminUrl = `${baseUrl}api/${apiPath}/admin/`; //管理者url
const adminAllProductsUrl = `${adminUrl}products`; //所有產品
const adminProductUrl = `${adminUrl}product`; //單筆產品
//0 modal
let addOrEditProductModal = null;
let delProductModal = null;

// 0 建立實體，vue3執行內容
const app = {
  data() {
    return {
      productsCategoryAll: [
        "主食",
        "主菜",
        "副菜",
        "前菜冷盤",
        "湯品",
        "鍋物",
        "甜點",
        "點心",
        "飲品",
        "漬物乾貨",
      ],
      productsData: [],
      productsNum: 0,
      productsSelected: {
        imagesUrl: [],
      },
      productsIsNew: true,
    };
  },
  methods: {
    checkSingIn() {
      // 2 確認登入狀態
      axios
        .post(userCheckUrl)
        .then((res) => this.getAdminProductsData())
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "login.html"; //導回登入頁
        });
    },
    getAdminProductsData() {
      //  3 取得遠端產品資料
      axios
        .get(adminAllProductsUrl)
        .then((res) => {
          this.productsData = res.data.products;
          this.productsNum = this.productsData.length;
        })
        .catch((err) => alert(err.response.data.message));
    },
    openModal(state, product) {
      // 4 打開modal並依狀態分流
      if (state === "add") {
        this.productsIsNew = true;
        this.productsSelected = {
          imagesUrl: [],
          category: 0,
        };
        addOrEditProductModal.show();
      } else if (state === "edit") {
        this.productsSelected = { ...product };
        this.productsIsNew = false;
        addOrEditProductModal.show();
      } else if (state === "delete") {
        // 4-1 刪除
        this.productsSelected = { ...product };
        delProductModal.show();
      }
    },
    addSideImages() {
      this.productsSelected.imagesUrl = [];
      this.productsSelected.imagesUrl.push(""); //有值
    },
    delProduct(id) {
      //   4-1 刪除產品
      let delProductUrl = `${adminProductUrl}/${id}`;
      axios
        .delete(delProductUrl)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getAdminProductsData();
        })
        .catch((err) => alert(err.response.data.message));
    },
    saveProductChange(id) {
      //   5 儲存變更
      //   狀態分流
      let http = this.productsIsNew ? "post" : "put";
      let saveProductUrl = this.productsIsNew
        ? adminProductUrl
        : ` ${adminProductUrl}/${id}`;
      axios[http](saveProductUrl, { data: this.productsSelected })
        .then((res) => {
          alert(res.data.message);
          addOrEditProductModal.hide();
          this.getAdminProductsData();
        })
        .catch((err) => alert(err.response.data.message));
    },
  },
  mounted() {
    // 1 實體與掛載完成
    // 1-1 初始化bs5 modal
    addOrEditProductModal = new bootstrap.Modal(
      document.getElementById("addOrEditProductModal"),
      {
        keyboard: false,
      }
    );
    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal"),
      {
        keyboard: false,
      }
    );
    // 1-2 取 Token
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

// 0 建立實體與掛載
createApp(app).mount("#app");
