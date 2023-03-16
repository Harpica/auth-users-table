"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.deleteUsers = exports.updateUsersStatus = exports.createUser = exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../bd/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const runtime_1 = require("@prisma/client/runtime");
const BadRequestError_1 = __importDefault(require("../utils/errors/BadRequestError"));
const DocumentNotFoundError_1 = __importDefault(require("../utils/errors/DocumentNotFoundError"));
const UnautorizedError_1 = __importDefault(require("../utils/errors/UnautorizedError"));
const ForbiddenError_1 = __importDefault(require("../utils/errors/ForbiddenError"));
const getUsers = (_req, res, next) => {
    prisma_1.default.user
        .findMany()
        .then((users) => res.send({ users }))
        .catch(next);
};
exports.getUsers = getUsers;
const createUser = (req, res, next) => {
    const userData = req.body.data;
    console.log(userData);
    bcryptjs_1.default.hash(userData.password, 10).then((hash) => {
        userData.password = hash;
        prisma_1.default.user
            .create({
            data: userData,
        })
            .then((user) => {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_KEY || '');
            res
                .cookie('jwt', token, {
                maxAge: 3600000,
                httpOnly: true,
            })
                .send({
                user: user,
            });
            console.log(res.cookie);
        })
            .catch((err) => {
            if (err instanceof runtime_1.PrismaClientValidationError ||
                err instanceof runtime_1.PrismaClientKnownRequestError) {
                next(new BadRequestError_1.default('Given data for new user creation is incorrect'));
                return;
            }
            next(err);
        });
    });
};
exports.createUser = createUser;
const updateUsersStatus = (req, res, next) => {
    const { ids, status } = req.body.data;
    if (ids === undefined || status === undefined) {
        throw new BadRequestError_1.default('Given data for user status update is incorrect');
    }
    prisma_1.default.user
        .updateMany({
        where: {
            id: { in: ids },
        },
        data: {
            status: status,
        },
    })
        .then((data) => {
        if (data.count !== 0) {
            res.send('updated');
        }
        else {
            throw new DocumentNotFoundError_1.default('User/s with current _id/s is/are not found');
        }
    })
        .catch(next);
};
exports.updateUsersStatus = updateUsersStatus;
const deleteUsers = (req, res, next) => {
    console.log(req.body);
    const { ids } = req.body;
    prisma_1.default.user
        .deleteMany({
        where: {
            id: { in: ids },
        },
    })
        .then((data) => {
        if (data.count !== 0) {
            res.send('updated');
        }
        else {
            throw new DocumentNotFoundError_1.default('User/s with current _id/s is/are not found');
        }
    })
        .catch(next);
};
exports.deleteUsers = deleteUsers;
const login = (req, res, next) => {
    const { email, password } = req.body.data;
    prisma_1.default.user
        .findUnique({
        where: {
            email: email,
        },
    })
        .then((user) => {
        if (!user) {
            return Promise.reject(new UnautorizedError_1.default('Wrong email or password'));
        }
        else {
            if (user.password)
                return {
                    matched: bcryptjs_1.default.compare(password, user.password),
                    user: user,
                };
        }
    })
        .then((data) => {
        if (data) {
            const { matched, user } = data;
            if (!matched) {
                throw new UnautorizedError_1.default('Wrong email or password');
            }
            if (user.status === 'blocked') {
                throw new ForbiddenError_1.default('User is blocked');
            }
            return user.id;
        }
    })
        .then((id) => {
        prisma_1.default.user
            .update({
            where: {
                id: id,
            },
            data: {
                lastVisit: new Date(Date.now()),
            },
        })
            .then((user) => {
            const token = jsonwebtoken_1.default.sign({ id: id }, process.env.JWT_KEY || '');
            res
                .cookie('jwt', token, {
                maxAge: 3600000,
                httpOnly: true,
            })
                .send({
                user: user,
            });
        });
    })
        .catch((err) => {
        next(err);
    });
};
exports.login = login;
