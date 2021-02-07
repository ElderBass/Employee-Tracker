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
/* Add departments, roles, employees
View departments, roles, employees
Update employee roles*/
function init() {
    inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Departments', 'View All Employee Roles', 'Add Employee', 'Remove Employee', 'Add Employee Role', 'Add Department', 'Update Employee Role', 'Exit'],
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
                case 'Add Employee Role':
                    addRole();
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
    connection.query(`SELECT * FROM employees`, function(err, res) {
            if (err) throw err
            console.table(res);
            console.log(`\n==================================\n`);
            connection.end();
            init();
        })
        /* // Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
  findAllEmployees() {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  } */

}
/*
function viewByDepartment() {
    inquirer
        .prompt({
            type: "list",
            message: "Which department would you like to view?",
            choices: ['Rocinante', 'Tycho Station', 'Martian Navy'],
            name: "department",
        })
        .then(function(response) {
            switch (response.department) {
                case 'Rocinante':
                    connection.query(`SELECT first_name, last_name FROM employees INNER JOIN role ON employees.role_id = role.id WHERE role.department_id = 1`, function(err, res) {
                        if (err) throw err;
                        console.log(`Employees on the Rocinate: \n`)
                        console.table(res);
                    })
                    break;
                case 'Tycho Station':
                    connection.query(`SELECT first_name, last_name FROM employees INNER JOIN role ON employees.role_id = role.id WHERE role.department_id = 2`, function(err, res) {
                        if (err) throw err;
                        console.log(`Employees on Tycho Station: \n`)
                        console.table(res);
                    })
                    break;
                case 'Martian Navy':
                    connection.query(`SELECT first_name, last_name FROM employees INNER JOIN role ON employees.role_id = role.id WHERE role.department_id = 3`, function(err, res) {
                        if (err) throw err;
                        console.log(`Employees in the Martian Navy: \n`)
                        console.table(res);
                    })
                    break;
            }
        })
} */

function viewDepartments() {
    connection.query("SELECT name FROM department", function(err, res) {
        if (err) throw err;
        console.log("Viewing All Departments:")
        console.table(res);
        console.log(`\n==================================\n`)
        connection.end();
        init();
    })
}

function viewRoles() {
    connection.query(`SELECT title, salary, department_id FROM role`, function(err, res) {
        if (err) throw err;
        console.log("Viewing All Employee Roles:")
        console.table(res);
        console.log(`\n==================================\n`)
        connection.end();
        init();
    })
}
//this def needs work
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
                        console.log(`Great! We've added ${response.firstName} ${response.lastName} to the database of employees!`)
                        viewAllEmployees();
                        console.log(`\n==================================\n`);
                        connection.end();
                        init();
                    })
            })
    })
}

function removeEmployee() {
    connection.query("SELECT first_name, last_name, e_id FROM employees", function(err, res) {
        if (err) throw err;
        //set up an array that we will add our responses to
        let emps = [];
        //for every response object we get back from the query...
        for (let i = 0; i < res.length; i++) {
            //create a new object whose name is the employee's full name and value is the employee's id
            let emp = {
                    name: res[i].first_name + " " + res[i].last_name,
                    value: {
                        id: res[i].e_id,
                        emp: res[i].first_name + " " + res[i].last_name
                    }
                }
                //push this new object into the 'emps' array
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
                connection.query(`DELETE FROM employees WHERE employees.e_id = ${response.employee.e_id}`, function(err2, res2) {
                    if (err2) throw err2;
                    console.log(`Success! We have removed ${response.employee.emp} from the database. \n Here's the updated table: `)
                    viewAllEmployees();
                    console.log(`\n==================================\n`);
                    connection.end();
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
                    console.log(`Heck yeah! We successfully added ${response.role} to the database! Here's your updated table. Here's proof: \n`)
                    viewRoles();
                    console.log(`\n==================================\n`);
                    connection.end();
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
                console.log(`Excelsior! We successfully added this department to the database! Here's proof: \n`);
                viewDepartments();
                console.log(`\n==================================\n`);
                connection.end();
                init();
            })
        })
}

function updateRole() {
    connection.query("SELECT employees.first_name, employees.last_name, employees.e_id, employees.role_id, role.r_id, role.title FROM employees INNER JOIN role ON employees.role_id = role.r_id", function(err, res) {
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
                console.log(response.role)
                connection.query(`
                            UPDATE employees SET ? WHERE ? `, [{
                        role_id: response.role
                    },
                    {
                        e_id: response.employee.id,
                    }
                ], function(err3, res3) {
                    if (err3) err3;
                    console.log(`Success!We 've updated the role for this employee.`)
                    viewAllEmployees();
                    console.log(`\n==================================\n`);
                    connection.end();
                    init();
                })
            })
    })
}

function exitProgram() {
    connection.end();
}