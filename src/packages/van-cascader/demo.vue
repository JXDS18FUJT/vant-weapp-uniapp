<template>
  <view>
    <demo-block title="基础用法">
      <view @click="onClickBaseState">
        <van-field :value="baseState.result" is-link readonly label="地区" :placeholder="selectArea" />
      </view>

      <van-popup :show="baseState.show" round position="bottom">
        <van-cascader v-if="baseState.show" :value="baseState.value" :title="selectArea" :options="options"
          @close="onCloseBaseState" @finish="onFinishBaseState" />
      </van-popup>
    </demo-block>

    <demo-block title="自定义颜色">
      <van-field :value="customColorState.result" is-link readonly label="地区" :placeholder="selectArea"
        data-state-key="customColorState" @click="onClickCustomColorState" />
      <van-popup :show="customColorState.show" round position="bottom">
        <van-cascader v-if="customColorState.show" :value="customColorState.value" :title="selectArea"
          :options="options" data-state-key="customColorState" active-color="#ee0a24" @close="onCloseCustomColorState"
          @finish="onFinishCustomColorState" />
      </van-popup>
    </demo-block>

    <demo-block title="异步加载选项">
      <van-field :value="asyncState.result" is-link readonly label="地区" :placeholder="selectArea"
        data-state-key="asyncState" @click="onClickAsyncState" />
      <van-popup :show="asyncState.show" round position="bottom">
        <van-cascader v-if="asyncState.show" :value="asyncState.value" :title="selectArea" :options="asyncState.options"
          data-state-key="asyncState" @close="onCloseAsyncState" @change="loadDynamicOptions"
          @finish="onFinishAsyncState" />
      </van-popup>
    </demo-block>

    <demo-block title="自定义字段名">
      <van-field :value="customFieldState.result" is-link readonly label="地区" :placeholder="selectArea"
        data-state-key="customFieldState" @click="onClickCustomFieldState" />
      <van-popup :show="customFieldState.show" round position="bottom" safe-area-inset-bottom>
        <van-cascader v-if="customFieldState.show" :value="customFieldState.value" :title="selectArea"
          :options="customFieldOptions" :field-names="fieldNames" data-state-key="customFieldState"
          @close="onCloseCustomFieldState" @finish="onFinishCustomFieldState" />
      </van-popup>
    </demo-block>


  </view>
</template>

<script>
  import vanCascader from './van-cascader.vue';

  const zhCNOptions = [{
      text: '浙江省',
      value: '330000',
      children: [{
          text: '杭州市',
          value: '330100',
          children: [{
              text: '上城区',
              value: '330102',
            },
            {
              text: '下城区',
              value: '330103',
            },
            {
              text: '江干区',
              value: '330104',
            },
          ],
        },
        {
          text: '宁波市',
          value: '330200',
          children: [{
              text: '海曙区',
              value: '330203',
            },
            {
              text: '江北区',
              value: '330205',
            },
            {
              text: '北仑区',
              value: '330206',
            },
          ],
        },
        {
          text: '温州市',
          value: '330300',
          children: [{
              text: '鹿城区',
              value: '330302',
            },
            {
              text: '龙湾区',
              value: '330303',
            },
            {
              text: '瓯海区',
              value: '330304',
            },
          ],
        },
      ],
    },
    {
      text: '江苏省',
      value: '320000',
      children: [{
          text: '南京市',
          value: '320100',
          children: [{
              text: '玄武区',
              value: '320102',
            },
            {
              text: '秦淮区',
              value: '320104',
            },
            {
              text: '建邺区',
              value: '320105',
            },
          ],
        },
        {
          text: '无锡市',
          value: '320200',
          children: [{
              text: '锡山区',
              value: '320205',
            },
            {
              text: '惠山区',
              value: '320206',
            },
            {
              text: '滨湖区',
              value: '320211',
            },
          ],
        },
        {
          text: '徐州市',
          value: '320300',
          children: [{
              text: '鼓楼区',
              value: '320302',
            },
            {
              text: '云龙区',
              value: '320303',
            },
            {
              text: '贾汪区',
              value: '320305',
            },
          ],
        },
      ],
    },
  ];

  const asyncOptions1 = [{
    text: '浙江省',
    value: '330000',
    children: [],
  }, ];
  const asyncOptions2 = [{
      text: '杭州市',
      value: '330100'
    },
    {
      text: '宁波市',
      value: '330200'
    },
  ];

  function deepClone(options) {
    let optionStr = JSON.stringify(options)

    return JSON.parse(optionStr)

  }

  function getCustomFieldOptions(options) {
    const newOptions = deepClone(options);
    const adjustFieldName = (item) => {
      if ('text' in item) {
        item.name = item.text;
        delete item.text;
      }
      if ('value' in item) {
        item.code = item.value;
        delete item.value;
      }
      if ('children' in item) {
        item.items = item.children;
        delete item.children;
        item.items.forEach(adjustFieldName);
      }
    };
    newOptions.forEach(adjustFieldName);
    return newOptions;
  }
  const options = [{
    text: "浙江省",
    value: "330000",
    children: [{
      text: "杭州市",
      value: "330100",
      children: [{
        text: "上城区",
        value: "330102"
      }, {
        text: "下城区",
        value: "330103"
      }, {
        text: "江干区",
        value: "330104"
      }]
    }, {
      text: "宁波市",
      value: "330200",
      children: [{
        text: "海曙区",
        value: "330203"
      }, {
        text: "江北区",
        value: "330205"
      }, {
        text: "北仑区",
        value: "330206"
      }]
    }, {
      text: "温州市",
      value: "330300",
      children: [{
        text: "鹿城区",
        value: "330302"
      }, {
        text: "龙湾区",
        value: "330303"
      }, {
        text: "瓯海区",
        value: "330304"
      }]
    }]
  }, {
    text: "江苏省",
    value: "320000",
    children: [{
      text: "南京市",
      value: "320100",
      children: [{
        text: "玄武区",
        value: "320102"
      }, {
        text: "秦淮区",
        value: "320104"
      }, {
        text: "建邺区",
        value: "320105"
      }]
    }, {
      text: "无锡市",
      value: "320200",
      children: [{
        text: "锡山区",
        value: "320205"
      }, {
        text: "惠山区",
        value: "320206"
      }, {
        text: "滨湖区",
        value: "320211"
      }]
    }, {
      text: "徐州市",
      value: "320300",
      children: [{
        text: "鼓楼区",
        value: "320302"
      }, {
        text: "云龙区",
        value: "320303"
      }, {
        text: "贾汪区",
        value: "320305"
      }]
    }]
  }]
  export default {
    components: {
      vanCascader
    },
    data() {
      return {

        area: '地区',
        options: zhCNOptions,
        selectArea: '请选择地区',
        baseState: {
          show: false,
          value: '',
          result: '',
        },
        asyncState: {
          show: false,
          value: '',
          result: '',
          options: asyncOptions1,
        },
        fieldNames: {
          text: 'name',
          value: 'code',
          children: 'items',
        },
        customColorState: {
          show: false,
          value: '',
          result: '',
        },
        customFieldOptions: getCustomFieldOptions(zhCNOptions),
        customFieldState: {
          show: false,
          value: '',
          result: '',
        },
      }
    },

    methods: {
      onClickBaseState(e) {
        console.log(e, 'onClickBaseState')
        this.baseState.show = true
      },

      onCloseBaseState(e) {
        this.baseState.show = false
      },
      onFinishBaseState(e) {

        const {
          selectedOptions,
          value
        } = e;
        const result = selectedOptions
          .map((option) => option.text || option.name)
          .join('/');

        // this.setData({
        //   [`${stateKey}.value`]: value,
        //   [`${stateKey}.result`]: result,
        // });

        this.baseState.result = result
        this.baseState.value = value
        this.onCloseBaseState();
      },
      onClickCustomColorState(e) {
        this.customColorState.show = true
      },

      onCloseCustomColorState(e) {
        this.customColorState.show = false
      },
      onFinishCustomColorState(e) {

        const {
          selectedOptions,
          value
        } = e;
        const result = selectedOptions
          .map((option) => option.text || option.name)
          .join('/');

        // this.setData({
        //   [`${stateKey}.value`]: value,
        //   [`${stateKey}.result`]: result,
        // });

        this.customColorState.result = result
        this.customColorState.value = value
        this.onCloseCustomColorState();
      },
      onClickAsyncState(e) {
        this.asyncState.show = true
      },

      onCloseAsyncState(e) {
        this.asyncState.show = false
      },
      onFinishAsyncState(e) {

        const {
          selectedOptions,
          value
        } = e;
        const result = selectedOptions
          .map((option) => option.text || option.name)
          .join('/');

        // this.setData({
        //   [`${stateKey}.value`]: value,
        //   [`${stateKey}.result`]: result,
        // });

        this.asyncState.result = result
        this.asyncState.value = value
        this.onCloseAsyncState();
      },
      onClickCustomFieldState(e) {
        this.customFieldState.show = true
      },

      onCloseCustomFieldState(e) {
        this.customFieldState.show = false
      },
      onFinishCustomFieldState(e) {

        const {
          selectedOptions,
          value
        } = e;
        const result = selectedOptions
          .map((option) => option.text || option.name)
          .join('/');

        // this.setData({
        //   [`${stateKey}.value`]: value,
        //   [`${stateKey}.result`]: result,
        // });

        this.customFieldState.result = result
        this.customFieldState.value = value
        this.onCloseCustomFieldState();
      },
      loadDynamicOptions(e) {
        const {
          value
        } = e;
        if (value === '330000') {
          setTimeout(() => {
            this.$set(this.asyncState.options[0], 'children', asyncOptions2)

          }, 500);
        }
      }
    },

  }
</script>

<style>
</style>
