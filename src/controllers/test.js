const db = require("../models/index.js");
const {Admin, User, PersonalAccessToken} = db
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Sms =require('../service/sms.js')

const store = async (req, res) => {
   
    const sms=  await Sms.send("07045086558",'hi ')
    console.log(sms)
   res.send(req.authUser)
};

module.exports = { store };