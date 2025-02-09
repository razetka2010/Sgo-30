document.addEventListener('DOMContentLoaded', function() {
  // Проверяем наличие роли пользователя в localStorage
  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username');
  const logoutButton = document.getElementById('logoutButton');
  const navigationMenu = document.getElementById('navigation-menu');
  const teacherItems = document.querySelectorAll('.teacher-item');
  const studentItems = document.querySelectorAll('.student-item');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const studentSchedule = document.getElementById('student-schedule');
  const teacherSchedule = document.getElementById('teacher-schedule');
  const studentMarksTable = document.getElementById('student-marks-table');
  const teacherMarksTable = document.getElementById('teacher-marks-table');
  const addMarkForm = document.getElementById('add-mark-form');
  const dashboardMarks = document.getElementById('dashboard-marks');
  const userClass = localStorage.getItem('class');
  const userLetter = localStorage.getItem('letter');
  const studentSelect = document.getElementById('student-select');
  const homeworkForm = document.getElementById('homework-form');
  const homeworkList = document.querySelector('.homework-list');
  const studentHomeworkTable = document.getElementById('student-homework');
  const chatContacts = document.getElementById('chat-contacts');
  const chatContactsTeacher = document.getElementById('chat-contacts-teacher');
  const messageArea = document.getElementById('message-area');
  const messageAreaTeacher = document.getElementById('message-area-teacher');
  const messageForm = document.getElementById('message-form');
   const messageFormTeacher = document.getElementById('message-form-teacher');
  const chatRecipient = document.getElementById('chat-recipient');
   const chatRecipientTeacher = document.getElementById('chat-recipient-teacher');
  const afficheList = document.getElementById('affiche-list');


  let currentRecipient = null;
  let currentRecipientTeacher = null;
  userNameDisplay.textContent = username;

  if (userRole === 'teacher') {
      teacherItems.forEach(item => item.style.display = 'block');
    studentItems.forEach(item => item.style.display = 'none');
      loadTeacherSchedule();
      loadTeacherMarks();
    populateStudentSelect();
      loadHomework();
      loadChatContactsTeacher();
     loadAffiche();
  } else if (userRole === 'student') {
      teacherItems.forEach(item => item.style.display = 'none');
     studentItems.forEach(item => item.style.display = 'block');
      loadStudentSchedule(userClass, userLetter);
       loadStudentMarks();
      loadHomework();
     loadStudentHomework();
    loadChatContacts();
    loadAffiche();
  } else if (userRole === 'admin'){
      // Если пользователь админ, перенаправляем на admin.html
      window.location.href = 'admin.html';
  }

      // Если нет роли и имени пользователя в localStorage, то перенаправляем на страницу входа
  if (!userRole || !username) {
      window.location.href = 'login.html';
  }

// Обработчик клика по навигации
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
  // Выход из аккаунта
  logoutButton.addEventListener('click', function() {
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      localStorage.removeItem('class');
      localStorage.removeItem('letter');
      window.location.href = 'login.html';
  });

  // Функция для загрузки расписания для ученика
function loadStudentSchedule(userClass, userLetter) {
      const schedule = JSON.parse(localStorage.getItem('schedule') || '[]');
       if(studentSchedule){
          studentSchedule.innerHTML = '';
      }
     schedule.forEach(lesson => {
         if(lesson.class === userClass && lesson.letter === userLetter){
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${lesson.startTime} - ${lesson.endTime}</td>
                  <td>${lesson.subject}</td>
                  <td>${lesson.teacher}</td>
              `;
            if(studentSchedule){
               studentSchedule.appendChild(row);
            }
         }
      });
  }
  // Функция для загрузки расписания для учителя
  function loadTeacherSchedule() {
      const schedule = JSON.parse(localStorage.getItem('schedule') || '[]');
       if(teacherSchedule){
        teacherSchedule.innerHTML = '';
      }
     schedule.forEach(lesson => {
         const row = document.createElement('tr');
         row.innerHTML = `
                <td>${lesson.startTime} - ${lesson.endTime}</td>
                  <td>${lesson.subject}</td>
                 <td>${lesson.teacher}</td>
             `;
        if(teacherSchedule){
            teacherSchedule.appendChild(row);
          }
    });
  }
  // Функция для загрузки оценок ученика
  function loadStudentMarks() {
     const marks = JSON.parse(localStorage.getItem('marks') || '[]');
      const username = localStorage.getItem('username');
      if(studentMarksTable){
          studentMarksTable.innerHTML = '';
      }
      if(dashboardMarks){
         dashboardMarks.innerHTML = '';
     }

      marks.forEach(mark => {
          if(mark.student === username){
             const row = document.createElement('tr');
                row.innerHTML = `
                  <td>${mark.subject}</td>
                  <td>${mark.value}</td>
               `;
              if(studentMarksTable){
                 studentMarksTable.appendChild(row);
              }
              const markItem = document.createElement('li');
             markItem.textContent = `${mark.subject}: ${mark.value}`;
             if(dashboardMarks){
                 dashboardMarks.appendChild(markItem)
             }
          }
      });
  }
  // Функция для загрузки оценок учителя
  function loadTeacherMarks() {
      const marks = JSON.parse(localStorage.getItem('marks') || '[]');
      if(teacherMarksTable){
          teacherMarksTable.innerHTML = '';
       }

      marks.forEach(mark => {
          const row = document.createElement('tr');
         row.innerHTML = `
                <td>${mark.student}</td>
               <td>${mark.subject}</td>
               <td>${mark.value}</td>
             `;
         if(teacherMarksTable){
           teacherMarksTable.appendChild(row);
           }
      });
  }
  // Функция для добавления оценки
if(addMarkForm){
      addMarkForm.addEventListener('submit', function(e) {
        e.preventDefault();
         const student = document.getElementById('student-select').value;
          const subject = document.getElementById('mark-subject').value;
        const value = document.getElementById('mark-value').value;
      if(student && subject && value){
         let marks = JSON.parse(localStorage.getItem('marks') || '[]');
            marks.push({
                student: student,
               subject: subject,
               value: value
            });
         localStorage.setItem('marks', JSON.stringify(marks));
       addMarkForm.reset();
          loadTeacherMarks();
      }
  });
}
  // Функция для заполнения select с учениками
 function populateStudentSelect() {
      if(studentSelect){
          const users = JSON.parse(localStorage.getItem('users') || '[]');
       users.forEach(user => {
            if(user.role === 'student'){
                 const option = document.createElement('option');
                  option.value = user.username;
                  option.textContent = user.username;
                studentSelect.appendChild(option);
           }
       });
      }

  }
  // Функция для загрузки домашнего задания
  function loadHomework(){
      const homeworks = JSON.parse(localStorage.getItem('homeworks') || '[]');
       if(homeworkList){
           homeworkList.innerHTML = '';
       }
      homeworks.forEach(homework => {
          const homeworkItem = document.createElement('div');
           homeworkItem.classList.add('homework-item');
          homeworkItem.innerHTML = `
               <h3>${homework.subject}</h3>
              <p>${homework.text}</p>
                <div class="files">
                 </div>
           `;
            const filesDiv = homeworkItem.querySelector('.files');
          if(homework.file) {
             homework.file.forEach(file => {
                  const fileLink = document.createElement('a');
                 fileLink.href = file.url;
                 fileLink.textContent = file.name;
                  filesDiv.appendChild(fileLink);
             });
         }
      if(homeworkList){
         homeworkList.appendChild(homeworkItem);
        }
     });
  }
  // Функция для загрузки домашнего задания ученика
function loadStudentHomework(){
  const homeworks = JSON.parse(localStorage.getItem('homeworks') || '[]');
     if(studentHomeworkTable){
        studentHomeworkTable.innerHTML = '';
      }
     homeworks.forEach(homework => {
        const row = document.createElement('tr');
         row.innerHTML = `
              <td>${homework.subject}</td>
             <td>${homework.text}</td>
         `;
       if(studentHomeworkTable){
          studentHomeworkTable.appendChild(row);
      }
    });
}
  // Функция для добавления домашнего задания
  if(homeworkForm){
      homeworkForm.addEventListener('submit', function(e) {
         e.preventDefault();
         const subject = document.getElementById('subject').value;
         const text = document.getElementById('homework-text').value;
        const fileInput = document.getElementById('homework-file');

        const files = [];
       if(fileInput.files && fileInput.files.length > 0) {
            for(let i=0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];
                  const reader = new FileReader();
                   reader.onload = function(e) {
                      files.push({
                           name: file.name,
                         url: e.target.result
                     });

                    let homeworks = JSON.parse(localStorage.getItem('homeworks') || '[]');
                    homeworks.push({
                       subject: subject,
                        text: text,
                       file: files
                   });
                 localStorage.setItem('homeworks', JSON.stringify(homeworks));
                     homeworkForm.reset();
                  loadHomework();
                 }
                  reader.readAsDataURL(file);
           }
        } else {
          let homeworks = JSON.parse(localStorage.getItem('homeworks') || '[]');
           homeworks.push({
                subject: subject,
               text: text,
                file: files
           });
            localStorage.setItem('homeworks', JSON.stringify(homeworks));
           homeworkForm.reset();
          loadHomework();
     }
  });
  }
    function loadChatContacts(){
         const users = JSON.parse(localStorage.getItem('users') || '[]');
      if(chatContacts){
         chatContacts.innerHTML = '';
      }
      users.forEach(user => {
         if(user.role === 'teacher'){
             const li = document.createElement('li');
             li.textContent = user.username;
            li.addEventListener('click', () => selectContact(user.username));
            if(chatContacts){
             chatContacts.appendChild(li)
              }
          }
      });
  }
  function loadChatContactsTeacher(){
     const users = JSON.parse(localStorage.getItem('users') || '[]');
    if(chatContactsTeacher){
      chatContactsTeacher.innerHTML = '';
    }
      users.forEach(user => {
         if(user.role === 'student'){
           const li = document.createElement('li');
           li.textContent = user.username;
           li.addEventListener('click', () => selectContactTeacher(user.username));
         if(chatContactsTeacher){
          chatContactsTeacher.appendChild(li)
         }
        }
      });
  }
 function selectContact(username) {
     currentRecipient = username;
      chatRecipient.textContent = username;
       loadMessages(username);

    const contacts = chatContacts.querySelectorAll('li');
      contacts.forEach(contact => contact.classList.remove('active'));
   const selectedContact = Array.from(contacts).find(contact => contact.textContent === username);
      if(selectedContact){
          selectedContact.classList.add('active');
       }

  }
   function selectContactTeacher(username) {
     currentRecipientTeacher = username;
     chatRecipientTeacher.textContent = username;
        loadMessagesTeacher(username);

        const contacts = chatContactsTeacher.querySelectorAll('li');
          contacts.forEach(contact => contact.classList.remove('active'));
     const selectedContact = Array.from(contacts).find(contact => contact.textContent === username);
     if(selectedContact){
        selectedContact.classList.add('active');
      }
   }
   function loadMessages(recipient) {
      if(messageArea){
        messageArea.innerHTML = '';
      }

      const messages = JSON.parse(localStorage.getItem('messages') || '[]');

       messages.forEach(message => {
          if((message.sender === username && message.recipient === recipient) || (message.sender === recipient && message.recipient === username)) {
             const messageDiv = document.createElement('div');
              messageDiv.textContent = message.text;
            messageDiv.classList.add('message', message.sender === username ? 'sent' : 'received');
               if(messageArea){
                 messageArea.appendChild(messageDiv);
              }
         }
     });
       messageArea.scrollTop = messageArea.scrollHeight;
}
  function loadMessagesTeacher(recipient) {
      if(messageAreaTeacher){
        messageAreaTeacher.innerHTML = '';
     }
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');

      messages.forEach(message => {
          if((message.sender === username && message.recipient === recipient) || (message.sender === recipient && message.recipient === username)) {
               const messageDiv = document.createElement('div');
                messageDiv.textContent = message.text;
            messageDiv.classList.add('message', message.sender === username ? 'sent' : 'received');
            if(messageAreaTeacher){
                 messageAreaTeacher.appendChild(messageDiv);
             }
          }
      });
     messageAreaTeacher.scrollTop = messageAreaTeacher.scrollHeight;
  }
 if(messageForm){
      messageForm.addEventListener('submit', function(e) {
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
          loadMessages(currentRecipient)
      }
  });
}

if(messageFormTeacher){
      messageFormTeacher.addEventListener('submit', function(e) {
          e.preventDefault();

        const text = document.getElementById('message-input-teacher').value;
       if(text && currentRecipientTeacher){
           let messages = JSON.parse(localStorage.getItem('messages') || '[]');
            messages.push({
                 sender: username,
                  recipient: currentRecipientTeacher,
                  text: text
            });
           localStorage.setItem('messages', JSON.stringify(messages));
           document.getElementById('message-input-teacher').value = '';
          loadMessagesTeacher(currentRecipientTeacher);
       }
    });
}

 function loadAffiche() {
   const afficheData = [
          {
              title: 'Новая выставка "Мир динозавров"',
              description: 'Приглашаем вас посетить новую выставку в городском музее...',
               date: '20.05.2024 - 20.06.2024'
          },
          {
              title: 'Премьера спектакля "Ромео и Джульетта"',
              description: 'Новая постановка в нашем городском театре...',
              date: '25.05.2024'
          },
            {
              title: 'Экскурсия по историческим местам',
               description: 'Прогулка по историческим местам города...',
                date: '25.05.2024'
          }
          // Добавьте больше мероприятий
   ];
       if(afficheList){
          afficheList.innerHTML = '';
       }
      afficheData.forEach(item => {
          const afficheItem = document.createElement('div');
          afficheItem.classList.add('affiche-item');
        afficheItem.innerHTML = `
              <h4>${item.title}</h4>
                <p>${item.description}</p>
                <p>${item.date}</p>
            `;
        if(afficheList){
          afficheList.appendChild(afficheItem);
        }
      });
  }


});