//Set dependencies and connect to mysql
const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "CoolP001Par7y!",
    database: "employees_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Sarvay's Employee Tracker");
    employeeTracker();
  });

function employeeTracker() {
    inquirer.prompt({
        type: "list",
        name: "initial",
        message: "What would you like to do?",
        choices: [
            "Add Department",
            "Add Role",
            "Add Employee",
            "View Departments",
            "View Roles",
            "View Employees",
            "Update Employee Role",
            "Nothing"
        ]
    }).then(function(response){
        switch(response.initial) {
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Employees":
                viewEmployees();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "Nothing":
                connection.end();
                break;
        };
    });
};

//Add function that allows the user to add a Department
function addDepartment(){
    inquirer.prompt({
        type: "input",
        name: "department",
        message: "What is the name of the new department you would like to add?"
    }).then(function(response){
        console.log("Adding Department...\n");
        connection.query(
            "INSERT INTO department SET ?",
            {
                department_name: response.department
            },
            function(err, res) {
                if (err) throw (err);
                console.log("Department updated");
                //viewDepartments();
                employeeTracker();
            }
        );
    });
};