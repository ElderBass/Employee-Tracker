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

Using these prompts, the manager can view all employees at the company, view all the different roles employees can have, view all the departments, add and remove employees, add roles, add departments, and update an employee's role. 

The manager can perform all of these actions seemlessly using inquirer prompts. As soon as one action is performed successfully, the manager will be returned to the 'main menu' of prompts, where they can continue performing actions as much as they want.

To exit the application, one simply must choose 'Exit' from the main menu. 


    
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


    

    
