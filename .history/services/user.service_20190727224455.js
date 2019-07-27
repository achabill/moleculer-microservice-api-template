"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
const DbService = require("../mixins/db.mixin");
const User = require("../models/user");

module.exports = {
    name: "users",
    mixins: [DbService("users", process.env.USERS_MONGODB)],
    dependencies: ["api"],
    model: User,
    settings: {},
    metadata: {},
    actions: {
        create: {
            params: {
                username: { type: "string" },
                password: { type: "string" }
            },
            handler(ctx) {
                return new Promise(async (resolve, reject) => {
                    let { username, password } = ctx.params;
                    this.adapter.find({
                        query: {
                            username
                        }
                    }).then(user => {
                        if (user) {
                            return reject(new MoleculerClientError(
                                "User already exists",
                                HttpStatus.CONFLICT
                            ));

                            this.adapter.insert(ctx.params).then(newUser => {
                                return resolve(newUser);
                            }).catch(error => {

                            });
                        }
                    }).catch(error => {

                    })
                })
            },

            list: {
                auth: "required",
                handler(ctx) {
                    return new Promise(async (resolve, reject) => {
                        let query = Object.assign(ctx.params) || {}
                        this.adapter.find({ query }).then(users => {
                            return resovle(users);
                        }).catch(error => {

                        });
                    })
                }
            },
            login: {
                params: {
                    username: { type: "string" },
                    password: { type: "string" }
                },
                handler(ctx) {
                    return new Promise(async (resolve, reject) => {

                        let user = await this.adapter.findOne({
                            firebaseId: decoded.uid,
                        });
                        if (!user) {
                            return reject(new MoleculerClientError(
                                "User does not exist. Have you signed up?",
                                HttpStatus.NOT_FOUND
                            ));
                        }
                        ctx.emit(appEvents.auth.LOGIN, {
                            userId: user._id
                        });
                        return resolve(user);

                    });
                }
            },
            resolveToken: {
                cache: {
                    keys: ["token"],
                    ttl: 60 * 60
                },
                params: {
                    token: { type: "string" }
                },
                handler(ctx) {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let user = await this.adapter.findOne({ firebaseId: decoded.uid });
                            if (!user) {
                                return reject('user not found');
                            }
                            return resolve(user);
                        } catch (error) {
                            return reject(error);
                        }
                    })
                }
            }
        },

        /**
         * Events
         */
        events: {},

        /**
         * Methods
         */
        methods: {},

        /**
         * Service created lifecycle event handler
         */
        created() {
        },

        /**
         * Service started lifecycle event handler
         */
        started() {
        },

        /**
         * Service stopped lifecycle event handler
         */
        stopped() {
        }
    };
