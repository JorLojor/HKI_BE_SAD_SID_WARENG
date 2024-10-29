const db = require('../../../../models/index');
const jenisSuratModel = db.administration_DB.jenisSurat.suratIzinBepergian;

const format_suratIzinBepergian = async (subSuratId) => {
    try {
        const suratIzinBepergian = await jenisSuratModel.suratIzinBepergian.findById(subSuratId);
        if (!suratIzinBepergian) {
            throw new Error('Surat Izin Bepergian tidak ditemukan');
        }
        
        return `
        <table>
            <tr>
                <td>Alamat Sekarang</td>
                <td>:</td>
                <td>
                    ${suratIzinBepergian.alamatSekarang || '-'}
                </td>
            </tr>
            <tr>
                <td>Alamat Tujuan</td>
                <td>:</td>
                <td>
                    ${suratIzinBepergian.alamatTujuan || '-'}
                </td>
            </tr>
            <tr>
                <td>Berlaku Dari</td>
                <td>:</td>
                <td>
                    ${suratIzinBepergian.berlakuDari || '-'}
                </td>
            </tr>
            <tr>
                <td>Berlaku Sampai</td>
                <td>:</td>
                <td>
                    ${suratIzinBepergian.berlakuSampai || '-'}
                </td>
            </tr>
        </table>
        `;
    } catch (err) {
        console.error(err);
        throw err; 
    }
}

module.exports = format_suratIzinBepergian;
