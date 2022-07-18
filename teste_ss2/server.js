'use strict';

const fs = require ('fs');

const { jwt } = require("./config.js")
const { key, aud, iss, maxAgeSec } = jwt
const Jwt = require("@hapi/jwt");

const { validate } = require('./auth.js');

const Hapi = require('@hapi/hapi')
const userController =  require('./src/controllers/user');

const init = async () => {
    try {
        const server = new Hapi.Server({
            port: 3000,
            host: 'localhost'
        });

        await server.register(Jwt)
        server.auth.strategy("my_jwt_strategy", "jwt", {
            keys: key,
            verify: { aud, iss, sub: false, maxAgeSec },
            validate
        })


        server.route({
            method: 'GET',
            path: '/funds',
            options: {
                auth: "my_jwt_strategy"
            },
            handler: userController.verificarSaldo
        });

        server.route({
            method: 'POST',
            path: '/subscribe',
            handler: userController.registarUtilizador
        });

        server.route({
            method: 'POST',
            path: '/login',
            handler: userController.autenticar
        });

        server.route({
            method: 'PUT',
            path: '/funds',
            options: {
                auth: "my_jwt_strategy"
            },
            handler: userController.adicionarSaldo
        });

        server.route({
            method: 'DELETE',
            path: '/funds',
            options: {
                auth: "my_jwt_strategy"
            },
            handler: userController.retirarSaldo
        });
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch(e){
        console.log(e)
    }
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();