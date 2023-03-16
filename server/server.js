"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const user_1 = require("./routes/user");
// Usage of .env file in the root dir
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.APP_PORT || 5000;
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
// To get full req.body in JSON format
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Apply routes
app.use('/', user_1.user);
app.use(errorHandler_1.default);
app.listen(PORT, () => {
    console.log('Listening to', PORT);
});
