import models from "./models";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";


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

const writeAllFile = async (dirname) => {
  const dirpath = path.join(__dirname, dirname);
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath);
  } 
  const posts = await models.Post.findAll()
  posts.map(async (post) => {
    await writeFileAsync(dirpath, post)
  })    
}

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("Blog Admin Write File CLI", {
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
};

const askQuestions = () => {
  const questions = [
    {
      name: "DIRNAME",
      type: "input",
      message: "Input the directory name your want store your data files."
    },
  ];
  return inquirer.prompt(questions);
};

const run = async () => {
  // show script introduction
  init();

  // ask questions
  const answers = await askQuestions();
  const { DIRNAME } = answers;

  try {
    await writeAllFile(DIRNAME);
    success(DIRNAME);
  }
  catch (err) {
    console.log("Process of store database data failed, ", err.message)
    return
  }
  // show success message
  
};

run();