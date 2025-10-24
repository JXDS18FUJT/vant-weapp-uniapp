<template>
  <view>
    <van-transition name="slide-down" :show="notifyShow" custom-class="van-notify__container"
      custom-style="computed.rootStyle({ zIndex, top })" @click="onTap">
      <view :class="'van-notify van-notify--'+type" style="computed.notifyStyle({ background, color })">
        <view v-if="safeAreaInsetTop" :style="'height:'+statusBarHeight+'px'" />
        <text>{{ message }}</text>
      </view>
    </van-transition>
  </view>
</template>

<script>
  import {
    VantComponent
  } from '../common/component';
  import {
    WHITE
  } from '../common/color';


  export default VantComponent({
    props: {
      message: String,
      background: String,
      type: {
        type: String,
        value: 'danger',
      },
      color: {
        type: String,
        value: WHITE,
      },
      duration: {
        type: Number,
        value: 3000,
      },
      zIndex: {
        type: Number,
        value: 110,
      },
      safeAreaInsetTop: {
        type: Boolean,
        value: false,
      },
      top: null,
    },

    data: () => {
      return {
        notifyShow: false,
        timer: null,
        onOpened: () => {},
        onClose: () => {},
        onClick: () => {},
      }
    },

    created() {
      const {
        statusBarHeight
      } = uni.getSystemInfoSync();
      this.statusBarHeight = statusBarHeight
    },

    methods: {
      show() {
        const {
          duration,
          onOpened
        } = this;

        clearTimeout(this.timer);
        this.notifyShow = true

        wx.nextTick(onOpened);

        if (duration > 0 && duration !== Infinity) {
          this.timer = setTimeout(() => {
            this.hide();
          }, duration);
        }
      },

      hide() {
        const {
          onClose
        } = this.data;

        clearTimeout(this.timer);
        this.show = false;
        setTimeout(() => {
          onClose()
        }, 1000 / 30);

      },

      onTap(event) {
        const {
          onClick
        } = this.data;
        if (onClick) {
          onClick(event.detail);
        }
      },
    },
  });
</script>

<style scoped>
  @import './index.less';
</style>
