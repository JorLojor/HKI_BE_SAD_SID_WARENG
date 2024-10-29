const db = require('../../../../models/index');
const jenisSuratModel = db.administration_DB.jenisSurat.suratKeteranganUsaha;; 

const format_suratIzinUsaha = async (subSuratId) => {
    try{
        const suratUsaha = await jenisSuratModel.suratKeteranganUsaha.findById(subSuratId);
        return `
            <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Yang bersangkutan benar - benar penduduk Kalurahan Wareng, Kapanewon Wonosari Kabupaten Gunungkidul dan memiliki usaha :
            </p>

            <table>
                <tr>
                    <td>1. Usaha pokok</td>
                    <td>:</td>
                    <td>${suratUsaha.usahaPokok}</td>
                </tr>
                <tr>
                    <td>2. Usaha sampingan</td>
                    <td>:</td>
                    <td>${suratUsaha.usahaSampingan}</td>
                </tr>
                <tr>
                    <td>3. Lokasi usaha</td>
                    <td>:</td>
                    <td>${suratUsaha.lokasiUsaha}</td>
                </tr>
            </table>
        `;
    }catch(err){
        console.log(err);
        res.status(500).send({message:err.message});
    }
};


module.exports = format_suratIzinUsaha;
