<script>
  export default {
    onLaunch: function() {
      console.log('App Launch')
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    }
  }
</script>

<style>
  /*每个页面公共css */
  page {
    box-sizing: border-box;
    min-height: 100vh;
    padding: 0 0 100rpx;
    color: #323233;
    font-size: 16px;
    background: #f7f8fa;
    -webkit-font-smoothing: antialiased;
  }

  .demo-margin-left {
    margin-left: 10px;
  }

  .demo-margin-right {
    margin-right: 10px;
  }

  .demo-margin-bottom {
    display: block;
    margin-bottom: 15px;
  }

  .van-calendar__popup--bottom,
  .van-calendar__popup--top {
    height: 80%;
  }

  .van-calendar__popup--left,
  .van-calendar__popup--right {
    height: 100%;
  }

  .van-cascader__tab {
    color: #323233 !important;
    flex: none !important;
    font-weight: 600 !important;
    padding: 0 8px !important;
  }
</style>

<style lang="less">
  @import '~@/packages/common/index.less';
</style>
