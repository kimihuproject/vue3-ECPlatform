<template>
  <div
    class="modal fade"
    id="adminCouponModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="adminCouponModal"
    ref="modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header bg-warning bg-opacity-75">
          <h5 class="modal-title" id="modalLabel">
            {{ isNewCoupon ? '新增優惠券' : '編輯優惠券' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row">
              <div class="col-6">
                <div class="mb-3">
                  <label for="title" class="form-label">優惠名稱</label>
                  <input
                    id="title"
                    v-model="tempCoupon.title"
                    type="text"
                    class="form-control"
                    placeholder="請輸入標題"
                  />
                </div>
                <div class="mb-3">
                  <label for="content" class="form-label">優惠說明</label>
                  <input
                    id="content"
                    v-model="tempCoupon.content"
                    type="text"
                    class="form-control"
                    placeholder="請輸入說明內容"
                  />
                </div>
                <div class="mb-3">
                  <label for="due_date" class="form-label">到期日</label>
                  <input type="date" class="form-control" id="due_date" v-model="due_date" />
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label for="percent" class="form-label"
                    >優惠折扣百分比<span class="text-secondary">（預設為100）</span></label
                  >
                  <input
                    id="percent"
                    v-model="tempCoupon.percent"
                    type="number"
                    class="form-control"
                    placeholder="請輸入折扣百分比"
                    max="100"
                    min="0"
                  />
                </div>
                <div class="mb-3">
                  <label for="code" class="form-label">折扣碼</label>
                  <input
                    id="code"
                    v-model="tempCoupon.code"
                    type="text"
                    class="form-control"
                    placeholder="請輸入折扣碼"
                  />
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input
                      id="is_enabled"
                      v-model="tempCoupon.is_enabled"
                      class="form-check-input"
                      type="checkbox"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="is_enabled">是否上架</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ isNewCoupon ? '取消新增' : '取消編輯' }}
          </button>
          <button type="button" class="btn btn-warning" @click="saveCoupon(tempCoupon.id)">
            {{ isNewCoupon ? '新增優惠券' : '儲存變更' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Modal from 'bootstrap/js/dist/modal'
export default {
  props: ['couponSelected', 'isNewCoupon', 'saveCoupon'],
  data() {
    return {
      modal: '',
      tempCoupon: {},
      due_date: null
    }
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: 'static'
    })
  },
  methods: {
    openModal() {
      this.modal.show()
    },
    hideModal() {
      this.modal.hide()
    }
  },
  watch: {
    couponSelected() {
      this.tempCoupon = this.couponSelected
      // 判斷狀態調整時間格式
      if (this.isNewCoupon) {
        this.due_date = null
      } else {
        // 改為 YYYY-MM-DD
        ;[this.due_date] = new Date(this.tempCoupon.due_date * 1000).toISOString().split('T')
      }
    },
    due_date() {
      this.tempCoupon.due_date = Math.floor(new Date(this.due_date) / 1000)
    }
  }
}
</script>
