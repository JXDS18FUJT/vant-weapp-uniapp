import {
  pickExclude,
  isPC,
  isWxWork
} from '../common/utils';
import {
  isImageUrl,
  isVideoUrl
} from '../common/validator';

// export interface File {
//   url: string; // 上传临时地址
//   size?: number; // 上传大小
//   name?: string;
//   type: string; // 上传类型
//   duration?: number; // 上传时间
//   time?: number; // 消息文件时间
//   isImage?: boolean;
//   isVideo?: boolean;
// }

export function isImageFile(item) {
  if (item.isImage != null) {
    return item.isImage;
  }

  if (item.type) {
    return item.type === 'image';
  }

  if (item.url) {
    return isImageUrl(item.url);
  }

  return false;
}

export function isVideoFile(item) {
  if (item.isVideo != null) {
    return item.isVideo;
  }

  if (item.type) {
    return item.type === 'video';
  }

  if (item.url) {
    return isVideoUrl(item.url);
  }

  return false;
}

function formatImage(
  res
) {

  return res.tempFiles.map((item) => ({
    ...pickExclude(item, ['path']),
    type: 'image',
    file:item,
    url: item.tempFilePath || item.path,
    thumb: item.tempFilePath || item.path,
  }));
}

function formatVideo(
  res
) {
   console.log('formatVideo',res)
  //mp
  if(res.tempFilePath){
    return [{
      ...pickExclude(res, ['tempFilePath', 'thumbTempFilePath', 'errMsg']),
      type: 'video',
      url: res.tempFilePath,
      thumb: res.thumbTempFilePath,
    }];
  }else{
    //h5
    return res.tempFiles.map((item) => ({
      file:item,
      type: 'video',
      url: item.tempFilePath || item.path,
      thumb: item.tempFilePath || item.path,
    }))

  }

}

function formatMedia(res) {
  return res.tempFiles.map((item) => ({
    ...pickExclude(item, ['fileType', 'thumbTempFilePath', 'tempFilePath']),
    type: item.fileType,
    url: item.tempFilePath,
    thumb: item.fileType === 'video' ? item.thumbTempFilePath : item.tempFilePath,
  }));
}

function formatFile(
  res
) {
  return res.tempFiles.map((item) => ({
    ...pickExclude(item, ['path']),
    url: item.path,
  }));
}

export function chooseFile({
  accept,
  multiple,
  capture,
  compressed,
  maxDuration,
  sizeType,
  camera,
  maxCount,
  mediaType,
  extension,
}) {
  return new Promise((resolve, reject) => {
    switch (accept) {
      // #ifdef WEB || APP-PLUS
      case 'image':

        uni.chooseFile({
          count: multiple ? Math.min(maxCount, 9) : 1,
          mediaType: ['image'],
          type:'image',
          sourceType: capture,
          maxDuration,
          sizeType,
          camera,
          success: (res) => resolve(formatImage(res)),
          fail: reject,
        });

        break;
      case 'video':
        uni.chooseFile({
          type:'video',
          sourceType: capture,
          compressed,
          maxDuration,
          camera,
          success: (res) => resolve(formatVideo(res)),
          fail: reject,
        });
        break;
      default:
        uni.chooseFile({
          count: multiple ? maxCount : 1,
          type: 'all',
          ...(extension ? {
            extension
          } : {}),
          success: (res) => resolve(formatImage(res)),
          fail: reject,
        });


        break;
        // #endif
        // #ifdef MP
      case 'image':
        if (isPC || isWxWork) {
          uni.chooseImage({
            count: multiple ? Math.min(maxCount, 9) : 1,
            sourceType: capture,
            sizeType,
            success: (res) => resolve(formatImage(res)),
            fail: reject,
          });
        } else {
          uni.chooseMedia({
            count: multiple ? Math.min(maxCount, 9) : 1,
            mediaType: ['image'],
            sourceType: capture,
            maxDuration,
            sizeType,
            camera,
            success: (res) => resolve(formatImage(res)),
            fail: reject,
          });
        }
        break;
      case 'media':
        uni.chooseMedia({
          count: multiple ? Math.min(maxCount, 9) : 1,
          mediaType,
          sourceType: capture,
          maxDuration,
          sizeType,
          camera,
          success: (res) => resolve(formatMedia(res)),
          fail: reject,
        });
        break;
      case 'video':
        uni.chooseVideo({
          sourceType: capture,
          compressed,
          maxDuration,
          camera,
          success: (res) => resolve(formatVideo(res)),
          fail: reject,
        });
        break;
      default:
        uni.chooseMessageFile({
          count: multiple ? maxCount : 1,
          type: accept,
          ...(extension ? {
            extension
          } : {}),
          success: (res) => resolve(formatFile(res)),
          fail: reject,
        });
        break;
        // #endif
    }
  });
}
