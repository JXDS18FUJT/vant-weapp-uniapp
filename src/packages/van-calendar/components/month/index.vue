<template>
  <!-- <wxs src="./index.wxs" module="computed"></wxs>
  <wxs src="../../../wxs/utils.wxs" module="utils" /> -->

  <view class="van-calendar__month">
    <view v-if="showMonthTitle" class="van-calendar__month-title">
      {{ formatMonthTitle(date) }}
    </view>

    <view v-if="visible" class="van-calendar__days">
      <view v-if="showMark" class="van-calendar__month-mark">
        {{ getMark(date) }}
      </view>

      <view v-for="(item, index) in days" :key="index"
        style="getDayStyle(item.type, index, date, rowHeight, color, firstDayOfWeek)"
        :class="'van-calendar__day '+'van-calendar__day--'+item.type" @click="onClick(index)">
        <view v-if="item.type === 'selected'" class="van-calendar__selected-day"
          :style="{ width: rowHeight + 'px', height: rowHeight + 'px', background: color }">
          <view v-if="item.topInfo" class="van-calendar__top-info">{{ item.topInfo }}</view>
          {{ item.text }}
          <view v-if="item.bottomInfo" class="van-calendar__bottom-info">
            {{ item.bottomInfo }}
          </view>
        </view>

        <view v-else>
          <view v-if="item.topInfo" class="van-calendar__top-info">{{ item.topInfo }}</view>
          {{ item.text }}
          <view v-if="item.bottomInfo" class="van-calendar__bottom-info">
            {{ item.bottomInfo }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    VantComponent
  } from '../../../common/component';
  import {
    getMonthEndDay,
    compareDay,
    getPrevDay,
    getNextDay,
    formatMonthTitle,
    getMark,
    getDayStyle,
    getMonthStyle
  } from '../../utils';
  import utils from './../../../wxs/utils'
  export default {
    ...VantComponent({
      props: {
        date: {
          type: [Date, Number],
          default: null

        },
        type: {
          type: String,
          default: 'single'

        },
        color: String,
        minDate: {
          type: [Date, Number],


        },
        maxDate: {
          type: [Date, Number],


        },
        showMark: {
          type: Boolean
        },
        rowHeight: {
          type: String,
          default: null
        },
        formatter: {
          type: String,
          default: null

        },
        currentDate: {
          type: [Date, Number],
          default: null

        },
        firstDayOfWeek: {
          type: Number,

        },
        allowSameDay: {
          type: Boolean
        },
        showSubtitle: {
          type: Boolean
        },
        showMonthTitle: {
          type: Boolean
        },
      },
      mounted() {
        this.setDays()
        //console.log(this.days)


      },
      watch: {
        minDate() {
          this.setDays()

        },
        maxDate() {
          this.setDays()
        },
        formatter() {
          this.setDays()
        },
        type() {
          this.setDays()
        },
        date() {
          this.setDays()
        },
        currentDate() {
          this.setDays()
        },
        firstDayOfWeek() {
          this.setDays()
        }

      },
      computed: {
        calendarDay() {
          const {
            disabled
          } = this
          return `calendar__day ${ utils.bem('field__label', disabled)}`
        }
      },

      data() {
        return {
          visible: true,
          days: [],
        }


      },
      methods: {
        getMark(date) {

          if (!(date instanceof Date)) {
            date = new Date(date);
          }
          return (date.getMonth() + 1)
        },
        formatMonthTitle,
        onClick(index) {
          const item = this.days[index];
          if (item.type !== 'disabled') {

            this.$emit('click', item);
          }
        },

        setDays() {
          const days = [];
          const startDate = new Date(this.date);
          const year = startDate.getFullYear();
          const month = startDate.getMonth();

          const totalDay = getMonthEndDay(year, month + 1);

          for (let day = 1; day <= totalDay; day++) {
            const date = new Date(year, month, day);
            const type = this.getDayType(date);



            let config = {
              date,
              type,
              text: day,
              bottomInfo: this.getBottomInfo(type),
            };

            if (this.formatter) {
              config = this.formatter(config);
            }

            days.push(config);
          }

          this.days = days;
        },

        getMultipleDayType(day) {
          if (!Array.isArray(this.currentDate)) {
            return '';
          }

          const isSelected = (date) =>
            this.currentDate.some(item => compareDay(item, date) === 0);

          if (isSelected(day)) {
            const prevDay = getPrevDay(day);
            const nextDay = getNextDay(day);
            const prevSelected = isSelected(prevDay);
            const nextSelected = isSelected(nextDay);

            if (prevSelected && nextSelected) return 'multiple-middle';
            if (prevSelected) return 'end';
            return nextSelected ? 'start' : 'multiple-selected';
          }

          return '';
        },

        getRangeDayType(day) {
          if (!Array.isArray(this.currentDate)) {
            return '';
          }

          const [startDay, endDay] = this.currentDate;

          if (!startDay) return '';

          const compareToStart = compareDay(day, startDay);

          if (!endDay) {
            return compareToStart === 0 ? 'start' : '';
          }

          const compareToEnd = compareDay(day, endDay);

          if (compareToStart === 0 && compareToEnd === 0 && this.allowSameDay) {
            return 'start-end';
          }

          if (compareToStart === 0) return 'start';
          if (compareToEnd === 0) return 'end';
          if (compareToStart > 0 && compareToEnd < 0) return 'middle';

          return '';
        },

        getDayType(day) {
          if (compareDay(day, this.minDate) < 0 || compareDay(day, this.maxDate) > 0) {
            return 'disabled';
          }

          if (this.type === 'single') {
            // console.log('222', day, this.currentDate, day.getDate())
            return compareDay(day, this.currentDate) === 0 ? 'selected' : '';
          }

          if (this.type === 'multiple') {
            return this.getMultipleDayType(day);
          }

          if (this.type === 'range') {
            return this.getRangeDayType(day);
          }

          return '';
        },

        getBottomInfo(type) {
          if (this.type === 'range') {
            if (type === 'start') return '开始';
            if (type === 'end') return '结束';
            if (type === 'start-end') return '开始/结束';
          }
          return '';
        },
      },

    })

  }
</script>

<style lang="less">
  @import './index.less';
</style>
