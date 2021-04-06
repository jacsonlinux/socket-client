const fs = require('fs');

const dir = 'C:\\socket-client';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    console.log('Create directory!');
}

fs.copyFile('./package.json', `${dir}/package.json`, (err) => {
    if (err) throw err;
    console.log('package.json successfully copied');
});

fs.copyFile('./service.js', `${dir}/service.js`, (err) => {
    if (err) throw err;
    console.log('service.js successfully copied');
});

fs.copyFile('./app.js', `${dir}/app.js`, (err) => {
    if (err) throw err;
    console.log('app.js successfully copied');
});