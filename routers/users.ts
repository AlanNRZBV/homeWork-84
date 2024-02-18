import {Router} from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const usersRouter = Router();


usersRouter.post('/',async(req,res,next)=>{
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    user.generateToken();
    await user.save()

    res.send(user)
  } catch (e) {
    next(e)
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e)
    }
  }
})

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({username: req.body.username})

    if (!user) {
      return res.status(422).send({error: 'Username not found!'})
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res.status(422).send({error: 'Password is wrong'})
    }

    user.generateToken();
    await user.save();
    return res.send({message: 'Username and password is correct!', user})


  } catch (e) {
    next(e)
  }
})

export default usersRouter