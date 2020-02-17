import Upload from '../components/upload/';

// 组件库导入
const components = [Upload];

const install = function(Vue) {
  components.forEach((component) => {
    console.log(component.name);
    Vue.component(component.name, component);
  });
};

export default {
  version: '1.0.0',
  total: components.length,
  install,
  Upload,
};

// 单个组件可以直接这样导出
// export default Button;
