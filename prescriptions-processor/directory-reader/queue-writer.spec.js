const mockPrescriptionPath = '/path/to/prescription';

async function skipMs(delay) {
    await new Promise(jest.requireActual('timers').setImmediate);
    jest.advanceTimersByTime(delay);
}

describe('queue-writer', () => {
    let fs;
    let amqp;
    let queueWriter;

    beforeEach(() => {
        jest.resetModules();
        jest.useFakeTimers();
        fs = require('fs');
        amqp = require('amqplib');
        queueWriter = require('./queue-writer');
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('when init is called', () => {
        describe('given rabbitmq is available', () => {
            it('should connection immediately', () => {
                const connectSpy = jest.spyOn(amqp, 'connect');
                connectSpy.mockResolvedValue({createConfirmChannel: jest.fn().mockResolvedValue(null)});

                queueWriter.init();

                expect(connectSpy).toHaveBeenCalledTimes(1);
            });

            it('should not try to connect multiple times', async () => {
                const connectSpy = jest.spyOn(amqp, 'connect');
                connectSpy.mockResolvedValue({createConfirmChannel: jest.fn().mockResolvedValue(null)});

                queueWriter.init();

                await skipMs(2000);

                expect(connectSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('given rabbitmq is unavailable', () => {
            it('should keep reconnecting every second until it becomes available', async () => {
                const connectSpy = jest.spyOn(amqp, 'connect');
                connectSpy.mockRejectedValue(new Error());

                queueWriter.init();

                expect(connectSpy).toHaveBeenCalledTimes(1);
                await skipMs(1000);
                expect(connectSpy).toHaveBeenCalledTimes(2);
                await skipMs(1000);
                expect(connectSpy).toHaveBeenCalledTimes(3);

                connectSpy.mockResolvedValue({createConfirmChannel: jest.fn().mockResolvedValue(null)});

                await skipMs(1000);
                expect(connectSpy).toHaveBeenCalledTimes(4);

                await skipMs(1000);
                expect(connectSpy).toHaveBeenCalledTimes(4);
            });
        });

        describe('when connected to rabbitmq', () => {
            const mockChannel = {
                publish: jest.fn().mockImplementation((...[, , , , callback]) => callback())
            };

            const mockConnection = {
                createConfirmChannel: jest.fn().mockResolvedValue(mockChannel),
                close: jest.fn()
            };

            beforeEach(() => {
                jest.spyOn(amqp, 'connect').mockResolvedValue(mockConnection);
            });

            it('should close the connection when the application exits', async () => {
                jest.spyOn(process, 'exit').mockImplementation(() => {
                });
                jest.spyOn(process, 'on').mockImplementation(async (_, listener) => await listener());

                queueWriter.init();

                await skipMs(1);

                expect(mockConnection.close).toHaveBeenCalled();
            });

            describe('when addFileToQueue has been called with a path', () => {
                beforeEach(async () => {
                    jest.spyOn(fs, 'readFileSync').mockImplementation((path) => `${path}-content`);
                    jest.spyOn(fs, 'rmSync').mockImplementation(() => {
                    });

                    queueWriter.addFileToQueue(mockPrescriptionPath);
                    queueWriter.init();

                    await skipMs(10000);
                });

                it("should send the added path's content to the prescriptions_exchange with a routing key of 'raw'", () => {
                    expect(mockChannel.publish).toHaveBeenCalledWith(
                        'prescriptions_exchange',
                        'raw',
                        Buffer.from(`${mockPrescriptionPath}-content`),
                        {persistent: true},
                        expect.any(Function)
                    );
                });

                describe('given the file was successfully sent to the exchange', () => {
                    it('should remove the file from the directory', () => {
                        expect(fs.rmSync).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
