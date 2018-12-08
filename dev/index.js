import NodeRSA from 'node-rsa';
import { humanizeDate, readKey, sha1 } from "./pay"


export default class Bpi {
  constructor(merchanCode, terminalCOde, privateKey) {
    this.merchanCode = merchanCode;
    this.terminalCOde = terminalCOde;
    this.privateKey = readKey(privateKey);
  }
  pay(data) {
    let date = new Date(),
      merchantCode = this.merchanCode,
      terminalCode = this.terminalCOde,
      invoiceNumber = String(date.getTime()),
      invoiceDate = String(date.getTime()),
      amount = data.total,
      redirectAddress = process.env.MAIN_ADDRESS + 'completebuy', // 'http://localhost:3000/',
      action = '1003',
      timeStamp = humanizeDate(date, '/', ':'); //makeTimeStamp(date);
    data = `#${merchantCode}#${terminalCode}#${invoiceNumber}#${invoiceDate}#${amount}#${redirectAddress}#${action}#${timeStamp}#`;
    console.log(this.privateKey, "key")
    var key = new NodeRSA(this.privateKey);

    console.log(data)
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
}
