import models from "./models";
import fs, { writeFile } from "fs";
import path from "path";
import chalk from "chalk";


const writeFileAsync = async (dirpath, post) => {
  const tags = await post.getTags();
  const filename = post.filename + '.md'
  const filepath = path.join(dirpath, filename);
  let writeStream = fs.createWriteStream(filepath, {
    flags: 'w+'
  });
  const title = '---\n' + 'title: ' + post.title + '\n'
  const description =  'description: ' + post.description + '\n'
  const tagname = 'tags: ' + tags.map(tag => tag.name).join(", ") + '\n'
  const image = 'image: ' + post.image + '\n' + '---\n'
  const info = title + description + tagname + image
  writeStream.write(info, 'utf8');
  writeStream.write(post.content, 'utf8');
  writeStream.on('finish', () => {
    console.log(
      chalk.white.bgGreen.bold(`Create ${filename} file successful..`)
    )
  });

  // close the stream
  writeStream.end();
}

const writeFiles = async (dirname) => {
  const dirpath = path.join(__dirname, dirname);
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath);
  } 
  const posts = await models.Post.findAll()
  posts.map(async (post) => {
    await writeFileAsync(dirpath, post)
  })    
}

export default writeFiles;