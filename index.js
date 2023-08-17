const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms',
		JSON.stringify(req.body)
	].join(' ')
}))

let persons = [
	{
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
]

app.get('/info', (request, response) => {	
	response.send('Phonebook has info for '+ persons.length +' people<br/><br/>'+new Date());
})
app.get('/api/persons', (request, response) => {
	response.json(persons)
})
app.get('/api/persons/:id', (request, response)=> {
	const id = Number(request.params.id)
	const person = persons.find(x => x.id === id)
	if(person)	{
		response.json(person)
	}	else {
		response.status(404).end()
	}
})
app.delete('/api/persons/:id', (request, response)=> {
	const id = Number(request.params.id)
	persons = persons.filter(x => x.id !== id)
	response.status(204).end()
})
/* app.get('/getid', (request, response) => {
	const newid = generateId().toString();
	response.send(newid);
}) */
app.post('/api/persons', (request, response)=>{
	const body = request.body;

	if(!body.name || !body.number)	{
		return response.status(400).json({error:'data missing'})
	}
	if(persons.findIndex((x)=>x.name===body.name)>-1)	{
		return response.status(400).json({error:'name must be unique'})
	}
	const person = {
		id: generateId(),
		name: body.name,
		number: body.number
	}

	persons = persons.concat(person);
	//console.log(person);
	response.json(person);
})
const generateId = () => {
	let id = Math.ceil(Math.random() * 9999);
	if(persons.findIndex((x)=>x.id===id)>-1)	{
		generateId();
	}	else {
		return id;
	}
}



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})