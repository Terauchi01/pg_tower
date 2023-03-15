// サーバーサイドのコード
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// bodyParserを使用して、POSTリクエストのbodyをパースする
app.use(bodyParser.json());

// /api/send-messageにPOSTリクエストがあった場合の処理
app.post('/saver/api/send-message', (req, res) => {
    const { message } = req.body;
    console.log('受信したメッセージ:', message);

    // ここでnameに保存するなどの処理を行う

    res.json({ success: true });
});

// サーバーを起動する
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
