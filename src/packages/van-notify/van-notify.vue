<template>

  <van-transition name="slide-down" :show="notifyShow" class="van-notify__container" :custom-style="rootStyle"
    @click="onTap">
    <view :class="'van-notify van-notify--'+notifyType" :style="notifyStyle">
      <view v-if="safeAreaInsetTop" :style="'height:'+statusBarHeight+'px'" />
      <text>{{ message }}</text>
    </view>
  </van-transition>

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
      message: {
        type: String,
        default: '',
      },
      background: String,
      type: {
        type: String,
        default: 'danger',
      },
      color: {
        type: String,
        default: WHITE,
      },
      duration: {
        type: Number,
        default: 3000,
      },
      zIndex: {
        type: Number,
        default: 110,
      },
      safeAreaInsetTop: {
        type: Boolean,
        default: false,
      },
      top: {
        type: Number,
        default: 0,
      },
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
    computed: {
      notifyType() {
        return this.type + ''
      },
      notifyMessage() {
        return this.message + ''
      },
      rootStyle() {
        return 'z-index:' + this.zIndex + ';top:' + this.top + 'px;'
      },
      notifyStyle() {
        return 'background:' + this.background + ';color:' + this.color + ';'
      }
    },

    methods: {
      show() {
        const {
          duration,
          onOpened
        } = this;

        clearTimeout(this.timer);
        this.notifyShow = true

        setTimeout(() => {
          onOpened()
        }, 1000 / 30);

        if (duration > 0 && duration !== Infinity) {
          this.timer = setTimeout(() => {
            this.hide();
          }, duration);
        }
      },

      hide() {
        const {
          onClose
        } = this;

        clearTimeout(this.timer);
        this.notifyShow = false;
        setTimeout(() => {
          onClose()
        }, 1000 / 30);

      },

      onTap(event) {
        const {
          onClick
        } = this;
        if (onClick) {
          onClick(event);
        }
      },
    },
  });
</script>
<style lang="less">
  @import './index.less';
</style>
