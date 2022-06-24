const contentful = require('contentful')
const fs = require('fs-extra');
require('dotenv').config();

const client = contentful.createClient({
    space: process.env.CF_SPACE,
    accessToken: process.env.CF_CDA,
})
const CF_IMAGE_FIELD_NAME = 'image'

export_from_cf();

async function export_from_cf() {
    var total_entries_processed=0, total_entries=0;
    var export_cf = [];
    do{
        try{
            var entries = await client.getEntries({skip: total_entries_processed, limit: 1000});
            total_entries = entries.total;
            total_entries_processed+=entries.items.length;
            entries.items.forEach(entry => {
                var tmp = {};
                if(entry.fields && entry.fields[CF_IMAGE_FIELD_NAME]){
                    tmp['Entry_ID']=entry.sys.id;
                    tmp['Field_Name']=CF_IMAGE_FIELD_NAME;
                    tmp['src']='https:'+entry.fields[CF_IMAGE_FIELD_NAME].fields.file.url;
                    tmp['title']=entry.fields[CF_IMAGE_FIELD_NAME].fields.title;
                    tmp['description']=entry.fields[CF_IMAGE_FIELD_NAME].fields.description;
                    export_cf.push(tmp)
                }
            })
        }catch(e){
            console.log("Could not get entries: "+ e)
        }   
    }while(total_entries_processed<=total_entries)
    try{
        fs.writeJSON('export_json/export_from_CF.json', export_cf);
        console.log("Report saved in export_json/export_from_CF.json")
    }catch(e){
        console.log("Write to JSON file failed")
    }
}




