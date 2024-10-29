const db = require('../../../../models/index');
const jenisSuratModel = db.administration_DB.jenisSurat.suratKeteranganTidakMampu;

const format_suratKeteranganTidakMampu = async (subSuratId) => {
    try {
        const suratKeteranganTidakMampu = await jenisSuratModel.suratKeteranganTidakMampu.findById(subSuratId);
        if (!suratKeteranganTidakMampu) {
            throw new Error('Surat Keterangan Tidak Mampu tidak ditemukan');
        }

        return `
        <table>
            <tr>
                <td>Pekerjaan</td>
                <td>:</td>
                <td>
                    ${suratKeteranganTidakMampu.pekerjaaan || '-'}
                </td>
            </tr>
            <tr>
                <td>Penghasilan</td>
                <td>:</td>
                <td>
                    ${suratKeteranganTidakMampu.penghasilan || '-'}
                </td>
            </tr>
            <tr>
                <td>keterangan lain lain</td>
                <td>:</td>
                <td>
                    <ul>
                        ${(suratKeteranganTidakMampu.keteranganLainnya || []).map((isi, index) => `<li>${index + 1}. ${isi}</li>`).join('')}
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


module.exports = format_suratKeteranganTidakMampu;
