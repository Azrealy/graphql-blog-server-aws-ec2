import TagsHelper from "./tagsHelper";

import readline from "readline";
import path from "path";
import fs from "fs";

const date = new Date()

const readFileAsync =  (
    filenames, 
    dirPath, 
    tagsHelper) => {
  return new Promise(async (resolve, reject) => {
    const posts = await Promise.all(filenames.map((filename) => {
      return storeMarkdown(
        dirPath,
        filename,
        tagsHelper);
    }))
    resolve(posts);
  })
}

const storeMarkdown = (dirPath, filename, tagsHelper) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(path.join(dirPath, filename)),
      terminal: true
    });
    var lineCounter = 0;
    var tagIds = [];
    var markdown = {
      filename: filename.split(".")[0],
      title: "",
      description: "",
      image: "",
      content: "",
      createdAt: date.setSeconds(date.getSeconds() + 1),
    };
    return new Promise((resolve, reject) => {
      rl.on('line', (line) => {
        lineCounter++;
        if (lineCounter == 2) {
          markdown.title = line.split(/^title: /)[1];
        } else if (lineCounter == 3) {
          markdown.description = line.split(/^description: /)[1];
        } else if (lineCounter == 4) {
          line.split(/^tags: /)[1].split(/, /).map(tag => {
            const result = tagsHelper.generateTag(tag);
            tagIds.push(result.id);
          })
        } else if (lineCounter == 5) {
          markdown.image = line.split(/^image: /)[1];
        } else if (lineCounter >= 7) {
          markdown.content = markdown.content + line + "\n";
        }
      });
      rl.on('close', () => {
        const post = {
          markdown: markdown,
          tagIds: tagIds
        };
        return resolve(post);
      })
    })
  }

const readFiles = (dirName) => {
  const tagsHelper = new TagsHelper();
  const dirPath = path.join(__dirname, dirName);
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, async (err, files) => {
      if (err) {
        return reject(err);
      }
      const posts = await readFileAsync(
        files,
        dirPath,
        tagsHelper)
      const tags = tagsHelper.tags;
      resolve({posts, tags});
    });
  });
}

export default readFiles;