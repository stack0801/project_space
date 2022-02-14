const S_DB = require('./src/S_DB')

await function clock() {
    const list = await S_DB.S_user.find();

}

module.exports = {
    S_clock : clock()
}