const contentful = require('contentful')
const fs = require('fs');
require('dotenv').config();

const client = contentful.createClient({
    space: process.env.CF_SPACE,
    accessToken: process.env.CF_CDA,
})

export_from_cf();

async function export_from_cf() {
    var total_asset_processed=0, total_asset=0;
    do{
        try{
            var images = await client.getAssets({mimetype_group:'image', skip: total_asset_processed, limit: 1000})
            total_asset = images.total;
            total_asset_processed+=images.items.length;
            images.items.forEach(item => {
                console.log(item.fields)
            })
        }catch(e){
            console.log("Could not get images: "+ e)
        }   
    }while(total_asset_processed<=total_asset)
}



