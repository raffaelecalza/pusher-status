const phin = require('phin').unpromisified;
const PUSHER_PAGE_URL = 'https://status.pusher.com/index.json';

class Pusher {
	status(cb) {
		phin({
			url: PUSHER_PAGE_URL,
			parse: 'json',
			timeout: 5000
		}, (err, res) => {
			if (err) {
				cb(err);
				return;
			}

			if (res['statusCode'] != 200) {
				cb(new Error(`Status Page error (code: ${res['statusCode']})`));
				return;
			}

			if (res['body']['error']) {
				cb(new Error(`Status Page error (code: ${res['body']['status']}, error: ${res['body']['error']})`));
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

			for (let i = 0; i < res['body']['components'].length; i++) {
				let _cur = res['body']['components'][i];
				let _destArray = (res['body']['components'][i]['status'] == 'operational') ? 'operational' : 'outage';

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