class AppConfig {
    config() {
        var cfg = {
            aws: {
                AWS_ACCESS_KEY_ID: "AKIAIA3Q6URKXBKEZZRQ",
                AWS_SECRET_ACCESS_KEY: "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"
            },
            smtp: {
                user: "AKIAIKQO2IFSFG34BPYA",
                password: "AkzjrKw4LuIApq3AgJnmaWfkEq68UUVeIU5vqP9L2O4c"
            },
            port: 3002,
            //staticPath: path.resolve(__dirname, "../dist/client"),
            ipaddr: "localhost",
            appUrl: "localhost:3002",
            appUIUrl: "https://bestdeveloper.ro",
            tokenPassword: "AkzjrKkw4Lu87^%7(&6_IApq3AgJnmaWfkEq98!eIU5vqP9L2O4c",
            mongodb: {
                url: "mongodb://127.0.0.1/onlinecoding",
                user: "",
                password: ""
            }
        }
        return cfg;
    }
}

module.exports = new AppConfig().config();


