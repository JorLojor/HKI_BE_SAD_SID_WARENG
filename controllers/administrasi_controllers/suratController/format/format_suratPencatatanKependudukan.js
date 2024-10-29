const db = require('../../../../models/index');
const jenisSuratModel = db.administration_DB.jenisSurat.suratPencatatanKependudukan;

const format_suratPencatatanKependudukan = async (subSuratId) => {
    try {
        const suratPencatatanKependudukan = await jenisSuratModel.suratPencatatanKependudukan.findById(subSuratId);
        if (!suratPencatatanKependudukan) {
            throw new Error('Surat Pencatatan Kependudukan tidak ditemukan');
        }

        return `
        <table>
            <tr>
                <td>Saksi Satu</td>
                <td>:</td>
                <td>
                    ${suratPencatatanKependudukan.saksiSatu || '-'}
                </td>
            </tr>
            <tr>
                <td>Saksi Dua</td>
                <td>:</td>
                <td>
                    ${suratPencatatanKependudukan.saksiDua || '-'}
                </td>
            </tr>
            <tr>
                <td>Keterangan</td>
                <td>:</td>
                <td>
                    <ul>
                        ${(suratPencatatanKependudukan.keretangan || []).map((isi, index) => `<li>${index + 1}. ${isi}</li>`).join('')}
                    </ul>
                </td>
            </tr>
        </table>`;
    } catch (err) {
        console.error(err);
        throw err; 
    }
};

module.exports = format_suratPencatatanKependudukan;
