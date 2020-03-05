const fs = require("fs");
const inquirer = require('inquirer');
const manager = require('./manager');
const engineer = require('./engineer');
const intern = require('./intern');

let company = [];

function addEmployee() {
    inquirer.prompt(
        [{
            type: 'list',
            name: 'addEmployee',
            message: 'Would you like to add an employee?',
            choices: ['Yes', 
                      'No'
                     ]
        },
        ]).then(answers => {
            if (answers.addEmployee === 'Yes') {
                newEmployee();
            }
            else {
                makePage(company);
            }
        }
    );
}

function newEmployee() {
    inquirer.prompt(
        [{
            name: 'employeeName',
            message: 'What is the employee\'s name?',
        },
        {
            name: 'employeeId',
            message: 'What is the employee\'s id?',
        },
        {
            name: 'employeeEmail',
            message: 'What is your employee\'s email address?',
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: 'What is the employee\'s role?',
            choices: ['Manager', 
                      'Engineer',
                      'Intern'
                     ]
        },
        ]).then(answers => {
            let name = answers.employeeName;
            let id = answers.employeeId;
            let email = answers.employeeEmail;

            if (answers.employeeRole === 'Manager') {
                inquirer.prompt(
                    [{
                        name: 'officeNumber',
                        message: 'What is the manager\'s office number?'
                    }
                    ]).then(answers => {
                        const newManager = new manager(name, id, email, answers.officeNumber)
                        company.push(newManager);
                        addEmployee();
                    });
            }
            else if (answers.employeeRole === 'Engineer') {
                inquirer.prompt(
                    [{
                        name: 'github',
                        message: 'What is the engineer\'s GitHub link?'
                    }
                    ]).then(answers => {
                        const newEngineer = new engineer(name, id, email, answers.github)
                        company.push(newEngineer);
                        addEmployee();
                    });
            }
            else if (answers.employeeRole === 'Intern') {
                inquirer.prompt(
                    [{
                        name: 'schoolName',
                        message: 'What is the intern\'s school?'
                    }
                    ]).then(answers => {
                        const newIntern = new intern(name, id, email, answers.schoolName)
                        company.push(newIntern);
                        addEmployee();
                    });
            }
        }
    );
}

function makePage(company) {
    let manager = [];
    let engineers = [];
    let interns = [];

    for (i = 0; i < company.length; i++) {
        if (company[i].getRole() === 'Manager') {
            manager.push(
                    company[i].name,
                    company[i].id,
                    company[i].email,
                    company[i].officeNumber
                )
        }
        else if (company[i].getRole() === 'Engineer') {
            engineers.push([
                company[i].name,
                company[i].id,
                company[i].email,
                company[i].github
            ])
        }
        else if (company[i].getRole() === 'Intern') {
            interns.push([
                company[i].name,
                company[i].id,
                company[i].email,
                company[i].school
            ])
        }
    }

    fs.writeFileSync('./output/team.html',
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
      <link rel="stylesheet" href="style.css">
      <title>Team Profile</title>
    </head>
    <body style="background-color: white">
      <h1 style="background-color: red">
          My Team
      </h1>
      <div class="wrapper" style="max-width: 960px; margin: 50px auto">
      `
    );

    fs.appendFileSync('./output/team.html',
        '<div class="col-4" id="manager"> <div class="card"> <div class="card-header"> <h2><strong>'
            + manager[0] + '</h2></strong>' + '<h2><strong>' +
            'Manager' + '</strong></h2></div>' +
            '<div class="card-body"><div class="row info-field">' + 
            "ID: " + manager[1] + '</div>' +
            '<div class="row info-field">' + "Email " + manager[2] + '</div>' +
            ' <div class="row info-field">' + "Office Number: " + manager[3] + ' </div>' +
        '</div></div></div>'
    );

    for (i = 0; i < engineers.length; i++) {
        fs.appendFileSync('./output/team.html',
            '<div class="col-4" id="engineer"> <div class="card">' +
                '<div class="card-header"> <h2><strong>' + 
                 engineers[i][0] + '</h2></strong>' + '<h2><strong>' +
                'Engineer #' + (i + 1) + '</h2></strong></div>' +
                '<div class="card-body"><div class="row info-field">'+ "ID: " + engineers[i][1] + '</div>' +
                '<div class="row info-field">' + "Email " + engineers[i][2] + '</div>' +
                '<div class="row info-field">' + "GitHub: " + engineers[i][3] + ' </div>' +
            '</div></div></div>'
        );
    }

    for (i = 0; i < interns.length; i++) {
        fs.appendFileSync('./output/team.html',
                '<div class="col-4" id="intern"> <div class="card">' +
                '<div class="card-header"> <h2><strong>'  + interns[i][0] + '</h2></strong>' + 
                '<h2><strong>' + 'Intern #' + (i + 1) + 
                '</h2></strong></div>' +
                '<div class="card-body"><div class="row info-field">' + "ID: " + interns[i][1] + ' </div>' +
                '<div class="row info-field">' + "Email " + interns[i][2] + ' </div>' +
                '<div class="row info-field">' + "School: " + interns[i][3] + ' </div>' +
                '</div></div></div>' +
            '</body>'
        );
    }
}

exports.addEmployee = addEmployee();
