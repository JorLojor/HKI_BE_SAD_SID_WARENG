const db = require('../../../../models/index');
const jenisSuratModel = db.administration_DB.jenisSurat.suratKeteranganKelahiran;

const format_suratKeteranganKelahiran = async (subSuratId) => {
    try {
        const suratKeteranganKelahiran = await jenisSuratModel.suratKeteranganKelahiran.findById(subSuratId);
        if (!suratKeteranganKelahiran) {
            throw new Error('Surat Keterangan Kelahiran tidak ditemukan');
        }

        return `
        <table>
            <tr>
                <td>NIK Pelapor</td>
                <td>:</td>
                <td>
                    ${suratKeteranganKelahiran.nikPelapor || '-'}
                </td>
            </tr>
            <tr>
                <td>NIK Ayah</td>
                <td>:</td>
                <td>
                    ${suratKeteranganKelahiran.nikAyah || '-'}
                </td>
            </tr>
            <tr>
                <td>NIK Ibu</td>
                <td>:</td>
                <td>
                    ${suratKeteranganKelahiran.nikIbu || '-'}
                </td>
            </tr>
            <tr>
                <td>Nama Anak</td>
                <td>:</td>
                <td>
                    ${suratKeteranganKelahiran.namaAnak || '-'}
                </td>
            </tr>
            <tr>
                <td>Tempat Lahir</td>
                <td>:</td>
                <td>
                    ${suratKeteranganKelahiran.tempatLahir || '-'}
                </td>
            </tr>
            <tr>
                <td>Tanggal Lahir</td>
                <td>:</td>
                <td>
                    ${suratKeteranganKelahiran.tanggalLahir || '-'}
                </td>
            </tr>
            <tr>
                <td>Jenis Kelamin</td>
                <td>:</td>
                <td>
                    ${suratKeteranganKelahiran.jenisKelamin || '-'}
                </td>
            </tr>
            <tr>
                <td>Nama Pelapor</td>
                <td>:</td>
                <td>
                    ${suratKeteranganKelahiran.namaPelapor || '-'}
                </td>
            </tr>
            <tr>
                <td>Hubungan Pelapor</td>
                <td>:</td>
                <td>
                    ${suratKeteranganKelahiran.hubunganPelapor || '-'}
                </td>
            </tr>
           
        </table>
        `;
    } catch (err) {
        console.error(err);
        throw err; 
    }
}


module.exports = format_suratKeteranganKelahiran;
