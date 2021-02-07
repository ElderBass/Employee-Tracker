//require mysql as dependency for all this stuff to work
const mysql = require("mysql");
const inquirer = require('inquirer');
//these got added after the fact...not sure why?
const { inherits } = require("util");
const { connect } = require("http2");


//create our connection for communicating with the SQL file
var connection = mysql.createConnection({

    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "emp_trackerDB"
});

//now we establish our connection with SQL and run it
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    init();
});

function init() {
    inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Departments', 'View Employees by Department (with budget)', 'View All Employee Roles', 'Add Employee', 'Remove Employee', 'Add Employee Role', 'Remove Employee Role', 'Update Employee Role', 'Add Department', 'Remove Department', 'Exit'],
            name: 'start'
        })
        .then(function(response) {
            switch (response.start) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'View Employees by Department (with budget)':
                    viewByDepartment();
                    break;
                case 'View All Employee Roles':
                    viewRoles();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Remove Employee':
                    removeEmployee();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Remove Department':
                    removeDepartment();
                    break;
                case 'Add Employee Role':
                    addRole();
                    break;
                case 'Remove Employee Role':
                    removeRole();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'Exit':
                    exitProgram();
                    break;
            }
        })
}

function viewAllEmployees() {
    connection.query(`SELECT employees.first_name, employees.last_name, employees.e_id, employees.role_id, role.r_id, role.title, role.salary, department.name FROM employees INNER JOIN role ON employees.role_id = role.r_id INNER JOIN department ON role.department_id = department.d_id`, function(err, res) {
        if (err) throw err
        console.table(res);
        console.log(`\n==================================\n`);
        init();
    })
}

function viewRoles() {
    connection.query(`SELECT title, salary, department_id FROM role`, function(err, res) {
        if (err) throw err;
        console.log(`\nViewing All Employee Roles:`)
        console.table(res);
        console.log(`\n==================================\n`)
        init();
    })
}

function viewDepartments() {
    connection.query("SELECT name FROM department", function(err, res) {
        if (err) throw err;
        console.log(`\nViewing All Departments:`)
        console.table(res);
        console.log(`\n==================================\n`)
        init();
    })
}

function viewByDepartment() {

    connection.query("SELECT name, d_id FROM department", function(err, res) {
        if (err) throw err;

        let depts = [];
        for (let i = 0; i < res.length; i++) {
            let dept = {
                name: res[i].name,
                value: {
                    id: res[i].d_id,
                    dept: res[i].name
                }
            }
            depts.push(dept);
        }
        inquirer
            .prompt({
                type: "list",
                message: "Which department would you like to view?",
                choices: depts,
                name: "department",
            })
            .then(function(response) {
                connection.query(`SELECT employees.first_name, employees.last_name, role.title, role.salary FROM employees INNER JOIN role ON role.r_id = employees.role_id WHERE role.department_id = ${response.department.id}`, function(err, res) {
                    if (err) throw err

                    let budget = 0;
                    for (let i = 0; i < res.length; i++) {
                        budget += res[i].salary;
                    }
                    console.log(`\n Viewing Employees from Department: "${response.department.dept}"`);
                    console.table(res);
                    console.log(`Total Budget for Department "${response.department.dept}" \n ${budget.toFixed(2)} Credits`);
                    console.log(`\n==================================\n`);
                    init();
                })
            })
    })
}

function addEmployee() {
    connection.query(`SELECT title, r_id FROM role`, function(err, res) {
        if (err) throw err;

        let roles = [];
        for (let i = 0; i < res.length; i++) {
            let role = {
                name: res[i].title,
                value: res[i].r_id
            }
            roles.push(role);
        }
        inquirer
            .prompt([{
                    type: "input",
                    message: "What is the employee's first name?",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "What is the employee's role?",
                    choices: roles,
                    name: "role"
                },
            ])
            .then(function(response) {
                connection.query(`INSERT INTO employees SET ?`, {
                        first_name: response.firstName,
                        last_name: response.lastName,
                        role_id: response.role,
                    },
                    function(err, res) {
                        if (err) throw err;
                        console.log(`\nGreat! We've added ${response.firstName} ${response.lastName} to the database of employees!`)
                        console.log(`\n==================================\n`);
                        init();
                    })
            })
    })
}

function removeEmployee() {
    connection.query("SELECT first_name, last_name, e_id FROM employees", function(err, res) {
        if (err) throw err;
        let emps = [];
        for (let i = 0; i < res.length; i++) {
            let emp = {
                name: res[i].first_name + " " + res[i].last_name,
                value: {
                    id: res[i].e_id,
                    emp: res[i].first_name + " " + res[i].last_name
                }
            }
            emps.push(emp);
        }
        inquirer.prompt({
                type: 'list',
                message: 'Which employee which would like to remove?',
                choices: emps, //this is now an array of objects, each of which has a value equal to the employee's id
                name: "employee"
            })
            .then(function(response) {
                //then we delete the employee who's id matches the value of the choice the user maade in the prompt
                connection.query(`DELETE FROM employees WHERE employees.e_id = ${response.employee.id}`, function(err2, res2) {
                    if (err2) throw err2;
                    console.log(`\nSuccess! We have removed ${response.employee.emp} from the database. \n `)
                    console.log(`\n==================================\n`);
                    init();
                })
            })
    })
}

function addRole() {
    //just need to grab the department names and their ids so we can display them in a prompt and set the department_id of the role to the d_id
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;

        let depts = [];
        for (let i = 0; i < res.length; i++) {
            let dept = {
                name: res[i].name,
                value: res[i].d_id
            }
            depts.push(dept);
        }
        inquirer
            .prompt([{
                type: 'input',
                message: "What is the name of the role you wish to add?",
                name: "role"
            }, {
                type: 'list',
                message: "Under which department does this role fall?",
                choices: depts,
                name: "department"
            }, {
                type: 'input',
                message: 'What will the salary of this role be?',
                name: "salary"
            }])
            .then(function(response) {
                connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${response.role}", "${parseInt(response.salary).toFixed(2)}", "${response.department}")`, function(err2, res2) {
                    if (err2) throw err2;
                    console.log(`\nHeck yeah! We successfully added ${response.role} to the database! \n`)
                    console.log(`\n==================================\n`);
                    init();
                })
            })
    })
}

function removeRole() {
    connection.query("SELECT title, r_id FROM role", function(err, res) {
        if (err) throw err;

        let roles = [];
        for (let i = 0; i < res.length; i++) {
            let role = {
                name: res[i].title,
                value: {
                    id: res[i].r_id,
                    role: res[i].title
                }
            }
            roles.push(role);
        }
        inquirer.prompt({
                type: 'list',
                message: 'Which role which would like to remove?',
                choices: roles,
                name: "role"
            })
            .then(function(response) {
                //then we delete the employee who's id matches the value of the choice the user maade in the prompt
                connection.query(`DELETE FROM role WHERE role.r_id = ${response.role.id}`, function(err2, res2) {
                    if (err2) throw err2;
                    console.log(`\n Success! We have removed "${response.role.role}" from the database. \n `)
                    console.log(`\n==================================\n`);
                    init();
                })
            })
    })
}

function addDepartment() {
    inquirer
        .prompt({
            type: 'input',
            message: 'What is the name of the department you wish to add? (PLEASE ensure your spelling is accurate)',
            name: 'department'
        })
        .then(function(response) {
            connection.query(`INSERT INTO department (name) VALUES ("${response.department}")`, function(err, res) {
                if (err) throw err;
                console.log(`Excelsior! We successfully added '${response.department}' to the database! \n`);
                console.log(`\n==================================\n`);
                init();
            })
        })
}

function removeDepartment() {
    connection.query("SELECT name, d_id FROM department", function(err, res) {
        if (err) throw err;

        let depts = [];
        for (let i = 0; i < res.length; i++) {
            let dept = {
                name: res[i].name,
                value: {
                    id: res[i].d_id,
                    dept: res[i].name
                }
            }
            depts.push(dept);
        }
        inquirer.prompt({
                type: 'list',
                message: 'Which department which would like to remove?',
                choices: depts, //this is now an array of objects, each of which has a value equal to the employee's id
                name: "department"
            })
            .then(function(response) {
                //then we delete the employee who's id matches the value of the choice the user maade in the prompt
                connection.query(`DELETE FROM department WHERE department.d_id = ${response.department.id}`, function(err2, res2) {
                    if (err2) throw err2;
                    console.log(`\nSuccess! We have removed ${response.department.dept} from the database. \n `)
                    console.log(`\n==================================\n`);
                    init();
                })
            })
    })
}

function updateRole() {
    connection.query("SELECT employees.first_name, employees.last_name, employees.e_id, employees.role_id, role.r_id, role.title FROM employees RIGHT JOIN role ON employees.role_id = role.r_id", function(err, res) {
        if (err) throw err;

        let emps = [];
        let roles = [];
        for (let i = 0; i < res.length; i++) {
            let emp = {
                name: res[i].first_name + " " + res[i].last_name,
                value: {
                    id: res[i].e_id,
                    emp: res[i].first_name + " " + res[i].last_name
                }
            }
            emps.push(emp);

            let role = {
                name: res[i].title,
                value: res[i].r_id
            }
            roles.push(role);
        }
        inquirer
            .prompt([{
                type: 'list',
                message: "Please select which employee you wish to update:",
                name: 'employee',
                choices: emps
            }, {
                type: 'list',
                message: 'Which role would you like to give this employee? (Note you may have to add the role you wish to choose first)',
                choices: roles,
                name: 'role'
            }])
            .then(function(response) {

                connection.query(`
                            UPDATE employees SET ? WHERE ? `, [{
                        role_id: response.role
                    },
                    {
                        e_id: response.employee.id,
                    }
                ], function(err3, res3) {
                    if (err3) err3;
                    console.log(`\nSuccess! We've updated the role for this employee.`)
                    console.log(`\n==================================\n`);
                    init();
                })
            })
    })
}

function exitProgram() {
    console.log("Thank for you using Employee Tracker. Have a nice day!")
    connection.end();
}