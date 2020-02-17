const fs = require('fs');

exports.pipeStream = function pipeStream(path, writeStream) {
  return new Promise((resolve) => {
    const readStream = fs.createReadStream(path);
    readStream.on('end', () => {
      fs.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  });
};
