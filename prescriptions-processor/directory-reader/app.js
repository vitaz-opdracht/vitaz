const path = require("path");
const {watch} = require('chokidar');
const queueWriter = require('./queue-writer');
const fs = require('fs');
const {startHttpServer} = require('./http-server');

const prescriptionsPath = path.join(__dirname, '../../prescriptions');

let amountOfFilesAddedToFolder = 0;

function watchDirectory() {
    watch(prescriptionsPath, {ignoreInitial: false})
        .on('add', (path) => {
            amountOfFilesAddedToFolder += 1;
            queueWriter.addFileToQueue(path);
        });
}

queueWriter.init().then(() => {
    watchDirectory();
    startHttpServer(() => {
        const amountOfFilesInFolder = fs.readdirSync(prescriptionsPath).length;
        const amountOfFilesProcessed = amountOfFilesAddedToFolder - amountOfFilesInFolder;
        return {
            amountOfFilesAddedToFolder,
            amountOfFilesInFolder,
            amountOfFilesProcessed
        };
    });
});
