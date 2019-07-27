"use strict";

const ApiGateway = require("moleculer-web");
const bodyParser = require("body-parser");
const E = require("moleculer-web").Errors;

module.exports = {
    name: "api",
    mixins: [ApiGateway],

    // More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
    settings: {
        port: process.env.PORT || 4000,
        path: "/api",
        logRequestParams: "info",
        cors: true,
        use: [
            bodyParser({
                json: {
                    strict: false
                },
                urlencoded: {
                    extended: false
                }
            })
        ],
        routes: [
            {
                path: "/users",
                //authorization: true,
                aliases: {
                    "GET ": "users.list",
                    "GET /:id": "users.get",
                    "POST /login": "users.login",
                    "POST ": "users.create",
                },
                mappingPolicy: "restrict"
            }
        ]
    },
    methods: {
        authorize(ctx, route, req) {
            return new Promise((resolve, reject) => {
                if (req.$endpoint.action.auth !== "required") {
                    return resolve(true);
                }

                let auth = req.headers["authorization"];
                if (!auth) {
                    return reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN, null));
                }
                if (!auth.startsWith("Bearer")) {
                    return reject(new E.UnAuthorizedError(E.ERR_UNABLE_DECODE_PARAM, null));
                }
                let token = auth.slice(7);
                if (!token) {
                    return reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN, null));
                }
                ctx.call("users.resolveToken", { token }).then(user => {
                    this.logger.info("Authenticated via JWT: ", user);
                    ctx.meta.user = user;
                    ctx.meta.token = token;
                    return resolve(user);
                }).catch(error => {
                    return reject(error);
                })
            });
        }
    },

    created() {
    }
};
