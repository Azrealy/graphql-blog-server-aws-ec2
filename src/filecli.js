import models, { sequelize } from "./models";
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import readFiles from "./readFiles";
import writeFiles from "./writeFiles";


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
      message: "Input the directory name your want to write or read file.."
    },
    {
      type: "list",
      name: "OPERATION",
      message: "Write file from database or store file to database.",
      choices: ["write", "store"],
      filter: function (val) {
        return val;
      }
    },
  ];
  return inquirer.prompt(questions);
};

const run = async () => {
  // show script introduction
  init();

  // ask questions
  const answers = await askQuestions();
  const { DIRNAME, OPERATION } = answers;

  try {
    if (OPERATION === 'write') {
      await writeFiles(DIRNAME);
    } else {
      const {posts, tags} = await readFiles(DIRNAME)
      sequelize.sync({ force: true }).then(async () => {
        await tags.forEach(async tag => await models.Tag.create(tag));
        await posts.forEach(async post => {
          const result = await models.Post.create(post.markdown)
          await result.setTags(post.tagIds)
        })
      });
    }

  }
  catch (err) {
    console.log("Process of store database data failed, ", err.message)
    return
  }
  // show success message

};

run();