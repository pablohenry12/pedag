const availableTimes = {
    "2024-06-24": ["14:00", "15:00", "16:00"],
    "2024-06-25": ["14:00", "15:00", "16:00"],
    "2024-06-26": ["14:00", "15:00", "16:00"],
    "2024-06-27": ["14:00", "15:00", "16:00"],
    "2024-06-28": ["14:00", "15:00", "16:00"],
    // Adicione mais datas e horários conforme necessário
};

const bookedTimes = JSON.parse(localStorage.getItem('bookedTimes')) || {};
const selectedWeek = JSON.parse(localStorage.getItem('selectedWeek')) || null;
const currentWeek = getWeekNumber(new Date());

if (selectedWeek !== currentWeek) {
    localStorage.removeItem('bookedTimes');
    localStorage.setItem('selectedWeek', JSON.stringify(currentWeek));
}

let selectedDate = null;
let selectedTime = null;

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('name').value = localStorage.getItem('name') || '';
    document.getElementById('class').value = localStorage.getItem('class') || '';
    displayAppointmentInfo();
});

function selectDay(date) {
    selectedDate = date;
    const timesDiv = document.getElementById('available-times');
    timesDiv.innerHTML = ''; // Limpar horários anteriores

    if (availableTimes[date]) {
        availableTimes[date].forEach(time => {
            if (!bookedTimes[date] || !bookedTimes[date].includes(time)) {
                const timeButton = document.createElement('button');
                timeButton.textContent = time;
                timeButton.onclick = () => selectTime(date, time);
                timesDiv.appendChild(timeButton);
            }
        });
    } else {
        timesDiv.textContent = 'Nenhum horário disponível para a data selecionada.';
    }
}

function selectTime(date, time) {
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
        if (!bookedTimes[selectedDate]) {
            bookedTimes[selectedDate] = [];
        }
        bookedTimes[selectedDate].push(selectedTime);

        localStorage.setItem('bookedTimes', JSON.stringify(bookedTimes));
        localStorage.setItem('name', name);
        localStorage.setItem('class', userClass);

        displayAppointmentInfo();

        selectDay(selectedDate); // Atualizar horários disponíveis
    } else {
        alert('Por favor, selecione uma data e um horário.');
    }
}

function displayAppointmentInfo() {
    const appointmentInfoDiv = document.getElementById('appointment-info');
    const name = localStorage.getItem('name');
    const userClass = localStorage.getItem('class');
    if (name && userClass) {
        appointmentInfoDiv.innerHTML = `
            <h2>Informações do Agendamento</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Turma:</strong> ${userClass}</p>
            <p><strong>Agendamentos:</strong></p>
            <ul>${getBookedTimesHtml()}</ul>
        `;
    }
}

function getBookedTimesHtml() {
    const bookedTimesHtml = [];
    for (const [date, times] of Object.entries(bookedTimes)) {
        times.forEach(time => {
            bookedTimesHtml.push(`<li>${date} às ${time}</li>`);
        });
    }
    return bookedTimesHtml.join('');
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}
