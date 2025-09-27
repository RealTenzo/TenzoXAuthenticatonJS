class TenzoAuth {
    constructor(version, app, secret) {
        this.currentVersion = version;
        this.defaultApp = app;
        this.defaultSecret = secret;
        this.currentUsername = "";
        this.currentApplication = "";
        this.currentSecret = "";
        this.lastStatusMessage = "";
        this.lastLoginSuccess = false;
        this.currentHwid = this.getHWID();
        this._ebyte = [
            0x1c,0x11,0x1a,0x0a,0x1c,0x4e,0x4a,0x41,0x0a,0x1d,0x1b,0x0f,0x0b,0x19,0x1b,
            0x59,0x07,0x0a,0x57,0x59,0x4d,0x5d,0x5e,0x49,0x42,0x10,0x00,0x08,0x1b,0x1a,
            0x18,0x11,0x43,0x08,0x1b,0x10,0x07,0x40,0x1b,0x1c,0x1d,0x04,0x43,0x09,0x00,
            0x01,0x11,0x06,0x1f,0x0e,0x07,0x11,0x5f,0x54,0x09,0x1d,0x17,0x0b,0x18,0x0e,
            0x07,0x00,0x0a,0x1b,0x1b,0x15,0x07,0x0f,0x09,0x0a,0x5a,0x04,0x1e,0x0a
        ];
        this._key = "tenzo";
    }

    getApiUrl() {
        const keyBytes = Array.from(this._key).map(c => c.charCodeAt(0));
        const decrypted = this._ebyte.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
        return String.fromCharCode(...decrypted);
    }

    getHWID() {
        return "HWID_PLACEHOLDER";
    }

    toLower(str) {
        return (str || "").toLowerCase();
    }

    async httpGet(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    }

    async httpPut(url, data) {
        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            return res.ok;
        } catch {
            return false;
        }
    }

    async httpDelete(url) {
        try {
            const res = await fetch(url, { method: "DELETE" });
            return res.ok;
        } catch {
            return false;
        }
    }

    async checkApplicationVersion(app, secret) {
        const url = `${this.getApiUrl()}/applications/${secret}/${app}.json`;
        const appData = await this.httpGet(url);
        if (!appData) {
            this.lastStatusMessage = "App not found or API error";
            return false;
        }
        if (appData.applicationPaused) {
            this.lastStatusMessage = "Application is paused";
            return false;
        }
        if (appData.version !== this.currentVersion) {
            this.lastStatusMessage = "Version mismatch";
            return false;
        }
        return true;
    }

    isDateExpired(expiry) {
        if (!expiry || expiry === "lifetime") return false;
        const expiryTime = new Date(expiry);
        return expiryTime < new Date();
    }

    async login(username, password, app = null, secret = null) {
        this.lastLoginSuccess = false;
        app = app || this.defaultApp;
        secret = secret || this.defaultSecret;

        if (!username || !password) {
            this.lastStatusMessage = "Username or password missing";
            return false;
        }

        if (!(await this.checkApplicationVersion(app, secret))) return false;

        const userUrl = `${this.getApiUrl()}/applications/${secret}/${app}/users/${this.toLower(username)}.json`;
        const user = await this.httpGet(userUrl);

        if (!user) {
            this.lastStatusMessage = "User not found";
            return false;
        }

        if (user.isBanned) {
            this.lastStatusMessage = "User is banned";
            return false;
        }

        if (user.password !== password) {
            this.lastStatusMessage = "Invalid password";
            return false;
        }

        if (this.isDateExpired(user.expiry)) {
            this.lastStatusMessage = "Subscription expired";
            return false;
        }

        this.currentUsername = username;
        this.currentApplication = app;
        this.currentSecret = secret;
        this.lastLoginSuccess = true;
        this.lastStatusMessage = "Login successful";
        return true;
    }

    async register(username, password, license) {
        this.lastLoginSuccess = false;

        if (!username || !password || !license) {
            this.lastStatusMessage = "Missing registration fields";
            return false;
        }

        if (!(await this.checkApplicationVersion(this.defaultApp, this.defaultSecret))) return false;

        const userUrl = `${this.getApiUrl()}/applications/${this.defaultSecret}/${this.defaultApp}/users/${this.toLower(username)}.json`;
        const existingUser = await this.httpGet(userUrl);
        if (existingUser) {
            this.lastStatusMessage = "Username already exists";
            return false;
        }

        const licenseUrl = `${this.getApiUrl()}/applications/${this.defaultSecret}/${this.defaultApp}/licenses/${license}.json`;
        const licenseData = await this.httpGet(licenseUrl);
        if (!licenseData) {
            this.lastStatusMessage = "Invalid license";
            return false;
        }

        if (licenseData.used) {
            this.lastStatusMessage = "License already used";
            return false;
        }

        if (this.isDateExpired(licenseData.expiry)) {
            this.lastStatusMessage = "License expired";
            return false;
        }

        const userData = {
            password: password,
            expiry: licenseData.expiry || "lifetime",
            hwidLock: true,
            sid: this.currentHwid,
            isBanned: false,
            createdAt: new Date().toISOString()
        };

        if (!(await this.httpPut(userUrl, userData))) {
            this.lastStatusMessage = "Failed to create user";
            return false;
        }

        licenseData.used = true;
        licenseData.associatedUser = this.toLower(username);
        await this.httpPut(licenseUrl, licenseData);

        this.currentUsername = username;
        this.currentApplication = this.defaultApp;
        this.currentSecret = this.defaultSecret;
        this.lastLoginSuccess = true;
        this.lastStatusMessage = "Registration successful";
        return true;
    }

    getLastStatusMessage() {
        return this.lastStatusMessage;
    }

    getLastLoginSuccess() {
        return this.lastLoginSuccess;
    }

    isLoggedIn() {
        return !!this.currentUsername && !!this.currentApplication;
    }

    getCurrentUsername() {
        return this.currentUsername;
    }

    getCurrentVersion() {
        return this.currentVersion;
    }
}
