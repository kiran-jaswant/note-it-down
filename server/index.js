import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose,{model,Schema} from 'mongoose';

dotenv.config();

const app=express();
app.use(express.json());
app.use(cors());

const connectDB= async()=>{
   await mongoose.connect(process.env.MONGODB_URL)
    console.log("Connected to DB");

};
connectDB();

const PORT=5000;

const noteSchema=new Schema({
    title: String,
    content: String,
    category: String
});

const Note = model("Note",noteSchema);

app.post("/notes",async(req,res)=>{
    const{title,content,category}=req.body;

    const newNote=await Note.create({
        title:title,
        content:content,
        category:category
    });

    res.json({
        success:true,
        message:"Note added successfully",
        data:newNote
    });
});

app.get("/notes",async(req,res)=>{
    const notes=await Note.find();
  
    res.json({
        success:true,
        message:"Notes fetch successfully",
        data:notes
    })
})

app.get("/notes/:id",async(req,res)=>{
    const{id}=req.params;
    const note= await Note.findOne({_id:id});

    res.json({
        success:true,
        message:"Note fetched successfully",
        data:note
    })
})

app.put("/notes/:id",async(req,res)=>{
    const{id}=req.params;
    const{title,content,category}=req.body;

    const updatednote=await Note.updateOne({_id:id},{$set:{
        title:title,
        content:content,
        category:category
    }});

    res.json({
        success:true,
        message:"Note updated successfully",
        data:updatednote
    })
})

app.delete("/notes/:id",async(req,res)=>{
    const{id}=req.params;
    await Note.deleteOne({_id:id});

    res.json({
        success:true,
        message:"Note deleted succesfully",
        data:null
    })

})

app.get("/health",(req,res)=>{
    res.json({
        "success":true,
        "message":"server is healthy",
        "data":null
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})