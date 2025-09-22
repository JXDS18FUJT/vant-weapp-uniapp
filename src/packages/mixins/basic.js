// eslint-disable-next-line no-undef
export const basic = {
  props: {
    componentId: {
      type: String,
      default: 'vant-component'
    }
  },
  methods: {
    getAllRect(context, selector) {
      return new Promise(function(resolve) {
        uni.createSelectorQuery()
          .in(context)
          .selectAll(selector)
          .boundingClientRect()
          .exec(function(rect) {
            if (rect === void 0) {
              rect = [];
            }
            return resolve(rect[0]);
          });
      });
    },
    getRect(selector, all,context=null) {
      return new Promise(resolve => {
        let selectorQuery
        // #ifndef MP-ALIPAY

        selectorQuery = uni.createSelectorQuery().in(context||this)
        // #endif
        // #ifdef MP-ALIPAY
        selectorQuery = uni.createSelectorQuery()
        // #endif
        selectorQuery[all ? 'selectAll' : 'select'](selector)
          .boundingClientRect(rect => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect)
            }
            if (!all && rect) {
              resolve(rect)
            }
          })
          .exec()
      })
    }
  }
}
