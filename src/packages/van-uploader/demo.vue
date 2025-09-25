<template>
  <view>
    <demo-block title="基础用法" padding>
      <van-uploader @delete="uploadDelete" name="1" @after-read="afterRead" showUpload
        :file-list="fileList1"></van-uploader>
    </demo-block>
    <demo-block title="上传视频" padding>
      <van-uploader name="7" accept="video" :file-list="fileList7" @after-read="afterRead"
        @delete="uploadDelete" />
    </demo-block>
    <demo-block title="文件预览" padding>
      <van-uploader accept="image" @delete="uploadDelete" name="2" @after-read="afterRead" showUpload
        :file-list="fileList2"></van-uploader>
    </demo-block>

    <demo-block title="隐藏上传按钮" padding>
      <van-uploader
        name="2"
        :file-list="fileList2"
        multiple
        :show-upload="false"
        @after-read="afterRead"
        @delete="uploadDelete"
        @click-preview="clickPreview"
      />
    </demo-block>

    <demo-block title="上传状态" padding>
      <van-uploader
        name="8"
        :file-list="fileList8"
        multiple
        :show-upload="false"
        @after-read="afterRead"
        @delete="uploadDelete"
        @click-preview="clickPreview"
      />
    </demo-block>

    <demo-block title="限制上传数量" padding>
      <van-uploader
        name="3"
        :file-list="fileList3"
        multiple
        :max-count="2"
        @after-read="afterRead"
        @delete="uploadDelete"
        @click-preview="clickPreview"
      />
    </demo-block>

    <demo-block title="自定义上传样式" padding>
      <van-uploader
        name="4"
        :file-list="fileList4"
        :max-count="2"
        @after-read="afterRead"
        @delete="uploadDelete"
        @click-preview="clickPreview"
        :use-slot="true"
      >
        <van-button icon="photo" type="primary">上传图片</van-button>
      </van-uploader>
    </demo-block>
    <!-- 待处理 -->
<!--    <demo-block title="上传前校验" padding>
      <van-uploader
        :name="5"
        :file-list="fileList5"
        @before-read="beforeRead"
        @after-read="afterRead"
        @delete="uploadDelete"
        @click-preview="clickPreview"
        :use-before-read="true"
      />
    </demo-block> -->
  </view>

</template>

<script>
  export default {
    data() {
      return {
         fileList1: [],
         fileList2: [
           { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
           { url: 'https://img.yzcdn.cn/vant/tree.jpg' },
         ],
         fileList3: [{ url: 'https://img.yzcdn.cn/vant/sand.jpg' }],
         fileList4: [],
         fileList5: [],
         fileList6: [],
         cloudPath: [],
         fileList7: [],
         fileList8: [
           {
             url: 'https://img.yzcdn.cn/vant/leaf.jpg',
             status: 'uploading',
             message: '上传中',
           },
           {
             url: 'https://img.yzcdn.cn/vant/tree.jpg',
             status: 'failed',
             message: '上传失败',
           },
         ],
      }
    },
    methods: {
      clickPreview(e) {},
      beforeRead(fileListItem) {
        const {
          file,
          callback = () => {}
        } = fileListItem;
        console.log(fileListItem)
        if (fileListItem.url.indexOf('jpeg') < 0) {
          uni.showToast({
            title: '请选择jpg图片上传',
            icon: 'none'
          });
          callback(false);
          return;
        }
        callback(true);
      },

      afterRead(fileListItem) {
        console.log(fileListItem)
        const {

          name
        } = fileListItem;
        console.log(JSON.stringify(fileListItem, null, 2));
        const fileList = this[`fileList${name}`];
        this[`fileList${name}`] = fileList.concat(fileListItem)
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

      uploadDelete(fileListItem) {
        const {
          index,
          name
        } = fileListItem;
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
