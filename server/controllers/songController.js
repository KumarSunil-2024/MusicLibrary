const Song =
require("../models/Song");

exports.createSong =
async(req,res)=>{

 try{

  const song =
  await Song.create(
   req.body
  );

  res.status(201)
  .json(song);

 }
 catch(error){

  res.status(500)
  .json({
   message:error.message
  });

 }

};

exports.getSongs =
async(req,res)=>{

 try{

  const songs =
  await Song.find({
   visibility:true
  });

  res.json(songs);

 }
 catch(error){

  res.status(500)
  .json({
   message:error.message
  });

 }

};

exports.getSongById =
async(req,res)=>{

 try{

  const song =
  await Song.findById(
   req.params.id
  );

  res.json(song);

 }
 catch(error){

  res.status(500)
  .json({
   message:error.message
  });

 }

};

exports.updateSong =
async(req,res)=>{

 try{

  const song =
  await Song.findByIdAndUpdate(
   req.params.id,
   req.body,
   {new:true}
  );

  res.json(song);

 }
 catch(error){

  res.status(500)
  .json({
   message:error.message
  });

 }

};

exports.deleteSong =
async(req,res)=>{

 try{

  await Song.findByIdAndDelete(
   req.params.id
  );

  res.json({
   message:
   "Song Deleted"
  });

 }
 catch(error){

  res.status(500)
  .json({
   message:error.message
  });

 }

};