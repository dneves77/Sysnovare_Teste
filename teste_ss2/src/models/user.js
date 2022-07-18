const fs = require("fs/promises")
var crypto = require("crypto")

const PATH = "users.json"

const hashPassword = (password) => crypto.createHash("md5").update(password).digest("hex")

exports.autenticarUtilizador = async (email, password) => {
    const rawData = await fs.readFile(PATH)
    const users = JSON.parse(rawData)
    const filteredUsers = users.filter(item => item.email === email && item.password === hashPassword(password))
    return filteredUsers.length > 0
}

exports.verificarEmail = async (email) => {
    const rawData = await fs.readFile(PATH)
    const users = JSON.parse(rawData)
    const filteredUsers = users.filter(item => item.email === email)
    return filteredUsers.length > 0
    console.log(email)
}

exports.obterSaldo = async (email) => {
    const rawData = await fs.readFile(PATH)
    const users = JSON.parse(rawData)
    const filteredUsers = users.filter(item => item.email === email)
    return filteredUsers[0]?.saldo
}

exports.inserirUtilizador = async (email, password) => {
    const rawData = await fs.readFile(PATH)
    const users = JSON.parse(rawData)
    const newUser = { email, password: hashPassword(password), saldo: 0 }
    users.push(newUser)
    await fs.writeFile(PATH, JSON.stringify(users, null, 4))
}

exports.atualizarSaldo = async (email, valor) => {
    const rawData = await fs.readFile(PATH)
    const users = JSON.parse(rawData)
    const newUsers = users.map(item => item.email === email ? ({ ...item, saldo: item.saldo + valor }) : item)
    await fs.writeFile(PATH, JSON.stringify(newUsers, null, 4))
}

exports.eliminarUtilizador = async (email) => {
    const rawData = await fs.readFile(PATH)
    const users = JSON.parse(rawData)
    const newUsers = users.filter(item => item.email !== email)
    await fs.writeFile(PATH, JSON.stringify(newUsers, null, 4))
}