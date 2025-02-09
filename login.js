document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');

  const username = usernameInput.value;
  const password = passwordInput.value;

  let userRole;
  let userClass;
  let userLetter;

   // Проверяем, есть ли пользователь с таким логином и паролем в localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(user => user.username === username && user.password === password);

   if(user){
    userRole = user.role;
    userClass = user.class;
   userLetter = user.letter;
   } else {
      errorMessage.style.display = 'block';
      usernameInput.value = '';
      passwordInput.value = '';
    return;
  }

      // Сохраняем роль пользователя в localStorage
     localStorage.setItem('userRole', userRole);

  // Сохраняем имя пользователя в localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('class', userClass);
      localStorage.setItem('letter', userLetter);

     // Успешный вход, перенаправляем на страницу дневника (index.html)
      window.location.href = 'index.html';

});

  // Проверяем, есть ли пользователи в localStorage
  if (!localStorage.getItem('users')) {
   // Если нет, добавляем админа по умолчанию
      const defaultAdmin = {
          username: 'admin',
         password: '123',
        role: 'admin',
      };
    localStorage.setItem('users', JSON.stringify([defaultAdmin]));
}