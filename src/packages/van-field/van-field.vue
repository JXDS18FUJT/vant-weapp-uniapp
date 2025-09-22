<template>
  <van-cell :size="size" :icon="leftIcon" :center="center" :border="border" :is-link="isLink" :required="required"
    :clickable="clickable" :title-style="{ marginRight: '12px' }" :arrow-direction="arrowDirection" @click="onClick"
    class="custom-class van-field">

    <!-- 左侧图标 -->
    <template>
      <slot name="left-icon" />
    </template>

    <!-- 标题部分 -->

    <template v-if="label">
      <label :for="name" :class="fieldLabel" slot="title">
        {{ label }}
      </label>
    </template>
    <template v-else>
      <view slot="title">
        <slot name="label" />
      </view>

    </template>


    <!--    <template v-if="label" v-slot:title>
    <label :for="name" :class="['label-class', bem('field__label', { disabled })]">
      {{ label }}
    </label>
  </template>
  <template v-else v-slot:title>
    <slot name="label" />
  </template> -->

    <!-- Field Body -->
    <div :class="fieldBody">
      <div :class="fieldControl" @click="onClickInput">
        <slot name="input" />
      </div>

      <!-- 动态加载 Textarea 或 Input 组件 -->
      <!--  <textarea-component v-if="type === 'textarea'" />
    <input-component v-else /> -->

      <textarea  v-if="type === 'textarea'" :class="fieldControlTextarea" :value="innerValue" :focus="focus"
        :auto-focus="autoFocus" :disabled="disabled || readonly" :maxlength="maxlength" :placeholder="placeholder"
        :placeholder-style="placeholderStyle" :placeholder-class="fieldPaceholder" :cursor-spacing="cursorSpacing"
        :show-confirm-bar="showConfirmBar" :hold-keyboard="holdKeyboard" :auto-height="autosize" :fixed="fixed"
        @input="onInput" @focus="onFocus"  @blur="onBlur" @linechange="onLineChange"
        @keyboardheightchange="onKeyboardHeightChange"  />


      <input v-if="type !== 'textarea'"   :class="fieldControlInput" :type="type" :focus="focus" :cursor="cursor"
        :value="innerValue" :auto-focus="autoFocus" :disabled="disabled || readonly" :maxlength="maxlength"
        :placeholder="placeholder" :placeholder-style="placeholderStyle" :placeholder-class="fieldPaceholder"
        :confirm-type="confirmType" :confirm-hold="confirmHold" :hold-keyboard="holdKeyboard"
        :cursor-spacing="cursorSpacing" :adjust-position="adjustPosition" :selection-end="selectionEnd"
        :selection-start="selectionStart" :always-embed="alwaysEmbed" :password="password || type === 'password'"
        @input="onInput" @blur="onBlur" @focus="onFocus" @confirm="onConfirm"
        @keyboardheightchange="onKeyboardHeightChange" @nicknamereview="onBindNicknameReview"  />


      <!-- 清除按钮 -->
      <van-icon v-if="showClear" size="18px" :name="clearIcon" class="van-field__clear-root van-field__icon-root"
        @touchstart.native="onClear" />

      <!-- 右侧图标容器 -->
      <div class="van-field__icon-container" @click="onClickIcon">
        <van-icon v-if="rightIcon || icon" :name="rightIcon || icon" :class="['van-field__icon-root', iconClass]"
          class="right-icon-class" />
        <slot name="right-icon" />
        <slot name="icon" />
      </div>

      <!-- 按钮部分 -->
      <div class="van-field__button">
        <slot name="button" />
      </div>
    </div>

    <!-- 显示字符数限制 -->
    <view v-if="showWordLimit && maxlength" :for="name" class="van-field__word-limit">
      <span :class="fieldWordNum">
        {{ Math.min(value.length,maxlength) }}
      </span>
      /{{ maxlength }}
    </view>

    <!-- 错误信息 -->
    <view v-if="errorMessage" :for="name" :class="fieldErrorMessage">
      {{ errorMessage }}
    </view>


  </van-cell>
</template>

<script>
  import {
    VantComponent
  } from '../common/component'
  import {
    commonProps,
    inputProps,
    textareaProps
  } from './props'
  import utils from '../wxs/utils'
  export default VantComponent({
    field: true,

    classes: ['input-class', 'right-icon-class', 'label-class'],

    props: {
      ...commonProps,
      ...inputProps,
      ...textareaProps,
      value: {
        default: '',
        type: String
      },
      size: String,
      icon: String,
      label: String,
      error: Boolean,
      center: Boolean,
      isLink: Boolean,
      leftIcon: String,
      rightIcon: String,
      autosize: null,
      required: Boolean,
      iconClass: String,
      clickable: {
        type:Boolean,
        default:true
      },
      inputAlign: String,
      customStyle: String,
      errorMessage: String,
      arrowDirection: String,
      showWordLimit: Boolean,
      errorMessageAlign: {
        type: String,
        default: 'left',
      },
      readonly: {
        type: Boolean,
          default: false,
      },
      clearable: {
        type: Boolean,
        observer: 'setShowClear',
      },
      clearTrigger: {
        type: String,
        default: 'focus',
      },
      border: {
        type: Boolean,
        default: true,
      },
      titleWidth: {
        type: String,
        default: '6.2em',
      },
      clearIcon: {
        type: String,
        default: 'clear',
      },
      extraEventParams: {
        type: Boolean,
        value: false,
      },
    },

    data() {
      return {
        focused: false,
        innerValue: '',
        innerValueLength: 0,
        showClear: false
      }
    },
    computed: {
      // innerValueLength(){
      //   return this.innerValue.length

      // },
      fieldLabel() {
        //:class="['label-class', bem('field__label', { disabled })]
        const {
          disabled
        } = this
        return `label-class ${ utils.bem('field__label', disabled)}`

      },
      fieldControlInput() {
        const {
          disabled,
          error,
          inputAlign
        } = this
        return `input-class ${utils.bem('field__control', [inputAlign, { disabled, error }])}`

      },
      fieldControlTextarea() {
        const {
          inputAlign,
          disabled,
          error
        } = this
        return `input-class ${utils.bem('field__control', [inputAlign, { disabled, error }])}`
      },
      fieldPaceholder() {
        const {
          disabled,
          error
        } = this
        return `${utils.bem('field__placeholder', { error })}`
      },
      fieldBody() {
        const {
          type
        } = this
        return `${ utils.bem('field__body', [type])}`
      },
      fieldControl() {
        const {
          inputAlign
        } = this
        return `${ utils.bem('field__control', [inputAlign, 'custom'])}`
      },
      fieldWordNum() {
        const {
          value,
          maxlength
        } = this

        return `${utils.bem('field__word-num', { full: value.length >= maxlength })}`
      },
      fieldErrorMessage() {
        const {
          errorMessageAlign,
          disabled,
          error
        } = this
        return `${utils.bem('field__error-message', [errorMessageAlign, { disabled, error }])}`

      }
    },

    watch: {
      innerValue(newVal) {
        console.log('innerValue')
        this.innerValueLength = newVal.length

      },
      value(newVal) {

        if (newVal !== this.innerValue) {
          this.innerValue = newVal
          this.setShowClear()
        }


      },
      clearTrigger() {
        this.setShowClear()
      },
      readonly() {
        this.setShowClear()
      },
      clearable() {
        this.setShowClear()
      }
    },

    created() {
      this.innerValue = this.value
      this.innerValueLength = this.innerValue.length
    },

    methods: {
      formatValue(val) {
        if (this.maxlength !== -1 && val.length > this.maxlength) {
          return val.slice(0, this.maxlength)
        }
        return val
      },
      onInput(event) {
        console.log(event)
        const val = this.formatValue(event.detail.value || '')
        this.innerValue = val
        this.setShowClear()
        this.emitChange(val, event)
      },
      onFocus(event) {
        this.focused = true
        this.setShowClear()
        this.$emit('focus', event)

      },
      onBlur(event) {
        this.focused = false
        this.setShowClear()
        this.$emit('blur', event)
      },
      onClick(e) {
        console.log(e)
        this.$emit('click')
      },
      onClickIcon() {
        this.$emit('click-icon')
      },
      onClickInput(event) {
        console.log(event)
        this.$emit('click-input', event)
      },
      onClear() {
        this.innerValue = ''
        this.setShowClear()
        this.$nextTick(() => {
          this.emitChange('', null)
          this.$emit('clear', '')
        })
      },
      onConfirm(event) {
        const val = event.target?.value || ''
        this.innerValue = val
        this.setShowClear()
        this.$emit('confirm', val)
      },
      setValue(val) {
        this.innerValue = val
        this.setShowClear()
        if (val === '') {
          this.innerValue = ''
        }
        this.emitChange(val)
      },
      emitChange(val, originEvent = null) {
        this.$emit('input', this.extraEventParams ? {
          ...originEvent,
          value: val,
          callback: (data) => {} // 模拟回调形式
        } : val)

        this.$emit('change', this.extraEventParams ? {
          ...originEvent,
          value: val
        } : val)
      },
      setShowClear() {
        const hasValue = !!this.innerValue
        const trigger = this.clearTrigger === 'always' || (this.clearTrigger === 'focus' && this.focused)
        this.showClear = this.clearable && !this.readonly && hasValue && trigger
        console.log(this.showClear)
      },
      onLineChange(event) {
        this.$emit('linechange', event)
      },
      onKeyboardHeightChange(event) {
        this.$emit('keyboardheightchange', event)
      },
      onBindNicknameReview(event) {
        this.$emit('nicknamereview', event)
      },
      noop() {}
    },
  })
</script>

<style lang="less">
  @import './index.less';
</style>
