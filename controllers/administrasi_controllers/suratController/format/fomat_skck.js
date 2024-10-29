const db = require('../../../../models/index');
const jenisSuratModel = db.administration_DB.jenisSurat.suratSkck;

const format_suratSkck = async (subSuratId) => {
    try {
        const suratSkck = await jenisSuratModel.findById(subSuratId);
        if (!suratSkck) {
            throw new Error('Surat Skck tidak ditemukan');
        }

        return `
        <table>
            <tr>
                <td>Keperluan</td>
                <td>:</td>
                <td>
                    ${suratSkck.keperluan || '-'}
                </td>
            </tr>
            <tr>
                <td>keterangan lain lain</td>
                <td>:</td>
                <td>
                    <ul>
                        ${(suratSkck.keteranganLainnya || []).map((isi, index) => `<li>${index + 1}. ${isi}</li>`).join('')}
                    </ul>
                </td>
            </tr>   
        </table>
        `;
    } catch (err) {
        console.error(err);
        throw err; 
    }
};

module.exports = format_suratSkck;
