require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
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
app.get('/api/persons/:id', (request, response, next)=> {
	Person.findById(request.params.id)
		.then(person=>{
			if(person)	{
				response.json(person)
			}	else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response,next)=> {
	Person.findByIdAndDelete(request.params.id)
			.then(result=> {
				response.status(204).end()
			})
			.catch(error => next(error))
})

app.post('/api/persons', (request, response)=>{
	const body = request.body;

	if(body.name === undefined || body.number === undefined)	{
		return response.status(400).json({error:'data missing'})
	}
	const person = new Person({
		name: body.name,
		number: body.number
	})

	person.save().then(savedPerson=>{
		console.log(`${savedPerson.name} saved to phonebook`);
		response.json(savedPerson);
	})
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number
	}
	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})