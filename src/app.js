const express = require('express');
const app = express();

app.use('/user', (req, res) => {
    res.send("route handler one");
});
app.listen(7778, () => {
    console.log('Server is running on http://localhost:7778');
});