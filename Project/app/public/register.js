$(document).ready(function() {
  // Función para mostrar el mensaje de error
  function showError(message) {
    $('#errorMessage').text(message).show();
  }

  $('#registerForm').submit(function(e) {
    e.preventDefault();

    const username = $('#registerUsername').val();
    const password = $('#registerPassword').val();
    const confirmPassword = $('#confirmPassword').val();

    // Validar las contraseñas
    if (password !== confirmPassword) {
      showError('Las contraseñas no coinciden.');
      return;
    }

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/register',
      contentType: 'application/json',
      data: JSON.stringify({ username, password }),
      success: function(response) {
        console.log('Usuario registrado exitosamente:', response.user);
        // Puedes redirigir a la página de inicio de sesión u otra página si lo prefieres
        window.location.href = '/login';
      },
      error: function(error) {
        console.error('Error al registrar el usuario:', error.responseJSON.error);
        showError('Error al registrar el usuario. Por favor, intenta nuevamente.');
      }
    });
  });
});
