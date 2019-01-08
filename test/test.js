const expect = require('chai').expect;
const nock = require('nock');
const pusher = require('../index');

describe('Pusher-status tests', function () {
	before(function () {
		nock('https://status.pusher.com')
			.get('/index.json')
			.replyWithFile(200,
				`${__dirname}/responses/not-a-json-file.html`);
	});

	it('should return an error while parsing JSON object', function (done) {
		pusher.status(function (err) {
			expect(err).to.not.be.null;

			done();
		});
	});

	before(function () {
		nock('https://status.pusher.com')
			.get('/index.json')
			.replyWithFile(200,
				`${__dirname}/responses/status-page-error.json`);
	});

	it('should return an error (Status Page Error simulation)', function (done) {
		pusher.status(function (err) {
			expect(err).to.not.be.null;

			done();
		});
	});

	before(function () {
		nock('https://status.pusher.com')
			.get('/index.json')
			.replyWithFile(500,
				`${__dirname}/responses/all-operational.json`);
	});

	it('should return an error (HTTP code != 200)', function (done) {
		pusher.status(function (err) {
			expect(err).to.not.be.null;

			done();
		});
	});

	before(function () {
		nock('https://status.pusher.com')
			.get('/index.json')
			.replyWithFile(200,
				`${__dirname}/responses/all-operational.json`);
	});

	it('should return an object with all the components operational', function (done) {
		pusher.status(function (err, data) {
			expect(err).to.be.null;
			expect(data['status']).to.equal('OK');
			expect(data['components']['operational']).to.have.lengthOf(11);
			expect(data['components']['outage']).to.have.lengthOf(0);

			done();
		});
	});

	before(function () {
		nock('https://status.pusher.com')
			.get('/index.json')
			.replyWithFile(200,
				`${__dirname}/responses/2-not-operational.json`);
	});

	it('should return an object with some component not working', function (done) {
		pusher.status(function (err, data) {
			expect(err).to.be.null;
			expect(data['status']).to.equal('ERROR');
			expect(data['components']['operational']).to.have.lengthOf(9);
			expect(data['components']['outage']).to.have.lengthOf(2);

			done();
		});
	});
});