<template>
  <div>
    <input
      type="file"
      :multiple="multiple"
      @change="handleChange"
    >
    <div
      v-for="item in current"
      :key="item.hash"
    >
      <div>
        <span>hash：{{ item.hash }}</span>
        <span>进度：{{ item.progress }}%</span>
        <img
          v-if="isImage(item.type)"
          class="ykx-upload__preview"
          :src="item.previewURL"
          :alt="item.name"
        >
        <span v-else>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ykx-upload',
  props: {
    // 是否开始多文件上传
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      chunkSize: 2 * 1024 * 1024,
      current: [],
    };
  },

  methods: {
    handleChange(e) {
      const files = e.target.files;
      console.dir(files);
      const array = Array.prototype.slice.call(files);
      const current = array.map((file, index) => {
        const fileInfo = this.createPreviewFile(file, index);
        const chunks = this.sliceFile(file, fileInfo);
        fileInfo.chunkLength = fileInfo.chunkUnComplete = chunks.length;
        this.upload(chunks, fileInfo);
        return fileInfo;
      });
      this.current = current;
    },

    async upload(chunks, fileInfo) {
      const formdata = new FormData();
      const promises = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        formdata.append(chunk.hash, chunk.blob);
        const promise = this.xhr({
          url: 'http://localhost:3000/upload',
          data: formdata,
          onProgress: this.handleProgress,
          fileInfo,
        });
        promises.push(promise);
      }
      try {
        const res = await Promise.all(promises);
        const isCompelete = res.every((item) => item.status === 200);
        if (isCompelete) {
          // 发起合并请求
          // const formdata = new FormData();
          // formdata.append('fileInfo', fileInfo);
          this.xhr({
            url: 'http://localhost:3000/merge',
            data: { fileInfo },
          });
        } else {
          alert('上传失败');
        }
      } catch (err) {
        alert(err.message);
      }
    },

    handleProgress(e, fileInfo) {
      if (e.lengthComputable) {
        if (e.loaded === e.total) {
          fileInfo.chunkUnComplete -= 1;
        }
      }
    },

    xhr({ url, data, onProgress, fileInfo }) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onreadystatechange = function() {
          if (this.readyState === 4) {
            if (this.status === 200) {
              resolve({
                status: this.status,
                response: JSON.parse(this.response),
              });
            } else {
              reject(new Error('请求失败'));
            }
          }
        };
        xhr.upload.onprogress = (e) => onProgress && onProgress(e, fileInfo);
        if (toString.call(data) === '[object Object]') {
          xhr.setRequestHeader('content-type', 'application/json');
          xhr.send(JSON.stringify(data));
        } else {
          xhr.send(data);
        }
      });
    },

    createHash(file, index) {
      return `file-${index}-${Date.now()}`;
    },

    createChunkHash(fileInfo, index) {
      return `${fileInfo.hash}+chunks-${index}`;
    },

    createPreviewFile(file, index) {
      const { name, lastModified, size, type } = file;
      return {
        name, // 文件名
        lastModified, // 系统最后更新时间
        size, // 文件大小
        type, // mimetype
        get progress() {
          return ((1 - this.chunkUnComplete / this.chunkLength) * 100).toFixed(
            2,
          );
        }, // 上传进度
        hash: this.createHash(file, index), // 文件 hash 值
        previewURL: window.URL.createObjectURL(file), // 预览地址
        index, // 文件序号
      };
    },

    isImage(type) {
      return type.indexOf('image') !== -1;
    },

    sliceFile(file, fileInfo) {
      const chunks = [];
      let start = 0;
      let end = 0;
      if (file.size > this.chunkSize) {
        let i = 0;
        while (true) {
          end += this.chunkSize;
          const blob = file.slice(start, end);
          start += this.chunkSize;

          if (blob.size === 0) break;
          chunks.push({
            hash: this.createChunkHash(fileInfo, i),
            blob,
          });
          i++;
        }
      } else {
        const blob = file.slice(0);
        chunks.push({
          hash: this.createChunkHash(fileInfo, 0),
          blob,
        });
      }
      return chunks;
    },
  },
};
</script>

<style lang="scss">
.ykx-upload {
  &__preview {
    width: 50px;
    height: 50px;
  }
}
</style>