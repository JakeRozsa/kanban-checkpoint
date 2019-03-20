let router = require('express').Router()
let Notes = require('../models/note')


let baseRoute = '/petowners/:petOwnerId/pets/:petId/notes'

//GET
//TESTED AND WORKS
router.get(baseRoute, (req, res, next) => {
  Notes.find({ petId: req.params.petId, identityId: req.session.uid })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
      next(err)
    })
})
//GET ONE
//TESTED AND WORKS
router.get(baseRoute + '/:id', (req, res, next) => {
  Notes.findOne({ _id: req.params.id, identityId: req.session.uid })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
      next(err)
    })
})


//POST
//TESTED AND WORKS
router.post(baseRoute, (req, res, next) => {
  req.body.identityId = req.session.uid
  Notes.create(req.body)
    .then(newNote => {
      res.send(newNote)
    })
    .catch(err => {
      console.log(err)
      next(err)
    })
})

//DELETE

router.delete(baseRoute + '/:id', (req, res, next) => {
  Notes.deleteOne({ _id: req.params.id, identityId: req.session.uid })
    .then(pet => {
      res.send("Successfully Deleted")
    })
    .catch(err => {
      res.status(400).send('Access Denied; Invalid Request')
    })
})

//PUT

router.put(baseRoute + '/:id', (req, res, next) => {
  Notes.findById(req.params.id)
    .then(note => {
      if (!note.identityId.equals(req.session.uid)) {
        return res.status(401).send("ACESS DENIED!")
      }
      note.update(req.body, (err) => {
        if (err) {
          console.log(err)
          next(err)
          return
        }
        res.send("Successfully Updated")
      })
    })
    .catch(err => {
      console.log(err)
      next(err)
    })
})

module.exports = router