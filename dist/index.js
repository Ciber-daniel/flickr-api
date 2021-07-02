"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const console_1 = require("console");
const xml2js = __importStar(require("xml2js"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.config({ path: path_1.resolve(__dirname, "../.env") });
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
// define a route handler for the default home page
app.post("/api/search/flicker", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validate if the token is in the header
    if (!req.headers.authorization) {
        return res.status(401).send("Forbidden");
    }
    const data = req.body;
    const token = process.env.TOKEN || "MVJDQJQqjAzoA3R0idrcfqf4tK1ZCyGr";
    const flickrApi = process.env.FLICKR_API ||
        "https://www.flickr.com/services/feeds/photos_public.gne";
    const apiKey = process.env.API_KEY || "dcc71b7ab14be2a0b8ea5945188b8eda";
    const headerToken = req.headers.authorization.replace("Bearer ", "");
    // validate if header token is valid
    if (headerToken !== token) {
        return res.status(401).send("Forbidden");
    }
    // validate if have body and tag
    if (!data || !data.tag) {
        console_1.log("bad request");
        return res.status(404).send("Bad request");
    }
    try {
        const url = flickrApi + `?tags=${data.tag}`;
        const response = yield axios_1.default.get(url, {
            headers: {
                api_key: apiKey,
            },
        });
        // parse the xml string to an object and return array entry
        xml2js.parseString(response.data, (err, result) => {
            const resu = result.feed.entry;
            if (err) {
                console_1.log("error", err);
            }
            return res.send(JSON.stringify(resu));
        });
    }
    catch (error) {
        return res.end({ error });
    }
}));
// start the Express server
app.listen(process.env.PORT || 8080, () => {
    console_1.log(`server started at http://localhost:${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map