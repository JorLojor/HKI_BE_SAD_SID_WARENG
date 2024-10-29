const db = require('../../../../models/index');
const jenisSuratModel = db.administration_DB.jenisSurat.suratBantuanSosial;

const format_bantuanSosial = async (subSuratId) => {
    try {
        const suratBantuanSosial = await jenisSuratModel.suratBantuanSosial.findById(subSuratId);
        if (!suratBantuanSosial) {
            throw new Error('Surat Bantuan Sosial tidak ditemukan');
        }

        return `
        <table>
            <tr>
                <td>Keperluan</td>
                <td>:</td>
                <td>
                    ${suratBantuanSosial.keperluan || '-'}
                </td>
            </tr>
            <tr>
                <td>keterangan lain lain</td>
                <td>:</td>
                <td>
                    <ul>
                        ${(suratBantuanSosial.keteranganLainnya || []).map((isi, index) => `<li>${index + 1}. ${isi}</li>`).join('')}
                    </ul>
                </td>
            </tr>   
        </table>
        `;
    } catch (err) {
        console.error(err);
        throw err; // Lempar kesalahan untuk ditangani oleh pemanggil
    }
};

module.exports = format_bantuanSosial;
