//require mysql as dependency for all this stuff to work
const mysql = require("mysql");
const inquirer = require('inquirer');
const conTable = require("console.table");
const { inherits } = require("util");

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
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager'],
            name: 'start'
        })
        .then(function(response) {
            switch (response.start) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View All Employees By Department':
                    viewByDepartment();
                    break;
                case 'View All Employees By Manager':
                    viewByManager();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Remove Employee':
                    removeEmployee();
                    break;
                case 'Update Employee Role':
                    updateRole();
                case 'Update Employee Manager':
                    updateManager();
                    break;
            }
        })
}

function viewAllEmployees() {
    connection.query(`SELECT * FROM employees`, function(err, res) {
        if (err) throw err
        console.table(res);
    })
}

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
                    connection.query(`SELECT * FROM role WHERE department_id = 1`, function(err, res) {
                        if (err) throw err;
                        console.log(res);
                        //let emps = [];
                        /*    connection.query(`SELECT * FROM employees WHERE role_id = ${res[i].id}`, function(err2, res2) {
                                //emps.concat(res2);
                                //console.log(res2);

                                console.log(`Employees in Rocinante Department: \n`);
                                console.table(emps)
                            })*/

                    })
                    break;
                case 'Tycho Station':
                    connection.query(`SELECT * FROM role WHERE department_id = 2`, function(err, res) {
                        if (err) throw err;
                        //let emps = [];
                        for (let i = 0; i < res.length; i++) {
                            connection.query(`SELECT * FROM employees WHERE role_id = ${res[i].id}`, function(err2, res2) {
                                console.table(res2);
                            })

                        }
                    })
                    break;
                case 'Martian Navy':
                    connection.query(`SELECT * FROM role WHERE department_id = 3`, function(err, res) {
                        if (err) throw err;
                        console.table(res);
                        let emps = [];
                        for (let i = 0; i < res.length; i++) {
                            connection.query(`SELECT * FROM employees WHERE role_id = ${res[i].id}`, function(err2, res2) {
                                emps.push(res2)
                            })
                        }
                        console.log(`Employees in ${res.name}: \n`);
                        console.table(emps)
                    })
                    break;

            }
        })
}

function viewByManager() {

}

function addEmployee() {
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
                choices: ['Captain', 'Engineer', 'Pilot', 'Mechanic'],
                name: "role"
            },
        ])
        .then(function(response) {
            let roleID;
            switch (response.role) {
                case 'Captain':
                    roleID = 1;
                    break;
                case 'Engineer':
                    roleID = 2;
                    break;
                case 'Pilot':
                    roleID = 3;
                    break;
                case 'Mechanic':
                    roleID = 4;
                    break;
            }
            connection.query(`INSERT INTO employees SET ?`, {
                first_name: response.firstName,
                last_name: response.lastName,
                role_id: roleID,
            })
        })
}

function removeEmployee() {
    viewAllEmployees();
    inquirer.prompt({
            type: 'input',
            message: 'Please select which employee you would like to move by entering the integer value of their unique id:',
            name: 'id'
        })
        .then(function(response) {
            connection.query(`DELETE FROM employees WHERE id = ${id}`, function(err2, res2) {
                if (err2) throw err2;
                console.log(`Success! We have removed the employee from the database. \n Here's the updated table: \n`)
                viewAllEmployees();

            })
        })
}

function updateRole() {

}

function updateManager() {

}