import {error401, error405, error500} from "@/utility/errorhandler";
import supabase from "@/lib/supabase";
import multer from 'multer';
import xlsx from 'xlsx';
import {getCookie} from "cookies-next";
import {decodeToken} from "@/utility/token";

const storage = multer.memoryStorage();
const upload = multer({ storage });


export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            try {
                const token = getCookie('token-key-adm', { req, res });
                const verify = decodeToken(token);

                if (verify == null) return error401(res)

                upload.single('file')(req, res, async (error) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).end();
                    }

                    const { buffer } = req.file;
                    const workbook = xlsx.read(buffer, { type: 'buffer' });
                    const firstSheet = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheet];
                    const data = xlsx.utils.sheet_to_json(worksheet);

                    // Delete all existing students first
                    const { error: deleteError } = await supabase
                        .from('Student')
                        .delete()
                        .neq('nisn', '');  // matches all rows

                    if (deleteError) {
                        return res.status(500).json({ status: 500, message: deleteError.message });
                    }

                    // Insert new students from Excel
                    // tgl_lahir comes from Excel as a string — Postgres accepts ISO date strings
                    const { error: insertError } = await supabase
                        .from('Student')
                        .insert(data);

                    if (insertError) {
                        return res.status(500).json({ status: 500, message: insertError.message });
                    }

                    return res.status(200).json({ status: 200, message: "Import Success" });
                });
            } catch (err) {
                error500(res, err.message)
            }
            break
        default:
            error405(res)
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}