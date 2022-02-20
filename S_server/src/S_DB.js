const { Vertices } = require('matter-js')
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
    }
})

const object_schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    },
    a: {
        type: Number,
        default: 0
    },
    dx: {
        type: Number,
        default: 0
    },
    dy: {
        type: Number,
        default: 0
    },
    da: {
        type: Number,
        default: 0
    },
    Vertices: []
})

module.exports = {
    S_user : mongoose.model('S_users', user_schema),
    S_object : mongoose.model('S_object', object_schema)
}
