export default {
  //１ 與外部連接：data,methods
  props: ["getProductInfo", "addToCart", "loadingItem", "productsData"],
  //２ 版型
  template: `
<h4>世界菜譜</h4>
<div class="row">
    <div class="col-6 my-3" v-for="product in productsData" :key="'productList'+product.id">
        <div class="card">
            <img :src="product.imageUrl" class="card-img card-img-top rounded img-fluid object-fit-cover"
                 :alt="product.title" style="height: 300px">
            <div class="card-body">
                <h5 class="card-title">{{product.title}}</h5>
                <p class="card-text">
                    <span class="badge bg-secondary bg-opacity-25 text-body-emphasis me-2">{{product.category}}</span>
                    <span
                          class="badge bg-secondary bg-opacity-25 text-body-emphasis me-2">{{product.areaCategory}}</span>
                    <span
                          class="badge bg-secondary bg-opacity-25 text-body-emphasis me-2">{{product.ingredientCategory}}</span>
                </p>
                <p class="card-text">
                    <span class="text-decoration-line-through fw-light me-3">原價：{{product.origin_price}}元</span>
                    <span class="fw-semibold">售價：{{product.price}}元</span>
                </p>
            </div>
            <div class="card-footer">
                <div class="d-flex gap-1">
                    <button type="button " class="btn btn-sm btn-outline-secondary me-3 w-100"
                            @click="getProductInfo(product.id)">查看產品細節</button>
                    <button type="button" class="btn btn-sm btn-sm btn-outline-warning w-100" @click="addToCart(product.id)">
                        <i class="fas fa-spinner fa-pulse" v-if="loadingItem === product.id"></i>加入購物車</button>
                </div>
            </div>
        </div>
    </div>
</div>
  `,
};
