document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    const userList = document.getElementById('user-list');
    const addUserForm = document.getElementById('add-user-form');
    const logoutButton = document.getElementById('logoutButton');
    const navigationMenu = document.querySelector('aside nav ul');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const editUserModal = document.getElementById('edit-user-modal');
    const closeButton = document.querySelectorAll('.modal .close-button'); // Исправление
    const editUserForm = document.getElementById('edit-user-form');
    const newClassSelect = document.getElementById('new-user-class');
    const newLetterSelect = document.getElementById('new-user-letter');
    const editClassSelect = document.getElementById('edit-user-class');
    const editLetterSelect = document.getElementById('edit-user-letter');
    const newStudentFields = document.querySelectorAll('#add-user-form .student-fields');
    const editStudentFields = document.querySelectorAll('#edit-user-form .student-fields');
    const addScheduleForm = document.getElementById('add-schedule-form');
    const scheduleList = document.getElementById('schedule-list');
    const editScheduleModal = document.getElementById('edit-schedule-modal');
    const closeScheduleButton = document.querySelector('#edit-schedule-modal .close-button');
    const editScheduleForm = document.getElementById('edit-schedule-form');
    const newScheduleClassSelect = document.getElementById('new-schedule-class');
    const newScheduleLetterSelect = document.getElementById('new-schedule-letter');
    const editScheduleClassSelect = document.getElementById('edit-schedule-class');
    const editScheduleLetterSelect = document.getElementById('edit-schedule-letter');
    const newScheduleDaySelect = document.getElementById('new-schedule-day');
    const editScheduleDaySelect = document.getElementById('edit-schedule-day');
    const userSearch = document.getElementById('user-search');
    const addAfficheForm = document.getElementById('add-affiche-form');
    const afficheListAdmin = document.getElementById('affiche-list-admin');
    const editAfficheModal = document.getElementById('edit-affiche-modal');
    const closeAfficheButton = document.querySelector('#edit-affiche-modal .close-button');
    const editAfficheForm = document.getElementById('edit-affiche-form');

   const scheduleClassFilter = document.getElementById('schedule-class-filter');
    const scheduleDayFilter = document.getElementById('schedule-day-filter');

    userNameDisplay.textContent = username;

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

    // Проверяем, если пользователь не админ, перенаправляем на страницу входа
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        window.location.href = 'login.html';
    }

    // Выход из админки
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    });

    // Функция для загрузки пользователей
    function loadUsers() {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        // Apply filtering here
        let filteredUsers = users;
        const searchTerm = userSearch.value.toLowerCase();
        if (searchTerm) {
            filteredUsers = users.filter(user => {
                return user.username.toLowerCase().includes(searchTerm);
            });
        }
        userList.innerHTML = '';
        filteredUsers.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>${user.class || '—'} ${user.letter || '—'}</td>
                <td>
                    <button class="edit-user" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="delete-user" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            userList.appendChild(row);
        });

        // Обработчик удаления пользователя
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteUser(index);
            });
        });

        // Обработчик редактирования пользователя
        document.querySelectorAll('.edit-user').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                openEditModal(index);
            });
        });
    }

    // Функция для добавления пользователя
    addUserForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;
        const newUserRole = document.getElementById('new-user-role').value;
        const newUserClass = document.getElementById('new-user-class').value;
        const newUserLetter = document.getElementById('new-user-letter').value;

        if (newUsername && newPassword) {
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push({
                username: newUsername,
                password: newPassword,
                role: newUserRole,
                class: newUserClass,
                letter: newUserLetter
            });
            localStorage.setItem('users', JSON.stringify(users));
            addUserForm.reset();
            loadUsers();
        }
    });

    // Функция для удаления пользователя
    function deleteUser(index) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    }

    // Функция для открытия модального окна редактирования
    function openEditModal(index) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users[index];
        document.getElementById('edit-user-index').value = index;
        document.getElementById('edit-username').value = user.username;
        document.getElementById('edit-password').value = user.password;
        document.getElementById('edit-user-role').value = user.role;
        document.getElementById('edit-user-class').value = user.class;
        document.getElementById('edit-user-letter').value = user.letter;

        editUserModal.style.display = 'flex';
        updateStudentFieldsVisibility('edit');
    }

    // Функция для обработки сохранения изменений пользователя
    editUserForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const index = document.getElementById('edit-user-index').value;
        const newUsername = document.getElementById('edit-username').value;
        const newPassword = document.getElementById('edit-password').value;
        const newUserRole = document.getElementById('edit-user-role').value;
        const newUserClass = document.getElementById('edit-user-class').value;
        const newUserLetter = document.getElementById('edit-user-letter').value;

        let users = JSON.parse(localStorage.getItem('users') || '[]');

        if (newUsername && newPassword) {
            users[index] = {
                username: newUsername,
                password: newPassword,
                role: newUserRole,
                class: newUserClass,
                letter: newUserLetter
            };
            localStorage.setItem('users', JSON.stringify(users));
            editUserModal.style.display = 'none';
            loadUsers();
        }
    });

    // Функция для показа/скрытия полей для класса и буквы
    function updateStudentFieldsVisibility(type) {
        let role, fields;
        if (type === 'add') {
            role = document.getElementById('new-user-role').value;
            fields = newStudentFields;
        } else {
            role = document.getElementById('edit-user-role').value;
            fields = editStudentFields;
        }

        if (role === 'student') {
            fields.forEach(field => field.style.display = 'block');
        } else {
            fields.forEach(field => field.style.display = 'none');
        }
    }

    //Обновление видимости полей при изменении роли пользователя
    document.getElementById('new-user-role').addEventListener('change', function() {
        updateStudentFieldsVisibility('add');
    });

    // Добавляем option для выбора класса
  function populateClassFilter() {
        const classes = ['Все','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
        classes.forEach(cls => {
           const option = document.createElement('option');
                option.value = cls;
                option.textContent = cls === 'Все' ? 'Все классы' : `Класс ${cls}`;
               scheduleClassFilter.appendChild(option);
        });
   }

    // Добавляем option для выбора дня недели
  function populateDayFilter() {
        const days = ['Все','Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
        days.forEach(day => {
           const option = document.createElement('option');
                option.value = day;
                option.textContent = day === 'Все' ? 'Все дни' : day;
               scheduleDayFilter.appendChild(option);
        });
   }

    //Загрузка расписания
   function loadSchedule() {
        let schedule = JSON.parse(localStorage.getItem('schedule') || '[]');
       const selectedClass = scheduleClassFilter.value;
        const selectedDay = scheduleDayFilter.value;

       let filteredSchedule = schedule;

      if (selectedClass !== 'Все') {
            filteredSchedule = filteredSchedule.filter(lesson => lesson.class === selectedClass);
        }

        if (selectedDay !== 'Все') {
            filteredSchedule = filteredSchedule.filter(lesson => lesson.day === selectedDay);
        }

        if (scheduleList) {
            scheduleList.innerHTML = '';
        }
        filteredSchedule.forEach((lesson, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lesson.subject}</td>
                <td>${lesson.teacher}</td>
                <td>${lesson.startTime}</td>
                <td>${lesson.endTime}</td>
                <td>${lesson.day}</td>
                <td>${lesson.class} ${lesson.letter}</td>
                <td>
                    <button class="edit-schedule" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="delete-schedule" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            if (scheduleList) {
                scheduleList.appendChild(row);
            }
        });

      // Обработчики событий для кнопок (delete, edit) - остаются без изменений
        document.querySelectorAll('.delete-schedule').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteSchedule(index);
            });
        });
        document.querySelectorAll('.edit-schedule').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                openEditScheduleModal(index);
            });
        });
    }

   // События для фильтров
    scheduleClassFilter.addEventListener('change', loadSchedule);
   scheduleDayFilter.addEventListener('change', loadSchedule);

    // Функция для добавления урока
    addScheduleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newSubject = document.getElementById('new-schedule-subject').value;
        const newTeacher = document.getElementById('new-schedule-teacher').value;
        const newStartTime = document.getElementById('new-schedule-start-time').value;
        const newEndTime = document.getElementById('new-schedule-end-time').value;
        const newClass = document.getElementById('new-schedule-class').value;
        const newLetter = document.getElementById('new-schedule-letter').value;
        const newDay = document.getElementById('new-schedule-day').value;

        if (newSubject && newTeacher && newStartTime && newEndTime && newDay) {
            let schedule = JSON.parse(localStorage.getItem('schedule') || '[]');
            schedule.push({
                subject: newSubject,
                teacher: newTeacher,
                startTime: newStartTime,
                endTime: newEndTime,
                class: newClass,
                letter: newLetter,
                day: newDay
            });
            localStorage.setItem('schedule', JSON.stringify(schedule));
            addScheduleForm.reset();
            loadSchedule();
        }
    });

    // Функция для удаления урока
    function deleteSchedule(index) {
        let schedule = JSON.parse(localStorage.getItem('schedule') || '[]');
        schedule.splice(index, 1);
        localStorage.setItem('schedule', JSON.stringify(schedule));
        loadSchedule();
    }

    // Функция для открытия модального окна редактирования урока
    function openEditScheduleModal(index) {
        let schedule = JSON.parse(localStorage.getItem('schedule') || '[]');
        const lesson = schedule[index];
        document.getElementById('edit-schedule-index').value = index;
        document.getElementById('edit-schedule-subject').value = lesson.subject;
        document.getElementById('edit-schedule-teacher').value = lesson.teacher;
        document.getElementById('edit-schedule-start-time').value = lesson.startTime;
        document.getElementById('edit-schedule-end-time').value = lesson.endTime;
        document.getElementById('edit-schedule-class').value = lesson.class;
        document.getElementById('edit-schedule-letter').value = lesson.letter;
        document.getElementById('edit-schedule-day').value = lesson.day;
        editScheduleModal.style.display = 'flex';
    }

    // Функция для обработки сохранения изменений урока
    editScheduleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const index = document.getElementById('edit-schedule-index').value;
        const newSubject = document.getElementById('edit-schedule-subject').value;
        const newTeacher = document.getElementById('edit-schedule-teacher').value;
        const newStartTime = document.getElementById('edit-schedule-start-time').value;
        const newEndTime = document.getElementById('edit-schedule-end-time').value;
        const newClass = document.getElementById('edit-schedule-class').value;
        const newLetter = document.getElementById('edit-schedule-letter').value;
        const newDay = document.getElementById('edit-schedule-day').value;

        let schedule = JSON.parse(localStorage.getItem('schedule') || '[]');

        if (newSubject && newTeacher && newStartTime && newEndTime && newDay) {
            schedule[index] = {
                subject: newSubject,
                teacher: newTeacher,
                startTime: newStartTime,
                endTime: newEndTime,
                class: newClass,
                letter: newLetter,
                day: newDay
            };
            localStorage.setItem('schedule', JSON.stringify(schedule));
            editScheduleModal.style.display = 'none';
            loadSchedule();
        }
    });

    // Функция для загрузки афиши
    function loadAfficheAdmin() {
        let affiche = JSON.parse(localStorage.getItem('affiche') || '[]');
        if (afficheListAdmin) {
            afficheListAdmin.innerHTML = '';
        }
        affiche.forEach((event, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.title}</td>
                <td>${event.description}</td>
                <td>${event.date}</td>
                <td>
                    <button class="edit-affiche" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="delete-affiche" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            if (afficheListAdmin) {
                afficheListAdmin.appendChild(row);
            }
        });

        // Обработчик удаления мероприятия
        document.querySelectorAll('.delete-affiche').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                deleteAffiche(index);
            });
        });

        // Обработчик редактирования мероприятия
        document.querySelectorAll('.edit-affiche').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                openEditAfficheModal(index);
            });
        });
    }

    // Функция для добавления мероприятия
    addAfficheForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newTitle = document.getElementById('new-affiche-title').value;
        const newDescription = document.getElementById('new-affiche-description').value;
        const newDate = document.getElementById('new-affiche-date').value;

        if (newTitle && newDescription && newDate) {
            let affiche = JSON.parse(localStorage.getItem('affiche') || '[]');
            affiche.push({
                title: newTitle,
                description: newDescription,
                date: newDate
            });
            localStorage.setItem('affiche', JSON.stringify(affiche));
            addAfficheForm.reset();
            loadAfficheAdmin();
        }
    });

    // Функция для удаления мероприятия
    function deleteAffiche(index) {
        let affiche = JSON.parse(localStorage.getItem('affiche') || '[]');
        affiche.splice(index, 1);
        localStorage.setItem('affiche', JSON.stringify(affiche));
        loadAfficheAdmin();
    }

    // Функция для открытия модального окна редактирования
    function openEditAfficheModal(index) {
        let affiche = JSON.parse(localStorage.getItem('affiche') || '[]');
        const event = affiche[index];
        document.getElementById('edit-affiche-index').value = index;
        document.getElementById('edit-affiche-title').value = event.title;
        document.getElementById('edit-affiche-description').value = event.description;
        document.getElementById('edit-affiche-date').value = event.date;
        editAfficheModal.style.display = 'flex';
    }

    // Функция для обработки сохранения изменений
    editAfficheForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const index = document.getElementById('edit-affiche-index').value;
        const newTitle = document.getElementById('edit-affiche-title').value;
        const newDescription = document.getElementById('edit-affiche-description').value;
        const newDate = document.getElementById('edit-affiche-date').value;

        let affiche = JSON.parse(localStorage.getItem('affiche') || '[]');

        if (newTitle && newDescription && newDate) {
            affiche[index] = {
                title: newTitle,
                description: newDescription,
                date: newDate
            };
            localStorage.setItem('affiche', JSON.stringify(affiche));
            editAfficheModal.style.display = 'none';
            loadAfficheAdmin();
        }
    });

    const observer = new MutationObserver(function(mutations) {
        const allElementsExist = newClassSelect &&
            newLetterSelect &&
            editClassSelect &&
            editLetterSelect &&
            newScheduleClassSelect &&
            newScheduleLetterSelect &&
            editScheduleClassSelect &&
            editScheduleLetterSelect;

        if (allElementsExist) {
            populateClassAndLetters();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function populateClassAndLetters() {
        if (newClassSelect && newLetterSelect && editClassSelect && editLetterSelect && newScheduleClassSelect && newScheduleLetterSelect && editScheduleClassSelect && editScheduleLetterSelect) {
            const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
            const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е'];

            // Очищаем выпадающие списки
            newClassSelect.innerHTML = '<option value="">-- Выберите класс --</option>';
            newLetterSelect.innerHTML = '<option value="">-- Выберите букву --</option>';
            editClassSelect.innerHTML = '<option value="">-- Выберите класс --</option>';
            editLetterSelect.innerHTML = '<option value="">-- Выберите букву --</option>';
            newScheduleClassSelect.innerHTML = '<option value="">-- Выберите класс --</option>';
            newScheduleLetterSelect.innerHTML = '<option value="">-- Выберите букву --</option>';
            editScheduleClassSelect.innerHTML = '<option value="">-- Выберите класс --</option>';
            editScheduleLetterSelect.innerHTML = '<option value="">-- Выберите букву --</option>';

            classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls;
                option.textContent = cls;
                newClassSelect.appendChild(option);

                const optionEdit = document.createElement('option');
                optionEdit.value = cls;
                optionEdit.textContent = cls;
                editClassSelect.appendChild(optionEdit);

                const optionSchedule = document.createElement('option');
                optionSchedule.value = cls;
                optionSchedule.textContent = cls;
                newScheduleClassSelect.appendChild(optionSchedule);

                const optionEditSchedule = document.createElement('option');
                optionEditSchedule.value = cls;
                optionEditSchedule.textContent = cls;
                editScheduleClassSelect.appendChild(optionEditSchedule);
            });

            letters.forEach(letter => {
                const option = document.createElement('option');
                option.value = letter;
                option.textContent = letter;
                newLetterSelect.appendChild(option);

                const optionEdit = document.createElement('option');
                optionEdit.value = letter;
                optionEdit.textContent = letter;
                editLetterSelect.appendChild(optionEdit);

                const optionSchedule = document.createElement('option');
                optionSchedule.value = letter;
                optionSchedule.textContent = letter;
                newScheduleLetterSelect.appendChild(optionSchedule);

                const optionEditSchedule = document.createElement('option');
                optionEditSchedule.value = letter;
                optionEditSchedule.textContent = letter;
                editScheduleLetterSelect.appendChild(optionEditSchedule);
            });
        }
    }
   // Закрытие модальных окон
   closeButton.forEach(button => {
        button.addEventListener('click', function() {
           this.closest('.modal').style.display = 'none';
       });
   });

      // Заполнение фильтров при загрузке страницы
    function populateClassFilter() {
        const classes = ['Все', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
       classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls;
           option.textContent = cls === 'Все' ? 'Все классы' : `Класс ${cls}`;
            scheduleClassFilter.appendChild(option);
       });
  }

    // Добавляем option для выбора дня недели
   function populateDayFilter() {
       const days = ['Все', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
        days.forEach(day => {
             const option = document.createElement('option');
             option.value = day;
             option.textContent = day === 'Все' ? 'Все дни' : day;
             scheduleDayFilter.appendChild(option);
        });
    }

    // События для фильтров
     scheduleClassFilter.addEventListener('change', loadSchedule);
     scheduleDayFilter.addEventListener('change', loadSchedule);

      // Заполнение фильтров при загрузке страницы
    populateClassFilter();
    populateDayFilter();
    loadUsers();
    loadSchedule();
    loadAfficheAdmin();
});