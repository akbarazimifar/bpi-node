import NodeRSA from 'node-rsa';
import fs from 'fs';
var crypto = require('crypto');


export function readKey(path) {
	fs.readFile(path, 'utf8', function(err, contents) {
    if (err) throw new Error(err)
    console.log("key imported Successfully")
    return contents
});
}

export function sha1(data) {
	var generator = crypto.createHash('sha1');
	generator.update(data);
	return generator.digest('hex');
}


export function humanizeDate(date, dateDelimeter, timeDelimeter) {
	if (date == null || date === '') return '';

	let year = date.getFullYear(),
		month = addZero(date.getMonth() + 1),
		day = addZero(date.getDate()),
		hour = addZero(date.getHours()),
		min = addZero(date.getMinutes()),
		sec = addZero(date.getSeconds());

	let result =
		year + dateDelimeter + month + dateDelimeter + day + ' ' + hour + timeDelimeter + min + timeDelimeter + sec;

	return result;
}

function addZero(number) {
	return number < 10 ? '0' + number : number;
}

export function pay(data) {
	let {_id, count, total, price, user} = data
	let date = new Date(),
		invoiceNumber = String(date.getTime()),
		invoiceDate = String(date.getTime()),
		amount = '1000',
		// amount = data.total,
		redirectAddress = process.env.MAIN_ADDRESS + 'completebuy', // 'http://localhost:3000/',
		action = '1003',
		timeStamp = humanizeDate(date, '/', ':'); //makeTimeStamp(date);
	data = `#${merchantCode}#${terminalCode}#${invoiceNumber}#${invoiceDate}#${amount}#${redirectAddress}#${action}#${timeStamp}#`;

	var key = new NodeRSA();

	data = sha1(data);
	data = key.encryptPrivate(data, 'base64', 'hex');

	var body = {
		merchantCode,
		terminalCode,
		invoiceDate,
		invoiceNumber,
		amount,
		redirectAddress,
		action,
		timeStamp,
		sign: data,
		memberShip: _id,
		total,
		count,
		price,
		user,
		date: date.getTime()
	};

	payments[body.invoiceDate + user] = body;
	return body;
}

export function accpetPayment(id) {
	let payment = payments[id];
	let date = new Date(),
		invoiceNumber = payment.invoiceNumber,
		invoiceDate = payment.invoiceDate,
		amount = '1000',
		// amount = data.total,
		action = '1003',
		timeStamp = humanizeDate(date, '/', ':'), //makeTimeStamp(date);
		data = `#${merchantCode}#${terminalCode}#${invoiceNumber}#${invoiceDate}#${amount}#${timeStamp}#`;

	var key = new NodeRSA();

	data = sha1(data);
	data = key.encryptPrivate(data, 'base64', 'hex');

	// var body = {
	// 	MerchantCode: merchantCode,
	// 	TerminalCode: terminalCode,
	// 	InvoiceDate: invoiceDate,
	// 	InvoiceNumber: invoiceNumber,
	// 	Amount: amount,
	// 	Action: action,
	// 	TimeStamp: timeStamp,
	// 	Sign: data
	// };

	var body = {
		MerchantCode: merchantCode,
		TerminalCode: terminalCode,
		InvoiceDate: invoiceDate,
		InvoiceNumber: invoiceNumber,
		Amount: amount,
		TimeStamp: timeStamp,
		Sign: data
	};

	return body;
}
