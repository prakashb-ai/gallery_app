const express = require('express')
const router = express.Router()
const multer = require('multer')
const bodyparser = require('body-parser')
const images = require('../models/image_schema')
const dotenv = require('dotenv')
dotenv.config()


router.use(bodyparser.json())

const FILE_MAP_TYPE={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        const isValid = FILE_MAP_TYPE[file.mimetype]
        let uploadError = new Error('invalid image type')
        if(isValid){
            uploadError = null
        }
        cb(uploadError,'upload/image')
    },
    filename: function(req,file,cb){
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_MAP_TYPE[file.mimetype]
        cb(null,`${fileName}-${Date.now()}.${extension}`)
    }
    
})


const uploadOptions = multer({storage:storage})

router.post('/api/image/post',uploadOptions.single('image'),async(req,res)=>{
    const file = req.file
    if(!file)
        return res.status(400).json({message:"not upload"})

    const filename = file.filename
    

    const baseurl = `http://localhost:${process.env.PORT}/upload/image/`
    const image = new images({
        title :req.body.title,
        image: `${baseurl}${filename}`,
    })
        //res.send(image)
    const data_save = await image.save()

    if(!data_save)
        return res.status(400).json({message:"not upload"})
    else   
        return res.status(200).json({message:"upload"})
    

})
router.get('/api/get',async(req,res)=>{
    const get_data = await images.find()
    //res.send(get_data)

    if(get_data){
        return res.status(200).json({message:"data found",image_details:get_data})
    }
    else{
        return res.status(400).json({message:"data was not"})

    }
})

router.put('/:id',uploadOptions.single('image'),async(req,res)=>{
    const file = req.file
    let imaagepath;
    if(file)
    {
        const filename = file.filename
        const baseurl = `http://localhost:${process.env.PORT}/upload/image/`
        imaagepath=`${baseurl}${filename}`
    }
    else{
        imaagepath = images.image
    }
    const update_data = await images.findByIdAndUpdate(
        req.params.id,
        {
            title:req.body.title,
            image:`${imaagepath}`
        },
        {new:true}
    )
    res.send(update_data)

    if(update_data){
        return res.status(200).json({message:"data was updated"})
    }
    else{
        return res.status(400).json({message:"data was not updated "})
    }
    

})

router.patch('/api/:id',async(req,res)=>{
    const find_data = await images.findById(req.params.id)
    res.send(find_data)
    if(find_data){
        return res.status(200).json({message:"data was found "})
    }
    else{
        return res.status(400).json({message:"data was not found "})
    }

})


router.delete('/api/delete/:id',async(req,res)=>{
    const delete_data = await images.findByIdAndDelete(req.params.id)
    res.send(delete_data)
    if(delete_data){
        return res.status(200).json({message:"data was deleted "})
    }
    else{
        return res.status(400).json({message:"data was not deleted "})
    }
})

module.exports=router