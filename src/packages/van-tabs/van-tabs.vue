<template>
  <view :class="tabsClass">
    <van-sticky :disabled="!sticky" :z-index="zIndex" :offset-top="offsetTop" :container="container"
      :scroll-top="scrollTop" @scroll="onTouchScroll">
      <view :class="tabsWrapClass">
        <slot name="nav-left" />

        <scroll-view :scrollWithAnimation="scrollWithAnimation" :scroll-x="scrollable" :scroll-left="scrollLeft" :class="tabsScrollClass"
          :style="[color ? { 'border-color': color } : {}]">
          <view :class="tabsNavClass" :style="tabCardTypeBorderStyle">
            <view v-if="type === 'line'" class="van-tabs__line" :style="lineStyle" />
            <view v-for="(item, index) in tabs" :key="index" :class="item.tabsItemClass" :style="item.tabsItemStyle"
              @click="onTap(index)">
              <view :class="{ 'van-ellipsis': ellipsis }" :style="item.titleStyle">
                {{ item.title }}
                <van-info v-if="item.info !== null || item.dot" :info="item.info" :dot="item.dot"
                  custom-class="van-tab__title__info" />
              </view>
            </view>
          </view>
        </scroll-view>

        <slot name="nav-right" />
      </view>
    </van-sticky>

    <view class="van-tabs__content" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
      @touchcancel="onTouchEnd">
      <view :class="tabsTrackClass" :style="trackStyle">
        <slot />
      </view>
    </view>
  </view>
</template>

<script>
  import utils from '../wxs/utils'
  import VanInfo from '../van-info/van-info'
  import VanSticky from '../van-sticky/van-sticky'
  import {
    VantComponent
  } from '../common/component'
  import {
    touch
  } from '../mixins/touch'
  import {
    isDef,
    addUnit
  } from '../common/utils'
  import {
    getComponentByOptionsName
  } from '../wxs/get-component'
  import {
    ParentMixin
  } from '../mixins/relation'

  function getRect(context, selector) {
    return new Promise(function(resolve) {
      uni.createSelectorQuery()
        .in(context)
        .select(selector)
        .boundingClientRect()
        .exec(function(rect) {
          if (rect === void 0) {
            rect = [];
          }
          return resolve(rect[0]);
        });
    });
  }

  function getAllRect(context, selector) {
    return new Promise(function(resolve) {
      uni.createSelectorQuery()
        .in(context)
        .selectAll(selector)
        .boundingClientRect()
        .exec(function(rect) {
          if (rect === void 0) {
            rect = [];
          }
          return resolve(rect[0]);
        });
    });
  }


  export default {
    components: {
      VanInfo,
      VanSticky
    },
    ...VantComponent({
      mixins: [touch, ParentMixin('vanTabs')],

      classes: ['nav-class', 'tab-class', 'tab-active-class', 'line-class'],

      props: {
        sticky: Boolean,
        border: Boolean,
        swipeable: Boolean,
        titleActiveColor: String,
        titleInactiveColor: String,
        color: String,
        animated: {
          type: Boolean
        },
        lineWidth: {
          type: [String, Number],
          default: 40
        },
        lineHeight: {
          type: [String, Number],
          default: -1
        },
        active: {
          type: [String, Number],
          default: 0
        },
        type: {
          type: String,
          default: 'line'
        },
        ellipsis: {
          type: Boolean,
          default: true
        },
        duration: {
          type: Number,
          default: 0.3
        },
        zIndex: {
          type: Number,
          default: 10
        },
        swipeThreshold: {
          type: Number,
          default: 5
        },
        offsetTop: {
          type: Number,
          default: 0
        },
        scrollTop: {
          type: Number,
          default: 0
        },
        lazyRender: {
          type: Boolean,
          default: true
        }
      },

      data() {
        return {
          tabs: [],
          lineStyle: '',
          lineOffsetLeft: 0,
          scrollLeft: 0,
          scrollable: false,
          currentIndex: null,
          container: null,
          inited: false,
          skipTransition: true,
          scrollWithAnimation: false
        }
      },

      computed: {
        tabsClass() {
          return `custom-class ${this.customClass} ${utils.bem('tabs', [
          this.type
        ])} van-tabs-${this._uid}`
        },
        tabsWrapClass() {
          return `${utils.bem('tabs__wrap', { scrollable: this.scrollable })} ${
          this.type === 'line' && this.border ? 'van-hairline--top-bottom' : ''
        }`
        },
        tabsScrollClass() {
          return utils.bem('tabs__scroll', [this.type])
        },
        tabsNavClass() {
          return `${utils.bem('tabs__nav', [this.type, { complete: !this.ellipsis }])} nav-class ${this.navClass} van-tabs__nav-${this._uid}`
        },
        tabCardTypeBorderStyle() {
          var isCard = this.type === 'card'
          var styles = []
          if (isCard && this.color) {
            styles.push('border-color:' + this.color)
          }
          return styles.join(';')
        },
        tabsTrackClass() {
          return `${utils.bem('tabs__track', [
          { animated: this.animated }
        ])} van-tabs__track`
        },
        trackStyle() {
          if (!this.animated) {
            return ''
          }

          return [
              ['left', -100 * this.currentIndex + '%'],
              ['-webkit-transition-duration', this.duration + 's'],
              ['transition-duration: ', this.duration + 's'],
            ]
            .map(function(item) {
              return item.join(':');
            })
            .join(';');
        }
      },

      watch: {
        animated() {
          const children = this.getChildren()
          children.forEach((child, index) =>
            child.updateRender(index === this.currentIndex, this)
          )
        },
        active(name) {
          if (name !== this.getCurrentName()) {
            this.setCurrentIndexByName(name)
          }
        },
        swipeThreshold(val) {
          const children = this.getChildren()
          this.scrollable = children.length > val || !this.ellipsis
        }
      },

      mounted() {

        setTimeout(() => {
          this.resize()
          this.scrollIntoView()
        }, 1000 / 30);

        // this.$nextTick(() => {

        // })
      },

      methods: {
        tabClassFn(active, ellipsis) {
          var classes = ['tab-class', this.tabClass]

          if (active) {
            classes.push('tab-active-class')
            classes.push(this.tabActiveClass)
          }

          if (ellipsis) {
            classes.push('van-ellipsis')
          }

          return classes.join(' ')
        },
        tabStyle(
          active,
          ellipsis,
          color,
          type,
          disabled,
          activeColor,
          inactiveColor,
          swipeThreshold,
          scrollable
        ) {
          var styles = []
          var isCard = type === 'card'
          // card theme color
          if (color && isCard) {
            styles.push('border-color:' + color)

            if (!disabled) {
              if (active) {
                styles.push('background-color:' + color)
              } else {
                styles.push('color:' + color)
              }
            }
          }

          var titleColor = active ? activeColor : inactiveColor
          if (titleColor) {
            styles.push('color:' + titleColor)
          }

          if (scrollable && ellipsis) {
            styles.push('flex-basis:' + 88 / swipeThreshold + '%')
          }

          return styles.join(';')
        },
        updateContainer() {
          let selectorQuery
          // #ifndef MP-ALIPAY
          selectorQuery = uni.createSelectorQuery().in(this)
          // #endif
          // #ifdef MP-ALIPAY
          selectorQuery = uni.createSelectorQuery()
          // #endif
          selectorQuery
            .select(`.van-tabs-${this._uid}`)
            .boundingClientRect(res => {
              this.container = res
            })
            .exec()
        },

        getChildren() {
          return getComponentByOptionsName(this, 'VanTab')
        },

        updateTabs() {
          const children = this.getChildren()
          this.tabs = children.map((child, index) => ({
            dot: child.dot,
            info: child.info,
            title: child.title,
            disabled: child.disabled,
            titleStyle: child.titleStyle,
            name: child.name,
            active: child.active,
            inited: child.inited,
            shouldShow: child.shouldShow,
            shouldRender: child.shouldRender,
            tabsItemClass: `${this.tabClassFn(
            index === this.currentIndex,
            this.ellipsis
          )} ${utils.bem('tab', {
            active: index === this.currentIndex,
            disabled: child.disabled,
            complete: !this.ellipsis
          })} van-tab-${this._uid}-${index}`,
            tabsItemStyle: `${this.tabStyle(
            index === this.currentIndex,
            this.ellipsis,
            this.color,
            this.type,
            child.disabled,
            this.titleActiveColor,
            this.titleInactiveColor,
            this.swipeThreshold,
            this.scrollable
          )}`
          }))
          this.scrollable = children.length > this.swipeThreshold || !this.ellipsis

          const currentName = this.getCurrentName()
          this.setCurrentIndexByName(isDef(currentName) ? currentName : this.active)
        },

        trigger(eventName, child) {
          const {
            currentIndex
          } = this
          const children = this.getChildren()
          const currentChild = child || children[currentIndex]

          if (!isDef(currentChild)) {
            return
          }

          if (!currentChild.disabled) {
            this.updateTabs(currentChild)
          }

          this.$emit(eventName, {
            index: currentChild.index,
            name: currentChild.getComputedName(),
            title: currentChild.title
          })
        },

        onTap(index) {
          const children = this.getChildren()
          const child = children[index]

          if (child.disabled) {
            this.trigger('disabled', child)
          } else {
            this.setCurrentIndex(index)
            this.$nextTick(() => {
              this.trigger('click')
            })
          }
        },

        // correct the index of active tab
        setCurrentIndexByName(name) {
          const children = this.getChildren()
          const index = children.findIndex(child => child.getComputedName() === name)

          if (index !== -1) {
            this.setCurrentIndex(index)
          }
        },

        setCurrentIndex(currentIndex) {
          const children = this.getChildren()

          if (
            !isDef(currentIndex) ||
            currentIndex >= children.length ||
            currentIndex < 0
          ) {
            return
          }

          children.forEach((item, index) => {
            const active = index === currentIndex
            if (active !== item.active || !item.inited) {
              item.updateRender(active, this)
            } else {
              item.updateRender(active, this)
            }
          })

          if (currentIndex === this.currentIndex) {
            if (this.inited) {
              this.resize();
            }
            return;
          }

          const shouldEmitChange = this.currentIndex !== null
          this.currentIndex = currentIndex

          this.$nextTick(() => {
            this.resize()
            this.scrollIntoView()
            this.updateContainer()

            this.trigger('input')
            if (shouldEmitChange) {
              this.trigger('change')
            }
          })
        },

        getCurrentName() {
          const children = this.getChildren()
          const activeTab = children[this.currentIndex]

          if (activeTab) {
            return activeTab.getComputedName()
          }
        },


        resize() {
          if (this.type !== 'line') {
            return;
          }

          const {
            currentIndex,
            ellipsis,
            skipTransition
          } = this;

          Promise.all([
            getAllRect(this, '.van-tab'),
            getRect(this, '.van-tabs__line'),
          ]).then(([rects = [], lineRect]) => {
            const rect = rects[currentIndex];

            if (rect == null) {
              return;
            }

            let lineOffsetLeft = rects
              .slice(0, currentIndex)
              .reduce((prev, curr) => prev + curr.width, 0);

            lineOffsetLeft +=
              (rect.width - lineRect.width) / 2 + (ellipsis ? 0 : 8);
            this.lineOffsetLeft = lineOffsetLeft
            this.inited = true
            // this.setData({
            //   lineOffsetLeft,
            //   inited: true
            // });
            this.swiping = true;

            this.lineStyle = `
            width: ${addUnit(this.lineWidth)};
            opacity:${this.inited ? 1 : 0};
            background-color: ${this.color};
            transform: ${'translateX(' + this.lineOffsetLeft + 'px)'};
            -webkit-transform: ${'translateX(' + this.lineOffsetLeft + 'px)'};
            height:${this.lineHeight !== -1 ?addUnit(this.lineHeight) : null};
            border-radius:
                  ${this.lineHeight !== -1 ? addUnit(this.lineHeight) : null};
            transition-duration: ${this.skipTransition ? this.duration + 's' : null};
            `

            if (skipTransition) {
              // waiting transition end
              setTimeout(() => {
                this.skipTransition = false




                // this.setData({
                //   skipTransition: false
                // });
              }, this.duration);
            }
          });
        },

        setLine(skipTransition) {
          if (this.type !== 'line') {
            return
          }

          const {
            color,
            duration,
            currentIndex,
            lineWidth,
            lineHeight
          } = this
          this.$nextTick(() => {
            let doGetRect
            // #ifdef MP-ALIPAY
            const children = this.getChildren()
            doGetRect = () => Promise.all(children.map((item, index) => this.getRect(
              `.van-tab-${this._uid}-${index}`,
              true)))
            // #endif
            // #ifndef MP-ALIPAY
            doGetRect = () => getAllRect(this, '.van-tab')
            // #endif

            doGetRect().then((rects = []) => {
              // #ifdef MP-ALIPAY
              rects = rects.reduce((prev, curr) => prev.concat(curr), [])
              // #endif
              const rect = rects[currentIndex]
              if (rect == null) {
                return
              }
              const height =
                lineHeight !== -1 ?
                `height: ${addUnit(lineHeight)}; border-radius: ${addUnit(
                    lineHeight
                  )};` :
                ''

              let left = rects
                .slice(0, currentIndex)
                .reduce((prev, curr) => prev + curr.width, 0);

              console.log(rect)
              left += (rect.width - lineWidth) / 2;
              //(rect.width - lineRect.width) / 2 + (ellipsis ? 0 : 8);
              const transition = skipTransition ?
                '' :
                `transition-duration: ${duration}s; -webkit-transition-duration: ${duration}s;`

              this.lineStyle = `
              ${height}
              width: ${addUnit(lineWidth)};
              background-color: ${color};
              -webkit-transform: translateX(${left}px);
              transform: translateX(${left}px);
              ${transition}
            `
            })
          })

        },

        scrollIntoView1() {
          const {
            currentIndex,
            scrollable,
            scrollWithAnimation
          } = this;

          if (!scrollable) {
            return;
          }

          Promise.all([
            getAllRect(this, '.van-tab'),
            getRect(this, '.van-tabs__nav'),
          ]).then(([tabRects, navRect]) => {
            const tabRect = tabRects[currentIndex];
            const offsetLeft = tabRects
              .slice(0, currentIndex)
              .reduce((prev, curr) => prev + curr.width, 0);
            this.scrollLeft = offsetLeft - (navRect.width - tabRect.width) / 2
            // this.setData({
            //   scrollLeft: offsetLeft - (navRect.width - tabRect.width) / 2,
            // });

            if (!scrollWithAnimation) {
              this.$nextTick(() => {
                this.scrollWithAnimation = true

                this.lineStyle = `
                width: ${addUnit(this.lineWidth)};
                opacity:${this.inited ? 1 : 0};
                background-color: ${this.color};
                transform: ${'translateX(' + this.lineOffsetLeft + 'px)'};
                -webkit-transform: ${'translateX(' + this.lineOffsetLeft + 'px)'};
                height:${this.lineHeight !== -1 ?addUnit(this.lineHeight) : null};
                border-radius:
                      ${this.lineHeight !== -1 ? addUnit(this.lineHeight) : null};
                transition-duration: ${this.skipTransition ? this.duration + 's' : null},
                `
                // this.setData({
                //   scrollWithAnimation: true
                // });
              });
            }
          });
        },

        // scroll active tab into view
        scrollIntoView() {
          const {
            currentIndex,
            scrollable
          } = this

          if (!scrollable) {
            return
          }
          this.$nextTick(() => {
            let doGetRect
            // #ifdef MP-ALIPAY
            const children = this.getChildren()
            doGetRect = () => Promise.all([
              ...(children.map((item, index) => this.getRect(`.van-tab-${this._uid}-${index}`, true))),
              this.getRect(`.van-tabs__nav-${this._uid}`)
            ]).then((rects = []) => {
              const tabRects = rects.slice(0, -1).reduce((prev, curr) => prev.concat(curr), [])
              const navRect = rects[rects.length - 1]
              return Promise.resolve([tabRects, navRect])
            })
            // #endif
            // #ifndef MP-ALIPAY
            doGetRect = () => Promise.all([
              getAllRect(this, '.van-tab'),
              getRect(this, '.van-tabs__nav')
            ]).then(([tabRects, navRect]) => Promise.resolve([tabRects, navRect]))
            // #endif

            doGetRect().then(([tabRects, navRect]) => {
              const tabRect = tabRects[currentIndex]
              const offsetLeft = tabRects
                .slice(0, currentIndex)
                .reduce((prev, curr) => prev + curr.width, 0)

              this.scrollLeft = offsetLeft - (navRect.width - tabRect.width) / 2
            })
          })


        },

        onTouchScroll(event) {
          this.$emit('scroll', event.detail)
        },

        onTouchStart(event) {
          if (!this.swipeable) return

          this.touchStart(event)
        },

        onTouchMove(event) {
          if (!this.swipeable) return

          this.touchMove(event)
        },

        // watch swipe touch end
        onTouchEnd() {
          if (!this.swipeable) return

          const {
            direction,
            deltaX,
            offsetX
          } = this
          const minSwipeDistance = 50

          if (direction === 'horizontal' && offsetX >= minSwipeDistance) {
            const index = this.getAvaiableTab(deltaX)
            if (index !== -1) {
              this.setCurrentIndex(index)
            }
          }
        },

        getAvaiableTab(direction) {
          const {
            tabs,
            currentIndex
          } = this
          const step = direction > 0 ? -1 : 1

          for (
            let i = step; currentIndex + i < tabs.length && currentIndex + i >= 0; i += step
          ) {
            const index = currentIndex + i

            if (
              index >= 0 &&
              index < tabs.length &&
              tabs[index] &&
              !tabs[index].disabled
            ) {
              return index
            }
          }

          return -1
        }
      }
    })
  }
</script>

<style lang="less">
  @import './index.less';
</style>
