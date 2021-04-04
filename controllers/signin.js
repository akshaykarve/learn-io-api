var router = require('express').Router();
const mongoose=require('mongoose');

const userInfo=require('../models/userInfo.js');
const bcrypt=require('bcrypt-nodejs');


const handleSignin=(req,res)=>{
	const {username,password}=req.body;
	if(!username||!password){
		return res.status(400).json('incorrect form submission');
	}
	// userInfo
 //  		.find({username:username})
 //  		.exec()
 //  		.then((users)=>{
 //  			users
 //  				.forEach((user)=>{
 //  					const isValid=bcrypt.compareSync(password, user.password);
 //  					if(isValid){
 //  						res.json(user.username);
 //  					}else{
 //  						res.status(400).json('wrong credentials')
 //  					}
 //  				})
 //  		})
 //  		.catch(err=>res.status(400).json('wrong credentials'))
 	userInfo.findOne({username:username},function(err,result){
 		if(err){res.status(400).json('err')}
 		if(!result){
 			res.status(400).json('user is not exist')
 		}else{
 			const isValid=bcrypt.compareSync(password, result.password);
			if(isValid){
				res.json(result.username);
			}else{
				res.status(401).json('wrong password')
			}
 		}
 	})
}

router.post("/",(req,res)=>{signin.handleSignin(req,res)})

module.exports=router;