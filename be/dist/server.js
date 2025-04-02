"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const scoreRoutes_1 = __importDefault(require("./routes/scoreRoutes"));
// Import the models to ensure associations are set up
require("./models");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const corsOptions = {
    origin: true,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api/scores", scoreRoutes_1.default);
(0, database_1.connectDB)();
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
