const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const fs = require('fs');

const { pipeStream } = require('./file');

const app = new Koa();
const router = new Router();

app.use(
  koaBody({
    formidable: {
      uploadDir: path.resolve(__dirname, './uploads'),
      onFileBegin(name, file) {
        const [filename, chunkname] = name.split('+');
        const filedirPath = path.resolve(__dirname, `./uploads/${filename}`);
        const isExist = fs.existsSync(filedirPath);
        if (!isExist) {
          fs.mkdirSync(filedirPath);
        }
        file.path = path.resolve(
          __dirname,
          `./uploads/${filename}/${chunkname}`,
        );
      },
    },
    multipart: true,
  }),
);

app.use(cors());

router.post('/upload', (ctx, next) => {
  const file = ctx.request.files;
  ctx.body = file;
});

router.post('/merge', (ctx, next) => {
  const { fileInfo } = ctx.request.body;
  // const dirs = glob.sync(filepath);
  const filename = `${fileInfo.hash}.${fileInfo.type.split('/')[1]}`;
  const write = fs.createWriteStream(filename);
  const promises = [];
  for (let i = 0; i < fileInfo.chunkLength; i++) {
    const filepath = path.resolve(
      __dirname,
      `./uploads/${fileInfo.hash}/chunks-${i}`,
    );
    promises.push(pipeStream(filepath, write));
  }
  const res = Promise.all(promises);
  ctx.body = { res };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
