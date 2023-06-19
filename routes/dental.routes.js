const dental = require("../controllers/dental.controller");
const router = require("express").Router();

module.exports = app => {
    // Create a new dental office
    router.post("/", dental.create);

    // Retrieve all dental offices
    router.get("/", dental.findAll);

    // Retrieve a single dental office with id
    router.get("/:id", dental.findOne);

    // Retrieve a single dental office with id
    router.get("/owner/:id", dental.findAllByOwnerId);

    // Update a notification with id
    router.put("/", dental.update);

    // Update a dental office with id and patch only included fields
    router.patch("/", dental.patch);

    // Delete a dental office with id
    router.delete("/:id", dental.delete);

    // Delete a dental office with id and userId
    router.delete("/:id/owner/:ownerId", dental.deleteByIdAndByOwnerId);

    // Delete all dental offices for userId
    router.delete("/owner/:id", dental.deleteAllByOwnerId);

    // Delete all dental offices - Oh no!
    router.delete("/", dental.deleteAll);

    app.use("/dentals", router);
};
