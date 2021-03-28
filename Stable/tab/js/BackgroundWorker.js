var DarkDomic_Port;

window.addEventListener('storage', function(e) { 
	DarkDomic_Port.postMessage({greeting: GetNewSettings()});
});

function Сonnect(Port) {
	DarkDomic_Port = Port;
	DarkDomic_Port.postMessage({greeting: GetNewSettings()});
}

function GetNewSettings()
{
	var LoadedUserData = JSON.parse(localStorage.getItem('DDT'));
	return LoadedUserData;
}

browser.runtime.onConnect.addListener(Сonnect);