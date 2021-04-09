var router = require('express').Router();
const { ObjectId } = require('bson');
const mongoose=require('mongoose');

const userPlatformInfoSchema=require('../models/userPlatformInfo.js');
const platformSchema=require('../models/platform.js');

const handleUserPlay=(req,res)=>{ 
	const {username,platformId}=req.body; // Shouldn't handleUserPlay also have fields for completedId, timeSpend, widgetsClicked, pageVisited, and badges
	if(!platformId){
		return res.status(400).json('incorrect form submission');
	}
	if(!username){
		return res.status(200).json("guest");
	}
	var platformOwner=false;
	platformSchema.findOne({"_id":ObjectId(platformId)},function(err,result){
 		if(err){res.status(400).json('err')}
 		if(!result){
 			res.status(401).json('platform is not exist')
 		}else{
			if(result.owner==username){
				platformOwner=true;
			}
			const newPlatformUser=new userPlatformInfoSchema({
		 		username:username,
				platformId:platformId,
				ownPlatform:platformOwner
			});
			newPlatformUser.save()
			.then(data=>{
				res.status(200).json("create new platform user")
			})
			.catch(err=>{res.status(400).json('unable to create new platform user')});
 		}
 	})
 	
}

const handleSearchUserPlatformInfo=(req,res)=>{
    const {user, skip, count} = req.body;
	query = {}
    query.username = user;

    platformSchema.find(query).limit(parseInt(count)).skip(parseInt(skip)).exec()
	.then(function(resp){
		res.status(200).json(resp);
	})
	.catch(function(err){
		res.status(400).json(err);
	})
}


// use for profile page
const handleGetUserPlatformInfo=(req,res)=>{
	const {username, platform} = req.body;
	// const {username}=req.session.username;
	if(!username){
		return res.status(400).json('not username');
	}
	if(!platform){
		return res.status(400).json('not platform');
	}
	userPlatformInfoSchema.findOne({username:username, platformName:platform},function(err,result){
 		if(err){res.status(400).json('err')}
 		if(!result.length){
 			res.status(401).json('The user does not have play record');
 		}else{
			res.status(200).json(result);
 		}
 	})
}

router.post("*", (req,res,next)=>{
	if(req.session.username)
		next();
	else
		res.status(401).json("Must be logged in to post data");

})


router.post("/stats",(req,res)=>{handleUserPlay(req,res)})
router.get("/stats", (req,res)=>{handleSearchUserPlatformInfo(req, res)});
router.get("/play",(req,res)=>{handleGetUserPlatformInfo(req,res)})
module.exports=router;