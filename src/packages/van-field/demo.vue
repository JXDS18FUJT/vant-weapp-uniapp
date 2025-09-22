<template>
  <demo-section>
    <demo-block title="基础用法">
      <van-cell-group>
        <van-field readonly v-model="value" @input="name" :maxlength="10" showWordLimit clearable type="text" label="文本"
          placeholder="请输入文本" />
      </van-cell-group>
    </demo-block>

    <demo-block title="自定义类型">
      <van-field v-model="text" label="文本" placeholder="请输入文本"  />
      <van-field v-model="phone" type="tel" label="电话" placeholder="请输入手机号" />
      <van-field v-model="number" type="number" label="整数" placeholder="请输入整数" />
      <van-field v-model="digit" type="digit" label="数字" placeholder="请输入数字（支持小数）" />
      <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" />
    </demo-block>

    <demo-block title="禁用输入框">
      <van-cell-group>
        <van-field
          value="输入框已禁用"
          label="用户名"
          left-icon="contact"
          disabled
          :border="false"
        />
      </van-cell-group>
    </demo-block>

    <demo-block title="错误提示">
      <van-cell-group>
        <van-field :value="username2" label="用户名" placeholder="请输入用户名" error />
        <van-field :value="phone" label="手机号" errorMessageAlign="right" placeholder="请输入手机号" error-message="手机号格式错误" :border="false"
          input-align="left" />
      </van-cell-group>
    </demo-block>
    <demo-block title="高度自适应">
      <van-cell-group>
        <van-field :value="message" label="留言" type="textarea" placeholder="请输入留言" rows="1" autosize :border="false" />
      </van-cell-group>
    </demo-block>
    <demo-block title="插入按钮">
      <van-cell-group>
        <van-field :value="sms" center clearable label="短信验证码" placeholder="请输入短信验证码" use-button-slot :border="false">
          <van-button slot="button" size="small" type="primary" custom-class="button">发送验证码</van-button>
        </van-field>
      </van-cell-group>
    </demo-block>
  </demo-section>
</template>

<script>
  export default {
    components: {

    },
    methods: {
      name(e) {
        console.log(e)

      }
    },
    data() {
      return {
        value: '12347890',
        message: '',
        sms: '',
        username2: '',
        text: '',
        phone: '',
        digit: '',
        number: '',
        password: '',
      };
    }
  }
</script>
