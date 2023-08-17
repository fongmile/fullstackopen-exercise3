require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(cors())
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

app.get('/info', (request, response) => {	
	Person.find({}).then(persons => {
		response.send('Phonebook has info for '+ persons.length +' people<br/><br/>'+new Date());
	})
})
app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})
app.get('/api/persons/:id', (request, response)=> {
	Person.findById(request.params.id).then(person=>{
		response.json(person)
	})
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

	if(body.name === undefined || body.number === undefined)	{
		return response.status(400).json({error:'data missing'})
	}
	/* if(persons.findIndex((x)=>x.name===body.name)>-1)	{
		return response.status(400).json({error:'name must be unique'})
	} */
	const person = new Person({
		name: body.name,
		number: body.number
	})

	person.save().then(savedPerson=>{
		console.log(`${savedPerson.name} saved to phonebook`);
		response.json(savedPerson);
	})
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})