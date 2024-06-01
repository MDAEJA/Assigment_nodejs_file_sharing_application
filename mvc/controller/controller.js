// basic logic building of project

//file upload in server

//import multer to get form data from postman
const { error } = require("console");
const express = require('express')
const fs = require("node:fs")
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const fileModel = require("../model/model")

const nodemailer = require("nodemailer");
// const app = express();

const path = require("path");
const { writeFile, writeFileSync } = require("fs");

const uploadDirectryPath = path.join(__dirname,"..","files")






const storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, uploadDirectryPath)
            },
            filename: function (req, file, cb) {
                const fileName = uuidv4() + path.extname(file.originalname)
                cb(null,fileName)
              }
})

const fileStore = multer({
    storage : storage,
}).single("files");


const uploadFile = async(req,res)=>{
    fileStore(req,res,async(error)=>{
        console.log(req.body)
        if(error){
            console.log("Error while uploading the file : ",error)
            return;
        }
        console.log("File is added in file folder successfully")
        console.log(req.file);

        const newFile = new fileModel({
            originalFileName : req.file.originalname,
            newFileName : req.file.filename,
            size : req.file.size,
            path :req.file.path,
        });
       const newFileAdd = await newFile.save();
       console.log("file data is save in the db")
       res.json({
        status :"Success",
        message : "File Uploaded Successfully",
        _id : newFileAdd._id
    })
    })
    
}

const share_link = async(req,res)=>{
    try{
        const find_id = req.params.id;
    const file = await fileModel.findById(find_id);
    if(!file){
        return res.status(404).json({
            status : 'Reject',
            message :'File with given id is not found'
        })
    }
    res.json({
        status :"Success",
        message :" Link Is Generated",
        link : "http://localhost:8080/files/download/" + find_id
    })
} 
catch(err){
   res.status(505).json({
    status :'reject',
    message : "Somethings went wrong please try again later"
   })
}
    }


    const downloadFile =async (req,res)=>{
        try{
            const find_id = req.params.id;
            const file = await fileModel.findById(find_id);
            if(!file){
               return res.end('File with given id is not found')
            }
            res.download(file.path,file.originalFileName)
            // res.end("file is downloaded")
        }
        catch(err){
            return res.end("Somethings went wrong please try again later",err)
        }
    }
       

     const share_file_link = async(req,res)=>{
        try{
                const find_id = req.params.id;
                const file = await fileModel.findById(find_id);
                if(!file){
                    res.status(404).json({
                        status :' false',
                        message : 'File with given id is not found'
                    })
                }
                // file_data = file.path;
                fs.writeFileSync("url_data.txt",file.path);
                console.log(file.path);
                res.send(
                    `
              <!DOCTYPE html>
              <html lang="en">
              <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Form</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                }
                form {
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  width: 400px;
                }
                label {
                  font-weight: bold;
                }
                input[type="email"],
                input[type="text"],
                textarea {
                  width: 100%;
                  padding: 10px;
                  margin-top: 5px;
                  margin-bottom: 15px;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                  box-sizing: border-box;
                }
                textarea {
                  height: 100px;
                }
                button {
                  background-color: #4CAF50;
                  color: white;
                  padding: 10px 20px;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 16px;
                }
                button:hover {
                  background-color: #45a049;
                }
              </style>
              </head>
              <body>
              
              <form action="/send-email" method="post">
                <label for="email">Email:</label><br>
                <input type="email" id="email" name="email" required><br>
                <label for="subject">Subject:</label><br>
                <input type="text" id="subject" name="subject" required><br>
                
                <label for="message">Message:</label><br>
                <textarea id="message" name="message" rows="4" required></textarea><br><br>

                <button type="submit">Send Email</button>
              </form>
              
              </body>
              </html>  
              `
                )
            }
            catch(err){
               console.log(err)
               res.json({
                status : 'false',
                message :"Somethings went wrong please try again later" ,err
               })
            }
    }

    

   
const controllerFile = {
    uploadFile,
    share_link,
    downloadFile,
    share_file_link
}

module.exports = controllerFile