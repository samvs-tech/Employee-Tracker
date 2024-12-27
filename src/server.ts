import inquirer from "inquirer";
import { connectDb } from './connection'

const startApp = async () => {
  
  await connectDb();

  const questions = [
    {
      type: 'list',
      name: 'menu',
      message: 'What would you like to do?',
      choices: [
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Quit'
      ],
    },
  ];

  const answers = await inquirer.prompt(questions);

  switch (answers.menu) {

    case 'Add Employee':
      //ADD CALL FUNCTION TO ADD EMPLOYEE
      break;
    case 'Update Employee Role':
      //ADD CALL FUNCTION TO UPDATE EMPLOYEE ROLE
      break;
    case 'View All Roles':
      //ADD CALL FUNCTION TO VIEW ALL ROLES
      break;
    case 'Add Role':
      //ADD CALL FUNCTION TO ADD A ROLE
      break;case 'View All Departments':
      //ADD CALL FUNCTION TO VIEW ALL DEPARTMENTS
      break;
    case 'Add Department':
      //ADD CALL FUNCTION TO ADD A DEPARTMENT
      break;
    case 'Quit':
      console.log('Exiting the application.');
      process.exit(0);
      break;
  };
};

startApp();