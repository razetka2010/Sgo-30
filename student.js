document.addEventListener('DOMContentLoaded', function() {
  const navigationMenu = document.querySelector('aside nav ul');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const username = localStorage.getItem('username');
   const logoutButton = document.getElementById('logoutButton');
  const scheduleList = document.getElementById('schedule-list');
    const afficheList = document.getElementById('affiche-list');
   userNameDisplay.textContent = username;
     //Исправляем здесь опечатку const teacherList = document.getElementById('teacher-list');
     const teachersList = document.getElementById('teachers-list');
     const chatMessagesTeacher = document.getElementById('messages-content');
   const messageFormTeacher = document.getElementById('message-form');
     let currentRecipient = null;


  navigationMenu.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();

          const targetId = this.getAttribute('href').substring(1);
          document.querySelectorAll('section[id]').forEach(section => {
              section.style.display = 'none';
          });
          document.getElementById(targetId).style.display = 'block';
      });
  });
  // Проверяем, если пользователь не ученик, перенаправляем на страницу входа
  const userRole = localStorage.getItem('userRole');
  if (userRole !== 'student') {
      window.location.href = 'login.html';
  }
   // Выход из админки
 logoutButton.addEventListener('click', function() {
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      window.location.href = 'login.html';
  });
   // Загрузка расписания
  function loadSchedule() {
    let schedule = JSON.parse(localStorage.getItem('schedule') || '[]');
      const userClass = localStorage.getItem('userClass');
     const userLetter = localStorage.getItem('userLetter');
      const filteredSchedule = schedule.filter(item => {
          return item.class === userClass && item.letter === userLetter;
      });
    scheduleList.innerHTML = '';
      filteredSchedule.forEach(lesson => {
          const row = document.createElement('tr');
         row.innerHTML = `
              <td>${lesson.subject}</td>
             <td>${lesson.teacher}</td>
               <td>${lesson.startTime}</td>
              <td>${lesson.endTime}</td>
              <td>${lesson.day}</td>
          `;
          scheduleList.appendChild(row);
      });
  }
   // Функция для загрузки афиши
   function loadAffiche() {
        let affiche = JSON.parse(localStorage.getItem('affiche') || '[]');
      afficheList.innerHTML = '';
     affiche.forEach(event => {
         const row = document.createElement('tr');
          row.innerHTML = `
              <td>${event.title}</td>
               <td>${event.description}</td>
               <td>${event.date}</td>
         `;
         afficheList.appendChild(row);
     });
 }
function loadTeachers() {
     let users = JSON.parse(localStorage.getItem('users') || '[]');
      const teachers = users.filter(user => user.role === 'teacher');
     if(teachersList){
        teachersList.innerHTML = '';
       }
     teachers.forEach(teacher => {
         const listItem = document.createElement('li');
          listItem.textContent = teacher.username;
         listItem.addEventListener('click', function() {
            currentRecipient = teacher.username;
             loadMessages(currentRecipient);
             document.querySelectorAll('.teachers-list li').forEach(el => el.classList.remove('active'));
            listItem.classList.add('active');
         });
        if(teachersList){
            teachersList.appendChild(listItem);
        }
     });
 }
 function loadMessages(recipient) {
    let messages = JSON.parse(localStorage.getItem('messages') || '[]');
      if(chatMessagesTeacher){
         chatMessagesTeacher.innerHTML = '';
      }
      const filteredMessages = messages.filter(message =>
         (message.sender === username && message.recipient === recipient) ||
         (message.sender === recipient && message.recipient === username)
    );
      filteredMessages.forEach(message => {
          const messageDiv = document.createElement('div');
        messageDiv.classList.add('message'); // Добавляем класс для стилизации

         if (message.sender === username) {
             messageDiv.classList.add('user-message'); // Отметьте сообщение пользователя
         } else {
            messageDiv.classList.add('teacher-message'); // Отметьте сообщение преподавателя
        }
         messageDiv.textContent = `${message.sender}: ${message.text}`;
         if(chatMessagesTeacher){
          chatMessagesTeacher.appendChild(messageDiv);
         }
    });
  }
if(messageFormTeacher){
     messageFormTeacher.addEventListener('submit', function(e) {
        e.preventDefault();
         const text = document.getElementById('message-input').value;
        if(text && currentRecipient){
            let messages = JSON.parse(localStorage.getItem('messages') || '[]');
           messages.push({
                sender: username,
                recipient: currentRecipient,
               text: text
           });
             localStorage.setItem('messages', JSON.stringify(messages));
             document.getElementById('message-input').value = '';
           loadMessages(currentRecipient);
       }
      });
  }
  loadSchedule();
  loadAffiche();
  loadTeachers();
});