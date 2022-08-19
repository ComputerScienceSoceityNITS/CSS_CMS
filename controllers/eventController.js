const Event = require("../models/eventModel"); //schema
const cloudinary = require("cloudinary");

//create Event
exports.createEvent = async (req, res, next) => {
    try {
        let images = [];
        if (typeof req.body.images === "string") {
            images.push(req.body.images)
        }
        else images = req.body.images

        const imagesLink = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "events",
            });

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            })
        }

        req.body.images = imagesLink;
        const event = await Event.create(req.body);
        res.status(201).json({
            success: true,
            event
        })

    } catch (err) {
        res.send(err.message);
    }

}

//update Event
exports.updateEvent = async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(500).json({
                success: false,
                message: "Event not found"
            })
        }

        let images = [];
        if (typeof req.body.images === "string") {
            images.push(req.body.images)
        }
        else images = req.body.images

        //checking if any image is uploded or not
        if (images !== undefined) {
            //removing old images
            for (let i = 0; i < event.images.length; i++) {
                await cloudinary.v2.uploader.destroy(event.images[i].public_id);
            }

            //updating image links
            const imagesLink = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "events",
                });

                imagesLink.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                })
            }
            req.body.images = imagesLink;
        }
        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            event
        })
    } catch (err) {
        res.send(err.message);
    }
}

//Delete Event
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(500).json({
                success: false,
                message: "Event not found"
            })
        }

        //removing images from cloudinary
        for (let i = 0; i < event.images.length; i++) {
            await cloudinary.v2.uploader.destroy(event.images[i].public_id);
        }

        await event.remove();

        res.status(200).json({
            success: true,
            message: "Event deleted"
        })
    } catch (err) {
        res.send(err.message);
    }
}


//Get one Event Detail
exports.getEventDetails = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            })
        }

        res.status(200).json({
            success: true,
            event,
        })
    } catch (err) {
        res.send(err.message);
    }
}


//get all Event
exports.getAllEvents = async (req, res) => {
    try {
        const eventsCount = await Event.countDocuments();
        const events = await Event.find();
        res.status(201).json({
            success: true,
            events,
            eventsCount,
        })
    } catch (err) {
        res.send(err.message);
    }
}
