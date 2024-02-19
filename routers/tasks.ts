import { Router } from 'express';
import Task from '../models/Task';
import auth, { RequestWithUser } from '../middleware/auth';
import { TaskData } from '../types';
import mongoose from 'mongoose';
import User from '../models/User';

const tasksRouter = Router();

tasksRouter.get('/', async (req, res, next) => {
  try{
    const tasks = await Task.find()

    if (tasks.length === 0){

    res.send({message:'No tasks added yet', tasks})
    }
    res.send(tasks)
  }catch (e) {
    next(e)
  }
});

tasksRouter.post('/',auth, async (req: RequestWithUser,res,next)=>{
  try{
    const taskData: TaskData={
      user: req.user,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status
    }
    const task = new Task(taskData);
    await task.save()

    return res.send({message:'Task successfully created', data: task})

  }catch (e){
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e)
  }
})

tasksRouter.delete('/:id', auth,async(req:RequestWithUser,res,next)=>{
  try{
    const task = await Task.findById(req.params.id)

    const user = await User.findById(task?.user)

    if(user.token === req.user?.token){
      await Task.deleteOne({_id:req.params.id})
      return res.send('Task has been deleted')
    }

    return res.status(403).send('You are not permitted to perform this operation')
  }catch (e) {
    next(e)
  }
})

export default tasksRouter;
