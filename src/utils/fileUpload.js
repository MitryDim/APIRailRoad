const multer = require('multer');
const path = require('path');

const storage = (destination) => multer.diskStorage({
destination: destination,
filename: (req, file, cb) => 
{
    if (!req.body.name)
        return cb(new Error('name is required'))

    const image = `${req.body.name}${path.extname(file.originalname)}`
   return cb(null, image);

}

});


const fileUpload = (destination) => multer({
    storage: storage(destination),
    limits:{
        fileSize:1024*1024*2, // 2mb
    },
    fileFilter: (req, file, cb) =>
    {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype == "image/jpeg")
        {
            cb(null, true);
        }
        else
        {
            cb(null, false);
            return cb(new Error('Filetype not allowed'));
            
        }
    },
    onError : function (err,next) {
        return console.log('error',err);
        next(err);      
    }
}).single('image');
;
;

module.exports =fileUpload;