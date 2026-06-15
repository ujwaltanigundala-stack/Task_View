import Tasks from "../models/tasks.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as vectorService from './vectorService.js';

dotenv.config();

const SECRETE_KEY = process.env.SECRETE_KEY;

export async function createTask(data, token){
    let response;
    try
    {
        const payload = jwt.verify(token, SECRETE_KEY); //Authorization
        data.createdby = payload.crid;
        data.vector = await vectorService.generateVector(data.title + " " + data.description);
        await Tasks.create(data); //Insert into MongoDB
        response = {code: 200, message: "New task has been created"};
    }catch(e)
    {
        response = {code: 500, message: e.message};
    }
    return response;
}

//Get All Tasks
export async function getAllTasks(page, size, token)
{
    let response;
    try{
        const payload = jwt.verify(token, SECRETE_KEY); //Authorization

        //Pagination Calculation
        const skip = (page -1) * size;

        const tasks = await Tasks.find({createdby: payload.crid})
                                .skip(skip)         //Skip records for pagination
                                .limit(size)        //No of records to be fetched per page
                                .sort({_id: 1});    //Ascending order by _id (-1 for Descending order)

        const totalrecords = await Tasks.countDocuments({createdby: payload.crid});

        response = {code: 200, page: page, size: size, totalpages: Math.ceil(totalrecords / size), tasks: tasks};
    }catch(e)
    {
        response = {code: 500, message: e.message};
    }
    return response;
}

//Get Task
export async function getTask(id, token)
{
    let response;
    try{
        const payload = jwt.verify(token, SECRETE_KEY); //Authorization

        const task = await Tasks.findById({_id: id});

        response = {code: 200, task: task};
    }catch(e){
        response = {code: 500, message: e.message};
    }
    return response;
}

//Update Task
export async function updateTask(id, data, token)
{
    let response;
    try{
        const payload = jwt.verify(token, SECRETE_KEY); //Authorization

        data.vector = await vectorService.generateVector(data.title + " " + data.description);

        await Tasks.findOneAndUpdate({_id: id}, data);

        response = {code: 200, message: "Task updated successfully"};
    }catch(e)
    {
        response = {code: 500, message: e.message};
    }
    return response;
}

//Delete Task
export async function deleteTask(id, token)
{
    let response;
    try{
        const payload = jwt.verify(token, SECRETE_KEY); //Autorization

        await Tasks.findOneAndDelete({_id: id});

        response = {code: 200, message: "Task has been deleted"};
    }catch(e)
    {
        response = {code: 500, message: e.message};
    }
    return response;
}

//Vector Search
export async function vectorSearch(query, token)
{
    let response;
    try
    {
        const payload = jwt.verify(token, SECRETE_KEY); //Authoeization

        const queryVector = await vectorService.generateVector(query);

        const tasks = await Tasks.find({createdby: payload.crid});

        const searchResult = tasks.map(task=>{
            const similiraty = vectorService.cosineSimilarity(queryVector, task.vector);
            console.log(task.title, similiraty);
            return {...task._doc, similiraty};
        })
        .filter(task => task.similiraty > 0.10)
        .sort((a,b)=>b.similiraty - a.similiraty)
        .slice(0, 5);

        response = {code: 200, tasks: searchResult};
    }catch(e)
    {
        response = {code: 500, message: e.message};
    }
    return response;
}

export async function getMyTasks(page, size, token)
{
    let response;

    try
    {
        const payload = jwt.verify(token, SECRETE_KEY);

        console.log("JWT PAYLOAD =", payload);

        const userid = Number(payload.crid);

        const skip = (Number(page) - 1) * Number(size);

        const tasks = await Tasks.find({
            assignedto: userid
        })
        .skip(skip)
        .limit(Number(size))
        .sort({ _id: 1 });

        const totalrecords = await Tasks.countDocuments({
            assignedto: userid
        });

        console.log("USER ID =", userid);
        console.log("TASKS FOUND =", tasks.length);

        response = {
            code: 200,
            page: Number(page),
            size: Number(size),
            totalpages: Math.ceil(totalrecords / Number(size)),
            tasks: tasks
        };
    }
    catch(e)
    {
        console.log("MY TASK ERROR =", e);

        response = {
            code: 500,
            message: e.message
        };
    }

    return response;
}