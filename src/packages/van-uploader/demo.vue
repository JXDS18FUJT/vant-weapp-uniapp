<template>
  <view>
    <demo-block title="基础用法" padding>
      <van-uploader accept="video"  @delete="uploadDelete" name="2" @after-read="afterRead" showUpload :file-list="fileList2"></van-uploader>
    </demo-block>
  </view>

</template>

<script>
  export default {
    data() {
      return {
        fileList2: [{
            url: 'https://img.yzcdn.cn/vant/leaf.jpg',
            name: '图片1',
          },
          // Uploader 根据文件后缀来判断是否为图片文件
          // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
          {
            url: 'https://img.yzcdn.cn/vant/tree.jpg',
            name: '图片2',
            isImage: true,
            deletable: true,
          },
        ]
      }
    },
    methods: {
      beforeRead(event) {
        const {
          file,
          callback = () => {}
        } = event.detail;
        if (file.url.indexOf('jpeg') < 0) {
          uni.showToast({
            title: '请选择jpg图片上传',
            icon: 'none'
          });
          callback(false);
          return;
        }
        callback(true);
      },

      afterRead(event) {
        console.log(event)
        const {
          file,
          name
        } = event;
        console.log(JSON.stringify(file, null, 2));
        const fileList = this[`fileList${name}`];
        this[`fileList${name}`] = fileList.concat(file)
        // this.setData({
        //   [`fileList${name}`]: fileList.concat(file)
        // });
      },

      oversize() {
        uni.showToast({
          title: '文件超出大小限制',
          icon: 'none'
        });
      },

      uploadDelete(event) {
        const {
          index,
          name
        } = event;
        const fileList = this[`fileList${name}`];
        fileList.splice(index, 1);
        this[`fileList${name}`] = fileList
        // this.setData({
        //   [`fileList${name}`]: fileList
        // });
      },
    },
  }
</script>

<style>
</style>
