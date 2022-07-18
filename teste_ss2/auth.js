const { jwt } = require("./config.js")
const { key, aud, iss, maxAgeSec } = jwt
const Jwt = require("@hapi/jwt");
const {verificarEmail} = require("./src/models/user");



exports.generateToken = (email) => Jwt.token.generate({ aud, iss, user: email }, { key }, { ttlSec: maxAgeSec })


exports.validate = async (artifacts) => {
    const emailValido = await verificarEmail(artifacts.decoded.payload.user)
    if (emailValido) {
        return ({ isValid: true, credentials: { email: artifacts.decoded.payload.user } })
    }
    return ({ isValid: false })
}