const { createClient } = require("@supabase/supabase-js");
const { SUPABASE_PROJ_URL, SUPABASE_API_KEY, ITEM_BUCKET } = require("./config");

const supabase = createClient(SUPABASE_PROJ_URL, SUPABASE_API_KEY);
const supabaseID = (id) => `supabase-${id}`;

module.exports = {
  instance: supabase,
  supabaseID,
  storage: {
    upload: async (filename, filebuffer) => {
      return await supabase
        .storage
        .from(ITEM_BUCKET)
        .upload(filename, filebuffer, {
          cacheControl: '3600',
          upsert: true,
          contentType: "image/png",
        });
    },
    
    download: async (filename) => {
      return await supabase
        .storage
        .from(ITEM_BUCKET)
        .download(filename);
    },
  },
};