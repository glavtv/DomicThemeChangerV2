var DTC_PORT;

var timer = 0;

browser.runtime.onConnect.addListener(Сonnect);

window.addEventListener('storage', function(e) { 
	DTC_PORT.postMessage({greeting: GetNewSettings()});
});

setTimeout(deadline_checker, 5000);
setInterval(deadline_checker, 7200000);






function deadline_checker()
{
	var deadline_list = GetDeadlines();
	var deadlineSoonIndexes = [];

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
		
		if (time_now_to_deadline <= 3)
		{	
			deadlineSoonIndexes.push(i);
		}
	}

	if (deadlineSoonIndexes.length == 0)
	{
		return 0;
	}

	var text = "";

	for (var i = 0; i < deadlineSoonIndexes.length; i++)
	{
		text += deadlineSoonIndexes[i] + "\n";
	}

	spawnNotification(1, "checker", text);

	//localStorage.setItem('DTC_DDL', JSON.stringify(deadlineSoonIndexes));
}

function Сonnect(Port) 
{
	DTC_PORT = Port;
	DTC_PORT.postMessage({greeting: GetNewSettings()});

	DTC_PORT.onMessage.addListener(function(m) 
	{
		//Working with new deadline object
		var oldData = GetDeadlines();
		var newData = m.greeting;

		if (oldData != null)
		{
			for (var i = 0; i < newData.data_count; i++)
			{
				for (var j = 0; j < oldData.data_count; j++)
				{
					if (newData.mass_text[i] == oldData.mass_text[j])
					{
						if (newData.mass_koef[i] == oldData.mass_koef[j])
						{
							newData.mass_push_count[i] = oldData.mass_push_count[j];
						}
					}
				}
			}
		}

		localStorage.setItem('DTC_DDL', JSON.stringify(newData));
		spawnNotification(3, "GetObject", "Дедлайны обновлены");
		
		setTimeout(deadline_checker, 5000);
		//deadline_checker();
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
			icon = browser.runtime.getURL("assets/icons/notify_soon.png");
			break;
		}
		case 2:
		{
			icon = browser.runtime.getURL("assets/icons/notify_rip.png");
			break;
		}
		default:
		{
			icon = browser.runtime.getURL("assets/icons/notify_rip.png");
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