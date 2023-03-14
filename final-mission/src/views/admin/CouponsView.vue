<template>
  <h1 class="h3">優換券管理</h1>
  <div class="text-end my-4">
    <button type="button" class="btn btn-warning" @click="openManageModal('add')">
      新增優惠券
    </button>
  </div>
  <div v-if="haveCouponsData">
    <table class="table text-center">
      <thead>
        <tr>
          <th>序號</th>
          <th>標題</th>
          <th>折扣碼</th>
          <th>折扣比</th>
          <th>到期日</th>
          <th>狀態</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-for="coupon in couponsData" :key="coupon.id" class="align-middle fs-6">
        <tr>
          <td>{{ coupon.num }}</td>
          <td>{{ coupon.title }}</td>
          <td>{{ coupon.code }}</td>
          <td>{{ coupon.percent }}％</td>
          <td>{{ coupon.dueDate }}</td>
          <td :class="{ 'text-success': coupon.is_enabled }">
            {{ coupon.is_enabled ? '啟用' : '未啟用' }}
          </td>
          <td>
            <button type="button " class="btn btn-sm px-1" @click="openManageModal('edit', coupon)">
              <i class="bi bi-pen text-secondary fw-light"></i>
            </button>
            <button type="button " class="btn btn-sm px-1" @click="openManageModal('del', coupon)">
              <i class="bi bi-trash3 text-danger fw-light"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      ref="pagination"
      :pages="pagination"
      :get-per-page-data="getCouponsData"
    ></Pagination>
  </div>
  <div v-else>
    <p>目前尚未建立優惠券</p>
  </div>
  <AdminCouponModal
    ref="couponModal"
    :coupon-Selected="couponSelected"
    :is-New-Coupon="isNewCoupon"
    :save-Coupon="saveCoupon"
  ></AdminCouponModal>
  <DelDataModal
    ref="delCouponModal"
    :data-Selected="couponSelected"
    :del-Data="delCoupon"
    :data-Type="dataType"
  ></DelDataModal>
</template>

<script>
// component
import Pagination from '@/components/PaginationView.vue'
import AdminCouponModal from '@/components/AdminCouponModal.vue'
import DelDataModal from '@/components/AdminDelDataModal.vue'

// api
import { couponsPaginationUrl, couponUrl, existingCouponUrl } from '@/api/admin-api.js'

export default {
  data() {
    return {
      couponsData: [],
      haveCouponsData: false,
      pagination: {},
      currentPage: 1,
      couponSelected: {},
      isNewCoupon: true,
      dataType: '優惠券'
    }
  },
  methods: {
    getCouponsData(currentPage = 1) {
      this.currentPage = currentPage
      this.$http
        .get(couponsPaginationUrl(currentPage))
        .then((res) => {
          this.couponsData = res.data.coupons
          this.haveCouponsData = this.couponsData.length > 0 ? true : false
          if (!this.haveCouponsData) return
          this.pagination = res.data.pagination
          this.couponsData.forEach((item) => {
            // 時間轉換
            item.dueDate = this.transformTime(item.due_date)
          })
        })
        .catch((err) => alert(err))
    },
    transformTime(originalTime) {
      const timeStamp = new Date(originalTime * 1000)
      return timeStamp.toLocaleString().split(' ')[0]
    },
    openManageModal(state, data) {
      if (state === 'add') {
        this.isNewCoupon = true
        this.couponSelected = { percent: 100 }
        this.$refs.couponModal.openModal()
      } else if (state === 'edit') {
        this.isNewCoupon = false
        this.couponSelected = data
        this.$refs.couponModal.openModal()
      } else if (state === 'del') {
        this.couponSelected = data
        this.$refs.delCouponModal.openModal()
      }
    },
    saveCoupon(id) {
      const http = this.isNewCoupon ? 'post' : 'put'
      const saveCouponUrl = this.isNewCoupon ? couponUrl : existingCouponUrl(id)
      this.$http[http](saveCouponUrl, { data: this.couponSelected })
        .then((res) => {
          alert(res.data.message)
          this.$refs.couponModal.hideModal()
          this.getCouponsData()
        })
        .catch((err) => alert(err.response.data.message))
    },
    delCoupon(id) {
      this.$http
        .delete(existingCouponUrl(id))
        .then((res) => {
          alert(res.data.message)
          this.$refs.delCouponModal.hideModal()
          this.getCouponsData(this.currentPage)
        })
        .catch((err) => alert(err.response.data.message))
    }
  },
  components: {
    Pagination,
    AdminCouponModal,
    DelDataModal
  },

  mounted() {
    this.getCouponsData()
  }
}
</script>
