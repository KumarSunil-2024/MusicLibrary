const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
{
  songName:{
    type:String,
    required:true
  },

  singer:{
    type:String,
    required:true
  },

  albumName:{
    type:String,
    required:true
  },

  musicDirector:{
    type:String,
    required:true
  },

  songUrl:{
    type:String,
    required:true
  },

  visibility:{
    type:Boolean,
    default:true
  }

},
{
  timestamps:true
}
);

module.exports =
mongoose.model(
"Song",
songSchema
);