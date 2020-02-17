import Upload from '../src/upload.vue';

import '../src/style.scss';

export const Default = () => ({
  components: { Upload },
  template: '<Upload />',
});

Default.story = { name: '默认' };

export const Multiple = () => ({
  components: { Upload },
  template: '<Upload multiple />',
});

Multiple.story = { name: '多文件' };

export default {
  title: '基础组件 | Upload 上传按钮',
  component: Upload,
};
