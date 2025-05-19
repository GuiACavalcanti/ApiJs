async function bitPrice() {
    try {
        const response = await fetch(`https://api.coinconvert.net/convert/btc/usd?amount=1`);
        const dataJson = await response.json();
        return dataJson.USD;
    }
    catch (error) {
        console.log(error);
    }
}

async function DolarPrice() {
    try {
        const Res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
        const dataRes = await Res.json();
        return parseFloat(dataRes.USDBRL.bid);
    } 
    catch (error) {
        console.log(error);
    }
}

async function Exec() {
    const ExecDolarPrice = await DolarPrice();
    const ExecbitPrice = await bitPrice();
    const bitPriceReal = ExecDolarPrice * ExecbitPrice;
    const bit = `{"Real": "${bitPriceReal}", "Dolar": "${ExecbitPrice}"}`;
    return bit;
}


var CryptoJS = require("crypto-js");
function passCript(password) {
    const criptPassword = CryptoJS.AES.encrypt(password, 'KeyAcesseAcont').toString();
    return criptPassword;
}


var http = require('http');
const { json } = require("stream/consumers");
var url = require('url');

http.createServer(async function (req, res) {
    const Execbit = await Exec();
    const BitJson = JSON.parse(Execbit);

    const fs = require('fs');

    const data = url.parse(req.url, true);
    switch (data.pathname) {
        case '/api/':
        case '/api':
            // http://localhost:3000/api/?key=123fdf8vb743ntgyov31b

            res.setHeader('Content-Type', 'application/json');
            const urlKei = data.query.key;


            const userJSON = JSON.parse(fs.readFileSync('../Users/users.json', 'UTF-8'));
            const keys = userJSON.map(p => p.key);

            if (keys.includes(urlKei)) {
                res.writeHead(200);
                res.end(JSON.stringify(BitJson));

            } else {
                res.writeHead(404);
                res.end(JSON.stringify(JSON.parse('{"Erro":"Chave não encontrada!"}')));
            }
            break;

        case '/api/login/':
        case '/api/login':
            //http://localhost:3000/api/login/?name=test1&email=test12324@gmail.com&password=test123456
            // name email password

            const UserJsonLogin = JSON.parse(fs.readFileSync('../Users/users.json'));
            
            const QueryAcont = data.query;


            const ultid = UserJsonLogin.map(p => p.id);
            const nameUsers = UserJsonLogin.map(p => p.name);
            const UsersEmail = UserJsonLogin.map(p => p.email);

            if (!UsersEmail.includes(QueryAcont.email)) {

                if (nameUsers.includes(QueryAcont.name)) {
                    res.writeHead(404);
                    res.end(JSON.stringify(JSON.parse('{"Erro": "O nome da conta já está sendo utilizado!"}')));
                }

                const newkay = (Math.random() * 0xfffffffff * 1000000).toString(16);

                UserJsonLogin.push({id: ultid.length, name: QueryAcont.name, email: QueryAcont.email, password: passCript(QueryAcont.password), key: newkay});
                fs.writeFileSync('../Users/users.json', JSON.stringify(UserJsonLogin));

                res.writeHead(200);
                res.end(JSON.stringify(JSON.parse('{"Conta": "Conta criada!","Sua kay": ""}')));

            } else {
                res.writeHead(404);
                res.end(JSON.stringify(JSON.parse('{"Erro": "Conta já existente!"}')));
            }
            break;

        case '/api/logar/':
        case '/api/logar':
            const query = data.query;
            const emailURL = query.email;
            const usersURL = fs.readdirSync('./Users');
            
            console.log(users);

            const password = query.password;
            console.log(`${query.email}, ${query.password}`);
            res.writeHead(200);
            res.end()
            break;

        default:
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(404);
        	res.end(JSON.stringify(JSON.parse('{"Erro":"Caminho não encontrado!"}')));
    }   
}).listen(3000);