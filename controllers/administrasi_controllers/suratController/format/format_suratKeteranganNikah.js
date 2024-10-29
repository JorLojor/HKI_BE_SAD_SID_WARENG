const db = require('../../../../models/index');
const jenisSuratModel = db.administration_DB.jenisSurat.suratKeteranganNikah;

const format_suratKeteranganNikah = async (subSuratId) => {
    try{
        const suratNikah = await jenisSuratModel.suratKeteranganNikah.findById(subSuratId);

        return `
            <table>       
                <tr>
                    <td>Status Pernikahan</td>
                    <td>:</td>
                    <td>${suratNikah.statusPernikahan}</td>
                </tr>
                <tr>
                    <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Atau beristri ke...</td>
                    <td>
                        ${suratNikah.istriKe}
                    </td>
                </tr>
            </table>

            <p>
                Adalah benar anak dari pernikahan seorang pria
            </p>
            <table>
                <tr>
                    <td>1. Nama lengkap dan alias</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.namaAyah}
                    </td>
                </tr>
                <tr>
                    <td>2. Nomor Induk Kependudukan (NIK)</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.nikAyah}
                    </td>
                </tr>
                <tr>
                    <td>3. Tempat dan Tanggal lahir</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.tempatlahirAyah}, ${suratNikah.tanggallahirAyah}
                    </td>
                </tr>
                <tr>
                    <td>4. Kewarganegaraan</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.kewargaNegaraanAyah}
                    </td>
                </tr>
                <tr>
                    <td>5. Agama</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.agamaAyah}
                    </td>
                </tr>
                <tr>
                    <td>6. Pekerjaan</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.pekerjaanAyah}
                    </td>
                </tr>
                <tr>
                    <td>7. Alamat</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.alamatAyah}
                    </td>
                </tr>
            </table>

            <p>
                Dengan seorang wanita
            </p>
            <table>
                <tr>
                    <td>1. Nama lengkap dan alias</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.namaIbu}
                    </td>
                </tr>
                <tr>
                    <td>2. Nomor Induk Kependudukan (NIK)</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.nikIbu}
                    </td>
                </tr>
                <tr>
                    <td>3. Tempat dan Tanggal lahir</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.tempatlahirIbu}, ${suratNikah.tanggallahirIbu}
                    </td>
                </tr>
                <tr>
                    <td>4. Kewarganegaraan</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.kewargaNegaraanIbu}
                    </td>
                </tr>
                <tr>
                    <td>5. Agama</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.agamaIbu}
                    </td>
                </tr>
                <tr>
                    <td>6. Pekerjaan</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.pekerjaanIbu}
                    </td>
                </tr>
                <tr>
                    <td>7. Alamat</td>
                    <td>:</td>
                    <td>
                        ${suratNikah.alamatIbu}
                    </td>
                </tr>
            </table>

            <p>
                Demikian surat pengantar ini dibuat dengan mengingat sumpah jabatan dan untuk dipergunakan sebagaimana mestinya.
            </p>
        `;
    }catch(err){
        console.log(err);
        res.status(500).send({message:err.message});
    }
};

module.exports = format_suratKeteranganNikah;
