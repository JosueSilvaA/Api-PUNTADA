var mongoose = require('mongoose');


const URI = "mongodb+srv://silva:wI58OeWxGVx98coq@puntadadb.xffos.mongodb.net/puntadadb?retryWrites=true&w=majority"
const connectDB = async () =>{
    await mongoose.connect(URI,{
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(result=>{
        console.log('Se conecto a mongoAtlas');
    })
    .catch(error =>{
        console.log(error);
    });
};

module.exports = connectDB;
