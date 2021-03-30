var DTC_PORT;

window.addEventListener('storage', function(e) { 
	DTC_PORT.postMessage({greeting: GetNewSettings()});
});

function Сonnect(Port) {
	DTC_PORT = Port;
	DTC_PORT.postMessage({greeting: GetNewSettings()});
}

function GetNewSettings()
{
	var LoadedUserData = JSON.parse(localStorage.getItem('DTC'));
	return LoadedUserData;
}

browser.runtime.onConnect.addListener(Сonnect);