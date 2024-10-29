const db = require('../../../../models');
const suratAcaraModel = db.administration_DB.suratAcara;

exports.setNomorSurat = async (req,res) => {
    try{
        const date = new Date();
        // const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);   
        const countSuratAcara = await suratAcaraModel.countDocuments();

        console.log("-----------------",countSuratAcara);

        // mengkonfersi bulan pada field createdAt di varibale suratAcara ke dalam bentuk string berupa angka romawi (januari = I, februari = II, dst)
        const month = date.toLocaleString('default', { month: 'long' });
        const monthRomawi = month === 'January' ? 'I' : 
        month === 'February' ? 'II' : 
        month === 'March' ? 'III' : 
        month === 'April' ? 'IV' : 
        month === 'May' ? 'V' : 
        month === 'June' ? 'VI' : 
        month === 'July' ? 'VII' : 
        month === 'August' ? 'VIII' : 
        month === 'September' ? 'IX' : 
        month === 'October' ? 'X' : 
        month === 'November' ? 'XI' : 'XII';

        
        const year = date.getFullYear(); 
        const setNomor = countSuratAcara.toString().padStart(3, '0'); 

        const newNomorSurat = `140 / ${setNomor} / ${monthRomawi} / ${year}`;
        console.log(newNomorSurat);
        return newNomorSurat;

    }catch(err){
        console.log(err);
        res.status(500).send({message:err.message});
    }
}


module.exports = exports;
