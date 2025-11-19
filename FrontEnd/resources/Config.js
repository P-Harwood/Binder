const Config = (request) => {
    if (request === 'url') {
        return 'http://192.168.1.120:5000';
    }

    return null;
};

export default Config;
