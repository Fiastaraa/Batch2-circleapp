"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./middleware/auth");
const AuthController_1 = require("./controllers/AuthController");
const upload_1 = require("./middleware/upload");
console.log('--- DIAGNOSTIC IMPORT VALUES ---');
console.log('authenticateToken:', typeof auth_1.authenticateToken, auth_1.authenticateToken ? 'DEFINED' : 'UNDEFINED');
console.log('authController:', typeof AuthController_1.authController, AuthController_1.authController ? 'DEFINED' : 'UNDEFINED');
console.log('upload:', typeof upload_1.upload, upload_1.upload ? 'DEFINED' : 'UNDEFINED');
if (upload_1.upload) {
    console.log('upload.single:', typeof upload_1.upload.single, upload_1.upload.single ? 'DEFINED' : 'UNDEFINED');
}
console.log('--------------------------------');
