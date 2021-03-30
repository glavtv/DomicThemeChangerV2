var core_default = {
    "ext_theme": 1,                 //Тема расширения 
    "ext_ver": 2.2,                //Версия расширения
    "check_ext": true,              //Кнопка-переключатель, расширение              
    "check_icon": true,             //Кнопка-переключатель, иконка 
    "check_title": true,            //Кнопка-переключатель, название
    "check_theme": true,            //Кнопка-переключатель, тема
    "check_layer": true,            //Кнопка-переключатель, подложка
    "text_icon": "",                //Текст, ссылка на иконку    
    "text_title": "",               //Текст, название вкладки
    "text_theme": "",               //Текст, ссылка на тему
    "text_loader": "",              //Текст, ссылка на gif-загрузку
    "switch_theme": 1,              //Список, выбранная тема
    "switch_loader": 1,             //Список, выбранная тема
    "cpicker_r": 13,    
    "cpicker_g": 110,    
    "cpicker_b": 253,      
    "num_layer_delay": 1500,        //Диапазон чисел, длительность перехода
    "num_layer_fadeout": 1000,      //Диапазон чисел, длительность затухания
    "menu_rgb": false,              //Переливание цветов
    "menu_rotate_icon": false       //Крутящиеся иконки
};

var nj = $.noConflict(true),
	DTC_PORT = browser.runtime.connect({name:"DTC_PORT"}),
	jq_ready = false,
	OpenHomeworkPage = window.location.pathname,
	original_title = "domic.isu.ru";

DTC_PORT.onMessage.addListener(function(m) 
{
	console.log("{DTC V2: TC}: Injected");

	var UserData = m.greeting;

	if (UserData != null)
	{
		core_default = UserData;
	}

	core_start();
});

nj(document).ready(function() 
{
	if (OpenHomeworkPage == "/" && nj("input[name=\"nik\"]").length == 0)
	{
		window.location.replace("http://domic.isu.ru/student/");
	}
	else
	{
		jq_ready = true;
		core_start();
	}
	
	nj(document).keyup(function(e) 
	{
		if (e.keyCode === 46) {
			hide_load_layer();
		}
	});
	
});



function core_start()
{
	var OpenHomeworkPage = window.location.pathname,
	page_entity = OpenHomeworkPage.match(/\bentity\b/i),
	page_content = OpenHomeworkPage.match(/\bcontent\b/i),
	page_html = OpenHomeworkPage.match(/\b.html\b/i),
	page_res = OpenHomeworkPage.match(/\bres\b/i),
	page_sim = OpenHomeworkPage.match(/\bsim\b/i);
	
	/*
	Если ссылка вида:
	http://domic.isu.ru/student/entity/5077/content/index.html

	Не включаем расширение
	*/
	

	if ( (page_entity != null && page_content != null && page_html != null) || (page_res != null && page_sim != null && page_html != null)  )
	{
		fix_session();
	}
	else
	{
		core_run();
		fix_session();
	}
}

function core_run()
{
	if (core_default.check_ext == true)
	{
		core_apply();
    }
	else
	{
		core_reset();
	}

	setTimeout(hide_load_layer, parseInt(core_default.num_layer_delay, 10));
}

function core_reset()
{
	//Custom Site Title
	document.title = original_title;
	
	//Set light Site Icon (Original get:500)	
	reset_icon();

	//Delete Theme
	reset_theme();
	
	//CssFix();
}

function core_apply()
{
	//Auto Cleaner
	auto_clean();

	//Fix comments
	CssFix();

    //Custom Site Title
	if (core_default.text_title != "" && core_default.text_title != null)
	{
		document.title = core_default.text_title;
	}
	else
	{
		document.title = original_title;
	}
		
	//Custom Icon
	if (core_default.check_icon == true)
	{
		set_icon();
	}
	else
	{
		reset_icon();
	}
		
	//Set Theme
	if (core_default.check_theme == true)
	{
		set_theme();
	}
	else
	{
		reset_theme();
	}
}




function set_icon()
{
	if (nj("#SiteIcon").length > 0)
	{
		nj("#SiteIcon").remove();
	}
	
	if (core_default.text_icon == "" || core_default.text_icon == null)
	{
		nj('head').prepend('<link id="SiteIcon" rel="shortcut icon" type="image/png" href="' + browser.runtime.getURL("assets/icons/load.gif") +'" />');
	}
	else
	{
		nj('head').prepend('<link id="SiteIcon" rel="shortcut icon" type="image/png" href="' + core_default.text_icon + '" />');
	}
}

function reset_icon()
{
	if (nj("#SiteIcon").length > 0)
	{
		nj("#SiteIcon").remove();
	}
			
	nj('head').prepend('<link id="SiteIcon" rel="shortcut icon" type="image/png" href="' + browser.runtime.getURL("assets/icons/alpha.png") +'" />');
			
	if (nj("#SiteIcon").length > 0)
	{
		nj("#SiteIcon").remove();
	}
}

function set_theme()
{
	var href_path = "";
	switch(parseInt(core_default.switch_theme, 10))
	{
		case 1:
		{
			href_path = browser.runtime.getURL("theme_changer/css/Light.css");
			break;
		}
		case 2:
		{
			href_path = browser.runtime.getURL("theme_changer/css/Dark.css");
			break;
		}
		case 3:
		{
			//href_path = browser.runtime.getURL("theme_changer/css/Neon.css");
			break;
		}
		case 4:
		{
			href_path = text_theme;
			break;
		}
	}
	
	console.log(href_path);
	console.log(core_default.switch_theme);

	if( nj("head #DomicStyle").length < 1 && href_path != "" )
	{
		nj('<link>', {
				id: 'DomicStyle',
				rel: 'stylesheet',
				type: 'text/css',
				href: href_path
		}).prependTo('head');	
	}
	else
	{
		if ( href_path != nj("head #DomicStyle").attr('href') && href_path != "" )
		{
			nj("head #DomicStyle").remove();
			
			nj('<link>', {
				id: 'DomicStyle',
				rel: 'stylesheet',
				type: 'text/css',
				href: href_path
			}).prependTo('head');
		}
	}
	
}

function reset_theme()
{
	if (nj("head #DomicStyle").length > 0)
	{
		nj("head #DomicStyle").remove();
	}
}




function hide_load_layer()
{
    nj("#DTC-Window").fadeOut(parseInt(core_default.num_layer_fadeout, 10), function()
	{
		nj("#DTC-Window").remove();
	});
}

function auto_clean()
{
	nj("input[name=\"nik\"]").val('');
	nj("input[name=\"password\"]").val('');
}




function CssFix()
{
	var student = OpenHomeworkPage.match(/\bstudent\b/i),
	entity = OpenHomeworkPage.match(/\bentity\b/i);

	if (student != null && entity != null && OpenHomeworkPage.length < 24)
	{
		Fix_Comment();
	}
}

function Fix_Comment()
{
	var Deadline,
		HWChecked,
		CommentSection;
	
	Deadline = nj( "#content #navbar + h2 + h3 + h4 + p + div" );
	HWChecked = nj( "#content #studyEntity-requirements + div" );
	CommentSection = nj( "#content .student-comment + div" );
	
	if (HWChecked.length < 1)
	{
		HWChecked = nj( "#content .instructor-comment + div" );
	}
	if (CommentSection.length < 1)
	{
		CommentSection = nj( "#content #studyEntity-requirements + div + hr + h4 + div" );
		if (CommentSection.length < 1)
		{
			CommentSection = nj( "#content #studyEntity-requirements + hr + h4 + div" );
			if (CommentSection.length < 1)
			{
				CommentSection = nj( "#content #studyEntity-requirements + hr + div + div + hr + h4 + div" );
			}
		}
	}
	
	if ( nj(Deadline).css('background-color') == 'rgb(255, 192, 203)')
	{
		nj(Deadline)
			.css('background-color', '#f72c2c')
			.css('border-radius','4px')
			.css('padding','0px')
			.css('width','300px');
	}
	if ( nj(HWChecked).css('background-color') == 'rgb(173, 216, 230)')
	{
		nj(HWChecked)
			.css('background-color', 'var(--dark-theme-score2)')
			.css('border-radius','4px');
	}
	if ( nj(CommentSection).css('background-color') == 'rgb(255, 192, 203)')
	{
		nj(CommentSection)
			.css('background-color', '')
			.css('padding-top', '20px')
			.css('padding-left', '10px')
			.css('border-top', '1px solid var(--dark-theme-gray)')
			.css('border-bottom', '1px solid var(--dark-theme-gray)')
			.css('border-radius','5px');
	}
	
	console.log("[CSS Fixer] - Deadline:");
	console.log(Deadline);
	
	console.log("[CSS Fixer] - Last Check:");
	console.log(HWChecked);
	
	console.log("[CSS Fixer] - Comments:");
	console.log(CommentSection);
	
}

function fix_session()
{
	if (jq_ready == true)
	{
		var content = nj("#content p:nth-child(1)").text(),
		content_min = content.replace(/[^a-zа-яёA-ZА-ЯЁ]/g, ''),
		ses_out_text = "ВынеавторизованывсистемеПожалуйстаперейдитенастраницуавторизации";
		if (content_min == ses_out_text)
		{
			if (nj("input[name=\"nik\"]").length == 0)
			{
				window.location.replace("http://domic.isu.ru/student/");
			}
			else
			{
				window.location.replace("http://domic.isu.ru/");
			}
		}
		else
		{
			setTimeout(hide_load_layer, parseInt(core_default.num_layer_delay, 10));
		}
	}
}