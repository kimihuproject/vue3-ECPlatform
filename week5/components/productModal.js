export default {
  //１ 與外部連接：data,methods
  props: ["productSelected", "addToCart"],
  //２ 版型
  template: `
  <div class="modal fade" id="productInfoModal" tabindex="-1" aria-labelledby="productInfoModal"
                     aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">商品細節：{{productSelected.title}}
                                </h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-sm-8">
                                            <div class="row">
                                                <img :src="productSelected.imageUrl"
                                                     class="rounded  img-fluid object-fit-cover"
                                                     :alt="productSelected.title" style="height: 40vh">
                                            </div>
                                        </div>
                                        <div class="col-sm-4">
                                            <div class="d-flex flex-column justify-content-center" style="height: 40vh">
                                                <h3>
                                                    <span class="fs-6">商品名稱：</span>{{productSelected.title}}
                                                </h3>
                                                <div>
                                                    <ul class="list-unstyled">
                                                        <li>菜式風格：{{productSelected.category}}</li>
                                                        <li>地域風味：{{productSelected.areaCategory}}</li>
                                                        <li>食材主題：{{productSelected.ingredientCategory}}</li>
                                                        <li>份量單位：{{productSelected.unit}}</li>
                                                        <li>內容物：{{productSelected.content}}</li>
                                                        <li class="text-decoration-line-through fw-light">
                                                            原價：{{productSelected.origin_price}}元</li>
                                                        <li>售價：{{productSelected.price}}元</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="my-3">
                                        <p>{{productSelected.description}}</p>
                                    </div>
                                    <template
                                              v-if="Array.isArray(productSelected?.imagesUrl) && productSelected?.imagesUrl.length">
                                        <div class="row my-3" v-for="image in productSelected.imagesUrl"
                                             :key="'side-image'+image">
                                            <div class="col-sm-3 me-3">
                                                <img :src="image" class="rounded img-fluid object-fit-cover"
                                                     :alt="productSelected.title" style="height: 20vh">
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                                <button type="button" class="btn btn-warning"
                                        @click="addToCart(productSelected.id,'modal')">加入購物車</button>
                            </div>
                        </div>
                    </div>
                </div>
  `,
};
