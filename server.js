const express = require("express");
const bodyParser = require("body-parser");
const upload = require("express-fileupload");

const app = express();
//устанавливаем движок
app.set("view engine", "ejs");
app.use(upload());

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});

//данные программы 
var tasks = [{id:1,name:"task1",date: "2019-01-15",filename:"",isComplete:true},{id:2,name:"task2",date: "2019-03-05" ,filename:"",isComplete:false}];
var selectedTasks = tasks;
var freeId = 3;

//обрабатываем данные форм
app.post("/complete", urlencodedParser, function (request, response) {
    if(!request.body) 
    	return response.sendStatus(400);
    console.log("complete task :");
    console.log(request.body);
    for(var i = 0; i < tasks.length; i++) {
  		if(tasks[i].id == request.body.id) {
    		tasks[i].isComplete = true;
    		break;
  		}
  	}
    response.redirect("/");
});

app.post("/delete", urlencodedParser, function (request, response) {
    if(!request.body) 
    	return response.sendStatus(400);
    console.log("delete task :");
    console.log(request.body);
    for(var i = 0; i < tasks.length; i++) {
  		if(tasks[i].id == request.body.id) {
    		tasks.splice(i, 1);
    		selectedTasks = [];
    		selectedTasks = tasks;
    		break;
  		}
  	}
    response.redirect("/");
});

app.post("/show", urlencodedParser, function (request, response) {
	var completed=false;
	var notCompleted=false;

    if(!request.body) 
    	return response.sendStatus(400);
    console.log("show flags :");
    console.log(request.body);

    selectedTasks = [];
    if (request.body.completedCheck)
    	completed=true;
    if (request.body.notCompletedCheck)
    	notCompleted=true;
    for(var i = 0; i < tasks.length; i++) {
    	if (completed && notCompleted)
    		selectedTasks.push(tasks[i]);
    	else if (completed && tasks[i].isComplete)
    		selectedTasks.push(tasks[i]);
    	else if (notCompleted && !tasks[i].isComplete)
    		selectedTasks.push(tasks[i]);
  	}
  	response.redirect("/");
});

app.post("/add", urlencodedParser, function (request, response) {
    if(!request.body) 
    	return response.sendStatus(400);
    console.log("add task :");
    console.log(request.body);
    if (typeof request.files.filename !== "undefined")
    {
    	var file = request.files.filename;
    	var nameOfFile = request.files.filename.name;
    	file.mv(__dirname+"/uploads/"+nameOfFile);
    	tasks.push({id:freeId,name:request.body.name,date:request.body.date,filename:nameOfFile,isComplete:false});
    }
    else
    	tasks.push({id:freeId,name:request.body.name,date:request.body.date,filename:"",isComplete:false});
    freeId++;
    selectedTasks=[];
    selectedTasks = tasks;
    response.redirect("/");
});

//обрабатываем маршрруты 
app.use(function(request, response, next){     
    if (request.url === "/")
   		next();
   	else
   	{
   		response.render("error", {
        	title: "ERROR",
        	code: 404,
        	text: "The page you are looking for was not found."
    	});
   	}
});

app.get("/", function(request, response){     
    response.render("main", {
        title: "Tasks",
        tasks: selectedTasks
    });
});
  
app.listen(3000,function () {
	console.log('App started');
});