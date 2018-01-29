// app.js

// set up express app
const express = require('express')
const app = express()

// set up body parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// set up static files
const path = require('path')
const publicPath = path.resolve(__dirname, 'public')
app.use(express.static(publicPath))

// require passport modules
const passport = require('passport')
const passportLocal = require('passport-local').Strategy
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
// const FacebookStrategy = require('passport-facebook').Strategy

// set up session management and use middleware
const session = require('express-session')
const sessionOptions = {
  secret: 'secret for signing session id',
  saveUninitialized: false,
  resave: false
}
app.use(session(sessionOptions))

// 1. uncomment this when you want to switch back to deployed heroku
app.set('port', (process.env.PORT || 8080))

// set up mongodb and mongoose middleware and our models imported
require('./db')
const mongoose = require('mongoose')
const Restaurant = mongoose.model('Restaurant')
const User = mongoose.model('User')
const LunchPlan = mongoose.model('LunchPlan')

// set up cookie parser middleware
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// setup express validator
const expressValidator = require('express-validator')
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    const namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

// Set up passport
app.use(passport.initialize())
app.use(passport.session())

// set view engine
app.set('view engine', 'hbs')

// global variables storage
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// routes below
app.get('/', ensureAuthenticated, function (req, res) {
  // if we've filtered both cuisine type and price
  if (req.query.cuisine && req.query.price) {
    Restaurant.find({userID: req.user._id, cuisinetype: req.query.cuisine, price: req.query.price}, function (err, rests, count) {
      if (err) {
        res.send(err)
      }
      console.log(rests)
      res.render('index', {rests: rests, first: req.user.first})
    })
  } else if (req.query.cuisine) { // filtering just by cuisine type
    console.log('filtering cuisine')

    Restaurant.find({userID: req.user._id, cuisinetype: req.query.cuisine}, function (err, rests, count) {
      if (err) {
        res.send(err)
      }
      console.log(rests)
      res.render('index', {rests: rests, first: req.user.first})
    })
  } else if (req.query.price) { // just filtered by price
    Restaurant.find({userID: req.user._id, price: req.query.price}, function (err, rests, count) {
      if (err) {
        res.send(err)
      }
      console.log(rests)
      res.render('index', {rests: rests, first: req.user.first})
    })
  } else { // no filter
    console.log('filtering none')
    Restaurant.find({userID: req.user._id}, function (err, rests, count) {
      if (err) {
        res.send(err)
      } else {
        // console.log(rests);
        res.render('index', {rests: rests, first: req.user.first})
      }
    })
  }
})

// redirect to log in page if user is not logged in (ensures authentication)--> pair with app.get'/'
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login')
  }
}

app.get('/add', function (req, res) {
  res.render('add')
})

app.post('/add', function (req, res) {
  const rest = new Restaurant(
    {
      userID: req.user._id,
      name: req.body.name,
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      cuisinetype: req.body.cuisine,
      price: req.body.price
    })

  console.log(rest.latlon)
  rest.save(function (err, list, count) {
    if (err) {
      console.log(err)
    }
    console.log('success')
    res.redirect('/')
  })
})

app.get('/lunchplan', function (req, res) {
  LunchPlan.find({userID: req.user._id}, function (err, plan, count) {
    if (err) {
      console.log(err)
    }
    console.log(plan)
    res.render('lunchplan', {plan: plan})
  }).limit(1).sort({$natural: -1})
})

app.get('/setplan', function (req, res) {
  Restaurant.find({userID: req.user._id}, function (err, rests, count) {
    if (err) {
      res.send(err)
    } else {
      res.render('setplan', {rests: rests})
    }
  })
})

app.post('/setplan', function (req, res) {
  console.log(req.body)
  const plan = new LunchPlan(
    {
      userID: req.user._id,
      monday: req.body.monday,
      tuesday: req.body.tuesday,
      wednesday: req.body.wednesday,
      thursday: req.body.thursday,
      friday: req.body.friday
    })

  plan.save(function (err, list, count) {
    if (err) {
      console.log(err)
    }
    console.log(plan)
    res.redirect('/lunchplan')
  })
})

app.get('/remove', function (req, res) {
  Restaurant.find({userID: req.user._id}, function (err, rests, count) {
    if (err) {
      res.send(err)
    } else {
      res.render('remove', {rests: rests})
    }
  })
})

app.post('/remove', function (req, res) {
  // returns an array of restaurant names to be deleted
  const deleteMe = Object.getOwnPropertyNames(req.body)
  // console.log(Object.getOwnPropertyNames(req.body));
  // console.log(deleteMe[0]);

  // higher order function #1
  deleteMe.forEach(function (rests) {
    Restaurant.remove({name: rests}, function (err, result) {
      if (err) {
        console.log(err)
      }
      console.log(result)
    })
  })

  // after we've deleted them, redirect to home page
  res.redirect('/')
})

app.get('/login', function (req, res) {
  res.render('login')
})

app.get('/profile', function (req, res) {
  res.render('profile', {username: req.user.username, email: req.user.email, first: req.user.first, last: req.user.last})
})

const User1 = require('./db')
app.post('/signup', function (req, res) {
  const first = req.body.first
  const last = req.body.last
  const email = req.body.email
  const username = req.body.username
  const password = req.body.password
  // const password2 = req.body.password2
  let admin = false

  if (username === 'admin') {
    admin = true
  }
  req.checkBody('first', 'First is required').notEmpty()
  req.checkBody('last', 'Last is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

  const errors = req.validationErrors()

  if (errors) {
    // 2. Higher Order Function #2 -- Map
    // map results to only get error msg in array of objects
    const map = errors.map(function (ele) {
      return ele.msg
    })
    console.log(errors)
    console.log(map)

    // 3. Higher Order Function #3 -- Reduce
    const str = map.reduce(function (pre, ele) {
      return pre + ' ' + ele + '\n'
    })

    // re-render login page displaying the errors to the user
    res.render('login', {errors: str})
  } else {
    // check database for email or username errors
    // 1. check if email has already been taken
    User1.find({'email': email}, function (err, user) {
      if (err) {
        console.log(err)
      } else {
        if (user.length !== 0) {
          console.log('Sorry. Email already exists.')
          res.render('login', {emailtaken: 'Sorry. Email already exists.'})
        }
      }
    })

    // 2. check if username has already been taken
    User1.find({'username': username}, function (err, user) {
      if (err) {
        console.log(err)
      } else {
        if (user.length !== 0) {
          console.log('Sorry. Username already exists.')
          res.render('login', {usertaken: 'Sorry. Username already exists.'})
        }
      }
    })

    // 3. User input is valid!
    const newUser = new User({
      first: first,
      last: last,
      email: email,
      username: username,
      password: password,
      admin: admin
    })
    User1.createUser(newUser, function (err, user) {
      if (err) {
        console.log(err)
        console.log(user)
      } else {
        const success = 'Successfully registered.'
        res.render('login', {success: success})
      }
    })
  }
})

passport.use(new passportLocal(
  function (username, password, done) {
    User.findOne({username: username}, function (err, user) {
      User1.getUserByUsername(username, function (err, user) {
        if (err) {
          throw err
        }
        if (!user) {
          return done(null, false, {message: 'unknown user'})
        }

        User1.comparePassword(password, user.password, function (err, isMatch) {
          if (err) throw err
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, {message: 'invalid password'})
          }
        })
      })
    })
  }))

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User1.getUserByID(id, function (err, user) {
    done(err, user)
  })
})

// passport.use(new FacebookStrategy({
//   clientID: '497467063957847',
//   clientSecret: '7caed98cade40dfaa1942ababb6ef87b',
//   // http://localhost:8080/auth/facebook/callback
//   callbackURL: 'https://guarded-sands-89367.herokuapp.com/auth/facebook/callback'
// },
// function (accessToken, refreshToken, profile, done) {
//   process.nextTick(function () {
//     User.findOne({'fbid': profile.id}, function (err, user) {
//       if (err) {
//         return done(err)
//       }
//
//       if (user) return done(null, user)
//
//       else {
//         console.log(profile)
//
//         const newUser = new User()
//         newUser.fbid = profile.id
//         newUser.fbtoken = accessToken
//         newUser.fbname = profile.displayName
//         newUser.first = profile.displayName.split(' ')[0]
//         newUser.last = profile.displayName.split(' ')[1]
//
//         newUser.save(function (err) {
//           if (err) {
//             throw err
//           }
//
//           return done(null, newUser)
//         })
//       }
//     })
//   })
// }
// ))

app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}), function (req, res) {
  res.redirect('/')
})

app.get('/logout', function (req, res) {
  req.logout()
  console.log('logged out. success')
  res.redirect('/login')
})

// 2. uncomment this when you want to switch back to deployed heroku
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
// app.listen(8080)
console.log('listening on port 8080')
