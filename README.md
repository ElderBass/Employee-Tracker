# Employee Tracker 
An application for viewing and managing employees in a database, created by Seth Zygarlicke.

### Links:

GitHub Repository: https://github.com/ElderBass/Employee-Tracker.git
    


    
## Table of Contents

* [Description](#description)


* [Installation](#installation)

    
* [Usage](#usage)

    
* [Contributing](#contributing)

    
* [Tests](#tests)

    
* [Questions](#questions)




    
## Description

Employee Tracker is a node.js application that allows a manager to access a database of all the employees within a company. When the application is run, the user is prompted with a list of options for viewing and updating the employees. 

Using these prompts, the manager can do the following tasks:

* View All Employees in the database
* View All Departments
* View All Employee Roles
* View Employees by Department (including the total budget for that department)
* Add/Remove Employees
* Add/Remove Employee Roles
* Update an Employee's Role
* Add/Remove Departments

The manager can perform all of these actions seemlessly using inquirer prompts. As soon as one action is performed successfully, the manager will be returned to the 'main menu' of prompts, where they can continue performing actions as much as they want.

To exit the application, one simply must choose 'Exit' from the main menu. 

### Disclaimers and Future Directions
-----------------------------

I did not have enough time to clean up the code in this repository, thus many of the functions are inefficient, however they all should work perfectly. 

The way I set up this application was for a fictional universe of characters, thus the 'manager' functionality is limited and not what the assignment had intended. In the future, I believe I could find a way to 'Update Employee Managers' and 'View Employees by Manager'. 


    
## Installation

    
This application relies on two main dependencies: mysql and inquirer. To install these packages on your machine, run the following commands:

```
npm i mysql  | npm i inquirer
```

In order to run this application, right click on the 'empTrackerDB.js' file and select 'Open in Integrated Terminal'. In the new terminal that pops up on your window, type the following command:

```
node empTrackerDB.js
```

You will then be taken to main menu of the Employee Tracker app. 
    
    
## Technologies

This is a node application using javascript/JSON for backend functionality. The database was built and stored using MySQL Workbench, and the application itself uses the 'mysql' npm package to connect the javascript with the SQL database. 

The prompts for navigating and utilizing the application were set up with the 'inquirer' npm package. 

All the code for this application was compiled using VS Code. 


    
## Contributing

    
If you wish to contribute to the repository, fork it to your machine from GItHub and do with it what you will. 

    
    
## Questions

    
See more projects by this Seth on GitHub:  https://github.com/ElderBass

   
For any questions, please email Seth at:

    zygster11@gmail.com


    

    
