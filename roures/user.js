import express from 'express';
import conn from '../config/db.js';

const router = express.Router();

// Create a new user
router.post('/',(req, res)=>{
    // console.log("The received data is", req.body)

    const {id,Name, Age, Email} = req.body;

    if(!id || !Name || !Age || !Email){
        res.status(422).json("Please fill all data")
    }

    try{
        conn.query("SELECT * FROM usertable WHERE Email = ?", Email,(req, result)=>{
            if(result.length){
                res.status(422).json("The user is already exist")
            }else{
                conn.query("INSERT INTO usertable SET ?",{id, Name, Age, Email},(err, result)=>{
                    if(err){
                        res.status(422).json("Error occur while Insering data")
                    }else{
                        res.status(201).json("Data save successfully")
                    }
                })
            }
        })
    }catch(error){
        res.status(422).json("Error in catch")

    }
});

// Get all user

router.get('/',(req, res)=>{
    try{
        conn.query("SELECT * FROM usertable",(err, result)=>{
            if(err){
                return res.status(422).json("Error occur while executing query")
            }else{
                return res.status(201).json(result)
            }
        })
    }catch(error){
        return res.status(500).json("Error occur while geting user")
    }
});

//get user by ID
router.get('/:id',(req, res)=>{
    const userid = req.params.id;
    const sql = 'SELECT * FROM usertable WHERE id = ?';
    conn.query(sql, [userid], (err, result)=>{
        if(err){
            res.status(500).json("Internal server error")
        };
        if(result.length===0){
            res.status(404).json("User not found")
        }else{
            res.status(201).json(result);
        }
    })
});

//update user by ID
router.put('/:id',(req, res)=>{
    const id = req.params.id;
    const {Name, Age, Email} =req.body;
    if(!Name || !Age || !Email){
        return res.status(422).json({message:"Please enter all data"})
    };
    const query = "UPDATE usertable SET Name = ? , Age = ? , Email = ? WHERE id = ?";
    conn.query(query,[Name, Age, Email, id],(err, result)=>{
        if(err){
            return res.status(500).json("Internel serner error" + err)
        };
        if(result.affectedRows===0){
            return res.status(422).json("User not found")
        };
        res.status(201).json({message:"User has updated", data:{id, Name, Age, Email}})
    })

});

//Delete user 

router.delete('/:id', (req, res)=>{
    const id = req.params.id;
    const query = "DELETE FROM usertable WHERE id = ?";
    conn.query(query, [id],(err, result)=>{
        if(err){
            return res.status(500).json({message:"Internel server error ", Error: err})
        }
        if(result.affectedRows===0){
            return res.status(404).json("User Not found")
        }
        res.status(200).json({message:"User deleted successfully "})
    })
})


export default router;
