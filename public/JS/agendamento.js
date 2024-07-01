// Adiciona um evento ao formulário para ser executado quando for submetido
document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    // Previne o comportamento padrão do formulário de recarregar a página
    e.preventDefault();

    // Obtém os valores dos campos do formulário
    var nome = document.getElementById('nome').value;
    var classeNumber = document.getElementById('classe').value;
    var dia = document.getElementById('dia').value;
    var hora = document.getElementById('hora').value;

    // Cria um objeto de agendamento com os valores obtidos
    const appointment = { nome, classe: classeNumber, dia, hora };

    // Recupera os agendamentos do localStorage ou inicializa um array vazio se não houver agendamentos
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    
    // Verifica se o horário escolhido já está ocupado
    const isTimeSlotTaken = appointments.some(a => a.dia === dia && a.hora === hora);
    if (isTimeSlotTaken) {
        // Se o horário estiver ocupado, exibe um alerta e retorna
        alert('Este horário já está reservado. Por favor, escolha outro horário.');
        return;
    }

    // Adiciona o novo agendamento ao array de agendamentos
    appointments.push(appointment);
    // Salva o array de agendamentos atualizado no localStorage
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Exibe uma mensagem de sucesso
    alert('Agendamento realizado com sucesso!');
    // Atualiza a lista de agendamentos exibida na página
    fetchAppointments();
});

// Função para buscar e exibir os agendamentos
function fetchAppointments() {
    // Recupera os agendamentos do localStorage ou inicializa um array vazio se não houver agendamentos
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    // Obtém a div onde os agendamentos serão exibidos
    const appointmentInfo = document.getElementById('appointment-info');
    // Limpa o conteúdo atual da div
    appointmentInfo.innerHTML = '<h2>Agendamentos</h2>';
    // Para cada agendamento, cria um elemento div e adiciona à div principal
    appointments.forEach((appointment, index) => {
        const appointmentDiv = document.createElement('div');
        appointmentDiv.textContent = `${appointment.nome} - ${appointment.classe} - ${appointment.dia} - ${appointment.hora}`;
        // Adiciona botões de editar e deletar ao div de cada agendamento
        appointmentDiv.appendChild(createEditButton(index));
        appointmentDiv.appendChild(createDeleteButton(index));
        appointmentInfo.appendChild(appointmentDiv);
    });
}

// Função para criar um botão de editar
function createEditButton(index) {
    const button = document.createElement('button');
    button.textContent = 'Editar';
    // Define o evento de clique do botão para chamar a função de edição
    button.onclick = () => editAppointment(index);
    return button;
}

// Função para criar um botão de deletar
function createDeleteButton(index) {
    const button = document.createElement('button');
    button.textContent = 'Deletar';
    // Define o evento de clique do botão para chamar a função de deleção
    button.onclick = () => deleteAppointment(index);
    return button;
}

// Função para editar um agendamento
function editAppointment(index) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointment = appointments[index];

    // Preenche os campos do formulário com os dados do agendamento a ser editado
    document.getElementById('nome').value = appointment.nome;
    document.getElementById('classe').value = appointment.classe;
    document.getElementById('dia').value = appointment.dia;
    document.getElementById('hora').value = appointment.hora;

    // Remove o agendamento antigo para permitir a edição
    deleteAppointment(index);
}

// Função para deletar um agendamento
function deleteAppointment(index) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    // Remove o agendamento do array
    appointments.splice(index, 1);
    // Salva o array de agendamentos atualizado no localStorage
    localStorage.setItem('appointments', JSON.stringify(appointments));
    // Atualiza a lista de agendamentos exibida na página
    fetchAppointments();
}

// Chama a função fetchAppointments quando a página é carregada para exibir os agendamentos salvos
document.addEventListener('DOMContentLoaded', fetchAppointments);
