function MyExtension() {
	var self = this;
	
	self.loadData();
	
	kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
        self.updatePage();
    });
}

MyExtension.prototype = {
	loadData: function() {
		kango.console.log('Check ServerDate');
		
		var request = {
				url: 'http://www.membersinterests.org.uk/api/feed/datadate',
				method: 'GET',
				async: true,
				contentType: 'json'
		};
		kango.xhr.send(request, function(data) {
			if (data.status == 200 && data.response != null) {
				kango.storage.setItem('ServerDate', JSON.stringify(data.response));
				kango.console.log('ServerDate: ' + kango.storage.getItem('ServerDate'));
				kango.console.log('LocalDate: ' + kango.storage.getItem('LocalDate'));
				
				if(kango.storage.getItem('ServerDate') != kango.storage.getItem('LocalDate')) {				
					kango.console.log('Get Data');
					
					var request = {
							url: 'http://www.membersinterests.org.uk/api/feed/data',
							method: 'GET',
							async: true,
							contentType: 'json'
					};
					kango.xhr.send(request, function(data) {
						if (data.status == 200 && data.response != null)
						{
							kango.storage.setItem('Data', JSON.stringify(data.response));
							kango.console.log('Data: ' + kango.storage.getItem('Data'));
							kango.storage.setItem('LocalDate', kango.storage.getItem('ServerDate'));
							kango.console.log('ServerDate: ' + kango.storage.getItem('ServerDate'));
							kango.console.log('LocalDate: ' + kango.storage.getItem('LocalDate'));
						}
						else {
							kango.console.log('Error getting Data from server');
						}
					});
				}
			}
			else {
				kango.console.log('Error getting ServerDate from server');
			}
		});
	},
		
	updatePage: function() {
		kango.browser.tabs.getCurrent(function(tab) {
			kango.console.log('dispatchMessage to ' + tab.getUrl());
			
			var data = JSON.parse(kango.storage.getItem("Data"));
			tab.dispatchMessage('Background2Content', data);
		});
	}
};

var extension = new MyExtension();
