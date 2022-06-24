const contentful = require('contentful-management')
const fs = require('fs-extra');
require('dotenv').config();

const client = contentful.createClient({
    accessToken: process.env.CF_CMA,
})

const CF_CLD_ID = 'cldImage';
var success=0, failure=0, total=0;

import_to_CF();

async function import_to_CF(){
    var cld_json = await fs.readJson('export_json/export_from_CLD.json');
    var space = await client.getSpace(process.env.CF_SPACE);
    var env = await space.getEnvironment(process.env.CF_ENVIRONMENT);
    cld_json.forEach(async cld => {
        var entry = await env.getEntry(cld.Entry_ID)
        var tmp=[];
        tmp.push(cld['CLD_json'])
        entry.fields[CF_CLD_ID] = {}
        entry.fields[CF_CLD_ID]['en-US'] = tmp
        try {
            var response = await entry.update()
            success++;
        }catch(e){
            console.log("Error adding to Contentful for ID: "+cld.Entry_ID+"|| error reason: "+e)
            failure++;
        }
        total++;
        if(total===cld_json.length)
            callback();
    })
}

function callback () { 
    console.log('all done'); 
    console.log("Total:"+total)
    console.log("Success:"+success)
    console.log("Failure:"+failure)
}

