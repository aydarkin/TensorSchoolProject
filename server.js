let dir;
switch (process.argv[2]) {
    case 'src':
        dir = 'src';
        break;
    default:
        dir = 'dist';
        break;
}

const express = require('express');
const app = express();

const router = express.Router();

app.use('/css', express.static(`${__dirname}/${dir}/css`));
app.use('/img', express.static(`${__dirname}/${dir}/img`));
app.use('/js', express.static(`${__dirname}/${dir}/js`));
app.use('/user/css', express.static(`${__dirname}/${dir}/css`));
app.use('/user/img', express.static(`${__dirname}/${dir}/img`));
app.use('/user/js', express.static(`${__dirname}/${dir}/js`));

router.get(/\d*/, function(req, res) {
    const index = dir == 'src' ? 'index-src.html' : 'index.html';  
    res.sendFile(`${__dirname}/${dir}/${index}`);
})

app.get(/[im,user,auth,\/]/, router);

const port = 3000;
app.listen(port, () => {
    console.log(`[${dir}]Server started on ${port}...`)
});