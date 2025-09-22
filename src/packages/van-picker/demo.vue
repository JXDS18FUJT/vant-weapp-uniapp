<template>
  <demo-section>
    <van-toast ref="van-toast" id="van-toast"></van-toast>
    <demo-block card title="基础用法">
      <van-picker show-toolbar title="标题" :columns="textColumns" @change="onChange1" />
    </demo-block>

    <demo-block card title="默认选中项">
      <van-picker show-toolbar title="标题" :columns="textColumns" :default-index="2" @change="onChange1" />
    </demo-block>

    <demo-block card title="多列选择">
      <van-picker show-toolbar title="标题" :columns="dateColumns" @cancel="onCancel" @confirm="onConfirm" />
    </demo-block>

    <demo-block card v-if="!isWeapp" title="级联选择">
      <van-picker show-toolbar title="标题" :columns="cascadeColumns" @cancel="onCancel" @confirm="onConfirm" />
    </demo-block>

    <demo-block card title="禁用选项">
      <van-picker show-toolbar title="标题" :columns="disabledColumns" />
    </demo-block>

    <demo-block card title="动态设置选项">
      <van-picker show-toolbar title="标题" :columns="columns" @change="onChange2" />
    </demo-block>

    <demo-block card title="等待状态">
      <van-picker loading show-toolbar title="标题" :columns="columns" />
    </demo-block>

    <demo-block card v-if="!isWeapp" title="搭配弹出层使用">
      <van-field readonly clickable label="城市" :value="fieldValue" placeholder="选择城市" @click="onClickField" />
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker show-toolbar title="标题" :columns="textColumns" @cancel="onCancel2" @confirm="onConfirm2" />
      </van-popup>
    </demo-block>
  </demo-section>
</template>

<script>
  import {
    dateColumns,
    cascadeColumns
  } from './data';
  import Toast from './../van-toast/toast.js';
  export default {
    i18n: {
      'zh-CN': {
        city: '城市',
        cascade: '级联选择',
        withPopup: '搭配弹出层使用',
        chooseCity: '选择城市',
        showToolbar: '展示顶部栏',
        dateColumns: dateColumns['zh-CN'],
        defaultIndex: '默认选中项',
        disableOption: '禁用选项',
        cascadeColumns: cascadeColumns['zh-CN'],
        multipleColumns: '多列选择',
        setColumnValues: '动态设置选项',
        textColumns: [
          '杭州',
          '宁波',
          '温州',
          '绍兴',
          '湖州',
          '嘉兴',
          '金华',
          '衢州',
        ],
        disabledColumns: [{
            text: '杭州',
            disabled: true
          },
          {
            text: '宁波'
          },
          {
            text: '温州'
          },
        ],
        column3: {
          浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
          福建: ['福州', '厦门', '莆田', '三明', '泉州'],
        },
        toastContent: (value, index) => `当前值：${value}, 当前索引：${index}`,
      },
      'en-US': {
        city: 'City',
        cascade: 'Cascade',
        withPopup: 'With Popup',
        chooseCity: 'Choose City',
        showToolbar: 'Show Toolbar',
        dateColumns: dateColumns['en-US'],
        defaultIndex: 'Default Index',
        disableOption: 'Disable Option',
        cascadeColumns: cascadeColumns['en-US'],
        multipleColumns: 'Multiple Columns',
        setColumnValues: 'Set Column Values',
        textColumns: ['Delaware', 'Florida', 'Georqia', 'Indiana', 'Maine'],
        disabledColumns: [{
            text: 'Delaware',
            disabled: true
          },
          {
            text: 'Florida'
          },
          {
            text: 'Georqia'
          },
        ],
        column3: {
          Group1: ['Delaware', 'Florida', 'Georqia', 'Indiana', 'Maine'],
          Group2: ['Alabama', 'Kansas', 'Louisiana', 'Texas'],
        },
        toastContent: (value, index) => `Value: ${value}, Index：${index}`,
      },
    },

    data() {
      return {
        showPicker: false,
        isWeapp: true,
        fieldValue: '',
        city: '城市',
        cascade: '级联选择',
        withPopup: '搭配弹出层使用',
        chooseCity: '选择城市',
        showToolbar: '展示顶部栏',
        dateColumns: dateColumns['zh-CN'],
        defaultIndex: '默认选中项',
        disableOption: '禁用选项',
        cascadeColumns: cascadeColumns['zh-CN'],
        multipleColumns: '多列选择',
        setColumnValues: '动态设置选项',
        textColumns: [
          '杭州',
          '宁波',
          '温州',
          '绍兴',
          '湖州',
          '嘉兴',
          '金华',
          '衢州',
        ],
        disabledColumns: [{
            text: '杭州',
            disabled: true
          },
          {
            text: '宁波'
          },
          {
            text: '温州'
          },
        ],
        column3: {
          浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
          福建: ['福州', '厦门', '莆田', '三明', '泉州'],
        },
      };
    },

    computed: {
      columns() {
        const column = this.column3;
        return [{
            values: Object.keys(column),
            className: 'column1',
          },
          {
            values: column[Object.keys(column)[0]],
            className: 'column2',
            defaultIndex: 2,
          },
        ];
      },
    },

    methods: {
      onChange1(e) {
        Toast({
          context: this,
          message: `Value: ${e.value}, Index：${e.index}`,
        });

      },

      onChange2(e) {
        e.picker.setColumnValues(1, this.column3[e.values[0]]);
      },

      onConfirm(e) {
       Toast({
         context: this,
         message: `Value: ${e.value}, Index：${e.index}`,
       });
      },

      onCancel() {
        Toast({
          context: this,
          message: `取消`,
        });
      },

      onClickField() {
        this.showPicker = true;
      },

      onConfirm2(value) {
        this.showPicker = false;
        this.fieldValue = value;
      },

      onCancel2() {
        this.showPicker = false;
      },
    },
  };
</script>
<!--
<template>
  <view>
    <demo-block title="基础用法">
     <van-toast ref="van-toast" id="van-toast"></van-toast>
      <van-picker :columns="column1" @change="onChange1" />
    </demo-block>
  </view>

</template>

<script>
  import Toast from './../van-toast/toast.js';
  import {
    VantComponent
  } from '../common/component'
  export default VantComponent({
        data() {
          return {
            column1: [{
                text: '杭州',
                disabled: false
              },
              {
                text: '宁波'
              },
              {
                text: '温州'
              }],
            }
          },
          methods: {
              onChange1(event) {
                const {
                  value,
                  index
                } = event;
                console.log(event)
                // Toast({
                //   context: this,
                //   message: `Value: ${value}, Index：${index}`,
                // });
              },
            },

        })
</script>

<style>
</style> -->
