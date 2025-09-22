<template>
  <div class="van-calendar__header">

    <div v-if="showTitle">
      <div class="van-calendar__header-title">
        <slot name="title"></slot>
      </div>
      <div class="van-calendar__header-title">{{ title }}</div>
    </div>

    <div v-if="showSubtitle" class="van-calendar__header-subtitle" @click="onClickSubtitle">
      {{ subtitle }}
    </div>

    <div class="van-calendar__weekdays">
      <div v-for="(item, index) in weekdays" :key="index" class="van-calendar__weekday">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
  import {
    VantComponent
  } from '../../../common/component';
  export default {
    ...VantComponent({
      props: {
        title: {
          type: String,
          default: '日期选择',
        },
        subtitle: String,
        showTitle: {
          type: Boolean,
          default: true,
        },
        showSubtitle: Boolean,
        firstDayOfWeek: {
          type: Number,
        },
      },
      data() {
        return {
          weekdays: [],
        }
      },
      watch: {
        firstDayOfWeek(newValue, oldValue) {
          this.initWeekDay();
        }
      },

      mounted() {
        this.initWeekDay();
      },

      methods: {
        initWeekDay() {
          const defaultWeeks = ['日', '一', '二', '三', '四', '五', '六'];
          const firstDayOfWeek = this.firstDayOfWeek || 0;
          this.weekdays =  [
              ...defaultWeeks.slice(firstDayOfWeek, 7),
              ...defaultWeeks.slice(0, firstDayOfWeek),
            ]
          // this.setData({
          //   weekdays: [
          //     ...defaultWeeks.slice(firstDayOfWeek, 7),
          //     ...defaultWeeks.slice(0, firstDayOfWeek),
          //   ],
          // });
        },

        onClickSubtitle(event) {
          this.$emit('click-subtitle', event);
        },
      },
    })

  }
</script>

<style lang="less">
  @import './index.less';
</style>
