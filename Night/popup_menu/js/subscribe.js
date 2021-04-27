var isPushEnabled = false;
var useNotifications = false;

var permissionResult = null;

const askPermission = () => {
    return new Promise((resolve, reject) => {
      permissionResult = Notification.requestPermission((result) => {
        resolve(result)
      })
      if (permissionResult) {
        permissionResult.then(resolve, reject)
      }
    })
    .then((permissionResult) => {
      if (!("Notification" in window)) {
        alert("Этот браузер не поддерживет настольных уведомлений!");
      }
      if (permissionResult == 'granted') 
      {
        $( "#modalLabel" ).text( "Успешно!" );
        $( "#modalBody" ).text( "Вы уже подписаны на уведомления о предстоящих дедлайнах, больше нажимать не нужно." );
        $( "#modal" ).fadeIn( "slow" );
        $( "#black-bg" ).fadeIn( "slow" );
      }
      else
      {
        $( "#modalLabel" ).text( "Подтверждение" );
        $( "#modalBody" ).text( "Требуется нажать кнопку \"Разрешить уведомления\" в панели \"Информация о сайте\" (Находится рядом с адресной строкой)." );
        $( "#modal" ).fadeIn( "slow" );
        $( "#black-bg" ).fadeIn( "slow" );
      }
    })
}

$(document).ready(function() 
{

  $('#subscribe').on('click', function(e)
	{
    askPermission();
    console.log( permissionResult );

  });

  $('#modalClose').on('click', function(e)
	{
    $( "#modal" ).fadeOut( "slow" );
    $( "#black-bg" ).fadeOut( "slow" );
  });

  $(document).keyup(function(e) 
	{
		if (e.keyCode === 46) {
			deadline_checker();
		}
	});

});