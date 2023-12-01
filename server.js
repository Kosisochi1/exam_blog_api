const app = require('./app');
const db = require('./db');
const PORT = 5000;

db.connect();
app.listen(PORT, () => {
	console.log('Server Started');
});
