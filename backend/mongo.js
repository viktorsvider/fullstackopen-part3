const mongoose = require("mongoose");

const listAll = (Person) => {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
};

const addPerson = (person) => {
  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
};

const args = process.argv.length;
if (args < 3) {
  console.log("give password as argument");
  process.exit(1);
} else if (args == 4) {
  console.log("give name and number as argument");
  process.exit(1);
} else if (args > 5) {
  console.log("incorrect number of args");
  console.log("provide args: mongoPassword name number");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@fullstack.ss9dm0z.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = new mongoose.model("Person", phonebookSchema);

if (args == 3) {
  listAll(Person);
}

if (args == 5) {
  const person = new Person({
    name: name,
    number: number,
  });
  addPerson(person);
}
