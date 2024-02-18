import mongoose from 'mongoose';
import config from './config';
import Category from './models/Category';
import Product from './models/Product';
import User from './models/User';
import * as crypto from 'crypto';

const dropCollection = async (db: mongoose.Connection, collectionName: string)=>{
  try{
    await db.dropCollection(collectionName);
  }catch (e){
    console.log(`Collection ${collectionName} was missing, skipping drop`)
  }
}

const run = async()=>{
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection

  try{
    const collections = ['categories','products','users']

    for(const collectionName of collections){
      await dropCollection(db, collectionName)
    }

    const [cpuCategory, ssdCategory]=await Category.create({
      title:'CPUs',
      description:'Central Processing Units',
    },
      {
        title: 'SSDs',
        description:"Solid State Drivers"
      })

    await Product.create({
      title:'Intel Core i7 12700k',
      price: 350,
      category: cpuCategory,
      image:'fixture/cpu.jpg'
    },{
      title:'Samsung 990 Pro 1TB',
      price: 170,
      category: ssdCategory,
      image:'fixtures/ssd.jpg'
    })

    await User.create({
      username:'user',
      password:'1@345qWert',
      token: crypto.randomUUID()
    })

    await db.close()

  }catch (e){
    console.log('Collection were missing, skipping drop')
  }
}

void run()