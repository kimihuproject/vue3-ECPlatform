export default {
  //１ 與外部連接：data,methods
  props: ["sendOrder", "toggleCartState", "orderFormData", "isLoading"],
  //２ 版型
  template: `
  <h4>訂購者資訊</h4>
  <div class="card my-3">
      <!-- 表單 -->
      <div class="card-body">
          <v-form v-slot="{ errors }" @submit="sendOrder(orderFormData)">
              <div class="mb-3">
                  <label for="name" class="form-label">姓名：</label>
                  <v-field id="name" name="姓名" type="text" class="form-control" :class="{ 'is-invalid': errors['姓名'] }"
                           placeholder="請輸入姓名" rules="required" v-model="orderFormData.user.name"></v-field>
                  <error-message name="姓名" class="invalid-feedback"></error-message>
              </div>
              <div class="mb-3">
                  <label for="email" class="form-label">E-mail：</label>
                  <v-field id="email" name="email" type="email" class="form-control"
                           :class="{ 'is-invalid': errors['email'] }" placeholder="請輸入Email" rules="required|email"
                           v-model="orderFormData.user.email"></v-field>
                  <error-message name="email" class="invalid-feedback"></error-message>
              </div>
              <div class="mb-3">
                  <label for="tel" class="form-label">電話：</label>
                  <v-field id="tel" name="電話" type="tel" class="form-control" :class="{ 'is-invalid': errors['電話'] }"
                           placeholder="請輸入電話" rules="numeric|required|min:8|max:10"
                           v-model="orderFormData.user.tel"></v-field>
                  <error-message name="電話" class="invalid-feedback"></error-message>
              </div>
              <div class="mb-3">
                  <label for="address" class="form-label">收件地址：</label>
                  <v-field id="address" name="收件地址" type="text" class="form-control"
                           :class="{ 'is-invalid': errors['收件地址'] }" placeholder="請輸入收件地址" rules="required"
                           v-model="orderFormData.user.address"></v-field>
                  <error-message name="收件地址" class="invalid-feedback"></error-message>
              </div>
              <div class="mb-3">
                  <label for="message" class="form-label">備註：</label>
                  <textarea id="message" type="text" placeholder="請輸入備註" class="form-control" cols="10" rows="5"
                            v-model="orderFormData.user.message">
                                              </textarea>
              </div>
              <div class="d-flex gap-2 mt-3">
                  <button class="btn btn-outline-secondary w-100" type="button"
                          @click="toggleCartState('cancel')">取消結帳</button>
                  <button class="btn btn-warning w-100" type="submit" :disabled="isLoading">送出訂單</button>
              </div>
          </v-form>
      </div>
  </div>
  `,
};
