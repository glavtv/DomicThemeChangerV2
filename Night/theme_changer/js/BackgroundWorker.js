var DTC_PORT;

//var timer = 0;

chrome.runtime.onConnect.addListener(Сonnect);

window.addEventListener('storage', function(e) { 
	try 
	{
		DTC_PORT.postMessage({greeting: GetNewSettings()});
	}
	catch (e) 
	{
		console.log("{DTC V2: BW}: No listening windows");
	}
	
});

setTimeout(deadline_checker, 3000);

//TODO: Сделать зависимость от переменной частота оповещения
setInterval(deadline_checker, 7200000*3); // каждые 6 часов / каждый запуск






function deadline_checker()
{
	console.log("{DTC V2: BW(Checker)}: Run");

	var deadline_list = GetDeadlines();
	var deadlineSoonIndexes = [];
	var deadData = [];
	var dead_text = "";

	if (deadline_list == null)
	{
		return 0;
	}

	var time_now_raw = new Date(Date.now());
	var time_now = new Date(time_now_raw.getFullYear(), time_now_raw.getMonth(), time_now_raw.getDate());

	for (var i = 0; i < deadline_list.data_count; i++)
	{
		var deadline_end_time = new Date(deadline_list.mass_y[i], deadline_list.mass_m[i] - 1, deadline_list.mass_d[i]);
		var time_now_to_deadline = (deadline_end_time - time_now) / (1000 * 60 * 60 * 24);
		
		//TODO: Сделать зависимость от переменной дней до деда
		if (time_now_to_deadline <= 3)
		{
			//TODO: Сделать зависимость от переменной кол-во повторений
			if (deadline_list.mass_push_count[i] >= 5)
			{
				continue;	
			}

			if (time_now_to_deadline <= 0)
			{
				deadData.push(i);
				continue;
			}
			
			deadlineSoonIndexes.push(i);
			deadline_list.mass_push_count[i] += 1;
		}
	}

	if (deadData.length > 0)
	{
			dead_text += "Дедлайны которые исчезли (завершились): \n\n";

			for (var i = 0; i < deadData.length; i++)
			{
				var dd_item = [deadData[i]];
				dead_text += deadline_list.mass_d[dd_item] + "." + deadline_list.mass_m[dd_item] + "   " + deadline_list.mass_text[dd_item] + "("+ deadline_list.mass_koef[dd_item] +")"  + "\n\n";
				
				deadline_list.data_count--;

				deadline_list.mass_d.splice(dd_item, 1);
				deadline_list.mass_m.splice(dd_item, 1);
				deadline_list.mass_y.splice(dd_item, 1);
			
				deadline_list.mass_koef.splice(dd_item, 1);
				deadline_list.mass_text.splice(dd_item, 1);
				deadline_list.mass_push_count.splice(dd_item, 1);
			}
		
			dead_text += "\n";

			console.log("{DTC V2: BW(Checker)} " + dead_text);
			setTimeout(spawnNotification, 0, 2, "[DTC V2]", dead_text);
	}

	if (deadlineSoonIndexes.length > 0)
	{
		var text = "Ближайшие дедлайны: \n\n";

		for (var i = 0; i < deadlineSoonIndexes.length; i++)
		{
			var dd_item = [deadlineSoonIndexes[i]];
			text += deadline_list.mass_d[dd_item] + "." + deadline_list.mass_m[dd_item] + "   " + deadline_list.mass_text[dd_item] + "("+ deadline_list.mass_koef[dd_item] +")"  + "\n\n";
		}

		text += "\n"

		console.log("{DTC V2: BW(Checker)} " + text);
		setTimeout(spawnNotification, 5000, 1, "[DTC V2]", text);
	}

	localStorage.setItem('DTC_DDL', JSON.stringify(deadline_list));
}

function Сonnect(Port) 
{
	DTC_PORT = Port;
	DTC_PORT.postMessage({greeting: GetNewSettings()});

	DTC_PORT.onMessage.addListener(function(m) 
	{
		console.log("{DTC V2: BW(Connect)}: Run");

		//Работа с дедлайн объектами
		var oldData = GetDeadlines();
		var newData = m.greeting;
		var deadData = [];
		var dead_text = "";


		//Если имеется информация о прошлых дедлайнах, показываем дедлайны, что уже закончились, переносим информацию о кол-ве уведомлений
		if (oldData != null)
		{

			for (var o = 0; o < oldData.data_count; o++)
			{
				var wasF = false;
				for (var n = 0; n < newData.data_count; n++)
				{
					if (newData.mass_text[n] == oldData.mass_text[o])
					{
						wasF = true;

						if (newData.mass_koef[n] == oldData.mass_koef[o])
						{
							newData.mass_push_count[n] = oldData.mass_push_count[o];
						}
					}
					
				}

				if (wasF == false)
				{
					deadData.push(o);
				}

			}
		}

		localStorage.setItem('DTC_DDL', JSON.stringify(newData));


		//TODO: Добавить переключатель
		console.log("{DTC V2: BW(Connect)}: Информация получена");
		//spawnNotification(3, "[DTC V2]", "Информация получена");
		
		if (deadData.length > 0)
		{
			dead_text += "Дедлайны которые исчезли (/завершились): \n\n";

			for (var i = 0; i < deadData.length; i++)
			{
				var dd_item = [deadData[i]];
				dead_text += oldData.mass_d[dd_item] + "." + oldData.mass_m[dd_item] + "   " + oldData.mass_text[dd_item] + "("+ oldData.mass_koef[dd_item] +")"  + "\n\n";
			}
		
			dead_text += "\n";

			console.log("{DTC V2: BW(Connect)} Мёртвые деды:" + dead_text);
			spawnNotification(2, "[DTC V2]", dead_text);
		}

		setTimeout(deadline_checker, 0);
	});
}

function GetNewSettings()
{
	var LoadedUserData = JSON.parse(localStorage.getItem('DTC'));
	return LoadedUserData;
}

function GetDeadlines()
{
	var LoadedUserData = JSON.parse(localStorage.getItem('DTC_DDL'));
	return LoadedUserData;
}

function spawnNotification(typeOfNotification, head, body) 
{
	var icon, tag = "push";
			 
	switch(typeOfNotification)
	{
		case 1:
		{
			icon = chrome.runtime.getURL("assets/icons/notify_soon.png");
			break;
		}
		case 2:
		{
			icon = chrome.runtime.getURL("assets/icons/notify_rip.png");
			break;
		}
		default:
		{
			icon = chrome.runtime.getURL("assets/icons/notify_rip.png");
			break;
		}
	}
  
	var options = {
	  body: body,
	  icon: icon,
	  tag: tag
	};
  
	new Notification(head, options);
}