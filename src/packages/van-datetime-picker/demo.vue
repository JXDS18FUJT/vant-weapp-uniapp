<template>
  <demo-section>
    <demo-block card title="选择年月日">
      <van-datetime-picker
        @change="onChange1"
        v-model="value.date"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </demo-block>

    <demo-block card title="选择年月">
      <van-datetime-picker
        v-model="value.yearMonth"
        type="year-month"
        title="年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
      />
    </demo-block>

    <demo-block v-if="!isWeapp" card title="月日">
      <van-datetime-picker
        v-model="value.monthDayType"
        type="month-day"
        title="月日"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
      />
    </demo-block>

    <demo-block card title="时间">
      <van-datetime-picker
        v-model="value.time"
        type="time"
        title="时间"
        :min-hour="10"
        :max-hour="20"
      />
    </demo-block>

    <demo-block card title="完整时间">
      <van-datetime-picker
        v-model="value.datetime"
        type="datetime"
        title="完整时间"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </demo-block>

    <demo-block v-if="!isWeapp" card title="选择年月日小时">
      <van-datetime-picker
        v-model="value.datehour"
        type="datehour"
        title="选择年月日小时"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </demo-block>

    <demo-block card title="过滤选项">
      <van-datetime-picker
        v-model="value.optionFilter"
        type="time"
        title="过滤选项"
        :filter="filter"
      />
    </demo-block>

    <demo-block v-if="!isWeapp" card title="自定义列排序">
      <van-datetime-picker
        v-model="value.sortColumnsDate"
        type="date"
        title="自定义列排序"
        :columns-order="['month', 'day', 'year']"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
      />
    </demo-block>
  </demo-section>
</template>

<script>
export default {
  i18n: {
    'zh-CN': {
      day: '日',
      year: '年',
      month: '月',
      timeType: '选择时间',
      dateType: '选择年月日',
      datetimeType: '选择完整时间',
      datehourType: '选择年月日小时',
      monthDayType: '选择月日',
      yearMonthType: '选择年月',
      optionFilter: '选项过滤器',
      sortColumns: '自定义列排序',
    },
    'en-US': {
      day: ' Day',
      year: ' Year',
      month: ' Month',
      timeType: 'Choose Time',
      dateType: 'Choose Date',
      datetimeType: 'Choose DateTime',
      datehourType: 'Choose DateHour',
      monthDayType: 'Choose Month-Day',
      yearMonthType: 'Choose Year-Month',
      optionFilter: 'Option Filter',
      sortColumns: 'Columns Order',
    },
  },

  data() {
    return {
      isWeapp:true,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      value: {
        date: new Date(2021, 0, 17),
        time: '12:00',
        datetime: new Date(2020, 0, 1),
        datehour: new Date(2020, 0, 1),
        monthDay: new Date(2020, 0, 1),
        yearMonth: new Date(2020, 0, 1),
        optionFilter: '12:00',
        sortColumnsDate: new Date(2020, 0, 1),
      },
    };
  },

  methods: {
    onChange1(e){
      console.log(e)

    },
    formatter(type, value) {
      if (type === 'year') {
        return value + '年';
      }
      if (type === 'month') {
        return value + '月';
      }
      if (type === 'day') {
        return value + '日';
      }
      return value;
    },

    filter(type, values) {
      if (type === 'minute') {
        return values.filter((value) => value % 5 === 0);
      }

      return values;
    },
  },
};
</script>
