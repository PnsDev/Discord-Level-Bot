const userSchema = require('../models/user')

/**
 * Grabs an user from the database
 * @param params object - The parameters of the member
 * @returns {Promise<{success: boolean, result: object, reason: string}>}
 */
async function getUser(params){
    return await new Promise(function (resolve) {
        userSchema.findOne(params,
            async (err, res) => {
                if (err){
                    return resolve({
                        success: false,
                        reason: err
                    })
                } else if (!res){
                    return resolve({
                        success: false,
                        reason: 'No document found in the db'
                    })
                }
                return resolve({
                    success: true,
                    result: res
                })
            }
        )
    });
}

module.exports = {
    getUser: getUser
}