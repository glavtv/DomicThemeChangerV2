var ext_theme = 1,              //Тема расширения
    ext_ver  = 2.01,            //Версия расширения
    check_ext = true,           //Кнопка-переключатель, расширение
    check_icon = true,          //Кнопка-переключатель, иконка
    check_title = true,         //Кнопка-переключатель, название
    check_theme = true,         //Кнопка-переключатель, тема
    check_layer = true,         //Кнопка-переключатель, подложка
    text_icon = "",             //Текст, ссылка на иконку
    text_title = "",            //Текст, название вкладки
    text_theme = "",            //Текст, ссылка на тему
	text_loader = "",           //Текст, ссылка на gif-загрузку
    switch_theme = 1,           //Список, выбранная тема
    switch_loader = 1,          //Список, выбранная тема
    cpicker_r = 255,            //Диапазон чисел, Rgb
    cpicker_g = 255,            //Диапазон чисел, rGb
    cpicker_b = 255,            //Диапазон чисел, rgB
    num_layer_delay = 1500,     //Диапазон чисел, длительность перехода
    num_layer_fadeout = 1000,   //Диапазон чисел, длительность затухания
    menu_rgb = false,           //Переливание цветов
    menu_rotate_icon = true;    //Крутящиеся иконки


var RGB_CHECK = null;

$(document).ready(function() 
{
    load();

    $('#Main-Head > div').on('click', function(e)
	{
        if ( $(this).attr('id') != '#Head-Selected-Block' )
        {
            accent_reset();                                                     //Сбрасываем accent color с пункта меню

            $("#Head-Selected-Block").removeAttr("id");
            $(this).attr('id', 'Head-Selected-Block');

            $('#Main-Body > section').css( 'display', 'none' );                 //Скрываем все слои
            $('#Menu-' + $( this ).index()).css( 'display', ''  );              //Отображаем выбранный слой

            if ($( this ).index() == 2)
            {
                $('#Main-Body').css( 'padding-right', '30px' );
            }
            else
            {
                $('#Main-Body').css( 'padding-right', ' ' );
            }

            menu_animation_apply();                                             //Применяем анимацию для текущего пункта меню
            accent_apply();                                                     //Примеяем accent color для текущего пункта меню
        }
	});

    $(document).on("input",function(ev){
        save();
    });

});

function accent_text()
{
    $( "#accent_text" ).text('Accent Color ('+ cpicker_r +'; '+ cpicker_g +'; '+ cpicker_b +')');
    $( "#accent_color" ).css( 'background-color', 'rgb('+ cpicker_r +', '+ cpicker_g +', '+ cpicker_b +')' )
    accent_apply();
}

function num_text()
{
    $( "#num_text_delay" ).text('Длительность подложки ('+ num_layer_delay +'мс)');
    $( "#num_text_fadeout" ).text('Длительность затухания ('+ num_layer_fadeout +'мс)');
}

function accent_apply()
{
    if (check_ext == true)
    {
        //Нижняя граница верхнего меню
        $( "#Main-Head" ).css( 'border-bottom', '2px solid rgb('+ cpicker_r +', '+ cpicker_g +', '+ cpicker_b +')' );

        //выделение иконки верхнего меню
        $( "#Main-Head > #Head-Selected-Block > svg" ).css( 'stroke', 'rgb('+ cpicker_r +', '+ cpicker_g +', '+ cpicker_b +')' );
        $( "#Main-Head > #Head-Selected-Block > svg" ).css( 'fill', 'rgb('+ cpicker_r +', '+ cpicker_g +', '+ cpicker_b +')' );
    }
    else
    {
        accent_reset();
    }
}

function accent_reset()
{
    //Нижняя граница верхнего меню
    $( "#Main-Head" ).css( 'border-bottom', '2px solid rgb('+ 0 +', '+ 0 +', '+ 0 +')' );

    //выделение иконки верхнего меню
    $( "#Main-Head > #Head-Selected-Block > svg" ).css( 'stroke', '' );
    $( "#Main-Head > #Head-Selected-Block > svg" ).css( 'fill', '' );
}

function menu_animation_apply()
{
    //TODO: RGB не сбрасывается под нижним меню, если выбрать другой пункт
    $( "#Main-Head" ).removeAttr('class');
    $( "#Main-Head > div > svg" ).removeClass('anim-RotateRGB anim-Rotate anim-RGB');
    

    if (menu_rotate_icon == true && menu_rgb == true)
    {
        RGB_CHECK = setInterval(setRGB, 150, 2);
    }
    else if (menu_rotate_icon == true)
    {
        $( "#Main-Head > #Head-Selected-Block > svg" ).addClass( 'anim-Rotate' );
    }
    else if (menu_rgb == true)
    { 
        RGB_CHECK = setInterval(setRGB, 150, 1);
    }
}

function setRGB(menu)
{
    if(menu == 1)
    {
        if ( $( "#Main-Head" ).attr('class') == null )
        {
            $( "#Main-Head" ).attr( 'class', 'anim-Border-RGB' );
            $( "#Main-Head > #Head-Selected-Block > svg" ).addClass( 'anim-RGB' );
            RGB_CHECK = null;
        }     
    }
    else if (menu == 2)
    {
        if ( $( "#Main-Head" ).attr('class') == null )
        {
            $( "#Main-Head" ).attr( 'class', 'anim-Border-RGB' );
            $( "#Main-Head > #Head-Selected-Block > svg" ).addClass( 'anim-RotateRGB' );
            RGB_CHECK = null;
        }     
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
}

function refresh()
{
    check_ext = ($('#check_ext').is(":checked")) ? true : false;
    (check_ext == false) ? ext_disable() : ext_enable();

    check_icon = ($('#check_icon').is(":checked")) ? true : false;
    check_title = ($('#check_title').is(":checked")) ? true : false;
    check_theme = ($('#check_theme').is(":checked")) ? true : false;
    check_layer = ($('#check_layer').is(":checked")) ? true : false;

    menu_rgb = ($('#menu_rgb').is(":checked")) ? true : false;
    menu_rotate_icon = ($('#menu_rotate_icon').is(":checked")) ? true : false;

    text_icon = $('#text_icon').val();
    text_title = $('#text_title').val();
    text_theme = $('#text_theme').val();
	text_loader = $('#text_loader').val();

    switch_loader = $('#switch_loader').val();
    switch_theme = $('#switch_theme').val();
    ext_theme = $('#ext_theme').val();

    cpicker_r = $('#Menu-1 input[type="range"]:nth-child(2)').val();
    cpicker_g = $('#Menu-1 input[type="range"]:nth-child(3)').val();
    cpicker_b = $('#Menu-1 input[type="range"]:nth-child(4)').val();

    num_layer_delay = $('#Menu-2 input[type="range"]:nth-child(2)').val();
    num_layer_fadeout = $('#Menu-2 input[type="range"]:nth-child(4)').val();

    console.log("[DDT: Core] Updated");
}

function save()
{
    refresh();
    var UserData = 
	{
		"ext_theme" : ext_theme,
        "ext_ver" : ext_ver,
        "check_ext" : check_ext,
        "check_icon" : check_icon,
        "check_title" : check_title,
        "check_theme" : check_theme,
        "check_layer" : check_layer,
        "text_icon" : text_icon,
        "text_title" : text_title,
        "text_theme" : text_theme,
		"text_loader" : text_loader,
        "switch_theme" : switch_theme,
        "switch_loader" : switch_loader,
        "cpicker_r" : cpicker_r,
        "cpicker_g" : cpicker_g,
        "cpicker_b" : cpicker_b,
        "num_layer_delay" : num_layer_delay,
        "num_layer_fadeout" : num_layer_fadeout,
        "menu_rgb" : menu_rgb,
        "menu_rotate_icon" : menu_rotate_icon
    };
    localStorage.setItem('DDT', JSON.stringify(UserData));
    console.log("[DDT: Core] Saved");

    num_text();
    accent_text();
    ext_theme_change();
}

function loadUD()
{
    Data = JSON.parse(localStorage.getItem('DDT'));
	if (Data != null)
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

        $('#Menu-1 input[type="range"]:nth-child(2)').val(Data.cpicker_r);
        $('#Menu-1 input[type="range"]:nth-child(3)').val(Data.cpicker_g);
        $('#Menu-1 input[type="range"]:nth-child(4)').val(Data.cpicker_b);

        $('#Menu-2 input[type="range"]:nth-child(2)').val(Data.num_layer_delay);
        $('#Menu-2 input[type="range"]:nth-child(4)').val(Data.num_layer_fadeout);

        console.log("[DDT: Core] Loaded");

        refresh();
	}
	else
	{
		save();
	}
}

function ext_disable()
{
    accent_reset();

    $('#check_icon').attr('disabled', "yes");
    $('#check_title').attr('disabled', "yes");
    $('#check_theme').attr('disabled', "yes");

    //$('#menu_rgb').attr('disabled', "yes");
    $('#menu_rotate_icon').attr('disabled', "yes");

    $('#text_icon').attr('disabled', "yes");
    $('#text_title').attr('disabled', "yes");
    $('#text_theme').attr('disabled', "yes");
	$('#text_loader').attr('disabled', "yes");

    $('#switch_loader').attr('disabled', "yes");
    $('#switch_theme').attr('disabled', "yes");
    $('#ext_theme').attr('disabled', "yes");

    $(".form-range").attr('disabled', "yes");
}

function ext_enable()
{
    accent_apply();

    $('#check_icon').removeAttr('disabled');
    $('#check_title').removeAttr('disabled');
    $('#check_theme').removeAttr('disabled');

    //$('#menu_rgb').removeAttr('disabled');
    $('#menu_rotate_icon').removeAttr('disabled');

    $('#text_icon').removeAttr('disabled');
    $('#text_title').removeAttr('disabled');
    $('#text_theme').removeAttr('disabled');
	$('#text_loader').removeAttr('disabled');

    $('#switch_loader').removeAttr('disabled');
    $('#switch_theme').removeAttr('disabled');
    $('#ext_theme').removeAttr('disabled');

    $(".form-range").removeAttr('disabled');
}

function ext_theme_change()
{
    if(ext_theme == 2)
    {
        if ( $('#WhitePower').length < 1 )
        {
            document.getElementsByTagName("head")[0].insertAdjacentHTML(
            "beforeend",
            "<link id=\"WhitePower\" rel=\"stylesheet\" href=\"css/WhitePower.css\" />");
        }
    }
    else
    {
        $('#WhitePower').remove(); 
    }
}