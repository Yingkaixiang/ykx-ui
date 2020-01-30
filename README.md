# vue-component-boilerpalte-v2

一个用于创建 vue 组件的脚手架。

在线示例：

* [GitHub Pages](https://yingkaixiang.github.io/vue-component-boilerplate/)
* [七牛云](http://qncdn.yingkx.top/vue-component-boilerplate/index.html)

## 特性

- [x] 支持 创建单个组件或组件库。
- [x] 支持 组件库全量加载或按需加载。
- [ ] 支持 服务端渲染。
- [ ] 支持 TypeScript。
- [x] 支持 Sass。
- [ ] 支持 Less。
- [ ] 支持 Stylus。
- [x] 支持 storybook。
- [x] 支持 storybook 一键发布在线示例。
  - [x] GitHub Pages
  - [x] 七牛云
- [x] 支持 图片自动转换成 base64（默认小于 1kb）。
- [ ] 支持 图片自动上传至 CDN。
- [x] 支持 使用 Jest 进行单元测试。
- [ ] 支持 移动端调试。
- [ ] 支持 可视化自动测试。
- [x] 支持 快捷功能脚本（如：一键创建组件目录及相关默认文件）。 

## 规范

- [ ] 使用 ESLint 作为编码规范。
- [ ] 使用 CSS bem 规范。
- [x] 使用 Angular Commit 规范。

## 项目目录

- build 构建脚本
- components 组件
- cjs 全量加载输出目录
- lib 按需加载输出目录
- src 全量导入入口
  
## 如何使用

```bash
# 克隆项目至本地
git clone git@github.com:Yingkaixiang/vue-component-boilerplate.git

# 进入项目
cd vue-component-boilerplate

# 安装依赖
# 因为本项目依赖 node-sass，所以建议使用淘宝镜像
npm i

# 快速创建一个组件
npm run generate [component-name]

# 启动本地调试
npm run storybook

# 构建按需加载
npm run build-component

# 构建全量加载
npm run build
```

## 如何添加 Polyfill？

原则上组件库默认不添加 Polyfill，原因是防止组件库的使用者在项目中已经主动添加了 Polyfill，总而使得我们提供的组件库代码将其覆盖或重复打包相同功能的代码。如果你想要添加的话，可以使用以下方法：

```bash
# 组件库使用运行时的加载方法
# 避免污染全局属性
npm i @babel/plugin-transform-runtime --save-dev
npm i @babel/runtime --save
npm i @babel/runtime-corejs3 --save
```

```js
module.exports = {
  // ... 省略其他配置
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      { corejs: 3 }
    ]
  ]
}
```

## 为什么不在 .vue 文件中写 css？

组件库本身有一套自己的 CSS 命名规则，保证唯一的命名空间以及可以方便的进行修改。所以 scoped 和 CSS Module 对于组件库来说是没有意义的。但是在 .vue 文件中使用 `<style></style>` 标签的话 `vue-loader` 一定会把相关的 CSS 处理逻辑（如模拟 scoped 特性）打包进最终的文件里。所以采用分离的方式编写 CSS，也能做到组件库样式的统一管理。