// 0 引入Vue3的createApp
import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import pagination from "../components/pagination.js";
import productModalTemplate from "../components/productModal.js";
// 0 api url
const baseUrl = "https://vue3-course-api.hexschool.io/v2/";
const userCheckUrl = `${baseUrl}api/user/check`; //登入驗證
const apiPath = "kimi_project";
const adminUrl = `${baseUrl}api/${apiPath}/admin`; //管理者url
const adminAllProductsUrl = `${adminUrl}/products`; //所有產品
const adminProductUrl = `${adminUrl}/product`; //單筆產品
//0 modal
let addOrEditProductModal = null;
let delProductModal = null;

// 0 建立實體(與之前不同)，vue3執行內容
const app = createApp({
  data() {
    return {
      productCategories: {
        mainCategories: [
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
        areaCategories: ["臺灣", "亞洲", "歐洲", "美洲", "非洲", "大洋洲"],
        ingredientCategories: [
          "地上跑的",
          "土裡長的",
          "搧翅膀的",
          "水裡游的",
          "湯湯水水",
          "涮嘴小點",
          "甜滋滋",
          "喝起來",
        ],
      },
      productsData: [],
      productsNum: 0,
      productsSelected: {
        imagesUrl: [],
      },
      productsIsNew: true,
      page: {},
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
    getAdminProductsData(page = 1) {
      //  3 取得遠端產品資料
      // w4-1修改為分頁方式取得資料，帶入參數預設值
      const productsPaginationUrl = `${adminAllProductsUrl}/?page=${page}`;
      axios
        .get(productsPaginationUrl)
        .then((res) => {
          this.productsData = res.data.products;
          this.productsNum = this.productsData.length;
          this.page = res.data.pagination;
        })
        .catch((err) => alert(err.response.data.message));
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
    openModal(state, product) {
      // 4 打開modal並依狀態分流
      if (state === "add") {
        this.productsIsNew = true;
        this.productsSelected = {
          imagesUrl: [],
          category: 0,
          areaCategory: 0,
          ingredientCategory: 0,
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
    uploadImage(event) {
      // 圖片上傳
      const file = event.target.files[0]; //檔案 = 傳來事件的target
      const formData = new FormData(); //建構 FormData 實體
      formData.append("file-to-upload", file); //  利用append 增加欄位與data到表單
      // 如果有檔案的話執行請求
      if (file) {
        axios
          .post(`${adminUrl}/upload`, formData)
          .then((res) => {
            this.productsSelected.imageUrl = res.data.imageUrl;
          })
          .catch((err) => alert(err.response.data.message));
      }
    },
    addSideImages() {
      // 新增副圖
      this.productsSelected.imagesUrl = [];
      this.productsSelected.imagesUrl.push(""); //有值
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
  components: {
    // w4-1 導入元件（方式一）：分頁
    pagination,
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
});

// W4-2 導入元件（方式二）：modal刪除產品
app.component("del-modal-template", {
  props: ["productsSelected", "delProduct"],
  template: `#delModal`,
});

// W4-3 導入元件（方式三）：modal新增編輯
app.component("product-modal-template", productModalTemplate);

// 0 掛載
app.mount("#app");
