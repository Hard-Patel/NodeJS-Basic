const bcrypt = require('bcrypt');

async function run(){
    const salt = await bcrypt.genSalt(10);
    const hasPwd = await bcrypt.hash('123456', salt);
    console.log('hasPwd: ', hasPwd);
}

run();