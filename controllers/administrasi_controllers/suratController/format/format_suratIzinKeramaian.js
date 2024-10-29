const db = require('../../../../models/index');
const jenisSuratModel = db.administration_DB.jenisSurat.suratIzinKeramaian; 

const format_suratIzinKeramaian = async (subSuratId) => {
    try {
        // const suratIzinKeramaian = await jenisSuratModel.suratIzinKeramaian.findById(subSuratId);
        const suratIzinKeramaian = await jenisSuratModel.findById(subSuratId);
        if (!suratIzinKeramaian) {
            throw new Error('Surat Izin Keramaian tidak ditemukan');
        }

        return `
        <table>
            <tr>
                <td>Hari Acara</td>
                <td>:</td>
                <td>
                    ${suratIzinKeramaian.hariAcara || '-'}
                </td>
            </tr>
            <tr>
                <td>Tanggal Acara</td>
                <td>:</td>
                <td>
                    ${suratIzinKeramaian.tanggalAcara || '-'}
                </td>
            </tr>
            <tr>
                <td>Waktu Acara</td>
                <td>:</td>
                <td>
                    ${suratIzinKeramaian.waktuAcara || '-'}
                </td>
            </tr>
            <tr>
                <td>Jenis Acara</td>
                <td>:</td>
                <td>
                    ${suratIzinKeramaian.jenisAcara || '-'}
                </td>
            </tr>
            <tr>
                <td>Lokasi Kegiatan</td>
                <td>:</td>
                <td>
                    ${suratIzinKeramaian.lokasiKegiatan || '-'}
                </td>
            </tr>
            
        </table>
        `;
    } catch (err) {
        console.error(err);
        throw err; 
    }
};

module.exports = format_suratIzinKeramaian;
