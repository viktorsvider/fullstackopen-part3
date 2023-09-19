const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   next();
// };

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.json());
// app.use(requestLogger);
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time :post-body"
  )
);
app.use(express.static("dist"));

morgan.token("post-body", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

const buildString = (numberTotal, stringTemplate) => {
  return numberTotal == 1
    ? `${stringTemplate} 1 person`
    : `${stringTemplate} ${numberTotal} people`;
};

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

let persons = [];

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = new mongoose.model("Person", personSchema);

app.post("/api/persons", (request, response) => {
  const newPerson = {};
  const name = request.body.name;
  const number = request.body.number;

  if (name === undefined || number === undefined) {
    response.status(400).send({ error: "no name or number" });
  } else if (persons.find((person) => person.name === name) !== undefined) {
    response.status(400).send({ error: "name must be unique" });
  } else {
    newPerson.id = Math.round(Math.random() * 100000);
    newPerson.name = name;
    newPerson.number = number;
    persons.push(newPerson);
    response.json(newPerson);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const elementWithId = persons.find((person) => person.id === id);
  if (elementWithId === undefined) {
    response.status(404).end();
  } else {
    persons = persons.filter((persons) => persons.id !== id);
    response.status(204).end();
  }
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(new mongoose.Types.ObjectId(request.params.id)).then(
    (person) => response.json(person)
  );
});

app.get("/api/info", (request, response) => {
  const stringTemplate = "Phonebook has info about";
  const currentDateTime = new Date().toString();
  Person.find({})
    .then((person) => {
      response.send(
        `<p>${buildString(
          person.length,
          stringTemplate
        )}</p> <p>${currentDateTime}</p>`
      );
    })
    .catch((error) => console.log(error));
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
