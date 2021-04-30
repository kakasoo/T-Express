class Application {
    constructor() {
        this.settings = {};
        this.defaultConfiguration();
    }

    defaultConfiguration() {
        const env = process.env.NODE_ENV || "development";
    }

    set(setting, value) {
        if (arguments.length === 1) {
            return this.settings[setting];
        }

        this.settings[setting] = value;
        return this;
    }
}

export default Application;
