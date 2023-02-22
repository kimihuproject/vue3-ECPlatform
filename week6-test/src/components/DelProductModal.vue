<template>
  <div
    ref="modal"
    class="modal fade"
    id="delProductModal"
    tabindex="-1"
    aria-labelledby="delProduct"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger text-light">
          <h5 class="modal-title" id="exampleModalLabel">刪除產品</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <p>確認刪除商品：</p>
            <p class="m-0 fw-bold">產品名稱：{{ productSelected.title }}</p>
            <p class="fw-bold">產品ＩＤ：{{ productSelected.id }}</p>
          </div>
          <strong class="text-danger fs-6">＊產品經刪除後無法復原。</strong>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="delProduct(productSelected.id)"
          >
            確定刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
export default {
  props: ['productSelected', 'delProduct'],
  data () {
    return {
      modal: ''
    }
  },
  mounted () {
    this.modal = new Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: 'static'
    })
  },
  methods: {
    openModal () {
      this.modal.show()
    },
    hideModal () {
      this.modal.hide()
    }
  }
}
</script>

<style></style>
