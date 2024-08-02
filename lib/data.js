//Dependencies
const fs = require('fs');
const path = require('path');

//Module Scafolding
const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname,'/../.data/');

//write data to file
lib.create = (dir, file, data, callBack)=>{
    //open file to write 
    fs.open(`${lib.basedir+dir}/${file}.json`,'wx',(err, fileDescriptor)=>{
        if (!err && fileDescriptor) {

            const dataString = JSON.stringify(data);

            fs.writeFile(fileDescriptor,dataString,(err)=>{
                if(!err){
                    //Close the file
                    fs.close(fileDescriptor,(err)=>{
                        if(!err){
                            callBack(false);
                        }
                        else{
                            callBack('Error occur closing the file!');
                        }
                    });
                }
                else{
                    callBack('Error writting to new file!');
                }
            });
        }
        else{
            callBack(err);
        }
    });
};

//read data from file
lib.read = (dir, file, callBack) => {
    fs.readFile(`${lib.basedir+dir}/${file}.json`,'utf8',(err, data) => {
        callBack(err, data);
    });
};

//update the file 
lib.update = (dir, file, data, callBack) => {
    fs.open(`${lib.basedir+dir}/${file}.json`,'r+',(err, fileDescriptor) => {
        if(!err && fileDescriptor){
            const dataString = JSON.stringify(data);
            
            //Truncate the file
            fs.truncate(`${lib.basedir+dir}/${file}.json`,(err) => {
                if(!err){
                    //write in the file
                    fs.writeFile(fileDescriptor, dataString, (err) => {
                        if(!err){
                            //Close the file
                            fs.close(fileDescriptor, (err)=> {
                                if (!err) {
                                    callBack(false);
                                }
                                else{
                                    callBack(`Error closing the file!`)
                                }
                            })
                        }
                        else{
                            callBack(`Error updating the file!`)
                        }
                    });
                }
                else{
                    callBack(`Error Truncating the file!`);
                }
            })
        }
        else{
            callBack(`Error opening the file, File may not exist!`)
        }
        
    });
};

//Delete file 
lib.delete = (dir, file, callBack) => {
    fs.unlink(`${lib.basedir+dir}/${file}.json`,(err)=>{
        if (!err) {
            callBack(false);
        }
        else{
            callBack(`Error Deleting file!`)
        }
    });
};

module.exports = lib;