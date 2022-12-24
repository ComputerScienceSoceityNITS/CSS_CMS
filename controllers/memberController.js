const Member = require("../models/memberModel"); //schema
const cloudinary = require("cloudinary");

exports.addMember = async (req, res) => {
    try {

        const myCloud = await cloudinary.v2.uploader.upload(req.files.avatar.tempFilePath, {
            folder: "avatars",
        });
        const { name, role, session,year, socialMedia } = req.body;
        const member = await Member.create({
            name,
            role,
            session,
            year,
            socialMedia,
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

    } catch (err) {
        res.send(err.message)
    }
}


//update Member
exports.updateMember = async (req, res, next) => {
    try {
        let member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(500).json({
                success: false,
                message: "Member not found"
            })
        }
        member = await Member.findByIdAndUpdate(req.params.id, req.body, {
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
exports.deleteMember = async (req, res, next) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(500).json({
                success: false,
                message: "Member not found"
            })
        }
        if (user.avatar.public_id !== "") {
            const imageId = user.avatar.public_id;
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
exports.getMembers = async (req, res) => {
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
        const litreatureWing = members.filter((ele) => { return ele.role === "Litreature-Wing"; })
        const coHeads = members.filter((ele) => { return regex1.test(ele.role); })

        res.status(201).json({
            success: true,
            devWing, cpWing, executiveWing, mlWing, designWing, litreatureWing, coHeads, members
        });

    } catch (err) {
        res.send(err.message)
    }
}
