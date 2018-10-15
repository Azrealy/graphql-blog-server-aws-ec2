import models from "./models";
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";


const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("Blog Admin CLI", {
        font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
};

const askQuestions = () => {
  const questions = [
    {
      name: "USERNAME",
      type: "input",
      message: "Input the user name you want to create. "
    },
    {
        name: "EMAIL",
        type: "input",
        message: "Input the email which can use to login instead of user name. "
    },
    {
      type: "list",
      name: "ROLE",
      message: "Do you want create Admin account?",
      choices: ["Yes", "No"],
      filter: function(val) {
        return val;
      }
    },
    {
        name: "PASSWORD",
        type: "input",
        message: "Input the password of your user account."
    },
  ];
  return inquirer.prompt(questions);
};

const createUser = async (username, email, role, password) => {
    await models.User.create(
        {
          username: username,
          email: email,
          role: role,
          password: password,
        },
      );
};

const success = (username) => {
  console.log(
    chalk.white.bgGreen.bold(`Done! User ${username} has been created. `)
  );
};

const run = async () => {
  // show script introduction
  init();

  // ask questions
  const answers = await askQuestions();
  const { USERNAME, EMAIL, ROLE, PASSWORD } = answers;
  
  const role = ROLE === 'Yes' ? 'ADMIN': '';
  console.log(role)

  try {
    await createUser(USERNAME, EMAIL, role, PASSWORD);
  }
  catch (err) {
    console.log("User creation was canceled, ", err.message)
    return 
  }
  // show success message
  success(USERNAME);
};

run();