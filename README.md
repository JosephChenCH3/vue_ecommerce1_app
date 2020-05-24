# 頁面特點

- 電子商務網站實作專案
- 整體風格模仿成衣電商網站製作而成，貼近實務操作
- 不使用套件達成infinite scroll效果
- 中小分類於首次載入頁面時將後端取得之分類資料整理，後端分類更新或變動時不需再次維護前台頁面
- 完整購物結帳流程、庫存數量管控
- 自行參考 / 製作Banner


購物流程 
- 購物提示，點擊同項商品時警告防止誤觸重複購買結帳
- 購物車功能，商品選購後再統一結帳

結帳流程
- 訂單成立後，傳出訂購數量，計算庫存
- 結帳是模擬並無實際效果
- 結帳後隨機獲得7.9~9.9折優惠代碼供下次購物使用
- 結帳時使用優惠代碼獲得相對應折扣

庫存功能
- 後台建立商品資料時，可一併建立庫存數量傳入後端，也可於後台單獨修改
- 庫存小於特定數量時，該項商品顯示熱銷
- 無庫存時顯示售完並且無法將該品項加入購物車

搜尋功能 
- 一般搜尋：可使用商品片段名稱或大中小分類搜尋
- 訂單搜尋：選擇搜尋訂單並輸入訂單編號可搜尋

後台管理
- 商品管理：產品名稱、大中小分類、啟用狀態、庫存...等之新增、刪除、修改
- 訂單管理：付款狀態、付款方式修改，訂購人相關資訊查看
- 優惠卷管理：新增優惠券時隨機產生優惠代碼(也可自訂優惠代碼)，優惠代碼、類別、折扣...等之新增、刪除、修改


# 頁面展示

- [ecommerce1](https://josephchench3.github.io/vue_ecommerce1/#/)


# 頁面介紹

[前台](https://josephchench3.github.io/vue_ecommerce1/#/)
- 首頁形象頁面
- 商品總覽頁面
- 商品詳細頁面
- 購物車功能
- 訂單確認頁面
- 付款頁面
- 商品搜尋
- 訂單編號搜尋

[後台](https://josephchench3.github.io/vue_ecommerce1/#/login)
* 需管理員帳密驗證
* 商品管理頁面
* 訂單管理頁面
* 優惠卷管理頁面


# 技術

* Vue CLI-3
* Vue Router ( SPA )
* Vue Component
* API ( axios )
* Bootstrap 4
* jQuery


# 套件

* Vue-axios
* VeeValidate3
* vue-loading-overlay
* Bootstrap 4
* Font Awesome


# 資料來源

- 圖片素材：
* [Google圖片](https://www.google.com/)
* [unsplash](https://unsplash.com/)
* [picjumbo](https://picjumbo.com/)
* [pixabay](https://pixabay.com/)


- 版型參考、商品圖片、商品資料來源：
* [Lativ](https://www.lativ.com.tw/)

- API來源
* [六角學院](https://github.com/hexschool/vue-course-api-wiki/wiki)
