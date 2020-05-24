const express = require('express');
const app = express();

const router = express.Router();

app.use('/css', express.static(__dirname + '/dist/css'));
app.use('/img', express.static(__dirname + '/dist/img'));
app.use('/js', express.static(__dirname + '/dist/js'));
app.use('/user/css', express.static(__dirname + '/dist/css'));
app.use('/user/img', express.static(__dirname + '/dist/img'));
app.use('/user/js', express.static(__dirname + '/dist/js'));

router.get(/\d*/, function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
})

app.get(/[im,user,auth,\/]/, router);

app.listen(3000, () => {
    console.log('Server started on 3000...')
});
