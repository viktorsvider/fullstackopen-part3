const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const buildString = (numberTotal, stringTemplate) => {
  return numberTotal == 1
    ? `${stringTemplate} 1 person`
    : `${stringTemplate} ${numberTotal} people`;
};

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

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  // Maybe wrap with try...catch???
  if (persons[id] === undefined) {
    response.status(404).send("Bad id");
  }
  response.json(persons[id]);
});

app.get("/api/info", (request, response) => {
  const stringTemplate = "Phonebook has info about";
  const infoString = buildString(persons.length, stringTemplate);
  const currentDateTime = new Date().toString();
  const payload = `<p>${infoString}</p> <p>${currentDateTime}</p>`;
  response.send(payload);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
