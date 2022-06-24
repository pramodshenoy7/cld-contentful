# Contentful Migration

## NodeJS Scripts
* export_entries_from_cf.js
  * Export Content from Contentful to a JSON file. Only content belonging to the content-type that has the field name set in the *const CF_IMAGE_FIELD_NAME* will be exported to JSON.
  * Export will be saved in ***export_json/export_from_CF.json***. 
* import_to_CLD.js
  * variable *raw_transformation* will hold the default transformation that will be selected in the Cloudinary app within Contentful
  * reads content from ***export_json/export_from_CF.json*** and uploads it to the folder defined in *var CLD_FOLDER*
  * for the Cloudinary upload response, it adds three more fields - original_url, original_secure_url and raw_transformation - to match the JSON object saved by MLW when user inserts it via the app.
  * Export file ***export_json/export_from_CLD.json*** is created and it contains a mapping between Contentful Content's Entry ID and Cloudinary upload JSON.
* import_to_cf.js
  *  reads content from ***export_json/export_from_CLD.json*** and updates Contentful Entry to include Cloudinary media (JSON)
* (optional)export_images_from_cf.js
  * to export assets from Contentful's own Media Library. Does not return mapping between assets and content (entry) in Contentful.
