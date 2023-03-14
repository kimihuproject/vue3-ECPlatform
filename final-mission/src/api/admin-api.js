export const { VITE_API_URL ,VITE_API_PATH } = import.meta.env

export const adminSignInUrl = `${VITE_API_URL}admin/signin` //管理者登入
export const userCheckUrl = `${VITE_API_URL}api/user/check` // 登入驗證

export const adminUrl = `${VITE_API_URL}api/${VITE_API_PATH}/admin` // 管理者url


// 產品api
export const allProductsUrl = `${adminUrl}/products` // 所有產品
export const productsAllUrl = `${adminUrl}/products/all` // 所有產品
export const productsPaginationUrl =  (page) =>`${allProductsUrl}/?page=${page}`//產品列表分頁
export const productUrl = `${adminUrl}/product` // 單筆產品(新增)
export const existingProductUrl = (id) => `${productUrl}/${id}` // 刪除or編輯單筆產品

// 圖片api
export const uploadImageUrl = `${adminUrl}/upload` //本地端圖片上傳


// 訂單api
export const allOrdersUrl = `${adminUrl}/orders`
export const ordersAllUrl = `${allOrdersUrl}/all` 
export const ordersPaginationUrl =  (page) =>`${allOrdersUrl}/?page=${page}`//產品列表分頁
export const orderUrl =  (id) =>`${adminUrl}/order/${id}` //刪除or編輯



// 優惠券api


export const allCouponsUrl = `${adminUrl}/coupons`
export const couponsPaginationUrl = (page) =>`${allCouponsUrl}/?page=${page}`
export const couponUrl = `${adminUrl}/coupon` //新增
export const existingCouponUrl =  (id) => `${couponUrl}/${id}` //刪除or編輯


// 文章api
export const adminAllArticlesUrl = `${adminUrl}/articles` 
export const articlesPaginationUrl = (page) =>`${adminAllArticlesUrl}/?page=${page}`
export const adminArticleUrl = `${adminUrl}/article` //新增
export const adminExistingArticleUrl =  (id) => `${adminArticleUrl}/${id}` //刪除or編輯
