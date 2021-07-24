var core_default = {

	//Расширение (меню)
	"check_ext": true,                              //Кнопка-переключатель, расширение     
	"ext_theme": 1,                                 //Тема расширения 
	"ext_ver": 2.39,                                //Версия расширения
  
	
	//Вкладка               
	"check_icon": true,                             //Кнопка-переключатель, иконка вкладки
	"check_title": true,                            //Кнопка-переключатель, название вкладки
	"check_theme": true,                            //Кнопка-переключатель, тема сайта
  
	"text_icon": "",                                //Текст, ссылка на иконку    
	"text_title": "",                               //Текст, название вкладки
	"text_theme": "",                               //Текст, ссылка на тему
  
	"switch_theme": 1,                              //Список, выбранная тема
  
	"check_auto_login": false,				        //Автоматический вход
	"text_user_login": null,
	"text_user_password": null,


    //Кастомизация вкладки
	"check_new_navbar": true,				        //Шапка на сайте заместо боковой авторизации
    "check_new_login_page": true,				    //Новая страница авторизации
    "check_new_error_page": true,				    //Новая страница при ошибке
    "check_new_show_score": true,				    //Отображение оценки в 100 бальной системе, не полосочками
    "check_theme_sync_accent_color": true,			//Accent color on domic.isu.ru
  

	//Accent color
    "check_accent_color_on_inputs": true,			//Accent color на полях для ввода (или стандартный)
	"cpicker_r": 13,    
	"cpicker_g": 110,    
	"cpicker_b": 253,
	
  
	//Подложка
	"check_layer": true,                            //Кнопка-переключатель, подложка
	"text_loader": "",                              //Собственная gif-ка для загрузки
	"switch_loader": 1,                             //Список, выбранная тема
	"num_layer_delay": 800,                         //Диапазон чисел, длительность перехода
	"num_layer_fadeout": 500,                       //Диапазон чисел, длительность затухания
  
  
	//Анимации
	"menu_rgb": false,                              //Переливание цветов
  
  
	//Уведомления
	"notification_time_freq": 6,                    //частота оповещения
	"notification_days_before_deadline": 3,         //дней до деда
	"notification_repeat_max": 3,                   //кол-во повторений
  
  
	//Фиксы через скрипты
	"clean_demo": true,                             //Очищать поля DEMO
	"redirect_when_error": true                     //Если выкинуло из сессии переходить автоматически на главную
};

var ruleToBlock = 'input:not(#check_ext), select, button';


preLoadStart();
function preLoadStart()
{
    var data_ = JSON.parse(localStorage.getItem('DTC'));
    var pl = document.getElementById("preLoad");
    
	if (data_ != null)
    {
        if ( data_.switch_theme == 2 || (data_.switch_theme > 2 && data_.ext_theme == 2) )
        {
            pl.classList.toggle("pl-dark");
        }
        else
        {
            pl.classList.toggle("pl-light");
        }
    }
    else
    {
        pl.classList.toggle("pl-light");
    }
}


$(document).ready(function() 
{

    //Страница подписки на уведомления
    $('a[rel=external]').attr('href', chrome.runtime.getURL("popup_menu/subscribe_page.html"));

    load();

    $('#Main-Head > div').on('click', function(e)
	{
        if ( $(this).attr('id') != '#Head-Selected-Block' )
        {

            $("#Head-Selected-Block").removeAttr("id");
            $(this).attr('id', 'Head-Selected-Block');


            $('#Main-Body > section').css( 'display', 'none' );                 //Скрываем все слои
            $('#Menu-' + $( this ).index()).css( 'display', ''  );              //Отображаем выбранный слой

            if ($( this ).index() != 0)
            {
                $('#Main-Body').css( 'padding-right', '30px' );
            }
            else
            {
                $('#Main-Body').css( 'padding-right', '' );
            }
        }
	});

    $('#clearAuthData').on('click', function(e)
	{
        core_default.text_user_login = null;
        core_default.text_user_password = null;
        save();
        $('#text_user_login').attr("placeholder", "Пусто");
        $('#text_user_password').attr("placeholder", "Пусто");
    });

    $(document).on("input",function(ev){
        save();
    });

    $('#text_user_login').focusout(function() 
    {
        if (core_default.text_user_login != "" && core_default.text_user_login != null)
        {
            $('#text_user_login').attr("placeholder", "Задано");
            $('#text_user_login').val("");
        }
    });
    $('#text_user_password').focusout(function() 
    {
        if (core_default.text_user_password != "" && core_default.text_user_password != null)
        {
            $('#text_user_password').attr("placeholder", "Задано");
            $('#text_user_password').val("");
        }
    });

});

function accent_text()
{
    $( "#accent_text" ).text('Accent Color ('+ core_default.cpicker_r +'; '+ core_default.cpicker_g +'; '+ core_default.cpicker_b +')');
    
    accent_on_inputs();
    accent_apply();
}

function num_text()
{
    $( "#num_text_delay" ).text('Длительность подложки ('+ core_default.num_layer_delay +'мс)');
    $( "#num_text_fadeout" ).text('Длительность затухания ('+ core_default.num_layer_fadeout +'мс)');
    $( "#notification_repeat_max_text" ).text( 'Количество повторов уведомлений на дедлайн ('+core_default.notification_repeat_max +') ');

    
    $( "#notification_days_before_deadline_text" ).text( 'Информировать за '+ core_default.notification_days_before_deadline +' ' + ( (core_default.notification_days_before_deadline == 1 || core_default.notification_days_before_deadline == 21) ? "сутки" : "суток") + ' до дедлайна ' );

    var hours_ = "";
    var word = "";
    if (core_default.notification_time_freq == 1 || core_default.notification_time_freq == 21)
    {
        hours_ = "час";
        word = "Каждый";
    }
    else if ( (core_default.notification_time_freq > 1 && core_default.notification_time_freq <= 4) || core_default.notification_time_freq >= 22)
    {
        hours_ = "часа";
        word = "Каждые";
    }
    else
    {
        hours_ = "часов";
        word = "Каждые";
    }
    $("#notification_time_freq_text").text('Частота показа уведомлений (' + word + ' '+ core_default.notification_time_freq +' ' + hours_ +')');
}

function accent_apply()
{
    $("head #menuStyle").remove();

    var r = core_default.cpicker_r,
        g = core_default.cpicker_g,
        b = core_default.cpicker_b;

        if ( core_default.switch_theme == 2 || (core_default.switch_theme > 2 && core_default.ext_theme == 2) )
        {
            //тёмная тема
            if ( (parseInt(r, 10) + parseInt(g, 10) + parseInt(b, 10)) <= 180)
            {
                r = 90;
                g = 90;
                b = 90;
            }
        }
        else
        {
            //светлая тема
            if ( (parseInt(r, 10) + parseInt(g, 10) + parseInt(b, 10)) >= 615 )
            {
                r = 205;
                g = 205;
                b = 205;
            }
        }



    var new_style = ""

    + "#Main-Head"
    + "{"
    + "border-bottom: " + '2px solid rgb('+ r +', '+ g +', '+ b +');'
    + "}"

    + "#Main-Head > #Head-Selected-Block > svg"
    + "{"
    + "stroke: " + 'rgb('+ r +', '+ g +', '+ b +');'
    + "fill: " + 'rgb('+ r +', '+ g +', '+ b +');'
    + "}"
    
    ;

    $('head').append('<style id="menuStyle" type="text/css">'+new_style+'</style>');
}

function menu_animation_apply()
{
    var style_part_rgb = ""
    + "#Main-Head"
    + "{"
    + "animation-name: " + 'BottomBorderRGB;'
    + "animation-duration: " + '15s;'
    + "animation-timing-function: " + 'linear;'
    + "animation-delay: " + '0ms;'
    + "animation-iteration-count: " + 'infinite;'
    + "}"

    + "#Main-Head > div > svg"
    + "{"
    + "animation-name: " + 'RGBSVG;'
    + "animation-duration: " + '15s;'
    + "animation-timing-function: " + 'linear;'
    + "animation-delay: " + '0ms;'
    + "animation-iteration-count: " + 'infinite;'
    + "}"
    ;

    var style_part_rgb_fix = ""
    + "#Main-Head > div:not(#Head-Selected-Block) > svg"
    + "{"
    + "stroke: " + 'var(--h-selector-def) !important;'
    + "fill: " + 'var(--h-selector-def) !important;'
    + "}"
    ;

    
    if (core_default.menu_rgb == true)
    { 
        $('head').append('<style id="menuRGB" type="text/css">'+style_part_rgb+'</style>');
        $('head').append('<style id="RGBFix" type="text/css">'+style_part_rgb_fix+'</style>');
        
    }
    else
    {
        $("head #menuRGB").remove();
        setTimeout( () => 
        {
            $("head #RGBFix").remove();
        }, 500);
    }
}

function load()
{
    //Работает с основными данными
    loadUD();

    //Применяем тему настроек
    ext_theme_change();

    //Меняем текст по умолчанию
    accent_text();
    num_text();

    //Анимации меню настроек
    menu_animation_apply();


    setTimeout( () => 
    {
        $("#preLoad").fadeOut(300, function()
        {
            $("#preLoad").remove();
        });
    }, 150 )
    
}

function refresh()
{
    core_default.check_ext = ($('#check_ext').is(":checked")) ? true : false;
    core_default.check_ext == false ? ext_disable() : ext_enable();

    core_default.check_icon = ($('#check_icon').is(":checked")) ? true : false;
    core_default.check_title = ($('#check_title').is(":checked")) ? true : false;
    core_default.check_theme = ($('#check_theme').is(":checked")) ? true : false;
    core_default.check_layer = ($('#check_layer').is(":checked")) ? true : false;

    core_default.menu_rgb = ($('#menu_rgb').is(":checked")) ? true : false;

    core_default.text_icon = $('#text_icon').val();
    core_default.text_title = $('#text_title').val();
    core_default.text_theme = $('#text_theme').val();
	core_default.text_loader = $('#text_loader').val();

    core_default.switch_loader = $('#switch_loader').val();
    core_default.switch_theme = $('#switch_theme').val();
    core_default.ext_theme = $('#ext_theme').val();

    core_default.cpicker_r = $('#cpicker_r').val();
    core_default.cpicker_g = $('#cpicker_g').val();
    core_default.cpicker_b = $('#cpicker_b').val();

    core_default.num_layer_delay = $('#num_layer_delay').val();
    core_default.num_layer_fadeout = $('#num_layer_fadeout').val();

    core_default.notification_days_before_deadline = $('#notification_days_before_deadline').val();
    core_default.notification_repeat_max = $('#notification_repeat_max').val();
    core_default.notification_time_freq = $('#notification_time_freq').val();

    core_default.clean_demo = ($('#clean_demo').is(":checked")) ? true : false;
    core_default.redirect_when_error = ($('#redirect_when_error').is(":checked")) ? true : false;
    
    core_default.check_auto_login = ($('#check_auto_login').is(":checked")) ? true : false;
    core_default.check_new_navbar = ($('#check_new_navbar').is(":checked")) ? true : false;

    if ($('#text_user_login').val() != "" && $('#text_user_login').val() != null && $('#text_user_login').val() != undefined)
    {
        core_default.text_user_login = window.btoa($('#text_user_login').val());
    }

    if ($('#text_user_password').val() != "" && $('#text_user_password').val() != null && $('#text_user_password').val() != undefined)
    {
        core_default.text_user_password = window.btoa($('#text_user_password').val());
    }

    console.log("[DTC V2: Core]: Updated");
}

function save()
{
    refresh();
    num_text();
    ext_theme_change();
    accent_text();
    menu_animation_apply();

    localStorage.setItem('DTC', JSON.stringify(core_default));
    console.log("[DTC V2: Core]: Saved");
}

function loadUD()
{
    Data = JSON.parse(localStorage.getItem('DTC'));

	if (Data != null && Data.ext_ver == core_default.ext_ver)
	{
        $('#check_ext').prop('checked', Data.check_ext);
        $('#check_icon').prop('checked', Data.check_icon);
        $('#check_title').prop('checked', Data.check_title);
        $('#check_theme').prop('checked', Data.check_theme);
        $('#check_layer').prop('checked', Data.check_layer);

        $('#menu_rgb').prop('checked', Data.menu_rgb);
        $('#menu_rotate_icon').prop('checked', Data.menu_rotate_icon);

        $('#text_icon').val(Data.text_icon);
        $('#text_title').val(Data.text_title);
        $('#text_theme').val(Data.text_theme);
		$('#text_loader').val(Data.text_loader);

        $('#switch_theme').val(Data.switch_theme);
        $('#switch_loader').val(Data.switch_loader);
        $('#ext_theme').val(Data.ext_theme);

        $('#cpicker_r').val(Data.cpicker_r);
        $('#cpicker_g').val(Data.cpicker_g);
        $('#cpicker_b').val(Data.cpicker_b);

        $('#num_layer_delay').val(Data.num_layer_delay);
        $('#num_layer_fadeout').val(Data.num_layer_fadeout);

        $('#notification_days_before_deadline').val(Data.notification_days_before_deadline);
        $('#notification_repeat_max').val(Data.notification_repeat_max);
        $('#notification_time_freq').val(Data.notification_time_freq);

        $('#clean_demo').prop('checked', Data.clean_demo);
        $('#redirect_when_error').prop('checked', Data.redirect_when_error);

        $('#check_auto_login').prop('checked', Data.check_auto_login);
        $('#check_new_navbar').prop('checked', Data.check_new_navbar);

        if (Data.text_user_login != "" && Data.text_user_login != null)
        {
            core_default.text_user_login = Data.text_user_login;
            $('#text_user_login').attr("placeholder", "Задано");
        }
    
        if (Data.text_user_password != "" && Data.text_user_password != null)
        {
            core_default.text_user_password = Data.text_user_password;
            $('#text_user_password').attr("placeholder", "Задано");
        }

        console.log("[DTC V2: Core] Loaded");

        refresh();
	}
	else
	{
		localStorage.setItem('DTC', JSON.stringify(core_default));
        console.log("[DTC V2: Core]: First Save");

        load();
	}
}

function ext_disable()
{
    $(ruleToBlock).each(function() {
        $(this).attr('disabled', "yes");
    });

    $('a[rel="external"]').css("pointer-events", "none");
}

function ext_enable()
{
    accent_apply();

    $(ruleToBlock).each(function() {
        $(this).removeAttr('disabled');
    });

    $('a[rel="external"]').css("pointer-events", "");
}

function ext_theme_change()
{
    switch (parseInt(core_default.switch_theme, 10)) 
    {
        //TODO: Инжект тёмной темы отдельно, а не поверх всего
        case 1:
        {
            if ( $('#MenuLight').length < 1 )
            {
                document.getElementsByTagName("head")[0].insertAdjacentHTML(
                "beforeend",
                "<link id=\"MenuLight\" rel=\"stylesheet\" href=\"css/MenuLight.css\" />");
            }

            $('#switch_loader').attr('disabled', "yes");
            $('#ext_theme').attr('disabled', "yes");

            $('#MenuDark').remove();
            break;
        }
        case 2:
        {
            if ( $('#MenuDark').length < 1 )
            {
                document.getElementsByTagName("head")[0].insertAdjacentHTML(
                "beforeend",
                "<link id=\"MenuDark\" rel=\"stylesheet\" href=\"css/MenuDark.css\" />");
            }

            $('#switch_loader').attr('disabled', "yes");
            $('#ext_theme').attr('disabled', "yes");

            $('#MenuLight').remove();
            break;
        }
        default:
        {
        

            $('#switch_loader').removeAttr('disabled');
            $('#ext_theme').removeAttr('disabled');
            break;
        }
    } 
}

function accent_on_inputs()
{
    $("head #accentInput").remove();

    var r = core_default.cpicker_r,
        g = core_default.cpicker_g,
        b = core_default.cpicker_b,
        new_style = "";

   

    if ( core_default.switch_theme == 2 || (core_default.switch_theme > 2 && core_default.ext_theme == 2) )
    {
        //тёмная тема

        if ( (parseInt(r, 10) + parseInt(g, 10) + parseInt(b, 10)) <= 180)
        {
            r = 90;
            g = 90;
            b = 90;
        }

        new_style += ""

        + ".form-switch .form-check-input:checked, .form-switch .form-check-input:focus:checked"
        + "{"
        + "background-image: " + "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%"+"0"+"'/%3e%3c/svg%3e\")"
        + "}"

        + ".form-check-input:not(:checked)"
        + "{"
        + "background-color: " + 'rgb(255, 255, 255);'
        + "}"

        + ".form-switch .form-check-input:not(:checked)"
        + "{"
        + "background-image: " + "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='"+"rgba("+0+","+0+","+0+", .5)"+"'/%3e%3c/svg%3e\")"
        + "}"

        ;
    }
    else
    {
        //светлая тема

        if ( (parseInt(r, 10) + parseInt(g, 10) + parseInt(b, 10)) >= 615 )
        {
            r = 205;
            g = 205;
            b = 205;
        }
        
        new_style += ""
           
        + ".form-switch .form-check-input:not(:checked)"
        + "{"
        + "background-image: " + "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='"+"rgba("+r+","+g+","+b+", .5)"+"'/%3e%3c/svg%3e\")"
        + "}"
   
        ;
    }

    new_style += ""

    + ".form-check-input:checked"
    + "{"
    + "background-color: " + 'rgb('+ r +', '+ g +', '+ b +');'
    + "border-color: " + 'rgb('+ r +', '+ g +', '+ b +');'
    + "}"

    + ".form-check-input:focus"
    + "{"
    + "box-shadow: " + '0 0 0 .25rem rgba('+r+', '+g+', '+b+', .25);'
    + "border-color: " + 'rgb('+ r +', '+ g +', '+ b +');'
    + "}"



    + "input[type=range]::-moz-range-thumb"
    + "{"
    + "background: " + 'rgb('+ r +', '+ g +', '+ b +');'
    + "}"

    + "input[type=range]:focus::-moz-range-thumb"
    + "{"
    + "box-shadow: " + '0 0 0 .25rem rgba('+r+', '+g+', '+b+', .25);'
    + "}"


    + "#accent_color"
    + "{"
    + "background-color: " + 'rgb('+ r +', '+ g +', '+ b +');'
    + "}"

    ;



    $('head').append('<style id="accentInput" type="text/css">' + new_style + '</style>');
}