const {Schema} = require("mongoose");
module.exports = mongoose => {
    const dentalSchema = new mongoose.Schema(
        {
            name: String,
            owner: String,
            ownerId: Number,
            doctors: Array,
            address: String,
            city: String,
            coordinate: {
                longitude: Number,
                latitude: Number
            },
            openinghours: {
                monday: {
                    open: Number,
                    close: Number
                },
                tuesday: {
                    open: Number,
                    close: Number
                },
                wednesday: {
                    open: Number,
                    close: Number
                },
                thursday: {
                    open: Number,
                    close: Number
                },
                friday: {
                    open: Number,
                    close: Number
                }
            }
        },
        {
            timestamps: true
        }
    );

    dentalSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("Dental", dentalSchema);
}
