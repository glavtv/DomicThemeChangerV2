document.addEventListener ("DOMContentLoaded", load_layer);

var fiPort = browser.runtime.connect({name:"DarkDomic-Port"});

fiPort.onMessage.addListener(function(m) 
{
	UserData = m.greeting;
});

function load_layer() 
{
    if (UserData.check_ext == true)
    {
		if(UserData.check_layer == true)
		{
			var div = document.createElement('div');
			div.id = "DTC-Window";
			
			if(UserData.switch_loader == 1)
			{
				div.className = "DTC-Window-dark";
			}
			else
			{
				div.className = "DTC-Window-light";
			}
			
			if(UserData.text_loader == "" || UserData.text_loader == null)
			{
				div.innerHTML = "<div class=\"DTC-Window-Center\"> <img src=\""+browser.runtime.getURL("src/load.gif")+"\" alt=\"\"/> </div>";
			}
			else
			{
				div.innerHTML = "<div class=\"DTC-Window-Center\"> <img src=\""+UserData.text_loader+"\" alt=\"\"/> </div>";
			}
			
			document.body.prepend(div);
		}
    }
	
	fiPort.onMessage.removeListener();
}
