module.exports = {
    name: "Centery Dashbard",
    port: 8888,
    debug: true,
    requestTimeout: -1,
    autoload: [
        "/controllers",
        "/entities",
        "/start"
    ],
    assetPath: "/assets",
    encryption: {
        'key': "d6F3Efeq",
        'cipher': "aes-256-ctr"
    }
};
