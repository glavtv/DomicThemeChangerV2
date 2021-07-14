document.addEventListener ("DOMContentLoaded", load_layer);
var DTC_PORT = chrome.runtime.connect({name:"DTC_PORT"});

var core_default = {

	//Расширение (меню)
	"check_ext": true,                              //Кнопка-переключатель, расширение     
	"ext_theme": 1,                                 //Тема расширения 
	"ext_ver": 2.3,                                 //Версия расширения
  
	
	//Вкладка               
	"check_icon": true,                             //Кнопка-переключатель, иконка вкладки
	"check_title": true,                            //Кнопка-переключатель, название вкладки
	"check_theme": true,                            //Кнопка-переключатель, тема сайта
  
	"text_icon": "",                                //Текст, ссылка на иконку    
	"text_title": "",                               //Текст, название вкладки
	"text_theme": "",                               //Текст, ссылка на тему
  
	"switch_theme": 1,                              //Список, выбранная тема
  
  
	//Accent color
	"cpicker_r": 13,    
	"cpicker_g": 110,    
	"cpicker_b": 253,
	
  
	//Подложка
	"check_layer": true,                            //Кнопка-переключатель, подложка
	"text_loader": "",                              //Собственная gif-ка для загрузки
	"switch_loader": 1,                             //Список, выбранная тема
	"num_layer_delay": 1500,                        //Диапазон чисел, длительность перехода
	"num_layer_fadeout": 1000,                      //Диапазон чисел, длительность затухания
  
  
	//Анимации
	"menu_rgb": false,                              //Переливание цветов
	"menu_rotate_icon": false,                      //Крутящиеся иконки
  
  
	//Уведомления
	"notification_time_freq": 6.0,                  //частота оповещения
	"notification_days_before_deadline": 3,         //дней до деда
	"notification_repeat_max": 3,                   //кол-во повторений
  
  
	//Фиксы через скрипты
	"clean_demo": true,                             //Очищать поля DEMO
	"redirect_when_error": true                     //Если выкинуло из сессии переходить автоматически на главную
  };


DTC_PORT.onMessage.addListener(function(m) 
{
	UserData = m.greeting;
});

function load_layer() 
{
	console.log("{DTC V2: FI}: Started");

	DTC_PORT.onMessage.removeListener();

	var switch_val,
		switch_theme,
		loader_gif;
	
	if (UserData != null)
	{
		console.log("{DTC V2: FI}: User Data");
		if (UserData.check_ext == false)
		{
			return 0;
		}
		
		if (UserData.check_layer == false)
		{
			return 0;
		}

		switch_val = UserData.switch_loader;
		loader_gif = UserData.text_loader;
		switch_theme = UserData.switch_theme;
	}
	else
	{
		console.log("{DTC V2: FI}: Default");
		if (core_default.check_ext == false)
		{
			return 0;
		}
		
		if (core_default.check_layer == false)
		{
			return 0;
		}

		switch_val = core_default.switch_loader;
		loader_gif = core_default.text_loader;
		switch_theme = core_default.switch_theme;
	}

	var div = document.createElement('div');
		div.id = "DTC-Window";

	switch (parseInt(switch_theme, 10)) 
	{
		case 1:
		{
			div.className = "DTC-Window-light";
			break;
		}
		case 2:
		{
			div.className = "DTC-Window-dark";
			break;
		}	
		default:
		{
			if (switch_val == 1)
			{
				div.className = "DTC-Window-light";
			}
			else
			{
				div.className = "DTC-Window-dark";
			}
			break;
		}
	}

	
	
		
	if (loader_gif == "" || loader_gif == null)
	{
		div.innerHTML = "<div class=\"DTC-Window-Center\"> <img src=\"" + chrome.runtime.getURL("assets/icons/load.gif")+"\" alt=\"\"/> </div>";
	}
	else
	{
		div.innerHTML = "<div class=\"DTC-Window-Center\"> <img src=\"" + loader_gif + "\" alt=\"\"/> </div>";
	}
	
	document.body.prepend(div);
}