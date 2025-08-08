const {validationResult } = require('express-validator');
const fs = require('fs')

const validate = (req, res, next) => {
    const errors = validationResult(req);
   
    if (errors.isEmpty()) {
        return next();
    }
    if (req.file) {
        // Delete the uploaded file from the destination folder
        const filePath = req.file.path;
        fs.unlink(filePath, (err) => {
        });
    }

    const groupedErrors = errors.array().reduce((acc, error) => {
        if (!acc[error.path]) {
            acc[error.path] = [];
        }
        acc[error.path].push(error.msg);
        return acc;
    }, {});

    const timestamp = Math.floor(Date.now() / 1000);
     const data = {
        status:false,
        errors:groupedErrors,
        message:"Validation error",
        timestamp:timestamp
     }
    
        return res.status(422).json(data);
    

};


module.exports = {
    validate
};