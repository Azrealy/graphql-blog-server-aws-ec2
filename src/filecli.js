import models, { sequelize } from "./models";
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import readFiles, { readFile } from "./readFiles";
import writeFiles, { writeFile } from "./writeFiles";
import fs from "fs";
import path from "path";


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

const operationPrompt = {
  type: "list",
  name: "OPERATION",
  message: "Write file from database or store file to database.",
  choices: ["write", "store"],
}

const confirmPrompt = {
  type: "confirm",
  name: "CONFIRM",
  message: "Do you want implementation into this directory.",
  default: true
}

const inputFileNamePrompt = (operation, filenames) =>  {
  return {
    type: "list",
    name: "FILENAME",
    message: "Choice one of files to " + operation,
    choices: filenames
  }
}

const inputDirNamePrompt = {
  type: "input",
  name: "DIRNAME",
  message: "Input the directory name you want implement.",
  default: () => {
    return 'blogs'
  }
}

const main = async () => {
  init()
  const answers = await inquirer.prompt([operationPrompt, inputDirNamePrompt])
  const { OPERATION, DIRNAME } = answers

  if (OPERATION === 'write') {
    const answers = await confirmAnswer(OPERATION, DIRNAME);
    if (answers === true) {
      await writeFiles(DIRNAME);
    } else {
      await writeFile(DIRNAME, answers.FILENAME)
    }
  } else {
    const answers = await confirmAnswer(OPERATION, DIRNAME);
    if (answers === true) {
      const { posts, tags } = await readFiles(DIRNAME)
      sequelize.sync({ force: true }).then(async () => {
        await tags.forEach(async tag => await models.Tag.create(tag));
        await posts.forEach(async post => {
          const result = await models.Post.create(post.markdown)
          await result.setTags(post.tagIds)
        })
      });
    } else {
      const { post, tags } = await readFile(DIRNAME, answers.FILENAME);
      sequelize.sync().then(async () => {
        const tagIds = await tagsAsync(tags)
        const result = await models.Post.create(post.markdown)
        await result.setTags(tagIds)
      })
    }
    
  }
}

const confirmAnswer = async (OPERATION, DIRNAME) => {
  const answers = await inquirer.prompt(confirmPrompt)
    if (answers.CONFIRM) {
      return true;
    } else {
      const answers = await fileNameAnswer(OPERATION, DIRNAME);
      return answers;
    }
}

const fileNameAnswer = async (OPERATION, DIRNAME) => {
  if (OPERATION === "write") {
    const posts = await models.Post.findAll();
    const filenames = posts.map(post => post.filename)
    const inputPrompt = inputFileNamePrompt(OPERATION, filenames)
    const answers = await inquirer.prompt(inputPrompt)
    return answers
  } else {
    const dirPath = path.join(__dirname, DIRNAME);
    const filenames = await dirReadAsync(dirPath);
    const inputPrompt = inputFileNamePrompt(OPERATION, filenames)
    const answers = await inquirer.prompt(inputPrompt)
    return answers;
  } 
}

const tagsAsync = (tags) => {
  return new Promise(async (resolve, reject) => {
    var tagIds = [];
    await Promise.all(tags.map(async tag => {
      const findTag = await models.Tag.findOne({ where: {name: tag.name }});
      if (findTag) {
        tagIds.push(findTag.id)
      } else {
        const createTag = await models.Tag.create({ name: tag.name })
        tagIds.push(createTag.id)
      }
    }))
    resolve(tagIds)
  })
}

const dirReadAsync = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, filenames) => {
      resolve(filenames)
    })
  })
}

main();