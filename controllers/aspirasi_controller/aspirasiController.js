const db = require('../../models');
const axios = require('axios');

const aspirasiModels = db.aspiration_DB.aspirasi;

const { env } = require('process');
require('dotenv').config();



exports.postAspirasi = async (req, res) => {
    try {
        const { aspirasi, isPublish, kategori } = req.body;
        const { wargaId } = req.params;

        const newAspirasi = await aspirasiModels.create({
            wargaId: wargaId,
            aspirasi: aspirasi,
            // validator: process.env.VALIDATOR_ID,
            // isPublish: isPublish,
            kategori
        });

        console.log(newAspirasi);

        res.send({
            message: "Aspirasi berhasil dibuat",
            data: newAspirasi
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: error.message || "Some error occurred while posting aspirasi."
        });
    }
};

exports.putAspirasi = async (req, res) => {
    try {
        const { aspirasiId } = req.params;
        const {isArchived} = req.body;
        const valArchived = isArchived ? isArchived : false;

        const dataAspirasi = await aspirasiModels.findByIdAndUpdate(
            aspirasiId,
            { isArchived: valArchived },
            { new: true }
        );
        console.log(update);

        if (!dataAspirasi) {
            return res.status(404).send({
                message: "Aspirasi not found"
            });
        }

        res.send({
            message: "Aspirasi berhasil diupdate",
            data: dataAspirasi
        });

    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while updating aspirasi."
        });
    }
};



exports.deleteAspirasi = async (req, res) => {
    try {
        const { aspirasiId } = req.params;
        const dataAspirasi = await aspirasiModels.findById(aspirasiId);
        if (!dataAspirasi) {
            return res.status(404).send({ message: "Not found aspirasi with id " + aspirasiId });
        }
        await aspirasiModels.findByIdAndDelete(aspirasiId);

        return res.status(200).send({ message: "Aspirasi berhasil dihapus" });

    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while deleting aspirasi."
        });
    }
};



exports.getAspirasiByWarga = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await aspirasiModels.find({wargaId:id});
        if (!data) {
            return res.status(404).send({ message: "Not found aspirasi with id " + id });
        }
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving aspirasi."
        });
    }
}


exports.getAspirasiApproved = async (req, res) => {
    try{
        // const {page, size} = req.query;
        // const {limit, offset} = getPagination(page, size);
        // const data = await aspirasiModels.find({isPublish:true, siApproved:true}).limit(limit).skip(offset);
        const data = await aspirasiModels.find({isPublish:true, siApproved:true});
        if(!data){
            return res.status(404).send({message:"Not found aspirasi approved"});
        }
        res.status(200).send(data);

    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving aspirasi."
        })
    };

}
        


exports.getAspirasiAll = async (req, res) => {
    try {
        // const { page, size } = req.query;
        // const { limit, offset } = getPagination(page, size);
        // const data = await aspirasiModels.find({isPublish:true}).limit(limit).skip(offset);
        const data = await aspirasiModels.find({isArchived: false});
        if (!data) {
            return res.status(404).send({ message: "Not found aspirasi" });
        }
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving aspirasi."
        });
    }
}

exports.getAspirasiKadesAT = async (req, res) => {
    try{
        const aspirasiKades = await aspirasiModels.find({isArchived:true});
        if(!aspirasiKades){
            return res.status(404).send({message:"Not found aspirasi kades"});
        }
        res.status(200).send(aspirasiKades);
    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving aspirasi."
        });
    }
};

exports.getAspirasiKadesAF = async (req, res) => {
    try{
        const aspirasiKades = await aspirasiModels.find({isArchived:false});
        if(!aspirasiKades){
            return res.status(404).send({message:"Not found aspirasi kades"});
        }
        res.status(200).send(aspirasiKades);
    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving aspirasi."
        });
    }
};





exports.getAspirasiAdmin = async(req,res) => {
    try{
        const aspirasiAdmin = await aspirasiModels.find({isPublish:true})
        if(!aspirasiAdmin){
            return res.status(404).send({message:"Not found aspirasi admin"});
        }

        res.status(200).send(aspirasiAdmin);
    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving aspirasi."
        });   
    }
}

exports.getAspirasiKadesPagination = async (req, res) => {
    try{
        const {page, size} = req.query;
        const {limit, offset} = getPagination(page, size);
        const aspirasiKades = await aspirasiModels.find({isPublish:false}).limit(limit).skip(offset);
        if(!aspirasiKades){
            return res.status(404).send({message:"Not found aspirasi kades"});
        }
        res.status(200).send({
            "data" : aspirasiKades,
    });
    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving aspirasi."
        });
    }
};

exports.getAspirasiById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await aspirasiModels.find({wargaId:id});
        if (!data) {
            return res.status(404).send({ message: "Not found aspirasi with id " + id });
        }

        const arrAspirasi = [];

        data.map((aspirasi) => {
            arrAspirasi.push(aspirasi);
        }
        );


        
        res.status(200).send({
            "data": arrAspirasi
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving aspirasi."
        });
    }
}

// controller untuk get aspirasi dari id user
exports.getAspirasiByWarga = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await aspirasiModels.find({ wargaId: id });
        if (!data) {
            return res.status(404).send({ message: "Not found aspirasi with id " + id });
        }
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving aspirasi."
        });
    }
}
