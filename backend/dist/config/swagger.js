"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Circle Threads Clone API',
            version: '1.0.0',
            description: 'API Dokumentasi untuk Aplikasi Clone Threads (Circle API)',
            contact: {
                name: 'Developer Fia Fiastara',
            },
        },
        servers: [
            {
                url: 'http://localhost:7001',
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/routes/*.js'], // Scan routes untuk dokumentasi swagger
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
