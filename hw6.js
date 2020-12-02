var express = require('express');
var mysql = require('./dbcon.js');
var request = require('request');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.render('home', context);
      
    });
});


app.post('/', function(req,res){
  var context = {};
  var object = {};

  if (req.body['Add Item']){ //if select new entry
    
    object ={"name" :req.body.name}
    
    if(req.body.name = '' || req.body.reps =='' || req.body.weight == '' || req.body.date =='' ||
      req.body.date =='' || req.body.unit == ''){
      
      return
    }else{

      var sql = "INSERT INTO workouts (name, reps, weight, date, lbs) VALUES ('"+ object.name+"', '"+req.body.reps+
      "', '" + req.body.weight+ "', '"+ req.body.date + "', '"+req.body.unit+"')";
      

      mysql.pool.query(sql, function(err,rows){
        if (err){
          return;
  
        }
        mysql.pool.query('SELECT * FROM workouts', function(err,rows,fields){
          if (err){
            return;
          }
          context.results = rows;
          res.render('home', context);
          
        })
      })
    }
  }//end of new entry
  

  if (req.body['delete']){ //if deleting row
    
    var row = req.body['delete'][1]
    
    var sql = "DELETE FROM workouts WHERE id=" + row

    mysql.pool.query(sql, function(err,rows){
      if (err){
        return;
      }
      mysql.pool.query('SELECT * FROM workouts', function(err,rows){
        if (err){
          return;
        }
        context.results = rows;
        res.render('home',context);
      })
    })
  } // end of delete

  if(req.body['edit']){ // user clicked edit row
    
    var row = req.body['edit'][1];
    var sql = "SELECT * FROM workouts where id=" + row
    mysql.pool.query(sql, function(err,rows){
      if (err){
        return;
      }
      context.results = rows;
      res.render('edit', context);

    })
    
  } // end of editing

  if (req.body['Edit Item']){ // sending edited data back from edit.handlebars
    
    var sql = "UPDATE workouts SET name=" +"'" + req.body.name + "'" + ", reps=" +  req.body.reps  + ", weight=" + req.body.weight +
    ", date=" + "'" + req.body.date+ "'" + ", lbs=" + req.body.unit + " WHERE id=" + req.body.id;
    

    mysql.pool.query(sql, function(err,results){
      if (err){
        console.log(err);
        return;
      }

      mysql.pool.query('SELECT * FROM workouts', function(err,rows){
        if(err){
          return;
        }
        context.results = rows;
        res.render('home', context);
      })
    })
  }// end of edited data


});


app.use(function(req,res){
    res.status(404);
    res.render('404');
});
  
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});
  
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});