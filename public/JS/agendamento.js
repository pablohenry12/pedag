let selectedDate = null;
let selectedTime = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchAppointments();
});

function fetchAppointments() {
    fetch('/api/appointments')
        .then(response => response.json())
        .then(data => {
            displayAppointmentInfo(data);
        });
}

function selectDay(date) {
    selectedDate = date;
    fetch('/api/appointments')
        .then(response => response.json())
        .then(data => {
            const timesDiv = document.getElementById('available-times');
            timesDiv.innerHTML = ''; // Limpar horários anteriores

            const availableTimes = ["14:00", "15:00", "16:00"];
            const bookedTimes = data.filter(app => app.date === date).map(app => app.time);

            availableTimes.forEach(time => {
                if (!bookedTimes.includes(time)) {
                    const timeButton = document.createElement('button');
                    timeButton.textContent = time;
                    timeButton.onclick = (event) => selectTime(event, time);
                    timesDiv.appendChild(timeButton);
                }
            });
        });
}

function selectTime(event, time) {
    selectedTime = time;
    const buttons = document.querySelectorAll('#available-times button');
    buttons.forEach(button => button.classList.remove('selected'));
    event.target.classList.add('selected');
}

function confirmAppointment() {
    const name = document.getElementById('name').value;
    const userClass = document.getElementById('class').value;

    if (!name || !userClass) {
        alert('Por favor, preencha seu nome e turma.');
        return;
    }

    if (selectedDate && selectedTime) {
        const newAppointment = {
            name,
            class: userClass,
            date: selectedDate,
            time: selectedTime
        };

        fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAppointment)
        })
        .then(response => response.text())
        .then(() => {
            fetchAppointments(); // Atualizar horários disponíveis
            displayAppointmentInfo([newAppointment]); // Atualizar informações de agendamento
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Por favor, selecione uma data e um horário.');
    }
}

function displayAppointmentInfo(appointments) {
    const appointmentInfoDiv = document.getElementById('appointment-info');
    appointmentInfoDiv.innerHTML = '<h2>Informações do Agendamento</h2>';
    appointments.forEach(appointment => {
        appointmentInfoDiv.innerHTML += `
            <p><strong>Nome:</strong> ${appointment.name}</p>
            <p><strong>Turma:</strong> ${appointment.class}</p>
            <p><strong>Data:</strong> ${appointment.date}</p>
            <p><strong>Horário:</strong> ${appointment.time}</p>
            <hr>
        `;
    });
}
