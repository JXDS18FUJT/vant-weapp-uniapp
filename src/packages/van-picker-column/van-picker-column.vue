<template>
  <view class="van-picker-column" :style="{
    height:itemHeight * visibleItemCount+'px'
  }" @touchstart="onTouchStart" @touchmove.stop="onTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
    <view :style="{
      'transition': 'transform ' + duration + 'ms',
      'line-height': itemHeight+'px',
      transform: 'translate3d(0, ' + (offset + (itemHeight * (visibleItemCount - 1)) / 2) + 'px, 0)'

    }">
      <view v-for="(option, index) in options" :key="index" :data-index="index" :style="{ height: itemHeight + 'px' }"
        :class="[
          'van-ellipsis',
          'van-picker-column__item',
          option && option.disabled?'van-picker-column__item--disabled':'',
          index === currentIndex?'van-picker-column__item--selected':'',
          index === currentIndex ? 'active-class' : ''
        ]" @click="onClickItem(index)">
        {{ optionText(option, valueKey) }}
      </view>
    </view>
  </view>
</template>

<script>
  import style from './../wxs/style.js'
  import addUnit from './../wxs/add-unit.js'
  import bem from './../wxs/bem.js'

  function range(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  function isObj(x) {
    var type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
  }

  function optionText(option, valueKey) {
    return isObj(option) && option[valueKey] != null ? option[valueKey] : option;
  }

  function rootStyle(data) {
    return style({
      height: addUnit(data.itemHeight * data.visibleItemCount),
    });
  }

  function wrapperStyle(data) {
    var offset = addUnit(
      data.offset + (data.itemHeight * (data.visibleItemCount - 1)) / 2
    );

    return style({
      transition: 'transform ' + data.duration + 'ms',
      'line-height': addUnit(data.itemHeight),
      transform: 'translate3d(0, ' + data.offset + ', 0)',
    });
  }
  const DEFAULT_DURATION = 200
  export default {
    name: "PickerColumn",

    props: {
      valueKey: {
        type: String,
        default: 'text'
      },
      className: String,
      itemHeight: {
        type: Number,
        required: true,
        default: 44
      },
      visibleItemCount: {
        type: Number,
        required: true,
        default: 6
      },
      initialOptions: {
        type: Array,
        default: () => []
      },
      defaultIndex: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        startY: 0,
        offset: 0,
        duration: 0,
        startOffset: 0,
        options: [],
        currentIndex: 0
      };
    },

    created() {
      this.options = this.initialOptions;
      this.currentIndex = this.defaultIndex;
      this.setIndex(this.defaultIndex);
    },
    computed: {
      pickerColumn__item() {
        // return `van-ellipsis ${bem('picker-column__item', {
        //     disabled: option && option.disabled,
        //     selected: index === currentIndex,
        //   })}`
        return `van-ellipsis`
      },
      pickerColumnWrapperStyle() {
        return `${ wrapperStyle({ offset:this.offset, itemHeight:this.itemHeight, visibleItemCount:this.visibleItemCount, duration:this.duration })}`
      },
      pickerColumnRootStyle() {
        return rootStyle({
          itemHeight: this.itemHeight,
          visibleItemCount: this.visibleItemCount
        })
      }
    },

    methods: {
      setOptions(data){
        const {options} = data
        this.options = options
        return new Promise((resolve,reject)=>{
          resolve()
        })

      },
      optionText(option, valueKey) {

        return isObj(option) && option[valueKey] != null ? option[valueKey] : option;
      },

      getCount() {
        return this.options.length;
      },

      onTouchStart(event) {
        this.startY = event.touches[0].clientY;
        this.startOffset = this.offset;
        this.duration = 0;
      },

      onTouchMove(event) {

        const deltaY = event.touches[0].clientY - this.startY;
        this.offset = range(
          this.startOffset + deltaY,
          -(this.getCount() * this.itemHeight),
          this.itemHeight
        );
        event.stopPropagation()
      },

      onTouchEnd() {

        if (this.offset !== this.startOffset) {
          this.duration = DEFAULT_DURATION;
          const index = range(
            Math.round(-this.offset / this.itemHeight),
            0,
            this.getCount() - 1
          );
          console.log('TouchEnd',index)
          this.setIndex(index, true);
        }
      },

      onClickItem(index) {
        this.setIndex(index, true);
      },

      adjustIndex(index) {
        const count = this.getCount();
        index = range(index, 0, count);

        for (let i = index; i < count; i++) {
          if (!this.isDisabled(this.options[i])) return i;
        }
        for (let i = index - 1; i >= 0; i--) {
          if (!this.isDisabled(this.options[i])) return i;
        }
        return 0;
      },

      isDisabled(option) {
        return isObj(option) && option.disabled;
      },

      getOptionText(option) {
        if (isObj(option) && this.valueKey in option) {
          return option[this.valueKey];
        }
        return option;
      },

      setIndex(index, userAction) {
        console.log(index, userAction)
        index = this.adjustIndex(index) || 0;
        this.offset = -index * this.itemHeight;

        if (index !== this.currentIndex) {
          this.currentIndex = index;
          if (userAction) {
            this.$emit("change", index);
          }
        }
      },

      setValue(value) {
        for (let i = 0; i < this.options.length; i++) {
          if (this.getOptionText(this.options[i]) === value) {
            this.setIndex(i);
            return;
          }
        }
      },

      getValue() {
        return this.options[this.currentIndex];
      }
    },
  }
</script>
<style lang="less">
  @import './index.less';
</style>
