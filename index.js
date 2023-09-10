const express = require("express");
const app = express();

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

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  // Maybe wrap with try...catch???
  if (persons[id] === undefined) {
    response.status(404).send("Bad id");
  }
  response.send(JSON.stringify(persons[id]));
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
