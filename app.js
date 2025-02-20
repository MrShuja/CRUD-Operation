import express from 'express';
import router from './roures/user.js';
import conn from './config/db.js';


const app = express();

const PORT = 8000;
app.use(express.json());
app.use('/create',router)
app.use('/getalluser',router);
app.use('/user',router);
app.use('/update', router);
app.use('/delete',router);

app.listen(PORT,()=>{
    console.log(`The Server is running on PORT: ${PORT}`)
});

