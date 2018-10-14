var fs = require("fs")
var path = require("path")
var dir = process.argv[2] || '.';

var fileList = (dir) => {
  var results = [];
  return new Promise((res, rej) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        return rej(err);
      }
      files.forEach(file => {
        var fp = path.join(dir, file);
        if (fs.statSync(fp).isDirectory()) {
          fileList(fp)
            .then(files => {
              results = results.concat(files);
            });
        } else {
          results.push(fp);
        }
      });
      res(results);
    });
  });
}

fileList("src/test")
  .then(files => {
    console.log(files);
  }, (err) => {
    console.log('error', err);
  })