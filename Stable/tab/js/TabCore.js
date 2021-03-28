var check_ext = true,           //Кнопка-переключатель, расширение
    check_icon = true,          //Кнопка-переключатель, иконка
    check_title = true,         //Кнопка-переключатель, название
    check_theme = true,         //Кнопка-переключатель, тема
    text_icon = "",             //Текст, ссылка на иконку
    text_title = "",            //Текст, название вкладки
    text_theme = "",            //Текст, ссылка на тему
    switch_theme = 1,           //Список, выбранная тема
    cpicker_r = 255,            //Диапазон чисел, Rgb
    cpicker_g = 255,            //Диапазон чисел, rGb
	cpicker_b = 255,            //Диапазон чисел, rgB
	num_layer_delay = 1500,     //Диапазон чисел, длительность перехода
    num_layer_fadeout = 1000,   //Диапазон чисел, длительность затухания
    menu_rgb = false;           //Переливание цветов

var original_title = "domic.isu.ru",
	OpenHomeworkPage = window.location.pathname,
	jq_ready = false;

var nj = $.noConflict(true),
	myPort = browser.runtime.connect({name:"DarkDomic-Port"});


myPort.onMessage.addListener(function(m) 
{
	NewData = m.greeting;
	vars_update(NewData);

	core_start();
});

function vars_update(NewData)
{
	if (NewData != null)
	{
		check_ext = NewData.check_ext;
		check_icon = NewData.check_icon;
		check_title = NewData.check_title;
		check_theme = NewData.check_theme;
		
		text_icon = NewData.text_icon;
		text_title = NewData.text_title;
		text_theme = NewData.text_theme;
		
		switch_theme = NewData.switch_theme;
		
		cpicker_r = NewData.cpicker_r;
		cpicker_g = NewData.cpicker_g;
		cpicker_b = NewData.cpicker_b;

		num_layer_delay = NewData.num_layer_delay;
    	num_layer_fadeout = NewData.num_layer_fadeout;
		
		menu_rgb = NewData.menu_rgb;
	}
	else
	{
		check_ext = true;
		check_icon = true;
		check_title = true;
		check_theme = true;
		
		text_icon = "";
		text_title = "";
		text_theme = "";
		
		switch_theme = 1;
		
		cpicker_r = 255;
		cpicker_g = 255;
		cpicker_b = 255;

		num_layer_delay = 1500;
    	num_layer_fadeout = 1000;
		
		menu_rgb = false;
	}
}




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
	if (check_ext == true)
	{
		core_apply();
    }
	else
	{
		core_reset();
	}

	setTimeout(hide_load_layer, parseInt(num_layer_delay, 10));
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
	if (text_title != "" && text_title != null)
	{
		document.title = text_title;
	}
	else
	{
		document.title = original_title;
	}
		
	//Custom Icon
	if (check_icon == true)
	{
		set_icon();
	}
	else
	{
		reset_icon();
	}
		
	//Set Theme
	if (check_theme == true)
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
	
	if (text_icon == "" || text_icon == null)
	{
		nj('head').prepend('<link id="SiteIcon" rel="shortcut icon" type="image/png" href="' + browser.runtime.getURL("src/load.gif") +'" />');
	}
	else
	{
		nj('head').prepend('<link id="SiteIcon" rel="shortcut icon" type="image/png" href="' + text_icon + '" />');
	}
}

function reset_icon()
{
	if (nj("#SiteIcon").length > 0)
	{
		nj("#SiteIcon").remove();
	}
			
	nj('head').prepend('<link id="SiteIcon" rel="shortcut icon" type="image/png" href="' + browser.runtime.getURL("src/alpha.png") +'" />');
			
	if (nj("#SiteIcon").length > 0)
	{
		nj("#SiteIcon").remove();
	}
}

function set_theme()
{
	var href_path = "";
	switch(switch_theme)
	{
		case "1":
		{
			href_path = browser.runtime.getURL("tab/css/Dark.css");
			break;
		}
		case "2":
		{
			href_path = browser.runtime.getURL("tab/css/Light.css");
			break;
		}
		case "3":
		{
			//href_path = browser.runtime.getURL("tab/css/Neon.css");
			break;
		}
		case "4":
		{
			href_path = text_theme;
			break;
		}
	}
	
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
    nj("#DTC-Window").fadeOut(parseInt(num_layer_fadeout, 10), function()
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
	entity = OpenHomeworkPage.match(/\bentity\b/i),
	content = OpenHomeworkPage.match(/\bcontent\b/i),
	html_page_opened = OpenHomeworkPage.match(/\b.html\b/i),
	res = OpenHomeworkPage.match(/\bres\b/i),
	sim = OpenHomeworkPage.match(/\bsim\b/i);

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
			setTimeout(hide_load_layer, parseInt(num_layer_delay, 10));
		}
	}
}