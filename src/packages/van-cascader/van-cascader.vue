<template>
  <view>
    <view v-if="showHeader" class="van-cascader__header">
      <slot name="title" v-if="useTitleSlot"></slot>
      <span class="van-cascader__title" v-else>{{ title }}</span>
      <van-icon v-if="closeable" :name="closeIcon" class="van-cascader__close-icon" @click="onClose" />
    </view>

    <van-tabs :active="activeTab" tab-class="van-cascader__tab" custom-class="van-cascader__tabs" :swipeable="swipeable"
      :ellipsis="ellipsis" :color="activeColor" @click="onClickTab" :border="false">
      <van-tab v-for="(tab, tabIndex) in tabs" :key="tabIndex"
        :title="tab.selected ? tab.selected[textKey] : placeholder" :title-style="
          !tab.selected ? 'color: #969799; font-weight: normal;' : ''
        ">
        <view class="van-cascader__options">
          <view class="van-cascader__option" v-for="(option, index) in tab.options" :key="index" :class="{
            'van-cascader__option--selected':tab.selected && tab.selected[valueKey] === option[valueKey]
          }" :style="tab.selected && tab.selected[valueKey] === option[valueKey] ?
            `color: ${activeColor}; font-weight: bold;` :
            ''" @click="onSelect(option, tabIndex)">
            <text>{{ option[textKey] }}</text>
            <van-icon v-if="isSelected(tab, valueKey, option)" name="success" size="18" />
          </view>
        </view>
      </van-tab>
    </van-tabs>
  </view>
</template>
<script>
  //class="`${option.className || ''} ${optionClass(tab, valueKey, option)}`"
  import {
    VantComponent
  } from "../common/component";
  import {
    button
  } from "../mixins/button";
  import {
    openType
  } from "../mixins/open-type";
  import VanIcon from "../van-icon/van-icon";
  import vanTabs from "../van-tabs/van-tabs.vue";
  import vanTab from "../van-tab/van-tab.vue";
  const utils = require("../wxs/utils");
  let defaultFieldNames = {
    text: "text",
    value: "value",
    children: "children",
  };
  export default {
    // 组件必须这样子引入，不能放在 VantComponent 里面
    components: {
      VanIcon,
      vanTabs,
      vanTab,
    },
    ...VantComponent({
      mixins: [button, openType],
      props: {
        title: String,
        value: {
          type: String,
        },
        placeholder: {
          type: String,
          default: "请选择",
        },
        activeColor: {
          type: String,
          default: "#1989fa",
        },
        options: {
          type: Array,
          default: [],
        },
        swipeable: {
          type: Boolean,
          default: false,
        },
        closeable: {
          type: Boolean,
          default: true,
        },
        ellipsis: {
          type: Boolean,
          default: true,
        },
        showHeader: {
          type: Boolean,
          default: true,
        },
        closeIcon: {
          type: String,
          default: "cross",
        },
        fieldNames: {
          type: Object,
          default: defaultFieldNames,
        },
        useTitleSlot: Boolean,
      },
      data() {
        return {
          tabs: [],
          activeTab: 0,
          textKey: "text",
          valueKey: "value",
          childrenKey: "children",
          innerValue: "",
        };
      },
      watch: {
        options() {
          this.updateTabs();
        },
        value: {

          handler(newVal, oldVal) {
            console.log('newVal', newVal)
            this.updateValue(newVal);
          },
          immediate: true

        },

        fieldNames() {
          this.updateFieldNames();
        },
      },
      computed: {},
      mounted() {
        this.updateFieldNames();
        this.updateValue(this.value);
        console.log(this.tabs, this.textKey)
      },

      methods: {
        updateValue(val) {
          if (val !== undefined) {
            const values = this.tabs.map(
              (tab) => tab.selected && tab.selected[this.valueKey]
            );
            if (values.includes(val)) return;
          }
          this.innerValue = val;
          this.updateTabs();
        },
        updateFieldNames() {
          const {
            text,
            value,
            children
          } =
          this.fieldNames || defaultFieldNames;
          console.log(text)
          this.textKey = text;
          this.valueKey = value;
          this.childrenKey = children;
        },
        getSelectedOptionsByValue(options, value) {
          for (let option of options) {
            if (option[this.valueKey] === value) {
              return [option];
            }
            if (option[this.childrenKey]) {
              const selected = this.getSelectedOptionsByValue(
                option[this.childrenKey],
                value
              );
              if (selected) {
                return [option, ...selected];
              }
            }
          }
          return null;
        },
        updateTabs() {
          const {
            options
          } = this;
          const val = this.innerValue;

          if (!options || !options.length) return;

          if (val !== undefined) {
            const selectedOptions = this.getSelectedOptionsByValue(options, val);

            if (selectedOptions) {
              let optionsCursor = options;
              const tabs = selectedOptions.map((option) => {
                const tab = {
                  options: optionsCursor,
                  selected: option,
                };
                const next = optionsCursor.find(
                  (item) => item[this.valueKey] === option[this.valueKey]
                );
                if (next) {
                  optionsCursor = next[this.childrenKey] || [];
                }
                return tab;
              });
              if (optionsCursor && optionsCursor.length) {
                tabs.push({
                  options: optionsCursor,
                  selected: null,
                });
              }
              this.tabs = tabs;
              this.$nextTick(() => {
                this.activeTab = tabs.length - 1;
              });
              return;
            }

          }

          this.tabs = [{
            options,
            selected: null,
          }];
          this.activeTab = 0;
        },
        onClose() {
          this.$emit("close");
        },
        onClickTab(index) {
          this.$emit("click-tab", {
            tabIndex: index,
          });
          this.activeTab = index;
        },
        onSelect(option, tabIndex) {
          if (option.disabled) return;

          const tabs = [...this.tabs];
          tabs[tabIndex].selected = option;

          const nextTab = option[this.childrenKey] ? {
              options: option[this.childrenKey],
              selected: null,
            } :
            null;

          this.tabs = nextTab ?
            tabs.slice(0, tabIndex + 1).concat(nextTab) :
            tabs.slice(0, tabIndex + 1);

          if (nextTab) {
            this.$nextTick(() => {
              this.activeTab = tabIndex + 1;
            });
          }

          const selectedOptions = this.tabs
            .map((tab) => tab.selected)
            .filter(Boolean);
          const value = option[this.valueKey];

          this.innerValue = value;

          const params = {
            value,
            tabIndex,
            selectedOptions,
          };
          this.$emit("change", params);

          if (!option[this.childrenKey]) {
            this.$emit("finish", params);
          }
        },
        optionClass(tab, valueKey, option) {
          return tab.selected && tab.selected[valueKey] === option[valueKey] ?
            "van-cascader__option--selected" :
            "";
        },
        optionStyle(tab, valueKey, option, activeColor) {
          return tab.selected && tab.selected[valueKey] === option[valueKey] ?
            `color: ${activeColor}; font-weight: bold;` :
            "";
        },
        isSelected(tab, valueKey, option) {
          return tab.selected && tab.selected[valueKey] === option[valueKey];
        },
      }
    }),
  };
</script>

<style lang="less">
  @import "./index.less";
</style>
