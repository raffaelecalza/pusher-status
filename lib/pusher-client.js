const phin = require('phin');
const PUSHER_PAGE_URL = 'https://status.pusher.com/index.json';

class Pusher {
	status(cb) {
		phin({
			url: PUSHER_PAGE_URL,
			parse: 'json'
		}, (err, res) => {
			if (err) {
				cb(err);
				return;
			}

			let _status = {
				status: res['body']['status']['indicator'] == 'none' ? 'OK' : 'ERROR',
				description: res['body']['description'],
				components: {
					operational: [],
					outage: []
				}
			};

			for(let i = 0; i < res['body']['components'].length; i++) {
				let _cur = res['body']['components'][i];
				let _destArray = res['body']['components'][i]['status'];
                
				let _component = {
					name: _cur['name'],
					position: _cur['position'],
					description: _cur['description']
				};

				_status['components'][_destArray].push(_component);
			}

			cb(null, _status);
		});
	}
}

module.exports = Pusher;