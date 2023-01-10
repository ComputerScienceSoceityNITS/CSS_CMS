const Member = require("../models/memberModel"); //schema
const cloudinary = require("cloudinary");
const { json } = require("body-parser");

exports.addMember = async(req, res) => {
    try {
        // console.log(req.body.socialMedia);
        let myCloud = await cloudinary.v2.uploader.upload(
            req.files.avatar.tempFilePath, {
                folder: "avatars",
            }
        );
        const { name, role, session, year, socialMedia } = req.body;
        const socialtmp = JSON.parse(socialMedia)
            // console.log(socialtmp);
        const member = await Member.create({
            name,
            role,
            session,
            year,
            socialMedia: socialtmp,
            avatar: {
                // public_id: "myCloud.public_id",
                // url: "myCloud.secure_url",
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        });
        res.status(201).json({
            success: true,
            member
        });
        // console.log(member);

    } catch (err) {
        res.send(err.message)
    }
}


//update Member
exports.updateMember = async(req, res, next) => {
    try {


        let member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(500).json({
                success: false,
                message: "Member not found"
            })
        }


        if (req.files) {
            const imageId = member.avatar.public_id;
            console.log("on the way to delete");
            await cloudinary.v2.uploader.destroy(imageId);
            console.log("deleted");
        }

        const bodyObj = req.body
            // console.log(bodyObj);
        const socialtmp = JSON.parse(bodyObj.socialMedia)
        bodyObj['socialMedia'] = socialtmp
            // console.log(bodyObj['socialMedia']);
        if (req.files) {
            const myCloud = await cloudinary.v2.uploader.upload(req.files.avatar.tempFilePath, {
                folder: "avatars",
            });
            bodyObj['avatar'] = {
                // public_id: "myCloud.public_id",
                // url: "myCloud.secure_url",
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        }


        member = await Member.findByIdAndUpdate(req.params.id, bodyObj, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            member
        })
    } catch (err) {
        res.send(err.message);
    }
}

//Delete Member
exports.deleteMember = async(req, res, next) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(500).json({
                success: false,
                message: "Member not found"
            })
        }
        if (member.avatar.public_id !== "") {
            const imageId = member.avatar.public_id;
            await cloudinary.v2.uploader.destroy(imageId);
        }

        await member.remove();

        res.status(200).json({
            success: true,
            message: "Member deleted"
        })
    } catch (err) {
        res.send(err.message);
    }
}

//get Members
exports.getMembers = async(req, res) => {
    try {
        const regex1 = /Co-Head/
        let members = await Member.find({ session: req.params.session });

        if (req.query.year !== undefined) {
            members = members.filter((ele) => { return ele.year === req.query.year; })
        }

        const devWing = members.filter((ele) => { return ele.role === "Dev-Wing"; })
        const cpWing = members.filter((ele) => { return ele.role === "CP-Wing"; })
        const executiveWing = members.filter((ele) => { return ele.role === "Executive-Wing"; })
        const mlWing = members.filter((ele) => { return ele.role === "ML-Wing"; })
        const designWing = members.filter((ele) => { return ele.role === "Design-Wing"; })
        const literaryWing = members.filter((ele) => { return ele.role === "Literary-Wing"; })
        const coHeads = members.filter((ele) => { return regex1.test(ele.role); })

        res.status(201).json({
            success: true,
            devWing,
            cpWing,
            executiveWing,
            mlWing,
            designWing,
            literaryWing,
            coHeads,
            members
        });

    } catch (err) {
        res.send(err.message)
    }
}