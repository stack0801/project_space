const mongoose = require('mongoose')
require('dotenv').config()

/*main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DB_uri);

    const kittySchema = new mongoose.Schema({
        name: String
    });
    
    kittySchema.methods.speak = function speak() {
        const greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name";
        console.log(greeting);
    };
    
    const Kitten = mongoose.model('Kitten', kittySchema);
    
    const silence = new Kitten({ name: 'Silence' });
    console.log(silence.name);
    
    const fluffy = new Kitten({ name: 'fluffy' });
    fluffy.speak();

    //await fluffy.save();
    //fluffy.speak();
}*/

mongoose.connect(process.env.DB_uri, { }, (err) => {
    if(err) {
        console.log(err)
        process.exit(1)
    }
})

const user_schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    }

})

const user_model = mongoose.model('s_users', user_schema)

module.exports = {
    S_user : user_model
}
