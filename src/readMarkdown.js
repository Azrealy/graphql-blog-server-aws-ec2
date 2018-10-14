const readline = require('./readline-promise');
const path = require("path");
const fs = require("fs");
const TagsHelper = require("./tagsHelper.js")

// Custom promisify
function promisify(fn) {
  /**
   * @param {...Any} params The params to pass into *fn*
   * @return {Promise<Any|Any[]>}
   */
  return function promisified(...params) {
    return new Promise(
      (resolve, reject) => fn(...params.concat([
        (err, ...args) => err ? 
          reject(err) : resolve(
            args.length < 2 ? 
              args[0] : args)]
      )))
  }
}
var fileList = (dirName) => {
  const storeMarkdown = new StoreMarkdown();
  const tagsHelper = new TagsHelper();
  var tags = [];
  var posts = [];
  const dirPath = path.join(__dirname, dirName);
  return new Promise((res, rej) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        return rej(err);
      }
      files.forEach( (files) => {
         storeMarkdown.storeMarkdown(
          dirPath,
          files,
          tagsHelper)
        const post = {
          markdown: storeMarkdown.markdown,
          tagIds: storeMarkdown.tagIds
        }
        posts.push(post)
        console.log(post)
      });
      res(posts);
    });
  });
}

var readDir = (dirName) => {
  const storeMarkdown = new StoreMarkdown();
  const tagsHelper = new TagsHelper();
  var tags = [];
  var posts = [];
  const dirPath = path.join(__dirname, dirName);
  return new Promise((res, rej) => {
    fs.readdir(dirPath, (err, fileNames) => {
      if (err) {
        return rej(err);
      }
      fileNames.forEach(async (fileName) => {
        await storeMarkdown.storeMarkdown(
          dirPath,
          fileName,
          tagsHelper)
        const post = {
          markdown: storeMarkdown.markdown,
          tagIds: storeMarkdown.tagIds
        }
        posts.push(post)
      });
      return res(posts);
    });
    
  });
}

class StoreMarkdown {
  constructor() {
    this.tagIds = [];
    this.markdown = {
      title: "",
      description: "",
      image: "",
      content: "",
    }
  }

  async storeMarkdown(dirPath, filename, tagsHelper) {
    const rl = readline.createInterface({
      input: fs.createReadStream(path.join(dirPath, filename)),
      terminal: true
    });
    let lineCounter = 0;
    await rl.each((line) => {
      lineCounter++;
      if (lineCounter == 2) {
        this.markdown.title = line.split(/^title: /)[1];
      } else if (lineCounter == 3) {
        this.markdown.description = line.split(/^description: /)[1];
      } else if (lineCounter == 4) {
        line.split(/^tags: /)[1].split(/, /).map(tag => {
          tag = tagsHelper.generateTag(tag);
          this.tagIds.push(tag.id);
        })
      } else if (lineCounter == 5) {
        this.markdown.image = line.split(/^image: /)[1];
      } else if (lineCounter >= 7) {
        this.markdown.content = this.markdown.content + line + "\n"
      }
    });
    rl.close
  }
}


fileList("test").then(post => console.log(post))
