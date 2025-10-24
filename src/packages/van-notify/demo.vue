<template>
  <view>
    <demo-block padding title="基础用法">
      <van-button type="danger" @click="showNotify">基础用法</van-button>
    </demo-block>

    <demo-block padding title="通知类型">
      <view class="demo-margin-bottom">
        <van-button class="demo-margin-right" type="info" data-type="primary"
          @click="showNotifyByType">主要通知</van-button>
        <van-button type="primary" data-type="success" @click="showNotifyByType">成功通知</van-button>
      </view>
      <view class="demo-margin-bottom">
        <van-button class="demo-margin-right" type="danger" data-type="danger"
          @click="showNotifyByType">危险通知</van-button>
        <van-button type="warning" data-type="warning" @click="showNotifyByType">警告通知</van-button>
      </view>
    </demo-block>

    <demo-block padding title="自定义通知">
      <van-button type="primary" class="demo-margin-right" @click="showCustomColor">自定义颜色</van-button>
      <van-button type="primary" @click="showCustomDuration">自定义时长</van-button>
    </demo-block>

    <demo-block padding title="插入状态栏高度">
      <van-button type="primary" class="demo-margin-right" @click="showSafe">插入状态栏高度</van-button>
    </demo-block>

    <van-notify id="van-notify" />
  </view>

</template>

<script>

  import { VantComponent } from './../common/component';
  import Notify from './notify';

  export default VantComponent({
    methods: {
      showNotify() {
        Notify({ context: this, message: '通知内容' });
      },

      showCustomColor() {
        Notify({
          context: this,
          message: '自定义颜色',
          color: '#ad0000',
          background: '#ffe1e1',
        });

        Notify.clear();
      },

      showCustomDuration() {
        Notify({
          context: this,
          duration: 1000,
          message: '自定义时长',
        });
      },

      showNotifyByType(event) {
        const { type } = event.currentTarget.dataset;
        Notify({
          type,
          context: this,
          message: '通知内容',
        });
      },

      showSafe() {
        Notify({
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
