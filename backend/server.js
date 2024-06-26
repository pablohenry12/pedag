const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const appointmentsFile = path.join(__dirname, 'appointments.json');

app.get('/api/appointments', (req, res) => {
    fs.readFile(appointmentsFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading appointments data');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/appointments', (req, res) => {
    const newAppointment = req.body;
    fs.readFile(appointmentsFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading appointments data');
            return;
        }
        const appointments = JSON.parse(data);
        appointments.push(newAppointment);
        fs.writeFile(appointmentsFile, JSON.stringify(appointments, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error saving appointments data');
                return;
            }
            res.status(201).send('Appointment saved');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
