const request = require('request');
const PUSHER_PAGE_URL = 'https://status.pusher.com/index.json';

class Pusher {
    status(cb) {
        request(PUSHER_PAGE_URL, function(err, res, body) {
            if(err) {
                cb(err);
                return;
            }
            
            let _body = JSON.parse(body);
            // Clear data for a better visualization
            _body['components'].forEach(c => {
                delete c['created_at'];
                delete c['updated_at'];
                delete c['id'];
                delete c['showcase'];
                delete c['page_id'];
                delete c['group_id'];
            });

            // Build result object returned by the function
            let _result = {
                status: _body['status']['indicator'] == 'none' ? 'OK' : 'ERROR',
                description: _body['status']['description'],
                components: {
                    operational: _body['components'].filter(c => c.status == 'operational'),
                    outage: _body['components'].filter(c => c.status != 'operational')
                }
            }

            cb(null, _result);
        });
    };
}

module.exports = Pusher;