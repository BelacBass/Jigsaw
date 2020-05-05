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
const UserController        = require('./Controllers/UserController');
const redis                 = require('redis');
const session               = require('express-session');
const RedisStore            = require('connect-redis')(session);


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
    cooki: {
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
app.get("/register", errorHandler(async (req, res) => {
    //console.log(`in the register get`);
    res.sendFile(path.join(__dirname, "public", "html", "register.html"));
}));

app.post("/register", errorHandler(async (req, res) => {
    const body = req.body;
    if (body === undefined || (!body.username || !body.password)) {
        return res.sendStatus(400);
    }
    const {username, password} = body;
    try {
        await Auth.register(username, password);
        // console.log(`status 200`);
        res.sendStatus(200);
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            //console.log(`problem in the catch`);
            console.error(err);
            logger.error(err);
            res.sendStatus(409); // conflict
        } else {
            throw err;
        }
    }
 }));


/*
    Login Page
*/
app.get("/login", errorHandler(async (req, res) => {
    if (req.session.isVerified) {
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
        req.session.uuid = await UserController.getUserId(username);
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
    Auth = new AuthController(dao);
}


/*
    Error Handling
*/
app.use(function (err, req, res, next) {
    console.error(err.stack);
    logger.error(err);
    res.redirect('/error');
});

function errorHandler (fn) {
    return function (req, res, next) {
        return fn(req,res, next).catch(next);
    };
};
