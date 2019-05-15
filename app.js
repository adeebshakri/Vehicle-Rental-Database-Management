var http=require('http');
var  cid;

var mysql = require('mysql'); //mysql 
var express=require('express');   //localhost connections
var bodyParser=require('body-parser'); // used in post function

var urlParser=bodyParser.urlencoded({extended:false});
var app=express();

var user_email='';
var cid=[];
app.use(express.static(__dirname +'/static'));

function days(Date1,Date2)
{
	var timediff=Math.abs(Date2.getTime()-Date1.getTime());
	var num=Math.ceil(timediff/(1000*3600*24));
	return num;
}

// console.log(days(new Date('7/13/2010'),new Date('7/15/2010')));
app.get('/',function(req,res){  //.get func is used to show and get all the respective pages. they are used to set the routes
	res.render('index.ejs');
})
.get('/login',function(req,res){
	res.render('login.ejs');
})
.get('/reg',function(req,res){
	res.render('reg.ejs');
})
.get('/bookacardate',function(req,res){
	res.render('bookacardate.ejs');
})

.get('/home',function(req,res){

	if(user_email=='')
		res.redirect('/login');


	else if(typeof(req.query.task)!='undefined' && req.query.task=='bookcar' && typeof(req.query.id)!='undefined')
    {
     console.log(req.query);
     var sql='insert into booking(cid,fromdate,todate,book_status,car_id)values(?,?,?,?,?)'
      var sql2='select * from booking where book_id=last_insert_id()'

		con.query(sql,[req.query.id,req.query.from,req.query.to,req.query.fare,req.query.carid],function(err,result,fields)
		{
			con.query(sql2,function(err2,result2,fields2)
			{
				console.log(result2);
			
			   if(err) 
			   	  res.render('home.ejs',{task:req.query.task,result:result2,status:"failure"});
			   else
				res.render('home.ejs',{task:req.query.task,result:result2,status:"success"});	
			});
		});
    }

    else if(typeof(req.query.task)!='undefined' && req.query.task=='bookbike' && typeof(req.query.id)!='undefined')
    {
    	console.log(req.query);
     var sql='insert into bookingbike(cid,fromdate,todate,bookbike_status,bike_id)values(?,?,?,?,?)'
      var sql2='select * from bookingbike where bookbike_id=last_insert_id()'
		con.query(sql,[req.query.id,req.query.from,req.query.to,req.query.fare,req.query.bikeid],function(err,result,fields)
		{
			con.query(sql2,function(err2,result2,fields2)
			{
				console.log(result2);
			
			   if(err)
			   	res.render('home.ejs',{task:req.query.task,result:result2,status:"failure"});
			else
				res.render('home.ejs',{task:req.query.task,result:result2,status:"success"});	
			});
		}); 
    }

    	else if(typeof(req.query.task)!='undefined' && req.query.task=='bookcar')
    {
    	res.render('home.ejs',{task:req.query.task});
    }



    else if(typeof(req.query.task)!='undefined' && req.query.task=='bookbike')
    {
    	res.render('home.ejs',{task:req.query.task});
    }



    else if(typeof(req.query.task)!='undefined' && req.query.task=='contactus')
    {
    	res.render('home.ejs',{task:req.query.task});
    }

     else if(typeof(req.query.task)!='undefined' && req.query.task=='feedback')
    {
    	res.render('home.ejs',{task:req.query.task});
    }
      else if(typeof(req.query.task)!='undefined' && req.query.task=='feedback_sub')
    {
    	res.render('home.ejs',{task:req.query.task});
    } 
    else if(typeof(req.query.task)!='undefined' && req.query.task=='logout')
    {
    	res.redirect('/');
    }

    else if(typeof(req.query.task)!='undefined' && req.query.task=='bookings')
    {	console.log(cid);
    	con.query("select book_id,cid,b.car_id,fromdate,todate,book_status,car_name from booking b,car c where cid=? and b.car_id=c.car_id", cid,function(err, results,fields){
    		if(err) {
    			console.log(err);
    		}
    		else {
    			
    			con.query("select bookbike_id,cid,b.bike_id,fromdate,todate,bookbike_status,bike_name from bookingbike b,bike c where cid=? and b.bike_id=c.bike_id", cid,function(err2, results2,fields2){
    			if(err2) {
    			      console.log(err2);
    		      }
    		     else
    		     {
                     res.render('home.ejs',{task:req.query.task,results:results,results2:results2});
    		     }
    		  });
    		}
    	});
    }

	else if(typeof(task)=='undefined'||task=='profile'){
		var sql='call customer(?);'
		con.query(sql,[user_email],function(err,result,fields)
		{
			console.log(result);
			if(err) throw err;
			else
				res.render('home.ejs',{result:result});
		});
	}
})
.post('/home',urlParser,function(req,res)
{
	if(typeof(req.query.task)!='undefined' && req.query.task=='bookcar')
    {
    	console.log(req.body);
    	var sql='select * from car where category=?'
    	con.query(sql,[req.body.car_type],function(err,result,fields){
    	  // console.log(result);
    	  var day=days(new Date(req.body.to),new Date(req.body.from));
    	  console.log(day);
           res.render('home.ejs',{task:req.query.task,result:result,data:req.body,cid:cid,car_id:result[0].car_id,day:day});
    	});

    }
    else if(typeof(req.query.task)!='undefined' && req.query.task=='bookbike')
    {
    	console.log(req.body.bike_type);
    	var sql='select * from bike'
    	con.query(sql,[req.body.bike_type],function(err,result,fields){
    	  var day=days(new Date(req.body.to),new Date(req.body.from));
    	  console.log(day);
           res.render('home.ejs',{task:req.query.task,result:result,data:req.body,cid:cid,bike_id:result[0].bike_id,day:day});
    	});

    }
     else if(typeof(req.query.task)!='undefined' && req.query.task=='feedback')
    {
    
    	var sql="insert into feedback(cid,subject,fbarea) values(?,?,?)"
    	var values=[cid,req.body.subject,req.body.fbarea]
		con.query(sql,values,function(err,result,fields){
		if(err) throw err;

	    res.redirect('/home?task=feedback_sub')

	});

    }
})
.post('/login',urlParser,function(req,res){

	var uname=req.body.username;
	var pwd=req.body.pass;
	var sql='select cid from Customer where EmailID=? and Password=?';
	con.query(sql,[uname,pwd],function(err,result,fields)
	{
		
		if(err) throw err;
		if(result.length>0)
		{
			cid=result[0].cid;
			//console.log(cid);
			user_email=uname;
			res.redirect('/home');
		}
		else
		{
			res.render('login.ejs',{status:"Invalid Username or Password"});			
		}
	});
})
.post('/register',urlParser,function(req,res)
{

	var sql="insert into Customer(Name,LicenseNo,Phno,Address,EmailID,Password) values(?,?,?,?,?,?)"
	var values=[req.body.name,req.body.LicenseNo,req.body.Phno,req.body.Address,req.body.EmailID,req.body.Password]
	con.query(sql,values,function(err,result,fields){
		if(err) throw err;

	res.redirect('/login')

	})
	console.log(req.body);
})
.listen(8080);






var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "adeeb123",
  database:"mydb"
});



con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

