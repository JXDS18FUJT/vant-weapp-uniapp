<template>
  <view>
    <van-notify ref="van-notify" />
    <demo-block padding title="基础用法">
      <van-button type="danger" @click="showNotify">基础用法</van-button>
    </demo-block>

    <demo-block padding title="通知类型">
      <view class="demo-margin-bottom">
        <van-button class="demo-margin-right" type="info" data-type="primary"
          @click="showNotifyByType('primary')">主要通知</van-button>
        <van-button type="primary" data-type="success" @click="showNotifyByType('success')">成功通知</van-button>
      </view>
      <view class="demo-margin-bottom">
        <van-button class="demo-margin-right" type="danger" data-type="danger"
          @click="showNotifyByType('danger')">危险通知</van-button>
        <van-button type="warning" data-type="warning" @click="showNotifyByType('warning')">警告通知</van-button>
      </view>
    </demo-block>

    <demo-block padding title="自定义通知">
      <van-button type="primary" class="demo-margin-right" @click="showCustomColor">自定义颜色</van-button>
      <van-button type="primary" @click="showCustomDuration">自定义时长</van-button>
    </demo-block>

    <demo-block padding title="插入状态栏高度">
      <van-button type="primary" class="demo-margin-right" @click="showSafe">插入状态栏高度</van-button>
    </demo-block>


  </view>

</template>

<script>
  import {
    VantComponent
  } from './../common/component';
  import Notify from './notify';

  export default VantComponent({
    methods: {
      showNotify() {
        Notify({
          zIndex:999,
          context: this,
          message: '通知内容'
        });
      },

      showCustomColor() {
        Notify({
          zIndex:999,
          context: this,
          message: '自定义颜色',
          color: '#ffff00',
          background: '#55ff00',
        });

        Notify.clear();
      },

      showCustomDuration() {
        Notify({
          zIndex:999,
          context: this,
          duration: 1000,
          message: '自定义时长',
        });
      },

      showNotifyByType(type) {

        Notify({
          zIndex:999,
          type,
          context: this,
          message: '通知内容',
        });
      },

      showSafe() {
        Notify({
          zIndex:999,
          context: this,
          message: '通知内容',
          safeAreaInsetTop: true,
        });
      },
    },
  });
</script>

<style>
</style>
