const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url =
	`mongodb+srv://cattoro:${password}@cluster0.cql7w8b.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

console.log('--Mongo connected--');

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
	Person.find({}).then(result => {
		console.log('phonebook:');
		result.forEach(x => {
			console.log(x.name, x.number);
			//console.log(x)
		})
		
		mongoose.connection.close()
		console.log('--Connection end--');
	})
}	else if(process.argv.length === 5)	{
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	})
	
	person.save().then(result => {
		console.log(`${person.name} saved to phonebook`)
		mongoose.connection.close()
		console.log('--Connection end--');
	})
}	else {
	console.log('missing argument');
	mongoose.connection.close()
	console.log('--Connection end--');
}

