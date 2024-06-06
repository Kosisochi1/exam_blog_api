require('dotenv').config()
const db = require('./db')
const blogModel = require('./model/blogModel')
const mockData= require('./MOCK_DATA.json')


const start = async()=>{
    try {
       await  db.connect()
       await blogModel.create(mockData)
       process.exit(0)

    } catch (error) {
        console.error('failed connection')
        process.exit(1)
    }

}

start()