// Vue
const { createApp } = Vue; //Vue3

// 自定義元件
import productBoard from "../components/productBoard.js"; //產品列表
import pagination from "../components/pagination.js"; //頁碼
import productModal from "../components/productModal.js"; //單一產品明細
import cart from "../components/cart.js"; //購物車
import orderForm from "../components/orderForm.js"; //訂單表格
import orderInfo from "../components/orderInfo.js"; //訂單明細

// 表單驗證規則載入（全部）
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 讀取外部資源（本地端）：多國語系
VeeValidateI18n.loadLocaleFromURL("../js/zh_TW.json");

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，立即進行驗證
});

// api url
const baseUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "kimi_project";
const productsAllUrl = `${baseUrl}/api/${apiPath}/products/all`;
const productsUrl = `${baseUrl}/api/${apiPath}/products`;
const productUrl = `${baseUrl}/api/${apiPath}/product`;
const cartUrl = `${baseUrl}/api/${apiPath}/cart`;
const orderUrl = `${baseUrl}/api/${apiPath}/order`;
const payUrl = `${baseUrl}/api/${apiPath}/pay`;

// modal
let productInfoModal = null;
let orderInfoModal = null;

// vue建立
const app = createApp({
  data() {
    return {
      // products
      productsData: [],
      productsNum: 0,
      page: {},
      productSelected: "",
      // cart
      cartData: [],
      cartTotalPrice: 0,
      loadingItem: "",
      isLoading: false,
      isCheckout: false,
      // order
      orderFormData: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
      orderData: {
        user: "",
      },
    };
  },
  methods: {
    getProductsData(page = 1) {
      this.isLoading = false;
      const productsPaginationUrl = `${productsUrl}/?page=${page}`;
      axios
        .get(productsPaginationUrl)
        .then((res) => {
          this.productsData = res.data.products;
          this.productsNum = this.productsData.length;
          this.page = res.data.pagination;
        })
        .catch((err) => alert(err.response.data.message));
    },
    getProductInfo(id) {
      this.isLoading = true;
      axios
        .get(`${productUrl}/${id}`)
        .then((res) => {
          this.productSelected = res.data.product;
          this.isLoading = false;
          productInfoModal.show();
        })
        .catch((err) => alert(err.response.data.message));
    },
    getCartData() {
      this.cartTotalPrice = 0; //清空
      axios
        .get(cartUrl)
        .then((res) => {
          this.isLoading = false;
          this.cartData = res.data.data.carts;
          this.cartData.forEach((item) => {
            this.cartTotalPrice += item.total;
          });
        })
        .catch((err) => alert(err.response.data.message));
    },
    addToCart(id, state) {
      // 確認並限制車內既有商品訂購數量
      id = this.checkCartItemQty(id);
      if (!id) return;
      let cartProduct = {
        product_id: id,
        qty: 1,
      };
      this.loadingItem = id;
      // modal瀏覽模式下，加入購物車後關閉modal
      if (state === "modal") {
        productInfoModal.hide();
      }
      this.isLoading = true;

      axios
        .post(cartUrl, { data: cartProduct })
        .then((res) => {
          alert(res.data.message);
          this.loadingItem = ""; //清空
          this.getCartData(); //重新取得購物車資料
        })
        .catch((err) => alert(err.response.data.message));
    },
    checkCartItemQty(id) {
      // 防呆：超過預設數量10
      const itemSelectedIndex = this.cartData.findIndex(
        (item) => item.product.id == id
      );
      if (itemSelectedIndex < 0) return id; //車內無此商品，返回新增商品
      // 車內有商品，確認當前選購數量
      if (this.cartData[itemSelectedIndex].qty <= 10) {
        return id;
      } else {
        alert("選購數量已超過上限，若有大量採購需求請另洽");
      }
    },
    adjustCartItem(item) {
      // 限制訂購數量
      let product_id = this.checkCartItemQty(item.product.id);
      if (!product_id) return;

      let cartProduct = {
        product_id,
        qty: item.qty,
      };
      this.loadingItem = product_id;
      this.isLoading = true;

      axios
        .put(`${cartUrl}/${item.id}`, { data: cartProduct })
        .then((res) => {
          alert(res.data.message);
          this.loadingItem = ""; //清空
          this.getCartData(); //重新取得購物車資料
        })
        .catch((err) => alert("數量調整失敗，請洽客服"));
    },
    delCartItem(cartItem) {
      this.isLoading = true;
      axios
        .delete(`${cartUrl}/${cartItem.id}`)
        .then((res) => {
          alert(res.data.message);
          this.getCartData();
        })
        .catch((err) => alert("產品刪除失敗，請洽客服"));
    },
    delCartAll() {
      this.isLoading = true;
      let delAllUrl = `${cartUrl}s`;
      axios
        .delete(delAllUrl)
        .then((res) => {
          alert(res.data.message);
          this.getCartData();
        })
        .catch((err) => alert("產品刪除失敗，請洽客服"));
    },
    toggleCartState(state) {
      if (state === "send") {
        return (this.isCheckout = true);
      } else if (state === "cancel") {
        this.clickOrderFormData();
        this.isCheckout = false;
      }
    },
    clickOrderFormData() {
      // 清空前次暫存資料
      this.orderFormData.message = "";
      Object.keys(this.orderFormData.user).forEach((key) => {
        this.orderFormData.user[key] = "";
      });
      return;
    },
    sendOrder(data) {
      this.isLoading = true;
      axios
        .post(orderUrl, { data })
        .then((res) => {
          this.isLoading = false;
          alert(res.data.message);
          // 清空頁面暫存購物車資料
          this.cartData = [];
          this.getCartData();
          // 清空頁面暫存訂單資料
          this.clickOrderFormData();
          this.isCheckout = false;
          this.isLoading = true;
          this.getOrderInfo(res.data.orderId);
        })
        .catch((err) => alert("訂單錯誤，請洽客服"));
    },
    getOrderInfo(id) {
      axios
        .get(`${orderUrl}/${id}`)
        .then((res) => {
          this.isLoading = false;
          // 時間戳轉碼
          const timeStamp = new Date(res.data.order.create_at * 1000);
          const orderDate = timeStamp.toLocaleString().split(" ")[0];
          const productsData = [];
          // 訂單中產品資料轉陣列
          Object.keys(res.data.order.products).forEach((key) => {
            productsData.push(res.data.order.products[key]);
          });
          this.orderData = {
            ...res.data.order,
            orderDate,
            productsData,
          };
          orderInfoModal.show();
        })
        .catch((err) => alert("訂單資訊讀取錯誤，請洽客服"));
    },
    payOrder(id) {
      this.isLoading = true;
      axios
        .post(`${payUrl}/${id}`)
        .then((res) => {
          this.isLoading = false;
          alert(res.data.message);
          this.getOrderInfo(id);
        })
        .catch((err) => alert(err.response.data.message));
    },
  },
  components: {
    // 自定義
    productBoard,
    pagination,
    productModal,
    cart,
    orderForm,
    orderInfo,
  },
  mounted() {
    // 初始化bs5 modal
    productInfoModal = new bootstrap.Modal(
      document.getElementById("productInfoModal"),
      {
        keyboard: false,
      }
    );
    orderInfoModal = new bootstrap.Modal(
      document.getElementById("orderInfoModal"),
      {
        keyboard: false,
      }
    );
    this.getProductsData();
    this.getCartData();
  },
});

// 載入元件：外部套件
// VeeValidate
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
// VueLoading
app.component("loading", VueLoading.Component);

// vue掛載
app.mount("#app");
