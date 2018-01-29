const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Bring in mongoose model, Place, to represent a restaurant
const Place = mongoose.model('Place');

// TODO: create two routes that return json
// GET /api/places
// POST /api/places/create
// You do not have to specify api in your urls
// since that's taken care of in app.js when
// this routes file is loaded as middleware
router.get('/places', (req, res) => {
	const obj = {};

	if (req.query.cuisine) {
		obj.cuisine = req.query.cuisine;
	}

	if (req.query.location) {
		obj.location = req.query.location;
	}

	Place.find(obj, function(err,places){
    if (err) {
      res.send("error")
    }
    else {
			res.send(JSON.stringify(places));
    }
  });
});

router.post('/places/create', (req, res) => {
	const place = new Place({
		name: req.body.name,
		cuisine: req.body.cuisine,
		location: req.body.location
	});

	place.save(function(err,place){
		if(err){
			res.send(err)
		}
		else{
			res.json(place.toObject());
		}
	})
});

module.exports = router;
