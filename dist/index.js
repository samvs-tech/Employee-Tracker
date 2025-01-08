import inquirer from 'inquirer';
import express from 'express';
import { connectDb } from './connection.js';
import { viewAllDepartments, viewAllRoles, viewEmployees, addDepartment, addRole, addEmployee, changeRole, } from './queries.js';
await connectDb();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const startApp = () => {
    inquirer
        .prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Change an employee role",
            ],
        },
    ])
        .then((answers) => {
        if (answers.action === "View all departments") {
            viewAllDepartments(startApp);
        }
        else if (answers.action === "View all roles") {
            viewAllRoles(startApp);
        }
        else if (answers.action === "View all employees") {
            viewEmployees(startApp);
        }
        else if (answers.action === "Add a department") {
            addDepartment(startApp);
        }
        else if (answers.action === "Add a role") {
            addRole(startApp);
        }
        else if (answers.action === "Add an employee") {
            addEmployee(startApp);
        }
        else if (answers.action === "Change an employee role") {
            changeRole(startApp);
        }
    });
};
startApp();
