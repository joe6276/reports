const pdf = require("pdf-creator-node");
const fs = require("fs");
const sql=require('mssql')
require('dotenv').config()
let usersdata=[]

// Read HTML Template


let config = {
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD
   ,
  
    options: {
   
       encrypt: false,
       enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,


        
        idleTimeoutMillis: 30000
    }
    }


    sql.connect(config).then(pool =>{

      if(pool.connecting){
          console.log('connecting to the database')
      }
  
      if(pool.connected){
          console.log("connected")
      }
  }).catch(e=>console.log(e))

const createConnection = async ()=>{
    const pool = await sql.connect(config);

    const request = await pool.request();

    return request;
}



const myFunction = async ()=>{
  const request = await createConnection();

  const users = await (await request.query("select * from  Users")).recordsets[0]
  // console.log(users)

  const html = fs.readFileSync("index.html", "utf8");
  const options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
      header: {
          height: "10mm",
          contents: '<div style="text-align: center;"></div>'
      },
      footer: {
          height: "10mm",
          contents: {
                    
              default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            
          }
      }
  }
  
  const document = {
    html: html,
    data: {

      users: users,
    },
    path: "./out.pdf",
    type: "",
  };

  pdf
  .create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });




}



myFunction()
   


    
  
  