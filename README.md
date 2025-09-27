# TenzoXAuthenticationJS

A JavaScript library for handling user authentication and licensing.

## Key Features & Benefits

*   **Easy-to-use Authentication:** Streamlines the login and registration process for web applications.
*   **License Verification:** Integrates license verification to ensure authorized usage.
*   **HWID Tracking:** Identifies users based on their hardware ID for security purposes.
*   **Status Messages:** Provides clear status messages regarding authentication and licensing.

## Prerequisites & Dependencies

*   **JavaScript Enabled Browser:** Required for running the example HTML.

## Installation & Setup Instructions

1.  **Download the `tenzoauth.js` file** from the repository.
2.  **Include the `tenzoauth.js` file** in your HTML file using the `<script>` tag:

    ```html
    <script src="tenzoauth.js"></script>
    ```

3.  **Create a new `TenzoAuth` object** by passing in the version, app name, and secret to the constructor:

    ```javascript
    const auth = new TenzoAuth("1.0", "YourAppName", "YourSecretKey");
    ```

## Usage Examples & API Documentation

### Login

```javascript
const auth = new TenzoAuth("1.0", "YourAppName", "YourSecretKey");

async function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      
        const loginResult = await validateCredentials(username, password);

        if(loginResult.success){
            auth.currentUsername = username;
            auth.lastLoginSuccess = true;
            auth.lastStatusMessage = "Login Successful";
            console.log(auth.lastStatusMessage);
        } else {
            auth.lastLoginSuccess = false;
            auth.lastStatusMessage = loginResult.message; // or "Invalid credentials"
            console.error(auth.lastStatusMessage);
        }


    } catch (error) {
        auth.lastLoginSuccess = false;
        auth.lastStatusMessage = "Login failed: " + error;
        console.error(auth.lastStatusMessage);
    }
}
```


#### `TenzoAuth(version, app, secret)`

*   **version:** (String) - The version of your application.
*   **app:** (String) - The name of your application.
*   **secret:** (String) -  A secret key used for authentication (use with caution; do not expose client-side if possible).

#### Properties

*   `currentVersion` (String) - The version provided in the constructor.
*   `defaultApp` (String) - The application name provided in the constructor.
*   `defaultSecret` (String) - The secret key provided in the constructor.
*   `currentUsername` (String) - The current username.
*   `currentApplication` (String) - The current application name.
*   `currentSecret` (String) - The current secret key.
*   `lastStatusMessage` (String) - The last status message from the authentication process.
*   `lastLoginSuccess` (Boolean) - A boolean indicating if the last login was successful.
*   `currentHwid` (String) - The hardware ID of the current machine.


## Configuration Options

*   **Version:** Update the `version` parameter when you release a new version of your application.
*   **App Name:**  Set the `app` parameter to the name of your application.
*   **Secret Key:** Configure the `secret` parameter with a secure secret key. Ensure proper handling and storage of this key.  Avoid exposing secrets client-side whenever possible.

## Contributing Guidelines

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear commit messages.
4.  Submit a pull request.

## TenzoXAuthenticationJS License (Usage Only)

Copyright (c) 2025 Tenzo

Permission is granted to use this software for personal or commercial purposes, 
provided that it is used as-is and only for the intended functionality.

Restrictions:
1. You **may not** modify, reverse engineer, decompile, or redistribute the source code.
2. You **may not** use this software for illegal, unethical, or unauthorized purposes.
3. Any use beyond personal or authorized commercial usage requires explicit permission from the author.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHOR BE LIABLE 
FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, 
OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
OR OTHER DEALINGS IN THE SOFTWARE.

## Acknowledgments

Database Provider : Firebase!
Dev </> : Tenzo
