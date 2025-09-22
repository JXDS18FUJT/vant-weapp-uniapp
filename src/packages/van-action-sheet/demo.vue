<template>
  <demo-section>
    <demo-block custom-class="demo-action-sheet" card title="基础用法">

      <van-cell is-link title="基础用法" @click="show.basic = true"  />
      <van-cell is-link title="展示取消按钮" @click="show.cancel = true"  />
      <van-cell is-link title="展示描述信息" @click="show.description = true"  />
    </demo-block>

    <demo-block card title="选项状态">
      <van-cell is-link title="选项状态" @click="show.status = true" />
    </demo-block>

    <demo-block card title="自定义面板">
      <van-cell is-link title="自定义面板" @click="show.title = true" />
    </demo-block>

    <van-action-sheet closeOnClickOverlay @close="()=>{
      show.basic = false
    }" :show="show.basic" :actions="simpleActions" @select="onSelect" @cancel="show.basic = false" />

    <van-action-sheet @close="()=>{
      show.cancel = false
    }" closeOnClickOverlay :show="show.cancel" :actions="simpleActions" close-on-click-action cancel-text="取消"
      @cancel="onCancel" />

    <van-action-sheet @close="()=>{
      show.description = false
    }" closeOnClickOverlay :show="show.description" :actions="actionsWithDescription" close-on-click-action
      :cancel-text="'取消'" description="这是一段描述信息" @cancel="show.description = false" />

    <van-action-sheet @close="()=>{
      show.status = false
    }" closeOnClickOverlay :show="show.status" close-on-click-action :actions="statusActions" cancel-text="取消" />

    <van-action-sheet @close="()=>{
      show.title = false
    }" closeOnClickOverlay :show="show.title" title="标题">
      <div class="demo-action-sheet-content">{{ '内容' }}</div>
    </van-action-sheet>
  </demo-section>
</template>

<script>
  // import {
  //   RED
  // } from '../../utils/constant';

  export default {
    i18n: {
      'zh-CN': {
        option1: '选项一',
        option2: '选项二',
        option3: '选项三',
        subname: '描述信息',
        showCancel: '展示取消按钮',
        buttonText: '弹出菜单',
        customPanel: '自定义面板',
        description: '这是一段描述信息',
        optionStatus: '选项状态',
        coloredOption: '着色选项',
        disabledOption: '禁用选项',
        showDescription: '展示描述信息',
      },
      'en-US': {
        option1: 'Option 1',
        option2: 'Option 2',
        option3: 'Option 3',
        subname: 'Description',
        showCancel: 'Show Cancel Button',
        buttonText: 'Show ActionSheet',
        customPanel: 'Custom Panel',
        description: 'Description',
        optionStatus: 'Option Status',
        coloredOption: 'Colored Option',
        disabledOption: 'Disabled Option',
        showDescription: 'Show Description',
      },
    },

    data() {
      return {

        show: {
          basic: false,
          cancel: false,
          title: false,
          status: false,
          description: false,
        },
      }
    },

    computed: {
      simpleActions() {
        return [{
            name: '选项一'
          },
          {
            name: '选项二'
          },
          {
            name: '选项三'
          }
        ];
      },

      actionsWithDescription() {
        return [{
            name: '选项一'
          },
          {
            name: '选项二'
          },
          {
            name: '选项三',
            subname: '描述信息'
          },
        ];
      },

      statusActions() {
        return [{
            name: '着色选项',
            color: 'red'
          },
          {
            name: '禁用选项',
            disabled: true
          },
          {
            loading: true
          },
        ];
      },
    },

    methods: {

      onSelect(item) {
        this.show.basic = false;
        this.$toast(item.name);
      },

      onCancel() {
        this.show.cancel=false
        // this.$toast('取消');
      },
    },
  };
</script>

<style lang="less">
  // @import '../../style/var';

  .demo-action-sheet {
    background-color: antiquewhite;
  }
</style>
