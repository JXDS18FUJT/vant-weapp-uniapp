<template>
  <view class="van-calendar">
    <header :title="title" :showTitle="showTitle" :subtitle="subtitle" :showSubtitle="showSubtitle"
      :firstDayOfWeek="firstDayOfWeek" @click-subtitle="onClickSubtitle">
      <slot name="title" slot="title"></slot>
    </header>

    <scroll-view class="van-calendar__body" scroll-y :scroll-into-view="scrollIntoView">
      <month v-for="(item, index) in months" :key="index" :id="'month' + index" class="month" :date="item" :type="type"
        :color="color" :min-date="minDate" :max-date="maxDate" :show-mark="showMark" :formatter="formatter"
        :row-height="rowHeight" :current-date="currentDate" :show-subtitle="showSubtitle" :allow-same-day="allowSameDay"
        :show-month-title="index !== 0 || !showSubtitle" :first-day-of-week="firstDayOfWeek" @click="onClickDay" />
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
</template>
<!-- <wxs src="./index.wxs" module="computed" />
<wxs src="../wxs/utils.wxs" module="utils" /> -->
<script>
  import {
    VantComponent
  } from './../../common/component';
 import utils from './../wxs/utils.js';
  import {
    getMonthEndDay,
    compareDay,
    getPrevDay,
    getNextDay,
  } from '../../utils';
  export default {
    methods: {


    },
    computed: {
      calendarFooter() {
        // const {
        //   safeAreaInsetBottom
        // } = this
        return `${ utils.bem('calendar__footer', { safeAreaInsetBottom:true }))}`
      }
    }



  }
</script>
