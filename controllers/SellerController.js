const Seller = require("../models/Seller.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.create = async (req, res, next) => {
    try {
        const phone = req.body.phone;
        const isSellerExist = await Seller.findOne({'phone': phone});
        if (isSellerExist) {
            return res.status(200).json({success: false, msg: 'duplicate phone number'})
        }
        const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
        const seller = new Seller({...req.body, password: hashPassword});
        const savedSeller = await seller.save();
        return res.status(200).json({success: true, msg: 'success', doc: savedSeller})
    } catch(e) {
        console.log(e);
        return res.status(400).json({success: false, msg: 'create seller fail'})
    }   
}

module.exports.login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;

        console.log('user login in');

        // Checking if the email is not exist
        const owner = await Seller.findOne({ phone });
        if (!owner) return res.status(200).json({ success: false, msg: "Account not found" });

        // Checking Password is correct
        const validPassword = await bcrypt.compare(password, owner.password);
        if (!validPassword) {
            res.status(200).json({ success: false, msg: "Invalid password" });
            return;
        }

        //Create and assign a token 
        res.status(200).json({
            ...owner._doc, 
            password: '',
            success: true
        });
    } catch (e) {
        console.log(e)
        res.status(400).json({
            success: false
        });
    }
}