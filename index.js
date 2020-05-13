const express               = require('express');
const app                   = express();
const path                  = require('path');
const createDAO             = require('./Models/dao');
const UserModel             = require('./Models/UserModel');
const PuzzelModel           = require('./Models/PuzzelModel');
const ScoreModel            = require('./Models/ScoreModel');
const BadgeModel            = require('./Models/BadgeModel');
const BadgesEarnedModel     = require('./Models/BadgesEarnedModel');
const AuthController        = require('./Controllers/AuthController');
const UploadController       = require('./Controllers/UploadController');
//const UserController        = require('./Controllers/UserController');
const redis                 = require('redis');
const session               = require('express-session');
const RedisStore            = require('connect-redis')(session);
const multer                = require('multer');
const bodyParser            = require('body-parser');



app.use(bodyParser.urlencoded({extended: true}));


/*
    uploading a picture
*/
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images');
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1];
        callback(null, `${file.fieldname}-${Data.now()}.${ext}`);
    }
});

var upload = multer ({ storage: storage }).single('puzzleImg');




/*
    Sessions
*/
const redisClient = redis.createClient();

const sess = session({
    store: new RedisStore({
        client: redisClient,
        host: 'localhost',
        port: 6379,
        ttl: 12 * 60 * 60,
    }),
    secret:'needs to be random string',
    resave: false,
    cookie: {
        httpOnly: true,
    },
    saveUninitialized: false,
});

app.use(sess);

/*
    Set database path
*/
const dbFilePath = process.env.DB_FILE_PATH || path.join(__dirname, 'Database', 'Jigsaw.db');
//let Jigsaw  = undefined;
let Auth    = undefined;

app.use(express.static('public'));

/*
    Parse the POST data from the browser
*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


/* 
    Default route
*/
app.get('/', (req, res) => {
    res.redirect('/jigsaw');
});

app.get("/jigsaw", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/jigsaw.html'));
});


/*
    Registration
*/
app.get("/register", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "register.html"));
});

app.post("/register", async (req, res) => {
    const body = req.body;
    console.log(body);
    if (body === undefined || (!body.username || !body.password)) {
        return res.sendStatus(400);
    }
    const {username, password} = body;
    try {
        await Auth.register(username, password);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


/*
    Login Page
*/
app.get("/login", errorHandler(async (req, res) => {
    if (req.session.isVerified) {
        console.log("already logged in");
        res.redirect("/puzzle")
    } else {
        res.sendFile(path.join(__dirname, "public", "html", "login.html"));
    }
}));

app.post("/login", errorHandler( async (req, res) => {
    if(req.body === undefined || (!req.body.username || !req.body.password)) {
        return res.sendStatus(400);
    }
    const {username, password} = req.body;
    const isVerified = await Auth.login(username, password);
    const status = isVerified ? 200 : 401;
    req.session.isVerified = isVerified;
    if(isVerified) {
        req.session.username = username;
        req.session.uuid = await Users.getUserID(username);
    }
    res.sendStatus(status);
    
}));


/*
    Puzzle
*/
app.get("/puzzle", errorHandler(async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "puzzle.html"));
}));

 

/*
    Creator
*/
app.get("/creator", errorHandler(async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "creator.html"));
}));

app.post("/upload", errorHandler(async (req, res) => {
    if(req.body === undefined) {
        return res.status(400);
    }

    upload(req, res, (err) =>  {
        if(err) {
            console.warn("error while uploading");
        } else {
            console.log(req.file);
        } 

        console.log("photo uploaded");
    })
    

    const name = req.body.puzzleName;
    const imgFileName = req.body.puzzleImg;
    const size = req.body.puzzleSize;
    console.log(`name: ${name}, imgFileName: ${imgFileName}, size: ${size}`);
    
    // try {
    //     await Puzzles.addPuzzle(name, size, imgFileName);
    //     res.sendStatus(200);
    // } catch (err) {
    //     console.log(err);
    //     res.sendStatus(500);
    // }

}));



/*
    Listen on port 80
*/
    app.listen(80, async () => {
    await initDB();
    console.log("Listening on port 80.");
});

async function initDB () {
    const dao = await createDAO(dbFilePath);
    Users = new UserModel(dao);
    await Users.createTable();
    Puzzles = new PuzzelModel(dao);
    await Puzzles.createTable();
    Auth = new AuthController(dao);
}


/*
    Error Handling
*/
// app.use(function (err, req, res, next) {
//     console.error(err.stack);
//     logger.error(err);
//     res.redirect('/error');
// });

function errorHandler (fn) {
    return function (req, res, next) {
        return fn(req,res, next).catch(next);
    };
};
