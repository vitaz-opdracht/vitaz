describe('http-server', () => {
    let http;

    const mockServer = {listen: jest.fn()};
    const mockReq = jest.fn();
    const mockRes = {setHeader: jest.fn(), writeHead: jest.fn(), end: jest.fn()};
    const mockCollectDataToSend = jest.fn().mockReturnValue({data: 'dataToSend'});

    beforeEach(() => {
        jest.resetModules();
        http = require('http');
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('when startHttpServer is called', () => {
        beforeEach(() => {
            jest.spyOn(http, 'createServer').mockImplementation((requestListener) => {
                requestListener(mockReq, mockRes)
                return mockServer;
            });

            require('./http-server').startHttpServer(mockCollectDataToSend);
        });

        it('should allow all CORS', () => {
            expect(mockRes.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
            expect(mockRes.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            expect(mockRes.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Content-Type');
        });

        it('should invoke the callback and return the results', () => {
            expect(mockCollectDataToSend).toHaveBeenCalled();
            expect(mockRes.writeHead).toHaveBeenCalledWith(200, {'Content-Type': 'text/plain'});
            expect(mockRes.end).toHaveBeenCalledWith(JSON.stringify({data: 'dataToSend'}));
        });

        it('should create a new HTTP server on port 8080', () => {
            expect(mockServer.listen).toHaveBeenCalledWith(8080);
        });
    });
});
