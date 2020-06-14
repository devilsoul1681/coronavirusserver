
const express=require("express");
const cors = require('cors'); // addition we make
const bodyParser=require("body-parser");
const https=require("https");
const fileUpload = require('express-fileupload'); //addition we make
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(fileUpload());
function compare(a, b) {
    if (a.value > b.value) return 1;
    if (b.value > a.value) return -1;
  
    return 0;
  }

  app.get("/",function(rq,rs){
            rs.sendFile(__dirname +"/index.html");
  })

  const port=process.env.PORT || 8000;
app.get("/Confirmed",function(rq,rs){
    let confirmedcountries=[];
    url="https://covid19.mathdro.id/api/countries";
    https.get(url,function(response){
        response.on("data",function(data){
            const info=JSON.parse(data);
            for(let i=0;i<info.countries.length;i++){
                const country=info.countries[i].iso2;
                const nexturl="https://covid19.mathdro.id/api/countries/"+country;
                https.get(nexturl,function(nextresponse){
                    nextresponse.on("data",function(data2){
                        const info2=JSON.parse(data2);
                        if(info2.confirmed){
                            confirmedcountries.push({
                                country:info.countries[i].name,
                                iso2:country,
                                value:info2.confirmed.value
                            })
                        }

                    })
                })   
            }
            setTimeout(()=>{
               confirmedcountries.sort(compare);
               let cocountries=[];
               for(let i=confirmedcountries.length-1;i>=confirmedcountries.length-10;i--){
                   cocountries.push(confirmedcountries[i]);
               }
                rs.send(cocountries);
            },2000)
        })
    })  
})


app.get("/Deaths",function(rq,rs){
    let deathscountries=[];
    url="https://covid19.mathdro.id/api/countries";
    https.get(url,function(response){
        response.on("data",function(data){
            const info=JSON.parse(data);
            for(let i=0;i<info.countries.length;i++){
                const country=info.countries[i].iso2;
                const nexturl="https://covid19.mathdro.id/api/countries/"+country;
                https.get(nexturl,function(nextresponse){
                    nextresponse.on("data",function(data2){
                        const info2=JSON.parse(data2);
                        if(info2.confirmed){
                            deathscountries.push({
                                country:info.countries[i].name,
                                iso2:country,
                                value:info2.deaths.value
                            })
                        }
                    })
                })
            }
            setTimeout(()=>{
            deathscountries.sort(compare);
            let cocountries=[];
            for(let i=deathscountries.length-1;i>=deathscountries.length-10;i--){
                cocountries.push(deathscountries[i]);
            }
            rs.send(cocountries);
            },2000)
        })
    })
    
})



app.listen(port,function(){
    console.log("Server is running on port 8000");
})