// pages/productdetail/productdetail.js
import { request } from '../../request/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

    product: {},
    sku_show: false,
    skus: [],
    proSkus: [],
    skuDisInfo: "",
    skuImg: "",
    skuPrice: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const { ID } = options
    console.log(ID)
    this.getProductInfo(ID)


  },

  async getProductInfo(product_id) {

    const res = await request({
      url: "/Product/GetProduct",
      data: { id: product_id },
      method: "get"
    })
    console.log(res)
    res.Product.ProductMainImg = JSON.parse(res.Product.ProductMainImg)
    res.Product.ProductSlideImgs = JSON.parse(res.Product.ProductSlideImgs)
    res.Product.ProductDetailImg = JSON.parse(res.Product.ProductDetailImg)
    res.Product.ProductSkuValues = JSON.parse(res.Product.ProductSkuValues)

    for (let index = 0; index < res.Skus.length; index++) {
      res.Skus[index].ProductSku1 = JSON.parse(res.Skus[index].ProductSku1)
    }
    let skuDisInfo = "请选择 "
    res.Product.ProductSkuValues.forEach(v => {

      v.selectedValue = null
      skuDisInfo += v.name + " "

    })

    // res.skus.forEach(v=>{

    //   v.selectedValue=null
    //   skuDisInfo+=v.attrName+" "

    // })

    this.setData({
      product: res.Product,
      skus: res.Skus,
      proSkus: res.ProductSkus,
      skuDisInfo: skuDisInfo
    })

  },
  showSku() {

    this.setData({ sku_show: true })
  },
  onClose() {
    this.setData({ sku_show: false });
    let skuDisInfo = ""
    let { product } = this.data
    product.productSkuValues.forEach(v => {

      if (v.selectedValue != null) {

        skuDisInfo += v.selectedValue + " "

      }


    })
    if (skuDisInfo != "") {

      this.setData({ skuDisInfo: "已选择 " + skuDisInfo })
    }

  },
  handleSkuChange(event) {
    console.log(event)
    const { attrname, attrvalue, index } = event.currentTarget.dataset
    let { product } = this.data
    let { skus } = this.data
    let price = 0;
    let selectedValue = [];

    //遍历product
    product.ProductSkuValues.forEach(v => {

      if (v.name == attrname) {
        v.selectedValue = attrvalue

        //判断是否是图片sku
        if (v.isImg == 1) {
          this.setData({
            skuImg: v.values[index].img.CloudUrl,
          })
        }
      }
      //把已经选中的选项存入
      selectedValue.push(v.selectedValue);
    })

    skus.forEach(v => {
      v.skuValue=[]
      v.ProductSku1.forEach(_v=>{
        v.skuValue.push(_v.value)
      })
      if (JSON.stringify(v.skuValue) === JSON.stringify(selectedValue)) {
        price = v.Price;
      }
    });

    this.setData({
      product,
      skuPrice: price
    })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})