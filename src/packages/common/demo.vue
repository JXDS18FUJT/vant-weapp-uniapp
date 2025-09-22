<template>
  <div class="demo-style">
    <demo-block title="文字省略">
      <div class="van-ellipsis">这是一段最多显示一行的文字，后面的内容会省略</div>
      <div class="van-multi-ellipsis--l2">这是一段最多显示两行的文字，后面的内容会省略。这是一段最多显示两行的文字，后面的内容会省略</div>
    </demo-block>

    <demo-block title="1px 边框">
      <div class="van-hairline--top" />
    </demo-block>

    <demo-block card :title="'动画'">
      <van-cell is-link title="Fade" @click="animate('van-fade')" />
      <van-cell is-link title="Slide Up" @click="animate('van-slide-up')" />
      <van-cell is-link title="Slide Down" @click="animate('van-slide-down')" />
      <van-cell is-link title="Slide Left" @click="animate('van-slide-left')" />
      <van-cell is-link title="Slide Right" @click="animate('van-slide-right')" />
    </demo-block>

   <transition :name="transitionName">
     <div v-show="show" class="demo-animate-block" />
   </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: false,
        transitionName: '',
      }
    },
    methods: {
      animate(transitionName) {
        this.show = true;
        this.transitionName = transitionName;

        setTimeout(() => {
          this.show = false;
        }, 500);
      },
    }

  }
</script>

<style lang="less">
  @import './style/var';
  @import './style/animation.less';
  .demo-style {

    .van-ellipsis,
    .van-multi-ellipsis--l2 {
      max-width: 300px;
      margin-left: @padding-md;
      font-size: 14px;
      line-height: 18px;
    }

    .van-ellipsis {
      margin-bottom: @padding-md;
    }

    .van-hairline--top {
      height: 30px;
      background-color: @white;

      &::after {
        top: 5px;
      }
    }

    .demo-animate-block {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 100px;
      margin: -50px 0 0 -50px;
      background-color: @blue;
      border-radius: 8px;
    }
  }
</style>
