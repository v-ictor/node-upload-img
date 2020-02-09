const express = require('express');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname).toLocaleLowerCase());
    }
});

// Initilizations
const app = express();

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(multer({ 
    storage, //= storage: storage    
    dest: path.join(__dirname, 'public/uploads'),
    limits: {fileSize: 1000000}, //=1mb
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname){
            return cb(null, true);
        }
        cb("Error la imagen debe ser valida");
    }
}).single('image'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use(require('./routes/index.routes'));

// Start server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});