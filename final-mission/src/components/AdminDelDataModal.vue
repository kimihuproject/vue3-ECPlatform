<template>
  <div
    ref="modal"
    class="modal fade"
    id="delDataModal"
    tabindex="-1"
    aria-labelledby="delData"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger text-light">
          <h5 class="modal-title" id="exampleModalLabel">刪除{{ dataType }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>確認刪除以下資料：</p>
          <div>
            <p class="fw-bold">編號：{{ dataSelected.id }}</p>
            <p class="fw-bold">標題：{{ dataSelected.title }}</p>
            <strong class="text-danger fs-6">＊資料經刪除後無法復原。</strong>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-danger" @click="delData(dataSelected.id)">
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
  props: ['dataSelected', 'delData', 'dataType'],
  data() {
    return {
      modal: ''
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
  }
}
</script>
