const path = require('path');

const mockPrescriptionFilePath = '/prescriptions/pr_mock.json';

describe('app', () => {
    let chokidar;
    let queueWriter;
    let httpServer;
    let fs;

    let initSpy;

    beforeEach(() => {
        jest.resetModules();
        queueWriter = require('./queue-writer');
        chokidar = require('chokidar');
        httpServer = require('./http-server');
        fs = require('fs');
        jest.spyOn(httpServer, 'startHttpServer').mockImplementation();
        initSpy = jest.spyOn(queueWriter, 'init').mockReturnValue(Promise.resolve());
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should init the queueWriter', () => {
        jest.spyOn(chokidar, 'watch').mockReturnValue({on: jest.fn()});
        require('./app');
        expect(initSpy).toHaveBeenCalled();
    });

    describe('When init completed', () => {
        function fakeAddFilesToFolder(amount) {
            jest.spyOn(chokidar, 'watch').mockReturnValue({
                on: jest.fn().mockImplementation((method, callback) => {
                    for (let i = 0; i < amount; i++) {
                        callback(mockPrescriptionFilePath);
                    }
                })
            });
        }

        it('should listen to the add event on the prescriptions directory, including initial files', async () => {
            const watcher = {on: jest.fn()};
            const spy = jest.spyOn(chokidar, 'watch').mockReturnValue(watcher);

            require('./app');

            await Promise.resolve();
            expect(spy).toHaveBeenCalledWith(path.join(__dirname, '../../prescriptions'), {ignoreInitial: false});
            expect(watcher.on).toHaveBeenCalledWith('add', expect.any(Function));
        });

        it('should add paths to the queueWriter when chokidar emits an add event', async () => {
            fakeAddFilesToFolder(1);
            jest.spyOn(queueWriter, 'addFileToQueue');

            require('./app');
            await Promise.resolve();

            expect(queueWriter.addFileToQueue).toHaveBeenCalledWith(mockPrescriptionFilePath);
        });

        it('should start the http server with a callback with which it can collect data', async () => {
            fakeAddFilesToFolder(20);
            jest.spyOn(fs, 'readdirSync').mockReturnValue({length: 4});

            jest.spyOn(httpServer, 'startHttpServer').mockImplementation((collectDataToSendCb) => {
                const result = collectDataToSendCb();
                expect(result).toEqual({
                    amountOfFilesInFolder: 4,
                    amountOfFilesAddedToFolder: 20,
                    amountOfFilesProcessed: 16
                });
            });

            require('./app');
            await Promise.resolve();

            expect(fs.readdirSync).toHaveBeenCalledWith(path.join(__dirname, '../../prescriptions'));
        });
    });
});
