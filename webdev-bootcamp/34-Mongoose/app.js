import mongoose from "mongoose";

function createSchemas(fruitDB, peopleDB) {
    const fruitSchema = new mongoose.Schema({
        name: {type: String, required: true, unique: true, },
        rating: Number,
        review: String
    });
    const personSchema = new mongoose.Schema({
        id: { type: Number, required: true, unique: true, },
        name: new mongoose.SchemaTypeOptions({ type: String, required: [true, 'You need to specify the name!'], }),
        age: { type: Number, min: 0, max: 100, },
        favoriteFruit: {type: fruitSchema, required: [true, "You need to specify a favorite fruit!"], },
    }, { collection: 'people', })

    const Fruit = fruitDB.model('Fruit', fruitSchema);
    const Person = peopleDB.model('Person', personSchema)
    return { Fruit, Person };
}

async function connectDBs() {
    const fruitDB = await mongoose.connect(`mongodb://127.0.0.1:27017`, { dbName: 'fruitDB',  useNewUrlParser: true, useUnifiedTopology: true });
    const peopleDB = await mongoose.connect(`mongodb://127.0.0.1:27017`, { dbName: 'peopleDB',  useNewUrlParser: true, useUnifiedTopology: true });
    const close = async () => { await fruitDB.connection.close(); await peopleDB.connection.close(); }
    return { fruitDB, peopleDB , close}
}

async function manageFruits(Fruit) {
    await Fruit.collection.drop();
    const displayFruits = async () => {
        let results = await Fruit.find()
        console.log('--------------------');
        results.forEach(x => {
            console.log(x.name + ' is available...');
        });
    }
    let fruits = {
        'Apple': new Fruit({
            name: 'Apple',
            rating: 7,
            review: 'Pretty solid as a fruit.'
        }),
        'Orange': new Fruit({
            name: 'Orange',
            rating: 4,
            review: 'Too sour for me.'
        }),
        'Banana': new Fruit({
            name: 'Banana',
            rating: 3,
            review: 'Weird texture.'
        }),
    }
    try {
        let results = await Fruit.insertMany(Object.keys(fruits).map(k => fruits[k]));
        console.log('New fruit saved to database:', results.map(x => x.toJSON()));
    } catch (e) {
        if (e.code === 11000) {
            console.log('Duplicate fruit... ignoring');
        } else {
            throw e;
        }
    }
    await displayFruits();
    return fruits;
}

async function managePeople(fruits, Person) {
    const randomNames = ['John', 'Tom', 'Bob', 'Joe', 'Keon']
    await Person.collection.drop();
    const displayPeople = async () => {
        let results = await Person.find()
        console.log('--------------------');
        results.forEach(x => {
            console.log(x.name + ' is ' + x.age + ' years old.');
        });
    }
    let persons = enlist(randomNames, (i, name) => new Person({
        id: i,
        name: name,
        age: Math.floor(Math.random() * 100),
        favoriteFruit: fruits['Apple'],
    }));
    try {
        let results = await Person.insertMany(persons)
        console.log('New person saved to database:', results.map(x => x.toJSON()));
    } catch (e) {
        if (e.code === 11000) {
            console.log('Duplicate ID... ignoring');
        } else {
            throw e;
        }
    }
    await displayPeople();
    await Person.updateMany({ name: 'John' }, { age: 64 }, { runValidators: true });
    await displayPeople();
    await Person.deleteOne({ name: 'John' }, {runValidators: true});
    await displayPeople();
    await Person.deleteMany(); //deletes all!
    await displayPeople();
}

function enlist(items, fn) { //overkill function to demonstrate generators
    return (() => {
        const generator = function* () {
            for (let i = 0; i < items.length; i++) {
                yield fn(i, items[i]);
            }
        }();
        return Array.from(generator);
    })();
}

async function run() {
    let {fruitDB, peopleDB, close} = await connectDBs();
    let {Fruit, Person} = createSchemas(fruitDB, peopleDB);
    let fruits = await manageFruits(Fruit);
    await managePeople(fruits, Person);
    return close;
}

// manageFruits('fruitsDB');
const close = await run();

await close();