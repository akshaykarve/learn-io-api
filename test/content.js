var expect = require("chai").expect;
var axios = require("axios");
var bcrypt = require("bcrypt");
var crypto = require('crypto');
var fs = require("fs");

const FormData = require('form-data');

const platform_url="http://localhost:3000/platform";
const widgets_url="http://localhost:3000/widgets";
const media_url="http://localhost:3000/media";
const register_url="http://localhost:3000/register"
const delete_url = "http://localhost:3000/admin/users/delete"

let cookie = "";

let platform = {
    name:"", 
    image:"",
    description:"",
    modules:[],
    owner:""
}

let imagePath = "./image/bananaduck.jpg";
let imageStream = fs.createReadStream(imagePath, "utf8");
let imageData = fs.readFileSync(imagePath,"utf8"); 
//console.log("BASE64: ", imageData);
let imageExtension = ".jpg";

let imageHash = crypto.createHash('sha256').update(imageData).digest('utf8');


let platformId = "606ebcb8849da9406410cb28";

describe("Content Tests", function() {
    context('Media Test', function() {
        it("Uploads media to the server", function(){ 
            let form = new FormData();
            form.append('data', imageStream);
            form.append('extension', imageExtension);
            return axios({
                method: 'post',
                url: media_url,
                data:form,
                headers: form.getHeaders()
            }).then(function(response){
              	expect(response.status).to.equal(200, response.data.hash);
                expect(response.data.hash).to.equal(imageHash);
            })
        });
        it("Return media based on hash", function(){ 
            return axios({
                method: 'get',
                url: media_url+"/"+encodeURIComponent(imageHash)
            }).then(function(response){
              	expect(response.status).to.equal(200, response.data);
                delete response.data['_id'];
                delete response.data['__v'];
                expect(response.data).to.deep.equal({hash:imageHash, data:imageData, extension:imageExtension});
            })/*.catch(function(err){
                expect(err.response.status).to.equal(200, err.response.data);
                expect(err.response.data).to.deep.equal([{hash:imageHash, data:imageData, extension:imageExtension}]);
          })*/;
        });
    });
    context('Setting Up User', function() {
        it("Register for Session", function(){
            return axios({
                method: 'post',
                url: register_url,
                data: {
                    username: "bob",
                    password: "pass1",
                    verifyPassword: "pass1", 
                    email: "email@email.email",
                    dateOfBirth: "11/9/1999" //TODO: formatting?
                }
            }).then(function(response){
                cookie = response.headers["set-cookie"][0];
                expect(response.status).to.equal(200, response.data);
            });
        });
    });
    context('Setting Up', function() {
        //Need to put platform into db

        //Need to put pages into db

    });
    context("Platform Test", function() {
        it("Create platform", function(){ 
            return axios({
                method: 'post',
                url: platform_url,
                data:{
                    platformName:"All Those Obscure Berries",
                    image:"",
                    description:"In platform you learn about berries.",
                    owner:"bob"
                },
                headers: { Cookie: cookie }
            }).then(function(response){
              	expect(response.status).to.equal(200, response.data);
                // platformId=response.data.platformId;
            });
        });
        it("Update platform about", function(){ 
            return axios({
                method: 'post',
                url: platform_url+"/about",
                data:{
                    _id:platformId,
                    platformName:"All About Obscure Berries",
                    image:"",
                    description:"In this platform you'll learn all about berries that you didn't even know were berries."
                },
                headers: { Cookie: cookie }
            }).then(function(response){
              	expect(response.status).to.equal(200, "Success Update Platform About");
            });
        });

        // it("Get one platform by valid id", function(){ 
        //     return axios({
        //         method: 'get',
        //         url: platform_url+"/"+platformId,
        //     }).then(function(response){
        //       	expect(response.status).to.equal(200);
        //         expect(response.data).to.deep.equal({platformName:"All About Obscure Berries",image:"",description:"In this platform you'll learn all about berries that you didn't even know were berries.","modules":[]});
        //     });
        // });
        // it("Get one platform by invalid id", function(){ 
        //     return axios({
        //         method: 'get',
        //         url: platform_url+"/1",
        //     }).then(function(response){
        //       	expect(response.status).to.equal(200, response.data);
        //         expect(response.data).to.deep.equal([]);
        //     }).catch(function(error){
        //         expect(error.response.status).to.equal(500);
        //     });
        // });
        

        //WORKS UP TO HERE
    //     it("Updates a platform's about page and display information by _id", function(){
    //         return axios({
    //             method: 'post',
    //             url: platform_url,
    //             data:{
    //                 id="1",
    //                 title="",
    //                 mediaHash="",
    //                 desc=""
    //             }
    //         }).then(function(response){
    //           	expect(response.status).to.equal(200, response.data);
    //             expect(response.data).to.deep.equal([]);
    //         }).catch(function(error){
    //             expect(error.response.status).to.equal(400);
    //         });
    //     });
    //     it("Gets a platform's about page and display information", function(){
    //         return axios({
    //             method: 'get',
    //             url: platform_url+"/1/about",
    //         }).then(function(response){
    //           	expect(response.status).to.equal(200, response.data);
    //             expect(response.data).to.deep.equal([]);
    //         }).catch(function(error){
    //             expect(error.response.status).to.equal(400);
    //         });
    //     });
    //     it("Get all pages for a specific platform's module", function(){ 
    //         return axios({
    //             method: 'get',
    //             url: platform_url+"/1/2",
    //         }).then(function(response){
    //           	expect(response.status).to.equal(200, response.data);
    //             expect(response.data).to.deep.equal([]);
    //         }).catch(function(error){
    //             expect(error.response.status).to.equal(400);
    //         });
    //     });
    //     it("Get a specific page for a platform's module", function(){ 
    //         return axios({
    //             method: 'get',
    //             url: platform_url+"/1/2/3",
    //         }).then(function(response){
    //           	expect(response.status).to.equal(200, response.data);
    //             expect(response.data).to.deep.equal([]);
    //         }).catch(function(error){
    //             expect(error.response.status).to.equal(400);
    //         });
    //     });
    // });
    // context("Widget Test", function(){
    //     it("Get empty widget templates", function(){
    //         return axios({
    //             method: 'get',
    //             url: "/widgets",
    //         }).then(function(response){
    //             expect(response.status).to.equal(200, response.data);
    //             expect(response.data).to.deep.equal([
    //             {
    //                 widgetFlavor:"Flashcard",
    //                 text:[
    //                     {
    //                         front:"Text"
    //                     },{
    //                         back:"Text"
    //                     }
    //                 ]
    //             },{
    //                 widgetFlavor:"Image",
    //                 hash:""
    //             },{
    //                 widgetFlavor:"Sound",
    //                 hash:"" 
    //             },{
    //                 widgetFlavor:"MultipleChoice",
    //                 options:[
    //                     {option:"Text",isCorrect:true},
    //                     {option:"Text",isCorrect:false},
    //                     {option:"Text",isCorrect:false},
    //                     {option:"Text",isCorrect:false}                            
    //                 ],
    //                 buttonText:"Text",
    //                 rightAnswer:{
    //                     actionType:"S",
    //                     target:""
    //                 },
    //                 wrongAnswer:{
    //                     actionType:"P",
    //                     target:""
    //                 }
    //             },{
    //                 widgetFlavor:"Matching",
    //                 options:[
    //                     {
    //                         left:"Text",
    //                         right:"Text"
    //                     }
    //                 ],
    //                 buttonText:"Text",
    //                 rightAnswer:{
    //                     actionType:"S",
    //                     target:""
    //                 },
    //                 wrongAnswer:{
    //                     actionType:"P",
    //                     target:""
    //                 }
    //             },{
    //                 widgetFlavor:"Snacksnake",
    //                 options:[{
    //                     rightImage:"",
    //                     wrongImage:""
    //                 }],
    //                 rightAnswer:{
    //                     actionType:"S",
    //                     target:""
    //                 }
    //             },{
    //                 widgetFlavor:"Quicktime",
    //                 options:[
    //                     {text:"Text",actionType:"P",target:""},
    //                     {text:"Text",actionType:"P",target:""},
    //                     {text:"Text",actionType:"P",target:""},
    //                     {text:"Text",actionType:"P",target:""}
    //                 ],
    //                 timeout:{
    //                     actionType:"P",
    //                     target:"",
    //                     seconds:3
    //                 },
    //                 startText:"Start Text",
    //                 question:"Question Text"
    //             },{
    //                 widgetFlavor:"ImageButton",
    //                 hash:"",
    //                 click:{
    //                     actionType:"P",
    //                     target:""
    //                 }
    //             },{
    //                 widgetFlavor:"TextButton",
    //                 text:"",
    //                 click:{
    //                     actionType:"P",
    //                     target:""
    //                 }
    //             }]);
    //         }).catch(function(error){
    //             expect(error.response.status).to.equal(400);
    //         });
    //     });
    });
    context('Cleaning Up', function() {
        expect(process.env.NODE_ENV).to.not.equal('PROD');
        it("Deleting Registered User", function(){
            return axios({
                method: 'post',
                url: delete_url,
                data: {
                  username: 'bob'
                },
                headers: { Cookie: cookie }
            }).then(function(response){
                expect(response.status).to.equal(200, response.data);
            }).catch(function(err){
                expect(err.response.status).to.equal(200, err.response.data);
            });
        });
    });
});