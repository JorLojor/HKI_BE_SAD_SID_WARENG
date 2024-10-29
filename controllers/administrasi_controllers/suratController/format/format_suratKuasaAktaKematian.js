const db = require('../../../../models/index');
const jenisSuratModel = db.administration_DB.jenisSurat.suratKuasaAktaKematian;




const format_suratKuasaAktaKematian = async (subSuratId) => {
    try {
        const suratKuasaAktaKematian = await jenisSuratModel.suratKuasaAktaKematian.findById(subSuratId);
        if (!suratKuasaAktaKematian) {
            throw new Error('Surat Kuasa Akta Kematian tidak ditemukan');
        }


        return `
        <table>
            <tr>
                <td>Nama Penerima Kuasa</td>
                <td>:</td>
                <td>
                    ${suratKuasaAktaKematian.namaPenerimaKuasa || '-'}
                </td>
            </tr>
            <tr>
                <td>NIK Penerima Kuasa</td>
                <td>:</td>
                <td>
                    ${suratKuasaAktaKematian.nikPenerimaKuasa || '-'}
                </td>
            </tr>
            <tr>
                <td>Tempat Lahir Penerima Kuasa</td>
                <td>:</td>
                <td>
                    ${suratKuasaAktaKematian.tempatLahirPenerimaKuasa || '-'}
                </td>
            </tr>
            <tr>
                <td>Tanggal Lahir Penerima Kuasa</td>
                <td>:</td>
                <td>
                    ${suratKuasaAktaKematian.tanggalLahirPenerimaKuasa || '-'}
                </td>
            </tr>
            <tr>
                <td>Jenis Kelamin Penerima Kuasa</td>
                <td>:</td>
                <td>
                    ${suratKuasaAktaKematian.jenisKelaminPenerimaKuasa || '-'}
                </td>
            </tr>
            <tr>
                <td>Agama Penerima Kuasa</td>
                <td>:</td>
                <td>
                    ${suratKuasaAktaKematian.agamaPenerimaKuasa || '-'}
                </td>
            </tr>
            <tr>
                <td>Pekerjaan Penerima Kuasa</td>
                <td>:</td>
                <td>
                    ${suratKuasaAktaKematian.pekerjaanPenerimaKuasa || '-'}
                </td>
            </tr>
            <tr>
                <td>Alamat Penerima Kuasa</td>
                <td>:</td>
                <td>
                    ${suratKuasaAktaKematian.alamatPenerimaKuasa || '-'}
                </td>
            </tr>
            <tr>
                <td>Nama Almarhum</td>
                <td>:</td>
                <td>
                    ${suratKuasaAktaKematian.namaAlmarhum || '-'}
                </td>
            </tr>
            <tr>
                <td>NIK Almarhum</td>
                <td>:</td>
                <td>
                    ${suratKuasaAktaKematian.nikAlmarhum || '-'}
                </td>
            </tr>
        </table>
        `;
    } catch (err) {
        console.error(err);
        throw err; 
    }
};

module.exports = format_suratKuasaAktaKematian;
