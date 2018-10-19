# Pusher status
Monitor Pusher's services status directly in node.

Data loaded from https://status.pusher.com/

## Usage
```javascript
const pusher = require('pusher-status');

pusher.status(function (err, res) {
    if (err) throw err;

    console.log(`Status = ${res.status}`);
    console.log(`Numbers of components correctly working = ${res['components']['operational'].length}`);

    if (res.status != 'OK') {
        console.log(`Numbers of components not working = ${res['components']['outage'].lenght}`);
    }
});