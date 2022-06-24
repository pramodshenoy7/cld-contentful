var cloudinary = require('cloudinary').v2
const fs = require('fs-extra');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLD_CLOUD,
    api_key: process.env.CLD_KEY,
    api_secret: process.env.CLD_SECRET
})

var CLD_FOLDER="cms"
var raw_transformation="f_auto/q_auto"
var success=0, failure=0, total=0;

import_to_CLD();

async function import_to_CLD(){
    var export_cld=[];
    var cf_entries = await fs.readJson('export_json/export_from_CF.json');
    cf_entries.forEach(async entry => {
        try{
            var smd = "cf_entry_id="+entry['Entry_ID']
            var cmd = "alt="+entry.description+"|caption="+entry.title;
            var response = await cloudinary.uploader.upload(entry.src, {folder: CLD_FOLDER, use_filename:true, unique_filename:false, metadata:smd, context:cmd})
            success++;
            var tmp = {};
            tmp['Entry_ID']=entry.Entry_ID;
            tmp['Field_Name']=entry.Field_Name;
            response["original_url"] = response.url;
            response["original_secure_url"] = response.secure_url;
            response["raw_transformation"] = raw_transformation;
            response["url"] = response.url.split('/upload/')[0]+'/upload/'+raw_transformation+'/'+response.url.split('/upload/')[1]
            response["secure_url"] = response.secure_url.split('/upload/')[0]+'/upload/'+raw_transformation+'/'+response.secure_url.split('/upload/')[1]
            tmp['CLD_json']=response;
            export_cld.push(tmp)
        }catch(e){
            console.log("Upload Failed:"+e)
            failure++;
        }
        total++;
        if(total===cf_entries.length)
            callback(export_cld);
    })
}

function callback(export_cld) { 
    console.log('Upload to CLD process completed'); 
    console.log("Total:"+total)
    console.log("Success:"+success)
    console.log("Failure:"+failure)
    try{
        fs.writeJSON('export_json/export_from_CLD.json', export_cld);
        console.log("Report saved in xport_json/export_from_CLD.json")
    }catch(e){
        console.log("Write to JSON file failed")
    }
}