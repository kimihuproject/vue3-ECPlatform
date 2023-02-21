export default {
  //１ 與外部連接：data,methods
  props: [
    "cartData",
    "loadingItem",
    "adjustCartItem",
    "getProductInfo",
    "delCartItem",
    "delCartAll",
    "toggleCartState",
    "isCheckout",
    "cartTotalPrice",
  ],
  //２ 版型
  template: `
<div>
    <h4>我的菜籃車</h4>
    <template class="card my-4">
        <div>
            <!-- 購物車初始防呆：無產品 -->
            <div class="position-absolute text-white d-flex align-items-center justify-content-center active"
                 style="top: 0;bottom: 0;left: 0;right: 0;background-color: rgba(0, 0, 0, 0.65); z-index: 100;"
                 v-if="!cartData.length">請先選購商品
            </div>
            <!-- 購物車清單 -->
            <div class="card-body">
                <table class="table text-center">
                    <thead>
                        <tr>
                            <th width="100">品名</th>
                            <th width="50">單價</th>
                            <th width="100">數量</th>
                            <th width="70">小計</th>
                            <th width="20"></th>
                            <th width="20"></th>
                        </tr>
                    </thead>
                    <tbody v-if="cartData.length>0" class="align-middle">
                        <tr v-for="item in cartData" :key="'cartItem'+ item.id">
                            <th class="fw-light">{{item.product
                          .title}}</th>
                            <th class="fw-light">{{item.product.price}}</th>
                            <th class="fw-light">
                                <input id="qty" v-model.number="item.qty" type="number" min="1" max="10"
                                       class="form-control" @change="adjustCartItem(item)"
                                       :disabled="loadingItem === item.product.id || isCheckout">
                            </th>
                            <th class="fw-light">{{item.total}}</th>
                            <th class="px-0">
                                <button type="button " class="btn btn-sm px-1" @click="getProductInfo(item.product.id)">
                                    <i class="fa-solid fa-eye fw-light text-secondary"></i></button>
                            </th>
                            <th class="px-0">
                                <button type="button" class="btn btn-sm px-1 m-0" @click="delCartItem(item)"
                                        :disabled="isCheckout">
                                    <i class="fa-regular fa-trash-can text-danger fw-light"></i></button>
                            </th>
                        </tr>
                    </tbody>
                </table>
                <div v-if="cartData.length>0">
                    <p class="text-end">總金額： NT$ <span class="fw-bold">{{cartTotalPrice}}
                        </span>元
                    </p>
                    <div class="d-flex gap-2 mt-3">
                        <button class="btn btn-outline-secondary w-100" type="button" @click="delCartAll"
                                :disabled="isCheckout">刪除所有品項</button>
                        <button class="btn btn-warning w-100" type="button" @click="toggleCartState('send')"
                                :disabled="isCheckout">前往結帳</button>
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>
`,
};
