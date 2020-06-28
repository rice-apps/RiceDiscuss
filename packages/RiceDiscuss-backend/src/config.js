import "dotenv/config";
import sanitizeHtml from "sanitize-html";

const CLIENT_TOKEN_SECRET = process.env.CLIENT_TOKEN_SECRET;
const TOKEN_EXPIRE_TIME = parseInt(process.env.TOKEN_EXPIRE_TIME);
const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;
const SERVICE_URL = process.env.SERVICE_URL;
const DEV_PORT = parseInt(process.env.DEV_PORT);
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(",");
const CAS_VALIDATE_URL = process.env.CAS_VALIDATE_URL;
const COLLEGES = process.env.COLLEGES.split(";");
const MAJORS = process.env.MAJORS.split(";");
const MINORS = process.env.MINORS.split(";");

const DATALOADER_OPTIONS = {
    cacheExpiration: 3000,
    removeProjection: true,
    debug: false,
};

const DATALOADER_RESOLVERS = [
    "findById",
    "findOne",
    "count",
    "pagination",
    "createOne",
    "updateById",
    "updateOne",
    "removeById",
    "removeOne",
];

const CHECK_HTML_CONFIG = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
        a: ["href"],
        img: ["src"],
    },
};

export {
    CLIENT_TOKEN_SECRET,
    TOKEN_EXPIRE_TIME,
    MONGODB_CONNECTION_URL,
    SERVICE_URL,
    DEV_PORT,
    ALLOWED_ORIGINS,
    CAS_VALIDATE_URL,
    COLLEGES,
    MAJORS,
    MINORS,
    DATALOADER_OPTIONS,
    DATALOADER_RESOLVERS,
    CHECK_HTML_CONFIG,
};
