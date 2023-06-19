const db = require("../models")
const Dental = db.dental;
const mongoose = require('mongoose');

//CREATE
exports.create = async (req, res) => {
    const dental = new Dental(
        {
            name: req.body.name,
            owner: req.body.owner,
            ownerId: req.body.ownerId,
            doctors: req.body.doctors,
            address: req.body.address,
            city: req.body.city,
            coordinate: {
                longitude: req.body.coordinate.longitude,
                latitude: req.body.coordinate.latitude
            },
            openinghours: {
                monday: {
                    open: req.body.openinghours.monday.open,
                    close: req.body.openinghours.monday.close
                },
                tuesday: {
                    open: req.body.openinghours.tuesday.open,
                    close: req.body.openinghours.tuesday.close
                },
                wednesday: {
                    open: req.body.openinghours.wednesday.open,
                    close: req.body.openinghours.wednesday.close
                },
                thursday: {
                    open: req.body.openinghours.thursday.open,
                    close: req.body.openinghours.thursday.close
                },
                friday: {
                    open: req.body.openinghours.friday.open,
                    close: req.body.openinghours.friday.close
                }
            }
        }
    );

    dental
        .save(dental)
        .then(newDental => {
            res.send(newDental);
        })
        .catch(err => {
            res.status(500).send({
                err: err,
                message:
                    "Some error occurred while creating a new dental office."
            });
        });
};

// Find all dental offices
exports.findAll = (req, res) => {
    Dental.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving dentals."
            });
        });
};

// Find a single dental office with an id
exports.findOne = (req, res) => {
    let id = req.params.id;
    Dental.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Dental office with id " + id + " not found." });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Dental office with id=" + id });
        });
};

// Find all dental for a user
exports.findAllByOwnerId = (req, res) => {
    const id = req.params.id;
    console.log('Owner id: ' + id)
    Dental.findOne({ ownerId: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No Dental office found for a user with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving for a user with id = " + id });
        });
};

// Update a Dental office state by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Dental.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Dental office with id=${id}.`
                });
            } else res.send({ message: "Dental office was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Dental office with id=" + id
            });
        });
};

// Update a Dental office by the id in the request
exports.patch = async (req, res) => {
    const id = req.params.id;
    const dental = await Dental.findById(id).exec();
    if (!dental) return res.status(404).send(`Cannot patch notification with id=${id}.`);

    let query = {
        name: dental.name,
        owner: dental.owner,
        ownerId: dental.ownerId,
        doctors: dental.doctors,
        address: dental.address,
        city: dental.city,
        coordinate: {
            longitude: dental.coordinate.longitude,
            latitude: dental.coordinate.latitude
        },
        openinghours: {
            monday: {
                open: dental.monday.open,
                close: dental.monday.close
            },
            tuesday: {
                open: dental.tuesday.open,
                close: dental.tuesday.close
            },
            wednesday: {
                open: dental.wednesday.open,
                close: dental.wednesday.close
            },
            thursday: {
                open: dental.thursday.open,
                close: dental.thursday.close
            },
            friday: {
                open: dental.friday.open,
                close: dental.friday.close
            }
        }
    };
    let isFound = false;

    for (let key in req.body) {
        if (dental[key] !== req.body[key]) { // Check if field exists
            isFound = true;
            query[key] = req.body[key];
        }
    }

    if (isFound) {
        const updatedDental = await Dental.updateOne({_id: id}, query).exec();
        res.send('Dental office was updated successfully!');
    } else
        res.status(404).send(`Cannot patch Dental office with id=${id}. All values are same.`);
};

// Delete a Dental office with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Dental.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Dental office with id=${id}. Maybe Dental office does not exist!`
                });
            } else {
                res.send({
                    message: "Dental office was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Dental office with id=" + id
            });
        });
};

// Delete one Dental office with the specified userid in the request
exports.deleteByIdAndByOwnerId = (req, res) => {
    const id = req.params.id;
    const ownerId = req.body.ownerId;
    Dental.findByIdAndDelete({ id: id, ownerId: ownerId }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Dental office with id=${id} for a User. Maybe Dental office does not exist!`
                });
            } else {
                res.send({
                    message: "Dental offices was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Dental office with id=" + id
            });
        });
};

// Delete all notifications with the specified userid in the request
exports.deleteAllByOwnerId = (req, res) => {
    const ownerId = req.params.id;
    Dental.deleteMany({ ownerId: ownerId }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Dental office for a User. Maybe Dental office does not exist!`
                });
            } else {
                res.send({
                    message: "Dental office deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Dental office"
            });
        });
};

// Delete all notifications from the database.
exports.deleteAll = (req, res) => {
    Dental.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} dental offices were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all dental offices."
            });
        });
};

exports.addDoctor = (msg) => {
    let data = JSON.parse(msg.content.toString())
    Dental.findOneAndUpdate(
            { _id: data.message.dentalId },
            { $addToSet: { 'doctors': parseInt(data.message.userId) } }
        )
        .then(dental => console.log('Doctor added successfully to the dental clinic'))
        .catch(err => { console.log('Error on addDoctor: ' + err)});
}
