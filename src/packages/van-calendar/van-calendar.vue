<template>
  <view>
    <!-- 弹出日历 -->
    <van-popup v-if="poppable" :show="show" :position="position" :round="round"
      :close-on-click-overlay="closeOnClickOverlay" :safe-area-inset-bottom="safeAreaInsetBottom"
      :closeable="showTitle || showSubtitle" :custom-class="'van-calendar__popup--'+position"
      :class="'van-calendar__popup--'+position" close-icon-class="van-calendar__close-icon" @open="onOpen"
      @opened="onOpened" @close="onClose" @closed="onClosed">
      <view class="van-calendar">
        <vheader :title="title" :showTitle="showTitle" :subtitle="subtitle" :showSubtitle="showSubtitle"
          :firstDayOfWeek="firstDayOfWeek" @click-subtitle="onClickSubtitle">
        </vheader>

        <scroll-view class="van-calendar__body" scroll-y :scroll-into-view="scrollIntoView1">
          <view style="display: flex;overflow: auto;" v-for="(item, index) in getMonths(minDate,maxDate)" :key="index"
            :id="'month' + index">
            <vmonth class="month" :date="item" :type="type" :color="color" :min-date="minDate" :max-date="maxDate"
              :show-mark="showMark" :formatter="formatter" :row-height="rowHeight" :current-date="currentDate"
              :show-subtitle="showSubtitle" :allow-same-day="allowSameDay"
              :show-month-title="index !== 0 || !showSubtitle" :first-day-of-week="firstDayOfWeek"
              @click="onClickDay" />
          </view>

        </scroll-view>

        <view :class="calendarFooter">
          <slot name="footer"></slot>
        </view>

        <view :class="calendarFooter">
          <van-button v-if="showConfirm" round block type="danger" :color="color" custom-class="van-calendar__confirm"
            :disabled="getButtonDisabled(type, currentDate, minRange)" nativeType="text" bind:click="onConfirm">
            {{
             getButtonDisabled(type, currentDate, minRange)
               ? confirmDisabledText
               : confirmText
           }}
          </van-button>
        </view>
      </view>
    </van-popup>

    <!-- 非弹出模式 -->

    <view v-else class="van-calendar">
      <vheader :title="title" :showTitle="showTitle" :subtitle="subtitle" :showSubtitle="showSubtitle"
        :firstDayOfWeek="firstDayOfWeek" @click-subtitle="onClickSubtitle">
      </vheader>

      <scroll-view class="van-calendar__body" scroll-y :scroll-into-view="scrollIntoView1">
        <view style="display: flex;overflow: auto;" v-for="(item, index) in getMonths(minDate,maxDate)" :key="index"
          :id="'month' + index">
          <vmonth ref="month" class="month" :date="item" :type="type" :color="color" :min-date="minDate"
            :max-date="maxDate" :show-mark="showMark" :formatter="formatter" :row-height="rowHeight"
            :current-date="currentDate" :show-subtitle="showSubtitle" :allow-same-day="allowSameDay"
            :show-month-title="index !== 0 || !showSubtitle" :first-day-of-week="firstDayOfWeek" @click="onClickDay" />
        </view>

      </scroll-view>

      <view :class="calendarFooter">
        <slot name="footer"></slot>
      </view>

      <view :class="calendarFooter">
        <van-button v-if="showConfirm" round block type="danger" :color="color" custom-class="van-calendar__confirm"
          :disabled="getButtonDisabled(type, currentDate, minRange)" nativeType="text" bind:click="onConfirm">
          {{
           getButtonDisabled(type, currentDate, minRange)
             ? confirmDisabledText
             : confirmText
         }}
        </van-button>
      </view>
    </view>
    <!--  <Calendar v-else /> -->

    <!-- 提示 toast -->
    <van-toast />
  </view>
</template>
<script>
  import {
    VantComponent
  } from '../common/component';
  import {
    ROW_HEIGHT,
    getPrevDay,
    getNextDay,
    getToday,
    compareDay,
    copyDates,
    calcDateNum,
    formatMonthTitle,
    compareMonth,
    getMonths,
    getDayByOffset,
    getButtonDisabled
  } from './utils';
  import {
    Day
  } from './components/month/index';
  import month from './components/month/index';
  import header from './components/header/index';
  import Toast from '../van-toast/toast';
  import {
    requestAnimationFrame
  } from '../common/utils';

  const initialMinDate = getToday().getTime();

  const initialMaxDate = (() => {
    const now = getToday();
    return new Date(
      now.getFullYear(),
      now.getMonth() + 6,
      now.getDate()
    ).getTime();
  })();

  const getTime = (date) =>
    date instanceof Date ? date.getTime() : date;

  export default {
    components: {
      vmonth: month,
      vheader: header,

    },
    ...VantComponent({
      props: {
        title: {
          type: String,
          default: '日期选择',
        },
        color: String,
        show: {
          type: Boolean,
          default: false
        },
        formatter: null,
        confirmText: {
          type: String,
          value: '确定',
        },
        confirmDisabledText: {
          type: String,
          value: '确定',
        },
        rangePrompt: String,
        showRangePrompt: {
          type: Boolean,
          value: true,
        },
        defaultDate: {
          type: [Date, Number],
          default: +new Date()

        },
        allowSameDay: Boolean,
        type: {
          type: String,
          default: 'single',

        },
        minDate: {
          type: [Date, Number],
          default: initialMinDate,
        },
        maxDate: {
          type: [Date, Number],
          default: initialMaxDate,
        },
        position: {
          type: String,
          default: 'bottom',
        },
        rowHeight: {
          type: null,
          default: ROW_HEIGHT,
        },
        round: {
          type: Boolean,
          default: true,
        },
        poppable: {
          type: Boolean,
          default: true,
        },
        showMark: {
          type: Boolean,
          default: true,
        },
        showTitle: {
          type: Boolean,
          default: true,
        },
        showConfirm: {
          type: Boolean,
          default: true,
        },
        showSubtitle: {
          type: Boolean,
          default: true,
        },
        safeAreaInsetBottom: {
          type: Boolean,
          default: true,
        },
        closeOnClickOverlay: {
          type: Boolean,
          default: true,
        },
        maxRange: {
          type: null,
          default: null,
        },
        minRange: {
          type: Number,
          default: 1,
        },
        firstDayOfWeek: {
          type: Number,
          default: 0,
        },
        readonly: Boolean,
        rootPortal: {
          type: Boolean,
          default: false,
        },
      },
      data() {
        return {
          months: [],
          subtitle: '',
          currentDate: null,
          scrollIntoView1: '',
        }
      },
      // computed: {
      //   calendarFooter() {
      //     // const {
      //     //   safeAreaInsetBottom
      //     // } = this
      //     return `${ utils.bem('calendar__footer', { safeAreaInsetBottom:true }))}`
      //   }
      // },

      watch: {
        type() {
          this.months = getMonths(this.minDate, this.maxDate)

          this.currentDate = this.getInitialDate(this.defaultDate)
          // this.initRect();
        },
        minDate() {
          this.months = getMonths(this.minDate, this.maxDate)

          this.currentDate = this.getInitialDate(this.defaultDate)
          this.initRect();
        },
        maxDate() {
          this.months = getMonths(this.minDate, this.maxDate)

          this.currentDate = this.getInitialDate(this.defaultDate)
          this.initRect();
        },
      },

      created() {
        this.months = getMonths(this.minDate, this.maxDate)

        this.currentDate = this.getInitialDate(this.defaultDate)

        // this.currentDate = new Date()
        console.log(this.currentDate, this.type,this.defaultDate)
      },

      mounted() {
        console.log(this.defaultDate)
        if (this.show || !this.poppable) {
          this.initRect();
          this.scrollIntoView();
        }
      },

      methods: {
        getButtonDisabled,
        getMonths,
        reset() {

          this.currentDate = this.getInitialDate(this.defaultDate)

          this.scrollIntoView();
        },

        initRect() {
          // if (this.contentObserver != null) {
          //   this.contentObserver.disconnect();
          // }

          // const contentObserver = this.createIntersectionObserver({
          //   thresholds: [0, 0.1, 0.9, 1],
          //   observeAll: true,
          // });

          // this.contentObserver = contentObserver;

          // contentObserver.relativeTo('.van-calendar__body');
          // contentObserver.observe('.month', (res) => {
          //   if (res.boundingClientRect.top <= res.relativeRect.top) {
          //     // @ts-ignore
          //     this.setData({
          //       subtitle: formatMonthTitle(res.dataset.date)
          //     });
          //   }
          // });
        },

        limitDateRange(
          date,
          minDate,
          maxDate
        ) {
          minDate = minDate || (this.minDate);
          maxDate = maxDate || (this.maxDate);
          if (compareDay(date, minDate) === -1) {
            return minDate;
          }
          if (compareDay(date, maxDate) === 1) {
            return maxDate;
          }
          return date;
        },

        getInitialDate(defaultDate = null) {
          const {
            type,
            minDate,
            maxDate,
            allowSameDay
          } = this;

          if (!defaultDate) return [];

          const now = getToday().getTime();

          if (type === 'range') {
            if (!Array.isArray(defaultDate)) {
              defaultDate = [];
            }

            const [startDay, endDay] = defaultDate || [];

            const startDate = getTime(startDay || now);
            const start = this.limitDateRange(
              startDate,
              minDate,
              allowSameDay ? startDate : getPrevDay(new Date(maxDate)).getTime()
            );

            const date = getTime(endDay || now);
            const end = this.limitDateRange(
              date,
              allowSameDay ? date : getNextDay(new Date(minDate)).getTime()
            );

            return [start, end];
          }

          if (type === 'multiple') {
            if (Array.isArray(defaultDate)) {
              return defaultDate.map((date) => this.limitDateRange(date));
            }

            return [this.limitDateRange(now)];
          }

          if (!defaultDate || Array.isArray(defaultDate)) {
            defaultDate = now;
          }
          console.log('limitDateRange')
          return this.limitDateRange(defaultDate);
        },

        scrollIntoView() {
          requestAnimationFrame(() => {
            const {
              currentDate,
              type,
              show,
              poppable,
              minDate,
              maxDate
            } =
            this;
            if (!currentDate) return;
            // @ts-ignore
            const targetDate = type === 'single' ? currentDate : currentDate[0];
            const displayed = show || !poppable;
            if (!targetDate || !displayed) {
              return;
            }

            const months = getMonths(minDate, maxDate);

            months.some((month, index) => {
              if (compareMonth(month, targetDate) === 0) {

                this.scrollIntoView1 = `month${index}`

                return true;
              }

              return false;
            });
          });
        },

        onOpen() {
          this.$emit('open');
        },

        onOpened() {
          this.$emit('opened');
        },

        onClose() {
          this.$emit('close');
        },

        onClosed() {
          this.$emit('closed');
        },

        onClickDay(event) {
          if (this.readonly) {
            return;
          }

          let {
            date
          } = event;
          const {
            type,
            currentDate,
            allowSameDay
          } = this;

          if (type === 'range') {
            // @ts-ignore
            const [startDay, endDay] = currentDate;

            if (startDay && !endDay) {
              const compareToStart = compareDay(date, startDay);

              if (compareToStart === 1) {
                // selectComponent h5 没有data 属性 小程序有
                const vmonth = this.selectComponent('.month')
                const days = vmonth.data ? vmonth.data.days : vmonth.days;
                days.some((day, index) => {
                  const isDisabled =
                    day.type === 'disabled' &&
                    getTime(startDay) < getTime(day.date) &&
                    getTime(day.date) < getTime(date);
                  if (isDisabled) {
                    ({
                      date
                    } = days[index - 1]);
                  }
                  return isDisabled;
                });
                this.select([startDay, date], true);
              } else if (compareToStart === -1) {
                this.select([date, null]);
              } else if (allowSameDay) {
                this.select([date, date], true);
              }
            } else {
              this.select([date, null]);
            }
          } else if (type === 'multiple') {
            let selectedIndex;

            // @ts-ignore
            const selected = currentDate.some((dateItem, index) => {
              const equal = compareDay(dateItem, date) === 0;
              if (equal) {
                selectedIndex = index;
              }
              return equal;
            });

            if (selected) {
              // @ts-ignore
              const cancelDate = currentDate.splice(selectedIndex, 1);
              this.currentDate = currentDate
              // this.setData({
              //   currentDate
              // });
              this.unselect(cancelDate);
            } else {
              // @ts-ignore
              this.select([...currentDate, date]);
            }
          } else {
            this.select(date, true);
          }
        },

        unselect(dateArray) {
          const date = dateArray[0];
          if (date) {
            this.$emit('unselect', copyDates(date));
          }
        },

        select(date, complete) {
          if (complete && this.type === 'range') {
            const valid = this.checkRange(date);

            if (!valid) {
              // auto selected to max range if showConfirm
              if (this.showConfirm) {
                this.emit([
                  date[0],
                  getDayByOffset(date[0], this.maxRange - 1),
                ]);
              } else {
                this.emit(date);
              }
              return;
            }
          }

          this.emit(date);

          if (complete && !this.showConfirm) {
            this.onConfirm();
          }
        },

        emit(date) {

          this.currentDate = Array.isArray(date) ? date.map(getTime) : getTime(date),

            this.$emit('select', copyDates(date));
        },

        checkRange(date) {
          const {
            maxRange,
            rangePrompt,
            showRangePrompt
          } = this;

          if (maxRange && calcDateNum(date) > maxRange) {
            if (showRangePrompt) {
              Toast({
                context: this,
                message: rangePrompt || `选择天数不能超过 ${maxRange} 天`,
              });
            }
            this.$emit('over-range');

            return false;
          }

          return true;
        },

        onConfirm() {
          if (
            this.type === 'range' &&
            !this.checkRange(this.currentDate)
          ) {
            return;
          }
          wx.nextTick(() => {
            // @ts-ignore
            this.$emit('confirm', copyDates(this.currentDate));
          });
        },

        onClickSubtitle(event) {
          this.$emit('click-subtitle', event);
        },
      },
    })

  };
</script>

<style lang="less">
  @import './index.less';
</style>
