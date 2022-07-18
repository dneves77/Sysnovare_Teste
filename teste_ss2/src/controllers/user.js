'use strict';


const {verificarEmail, autenticarUtilizador, obterSaldo, atualizarSaldo} = require("../models/user");
const {inserirUtilizador} = require ("../models/user");
const {generateToken} = require("../../auth");
const {token} = require("@hapi/jwt");





exports.registarUtilizador = async (request, h) => {
    const rb = request.payload
    const todosParams = rb.email && rb.password;
    const emailExiste = await verificarEmail(rb.email);

    if (!todosParams) {
        return h
            .response({"message": "todos os campos são necessários"})
            .code(400)

    }
    try {
        if (emailExiste) {
                return h.response({message: "Email já existe"}).code(400)

        } else {
            await inserirUtilizador(rb.email, rb.password)
            return h
                .response({message: "Utilizador criado com sucesso!"})
                .code(201)
        }
    }catch (e){
        return h.response({message: "Erro inesperado"})
            .code(500)

    }



}

exports.autenticar = async (request, h) => {
    const rb = request.payload
    const todosParams = rb.email && rb.password;


    if (!todosParams) {
        return h
            .response({"message": "todos os campos são necessários"})
            .code(400)
    }
    try {
        const utilizadorValido = await autenticarUtilizador(rb.email, rb.password)
        if(utilizadorValido){
           return h.response({ token: generateToken(rb.email) }).code(200)
        }else {
            return h.response({message: "Credenciais invalidas!"})
                .code(400)
        }
    }catch (e){
        return h.response({message: "Erro inesperado"})
            .code(500)
    }

}


exports.verificarSaldo = async (request, h) => {
    try {
        const email = request.auth.credentials.email
        const saldo = await obterSaldo(email)
        return h.response({ saldo }).code(200)
    }
    catch (error) {
        return h.response({ mensagem: "Erro Inesperado" }).code(500)
    }
};

exports.adicionarSaldo = async (request, h) => {
    try {
        const email = request.auth.credentials.email
        const { valorMovimento } = request.payload
        if (!valorMovimento || typeof valorMovimento!== "number") {
            return h.response({ mensagem: "Movimento Inválido" }).code(422)
        }
        await atualizarSaldo(email, valorMovimento)
        return h.response({ menagem: "Saldo Atualizado" }).code(200)
    }
    catch (error) {
        return h.response({ mensagem: "Erro Inesperado" }).code(500)
    }
};

exports.retirarSaldo = async (request, h) => {
    try {
        const email = request.auth.credentials.email
        const { valorMovimento } = request.payload
        if (!valorMovimento || typeof valorMovimento!== "number") {
            return h.response({ mensagem: "Movimento Inválido" }).code(422)
        }
        await atualizarSaldo(email, -valorMovimento)
        return h.response({ menagem: "Saldo Atualizado" }).code(200)
    }
    catch (error) {
        return h.response({ mensagem: "Erro Inesperado" }).code(500)
    }
};





