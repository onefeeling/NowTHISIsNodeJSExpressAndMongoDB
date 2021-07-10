const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id }).populate("user").populate("campsites")
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne({user: req.user._id })
    .then(favorite => {
        if (favorite) {
            req.body.forEach(idObject => { if (!favorite.campsites.includes(idObject._id)) {
                favorite.campsites.push(idObject)         
            }})
            favorite.save().then( favorite => {
                res.json(favorite)
            })
        } else {
            Favorite.create({campsites: req.body, user: req.user._id})
            .then( favorite => {res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite); 
            })    
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({user: req.user._id })
    .then(favorite => {
        if (favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain'); 
            res.end('You do no have any favorites to delete.')
        }
    })
    .catch(err => next(err));
})

//favoriteId
favoriteRouter.route('/:favoriteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end(`Get operation not supported on /favorites/${req.params.favoriteId}`)
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne({user: req.user._id })
    .then(favorite => {
        if (favorite) {
            if (favorite.campsites.includes(req.params.favoriteId)) {
                res.end('That campsite is already in the list of favorites!')
            } else {
                favorite.campsites.push(req.params.favoriteId)
                favorite.save().then( favorite => {
                    res.json(favorite) 
                })
                
            }
        } else {
            Favorite.create({campsites: [req.params.favoriteId], user: req.user._id})
            .then( favorite => {res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite); 
            })  
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.favoriteId}`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            const toFilter = req.params.favoriteId
            favorite.campsites = favorite.campsites.filter(campsite => !campsite.equals(toFilter))
            console.log(toFilter)
            console.log(favorite.campsites)
            favorite.save().then( favorite => {
                res.json(favorite)
            })
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.end('There are no favorites to delete.')
        }
    })
    .catch(err => next(err));
})

module.exports = favoriteRouter;