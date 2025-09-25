<template>
  <div class="van-uploader">
    <div class="van-uploader__wrapper">
      <!-- 预览样式 -->
      <div v-if="previewImage" v-for="(item, index) in lists" :key="index" :data-index="index" class="van-uploader__preview"
        @click="onClickPreview">
        <!-- 图片预览 -->
        <img v-if="item.isImage" class="van-uploader__preview-image" :src="item.thumb || item.url"
          :alt="item.name || ('图片' + index)" style="sizeStyle(previewSize)" :data-index="index" :mode="imageFit"
          @click.stop="onPreviewImage" />

        <!-- 视频预览 -->
        <video v-else-if="item.isVideo" :data-index="index" enable-danmu danmu-btn controls class="van-uploader__preview-image" :src="item.url" :poster="item.thumb"
          :title="item.name || ('视频' + index)" :autoplay="item.autoplay" style="sizeStyle(previewSize)"
          :object-fit="videoFit"  :referrer-policy="referrerPolicy"
          @click.stop="onPreviewVideo"></video>

        <!-- 其他文件预览 -->
        <div v-else class="van-uploader__file" style="sizeStyle(previewSize)" @click.stop="onPreviewFile(index)">
          <van-icon name="description" class="van-uploader__file-icon" />
          <div class="van-uploader__file-name van-ellipsis">
            {{ item.name || item.url }}
          </div>
        </div>

        <!-- 上传状态遮罩 -->
        <div v-if="item.status === 'uploading' || item.status === 'failed'" class="van-uploader__mask">
          <van-icon v-if="item.status === 'failed'" name="close" class="van-uploader__mask-icon" />
          <van-loading v-else class="van-uploader__loading" />
          <span v-if="item.message" class="van-uploader__mask-message">{{ item.message }}</span>
        </div>

        <!-- 删除按钮 -->
        <div :data-index="index" v-if="deletable && item.deletable" class="van-uploader__preview-delete"
          @click.stop="deleteItem">
          <van-icon name="cross" class="van-uploader__preview-delete-icon" />
        </div>
      </div>

      <!-- 上传槽位 -->
      <template v-if="isInCount">
        <!-- 自定义插槽 -->
        <view class="van-uploader__slot" @click="startUpload">
          <slot />
        </view>

        <!-- 默认上传按钮 -->
        <view v-if="showUpload" class="van-uploader__upload" :class="{ 'van-uploader__upload--disabled': disabled }"
          style="width: 80px;height: 80px;" @click="startUpload">
          <van-icon :name="uploadIcon" class="van-uploader__upload-icon" />
          <text v-if="uploadText" class="van-uploader__upload-text">{{ uploadText }}</text>
        </view>

      </template>
    </div>
    <van-popup @close="()=>{previewMediaShow = false}" customStyle="background-color: transparent"
      :show="previewMediaShow">
      <view style="height: 50vh;display: flex;align-items: center;">
        <swiper style="width: 100vw;height:100%" :current="previewMediaIndex">
          <swiper-item style="width: 100vw;height:100%" v-for="(item,index) in previewMediaList" :key="index">
            <view style="display: flex;justify-content: center;align-items: center;height:100%">
              <image style="overflow: visible;height: 100%;" mode="heightFix" :src="item.url" v-if="item.isImage">
              </image>
              <video autoplay object-fit="contain" :src="item.url" style="width:100vw;height: 100%;" v-if="item.isVideo"></video>
            </view>

          </swiper-item>
        </swiper>
      </view>
    </van-popup>
  </div>
</template>

<script>
  import {
    VantComponent
  } from '../common/component';
  import {
    isBoolean,
    isPromise
  } from '../common/validator';
  import {
    imageProps,
    mediaProps,
    messageFileProps,
    videoProps
  } from './shared';
  import {
    chooseFile,
    isImageFile,
    isVideoFile
  } from './utils';
  export default {
    ...VantComponent({
      props: {
        disabled: Boolean,
        multiple: Boolean,
        uploadText: {
          type: String,
          default: '上传'
        },
        useBeforeRead: Boolean,
        afterRead: null,
        beforeRead: null,
        previewSize: {
          type: null,
          default: 80,
        },
        name: {
          type: null,
          default: '',
        },
        accept: {
          type: String,
          default: 'image',
        },
        fileList: {
          type: Array,
          default: ()=>[],
          observer: 'formatFileList',
        },
        maxSize: {
          type: Number,
          default: Number.MAX_VALUE,
        },
        maxCount: {
          type: Number,
          default: 100,
        },
        deletable: {
          type: Boolean,
          default: true,
        },
        showUpload: {
          type: Boolean,
          default: true,
        },
        previewImage: {
          type: Boolean,
          default: true,
        },
        previewFullImage: {
          type: Boolean,
          default: true,
        },
        videoFit: {
          type: String,
          default: 'contain',
        },
        imageFit: {
          type: String,
          default: 'scaleToFill',
        },
        uploadIcon: {
          type: String,
          default: 'photograph',
        },
        ...imageProps,
        ...videoProps,
        ...mediaProps,
        ...messageFileProps,
      },

      data() {
        return {
          lists: [],
          previewMediaList: [],
          previewMediaIndex: 0,
          isInCount: true,
          previewMediaShow: false
        }

      },
      watch: {
        fileList: {
          handler(newVal, oldVal) {
            this.formatFileList()



          },
          immediate: true
        },
        lists: {
          handler(newVal, oldVal) {
            console.log('lists')
            this.previewMediaList = newVal.filter(item => {
              //排除无法预览的非media文件
              return isImageFile(item) || isVideoFile(item)
            })

          },
          immediate: true
        }

      },

      methods: {
        formatFileList() {
          const {
            fileList = [], maxCount
          } = this;
          const lists = fileList.map((item) => ({
            ...item,
            isImage: isImageFile(item),
            isVideo: isVideoFile(item),
            deletable: isBoolean(item.deletable) ? item.deletable : true,
          }));
          this.lists = lists
          this.isInCount = lists.length < maxCount
        },

        getDetail(index) {
          return {
            name: this.name,
            index: index == null ? this.fileList.length : index,
          };
        },

        startUpload() {
          const {
            maxCount,
            multiple,
            lists,
            disabled,
            accept
          } = this;
          if (disabled) return;

          chooseFile({
              count: 1,
              multiple,
              maxCount: maxCount - lists.length,
              accept
            })
            .then((res) => {

              this.onBeforeRead(multiple ? res : res[0]);
            })
            .catch((error) => {

              this.$emit('error', error);
            });
        },

        onBeforeRead(file) {
          const {
            beforeRead,
            useBeforeRead
          } = this;
          let res = true;
          console.log(beforeRead, useBeforeRead)
          if (typeof beforeRead === 'function') {
            res = beforeRead(file, this.getDetail());
          }

          if (useBeforeRead) {
            res = new Promise((resolve, reject) => {
              this.$emit('before-read', {
                ...file,
                ...this.getDetail(),
                callback: (ok) => {
                  ok ? resolve() : reject();
                },
              });
            });
          }

          if (!res) {

            return;
          }

          if (isPromise(res)) {
            res.then((data) => this.onAfterRead(data || file));
          } else {

            this.onAfterRead(file);
          }
        },

        onAfterRead(file) {
          const {
            maxSize,
            afterRead
          } = this;
          const oversize = Array.isArray(file) ?
            file.some((item) => item.size > maxSize) :
            file.size > maxSize;

          if (oversize) {
            this.$emit('oversize', {
              ...file,
              ...this.getDetail()
            });
            return;
          }

          if (typeof afterRead === 'function') {

            afterRead(file, this.getDetail());
          }
          console.log(file, this.getDetail())
          this.$emit('after-read', {
            ...file,
            ...this.getDetail()
          });
          console.log(afterRead)
        },

        deleteItem(event) {

          const {
            index
          } = event.currentTarget.dataset;

          this.$emit('delete', {
            ...this.getDetail(index),
            ...this.fileList[index],
          });
        },

        onPreviewImage(event) {
          if (!this.previewFullImage) return;

          const {
            index
          } = event.currentTarget.dataset;
          const {
            lists,
            showmenu
          } = this;
          const item = lists[index];
          this.previewMediaIndex = Number(index)
          //#ifdef H5 || APP-PLUS
          this.previewMediaShow = true
          //#endif

          //#ifdef MP

          uni.previewImage({
            urls: lists.filter((item) => isImageFile(item)).map((item) => item.url),
            current: item.url,
            showmenu,
            fail() {
              uni.showToast({
                title: '预览图片失败',
                icon: 'none'
              });
            },
          });
          //#endif
        },

        onPreviewVideo(event) {
          if (!this.previewFullImage) return;
          const {
            index
          } = event.currentTarget.dataset;
          const {
            lists
          } = this;

          const sources = [];

          const current = lists.reduce((sum, cur, curIndex) => {
            if (!isVideoFile(cur)) {
              return sum;
            }

            sources.push({
              ...cur,
              type: 'video'
            });

            if (curIndex < index) {
              sum++;
            }

            return sum;
          }, 0);
          this.previewMediaIndex = Number(index)


          //#ifdef H5 || APP-PLUS
          this.previewMediaShow = true
          //#endif

          //#ifdef MP
          uni.previewMedia({
            sources,
            current,
            fail() {
              uni.showToast({
                title: '预览视频失败',
                icon: 'none'
              });
            },
          });
          //#endif

        },

        onPreviewFile(event) {
          if (!this.previewFile) return;

          const {
            index
          } = event.currentTarget.dataset;

          uni.openDocument({
            filePath: this.lists[index].url,
            showMenu: true,
          });
        },

        onClickPreview(event) {
          const {
            index
          } = event.currentTarget.dataset;
          const item = this.lists[index];

          this.$emit('click-preview', {
            ...item,
            ...this.getDetail(index),
          });
        },
      },
    })

  }
</script>

<style lang="less">
  .g {
    background-color: transparent
  }

  @import './index.less';
</style>
