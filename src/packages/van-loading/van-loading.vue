<template>
  <view :class="wrapClass" :style="customStyle">
    <view v-if="type === 'spinner'" :class="loadingClass" :style="loadingStyle">
      <view
        v-for="(item, index) in array12"
        :key="index"
        class="van-loading__dot"
      />
    </view>
    <view v-else :class="loadingClass" :style="loadingStyle"></view>
    <view class="van-loading__text" :style="textStyle">
      <slot />
    </view>
  </view>
</template>

<script>
import { VantComponent } from '../common/component'
import utils from '../wxs/utils'
export default VantComponent({
  props: {
    color: String,
    vertical: Boolean,
    type: {
      type: String,
      default: 'circular'
    },
    size: String,
    textSize: String,
    textColor:String
  },

  data() {
    return {
      array12: new Array(12).fill('')
    }
  },

  computed: {
    wrapClass() {
      const { customClass, vertical } = this
      return `custom-class ${ customClass } van-loading ${ vertical ? 'van-loading--vertical' : '' }`
    },
    textStyle() {
      const { textSize,color,textColor } = this
      return `font-size: ${utils.addUnit(textSize)};color:${textColor?textColor:color}`
    },
    loadingClass() {
      const { type } = this
      return `van-loading__spinner van-loading__spinner--${type}`
    },
    loadingStyle() {
      const { color, size } = this
      return `color: ${color}; width: ${utils.addUnit(
        size
      )}; height: ${utils.addUnit(size)}`
    }
  }
})
</script>

<style lang="less">
@import './index.less';
</style>
