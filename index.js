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

//Function that allows the user to add a Department
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

//Function that allows the user to add a role
function addRole() {
    connection.query("SELECT * FROM department", function(err, res){
        if (err) throw (err);
        let data = [];
        for(var i = 0; i < res.length; i++){
            data.push(res[i].department_name);
        }
        inquirer.prompt([
            {
                type: "list",
                name: "department",
                message: "Which department is getting the new role?",
                choices: data
            },
            {
                type: "input",
                name: "role",
                message: "What is the new role you would like to add?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is this role's salary?"
            }
        ]).then(function(response){
            connection.query("SELECT * FROM department where department_name=?", [response.department], function(err, res){
                let id = res[0].department_id;
                connection.query("INSERT INTO roles SET ?",
                {
                    title: response.role,
                    salary: response.salary,
                    department_id: id
                },
                function(err, res){
                    if (err) throw (err);
                    console.log("Role Added!");
                    employeeTracker();
                });
            });
        });
    });
};

//Function that allows the user to add an employee
function addEmployee() {
    connection.query("SELECT * FROM roles", function(err, res){
        if (err) throw (err);
        let data = [];
        for (var i = 0; i < res.length; i++){
            data.push(res[i].title);
        };
        let dataTwo = ["none"];
        connection.query("SELECT * FROM employee", function(err, res){
            if (err) throw (err);
            for (var j = 0; j < res.length; j++){
                dataTwo.push(res[j].first_name);
            };
            inquirer.prompt([
            {
                type: "input",
                name: "first",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's job title?",
                choices: data
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the Employee's Manager?",
                choices: dataTwo
            }
        ]).then(function(response){
            let mgr = null;
            if (response.manager != "none"){
                connection.query("SELECT * FROM employee WHERE first_name=?", [response.manager], function(err, res){
                    if (err) throw (err);
                    mgr = res[0].employee_id;
                });
            };
            connection.query("SELECT * FROM roles WHERE title=?", [response.role], function(err, res){
                if (err) throw (err);
                let id = res[0].role_id;
                connection.query("INSERT INTO employee SET ?",
                {
                    first_name: response.first,
                    last_name: response.last,
                    role_id: id,
                    manager_id: mgr
                },
                function(err, res){
                    if (err) throw (err);
                    console.log("Employee Added!");
                    employeeTracker();
                });
            });
        });
    });
    });
};