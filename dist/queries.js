import { pool } from "./connection.js";
import inquirer from "inquirer";
import Table from "cli-table3";
export const viewAllDepartments = (startApp) => {
    pool.query(`SELECT id, department_name AS name FROM department`, (err, result) => {
        if (err) {
            console.log("error viewing departments");
            startApp();
        }
        else if (result) {
            const table = new Table({
                head: ["ID", "Name"],
                colWidths: [5, 20],
            });
            result.rows.forEach((row) => {
                table.push([row.id, row.name]);
            });
            console.log(table.toString());
            startApp();
        }
    });
};
export const viewAllRoles = (startApp) => {
    pool.query(`SELECT id, title, department_id AS department, salary FROM roles`, (err, result) => {
        if (err) {
            console.log("error viewing departments");
            startApp();
        }
        else if (result) {
            const table = new Table({
                head: ["ID", "Title", "Department", "Salary"],
                colWidths: [5, 20, 15, 10],
            });
            result.rows.forEach((row) => {
                table.push([row.id, row.title, row.department, row.salary]);
            });
            console.log(table.toString());
            startApp();
        }
    });
};
export const viewEmployees = (startApp) => {
    pool.query(`SELECT
       e.id,
       e.first_name,
       e.last_name,
       r.title,
       d.department_name AS department,
       r.salary,
       COALESCE(m.first_name || ' ' || m.last_name, 'None') AS manager
     FROM
       employee e
     JOIN roles r ON e.role_id = r.id
     JOIN department d ON r.department_id = d.id
     LEFT JOIN employee m ON e.manager_id = m.id`, (err, result) => {
        if (err) {
            console.log("error viewing employees");
            startApp();
        }
        else if (result) {
            const table = new Table({
                head: [
                    "ID",
                    "First Name",
                    "Last Name",
                    "Title",
                    "Department",
                    "Salary",
                    "Manager",
                ],
                colWidths: [5, 15, 15, 20, 15, 15, 15],
            });
            result.rows.forEach((row) => {
                table.push([
                    row.id,
                    row.first_name,
                    row.last_name,
                    row.title,
                    row.department,
                    row.salary,
                    row.manager,
                ]);
            });
            console.log(table.toString());
            startApp();
        }
    });
};
export const addDepartment = (startApp) => {
    inquirer
        .prompt([
        {
            type: "input",
            name: "response",
            message: "What is the name of the department",
        },
    ])
        .then((answer) => {
        const departmentName = answer.response;
        pool.query(`INSERT INTO department (department_name) VALUES ($1) RETURNING id, department_name`, [departmentName], (err, result) => {
            if (err) {
                console.log("error adding department");
            }
            else {
                const department = result.rows[0];
                console.log(`${department.department_name} was added successfully!`);
                startApp();
            }
        });
    });
};
//this is returning an array of strings that are the departments
export const getDepartments = async () => {
    try {
        const result = await pool.query(`SELECT department_name FROM department`);
        const departments = result.rows.map((row) => row.department_name);
        return departments;
    }
    catch (err) {
        console.log("error fetching departments");
        throw err;
    }
};
export const addRole = (startApp) => {
    getDepartments().then((departments) => {
        inquirer
            .prompt([
            {
                type: "input",
                name: "role",
                message: "What is the name of the role?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?",
                validate: (input) => {
                    // Check if the input is a valid number
                    const number = parseFloat(input);
                    if (isNaN(number) || number <= 0) {
                        return "Please enter a valid number greater than 0.";
                    }
                    return true; // Input is valid
                },
            },
            {
                type: "list",
                name: "department",
                message: "Which department does the role belong to?",
                choices: departments,
            },
        ])
            .then((answer) => {
            pool.query(`SELECT id FROM department WHERE department_name = $1`, [answer.department], (err, result) => {
                if (err) {
                    console.log("error adding role");
                    throw err;
                }
                else {
                    const departmentId = result.rows[0].id;
                    pool.query(`INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`, [answer.role, answer.salary, departmentId], (err) => {
                        if (err) {
                            console.log("error adding role");
                            throw err;
                        }
                        else {
                            console.log(`${answer.role} was added successfully`);
                        }
                        startApp();
                    });
                }
            });
        });
    });
};
//returns list of roles
const getRoles = async () => {
    try {
        const result = await pool.query(`SELECT title FROM roles`);
        const roles = result.rows.map((row) => row.title);
        return roles;
    }
    catch (err) {
        console.log("error fetching roles");
        throw err;
    }
};
//returns list of employees
const getEmployees = async () => {
    try {
        const result = await pool.query(`SELECT first_name, last_name FROM employee`);
        const managers = result.rows.map((row) => `${row.first_name} ${row.last_name}`);
        return managers;
    }
    catch (err) {
        console.log("error fetching roles");
        throw err;
    }
};
export const addEmployee = (startApp) => {
    Promise.all([getRoles(), getEmployees()]).then(([roles, managers]) => {
        inquirer
            .prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?",
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roles,
            },
            {
                type: "list",
                name: "managers",
                message: "Who is the employee's manager?",
                choices: managers,
            },
        ])
            .then((answer) => {
            Promise.all([
                pool.query(`SELECT id FROM roles WHERE title = $1`, [answer.role]),
                pool.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = $1`, [answer.managers]),
            ]).then(([roleAnswer, managerAnswer]) => {
                const roleId = roleAnswer.rows[0].id;
                const managerId = managerAnswer.rows[0].id;
                pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES  ($1, $2, $3, $4)`, [answer.firstName, answer.lastName, roleId, managerId], (err) => {
                    if (err) {
                        console.log("error adding employee");
                        throw err;
                    }
                    else {
                        console.log(`Employee ${answer.firstName} ${answer.lastName} was added successfully!`);
                    }
                    startApp();
                });
            });
        });
    });
};
const getEmployeesInfo = async () => {
    try {
        const result = await pool.query(`SELECT id, first_name, last_name FROM employee`);
        return result.rows.map((row) => ({
            id: `${row.id}`,
            name: `${row.first_name} ${row.last_name}`,
        }));
    }
    catch (err) {
        console.log("error fetching roles");
        throw err;
    }
};
export const changeRole = async (startApp) => {
    try {
        const [employees, roles] = await Promise.all([
            getEmployeesInfo(),
            getRoles(),
        ]);
        const answers = await inquirer.prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Choose an employee",
                choices: employees.map((employee) => ({
                    name: employee.name,
                    value: employee.id,
                })),
            },
            {
                type: "list",
                name: "role",
                message: "Choose a role to switch to",
                choices: roles,
            },
        ]);
        const roleResult = await pool.query(`SELECT id FROM roles WHERE title = $1`, [answers.role]);
        await pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2`, [
            roleResult.rows[0].id,
            answers.employeeId,
        ]);
        console.log("Employee's role updated successfully!");
        startApp();
    }
    catch (err) {
        console.log("error updating employee's role");
        throw err;
    }
};
