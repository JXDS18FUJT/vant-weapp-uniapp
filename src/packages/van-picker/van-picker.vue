<template>
  <view :class="customClass" class="van-picker custom-class">
    <!-- 工具栏在顶部 -->
    <view :class="toolbarClass" class="van-picker__toolbar toolbar-class" v-if="toolbarPosition === 'top'">
      <view class="van-picker__cancel" hover-class="van-picker__cancel--hover" hover-stay-time="70" data-type="cancel"
        @click="emit">
        {{ cancelButtonText }}
      </view>
      <view v-if="title " class="van-picker__title van-ellipsis">{{
          title
        }}</view>
      <view class="van-picker__confirm" hover-class="van-picker__confirm--hover" hover-stay-time="70"
        data-type="confirm" @click="emit">
        {{ confirmButtonText }}
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="van-picker__loading">
      <van-loading color="#1989fa" />
    </view>

    <!-- 列表区域 -->
    <view class="van-picker__columns" :style="columnsStyle" @touchmove.stop="noop">
      <van-picker-column ref="picker__column" v-for="(item, index) in formateColumns" :key="index"
        :initialOptions="item.values"
        :default-index="item.defaultIndex !== undefined ? item.defaultIndex : defaultIndex" :item-height="itemHeight"
        :visible-item-count="visibleItemCount" :value-key="valueKey" :class="'van-picker__column ' +columnClass"
        :active-class="activeClass" @change="onChange" />

      <view class="van-picker__mask" :style="'background-size: 100% ' + (itemHeight * (visibleItemCount - 1)/2)+'px'" />
      <view class="van-picker__frame van-hairline--top-bottom" :style="{
        height:itemHeight+'px'
      }" />
    </view>

    <!-- 工具栏在底部 -->
    <view :class="toolbarClass" class="van-picker__toolbar toolbar-class" v-if="toolbarPosition === 'bottom'">
      <view class="van-picker__cancel" hover-class="van-picker__cancel--hover" hover-stay-time="70" data-type="cancel"
        @click="emit">
        {{ cancelButtonText }}
      </view>
      <view v-if="title " class="van-picker__title van-ellipsis">{{
         title
       }}</view>
      <view class="van-picker__confirm" hover-class="van-picker__confirm--hover" hover-stay-time="70"
        data-type="confirm" @click="emit">
        {{ confirmButtonText }}
      </view>
    </view>
  </view>
</template>

<script>
  import {
    VantComponent
  } from '../common/component'
  import {
    pickerProps,

  } from './shared';
  import style from './../wxs/style.js'
  import addUnit from './../wxs/add-unit.js'
  import array from './../wxs/array.js'



  function columnsStyle(data) {
    return style({
      height: addUnit(data.itemHeight * data.visibleItemCount),
    });
  }

  function maskStyle(data) {
    return style({
      'background-size': '100% ' + addUnit((data.itemHeight * (data.visibleItemCount - 1)) / 2),
    });
  }

  function frameStyle(data) {
    return style({
      height: addUnit(data.itemHeight),
    });
  }

  function columns(columns) {
    if (!Array.isArray(columns)) {

      return [];
    }

    if (columns.length && !columns[0].values) {
      return [{
        values: columns
      }];
    }

    return columns;
  }
  export default {
    ...VantComponent({
      classes: ['active-class', 'toolbar-class', 'column-class'],
      props: {
        ...pickerProps,
        valueKey: {
          type: String,
          default: 'text',
        },
        toolbarPosition: {
          type: String,
          default: 'top',
        },
        defaultIndex: {
          type: Number,
          default: 0,
        },
        columns: {
          type: Array,
          default: () => {
            return []
          },

        },
      },
      data() {
        return {
          formateColumns: [],
          simple: '',
          children:[]
        }
      },
      computed: {
        frameStyle() {
          return `${frameStyle({ itemHeight:this.itemHeight })}`
        },
        maskStyle() {
          return `${maskStyle({ itemHeight:this.itemHeight,visibleItemCount:this.visibleItemCount })}`
        }

      },
      watch: {
        columns: {
          handler(newVal, oldVal) {

            this.simple = newVal.length && !newVal[0].values;
            this.formateColumns = columns(newVal)

            if (Array.isArray(this.children) && this.children.length) {
              this.setColumns().catch(() => {});
            }
          },
          immediate: true

        }
      },
      mounted() {

        Object.defineProperty(this, 'children', {
          get: () => this.$refs['picker__column'] || [],
        });
        console.log('执行了代码', this.$refs['picker__column'])
        this.children = this.$refs['picker__column']
      },

      methods: {
        noop() {},
        // columns(columns) {
        //   if (!array.isArray(columns)) {
        //     return [];
        //   }

        //   if (columns.length && !columns[0].values) {
        //     return [{
        //       values: columns
        //     }];
        //   }

        //   return columns;
        // },

        setColumns() {
          const {
            columns
          } = this;
          const _columns = this.simple ? [{
            values: columns
          }] : columns;
          const stack = _columns.map((column, index) =>
            this.setColumnValues(index, column.values)
          );
          return Promise.all(stack);
        },

        emit(event) {
          const {
            type
          } = event.currentTarget.dataset;
          if (this.simple) {
            this.$emit(type, {
              value: this.getColumnValue(0),
              index: this.getColumnIndex(0),
            });
          } else {
            this.$emit(type, {
              value: this.getValues(),
              index: this.getIndexes(),
            });
          }
        },

        onChange(event) {
          // console.log(event)
          if (this.simple) {
            this.$emit('change', {
              picker: this,
              value: this.getColumnValue(0),
              index: this.getColumnIndex(0),
            });
          } else {
            this.$emit('change', {
              picker: this,
              value: this.getValues(),
              index: event,
            });
          }
        },

        // get column instance by index
        getColumn(index) {
          return this.children[index];
        },

        // get column value by index
        getColumnValue(index) {
          const column = this.getColumn(index);
          return column && column.getValue();
        },

        // set column value by index
        setColumnValue(index,value) {
          const column = this.getColumn(index);

          if (column == null) {
            return Promise.reject(new Error('setColumnValue: 对应列不存在'));
          }

          return column.setValue(value);
        },

        // get column option index by column index
        getColumnIndex(columnIndex) {
          return (this.getColumn(columnIndex) || {}).currentIndex;
        },

        // set column option index by column index
        setColumnIndex(columnIndex, optionIndex) {
          const column = this.getColumn(columnIndex);

          if (column == null) {
            return Promise.reject(new Error('setColumnIndex: 对应列不存在'));
          }

          return column.setIndex(optionIndex);
        },

        // get options of column by index
        getColumnValues(index) {
          return (this.children[index] || {}).data.options;
        },

        // set options of column by index
        setColumnValues(index, options, needReset = true) {
          const column = this.children[index];

          if (column == null) {
            return Promise.reject(new Error('setColumnValues: 对应列不存在'));
          }

          const isSame =
            JSON.stringify(column.options) === JSON.stringify(options);

          if (isSame) {
            return Promise.resolve();
          }

          return column.setOptions({
            options
          }).then(() => {
            if (needReset) {
              column.setIndex(0);
            }
          });
        },

        // get values of all columns
        getValues() {
          return this.children.map((child) => child.getValue());
        },

        // set values of all columns
        setValues(values) {
          const stack = values.map((value, index) =>
            this.setColumnValue(index, value)
          );
          return Promise.all(stack);
        },

        // get indexes of all columns
        getIndexes() {
          return this.children.map((child) => child.currentIndex);
        },

        // set indexes of all columns
        setIndexes(indexes) {
          const stack = indexes.map((optionIndex, columnIndex) =>
            this.setColumnIndex(columnIndex, optionIndex)
          );
          return Promise.all(stack);
        },
      },
    })
  };
</script>

<style lang="less">
  @import './index.less';
</style>
