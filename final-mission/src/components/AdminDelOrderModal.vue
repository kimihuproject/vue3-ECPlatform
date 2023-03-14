<template>
  <div
    ref="modal"
    class="modal fade"
    id="delProductModal"
    tabindex="-1"
    aria-labelledby="delOrder"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-danger text-light">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ isDelAllOrder ? '刪除所有訂單' : `刪除訂單：${orderSelected.id}` }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="isDelAllOrder">
            <h6>確認刪除所有訂單</h6>
          </div>
          <div v-else-if="!isDelAllOrder">
            <p class="fw-bold">編號：{{ orderSelected.id }}</p>
            <p class="fw-bold">金額：{{ orderSelected.total }}</p>
            <p class="fw-bold">日期：{{ orderSelected.orderDate }}</p>
            <p class="fw-bold">狀態：{{ orderSelected.state }}</p>
          </div>
          <strong class="text-danger fs-6">＊經刪除後無法復原。</strong>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button v-if="isDelAllOrder" type="button" class="btn btn-danger" @click="delAllOrders">
            確定刪除所有訂單
          </button>
          <button
            v-else-if="!isDelAllOrder"
            type="button"
            class="btn btn-danger"
            @click="delOrder(orderSelected.id)"
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
  props: ['isDelAllOrder', 'orderSelected', 'delOrder', 'delAllOrders'],
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

<style></style>
