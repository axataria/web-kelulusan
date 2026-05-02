import {error400, error404, error405, error500} from "@/utility/errorhandler";
import supabase from "@/lib/supabase";
import {setCookie} from "cookies-next";
import {signToken} from "@/utility/token";

export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            if (!req.body.nisn || !req.body.date) return error400(res)

            try {
                const nisn = req.body.nisn;
                const birth = req.body.date;

                // Find student by nisn and birth date
                const { data: student, error } = await supabase
                    .from('Student')
                    .select('*')
                    .eq('nisn', nisn)
                    .eq('tgl_lahir', birth)
                    .maybeSingle();

                if (error || !student) return error404(res)

                // Set cookie to save token
                setCookie('token-key', signToken({
                    nisn: student.nisn,
                }), { req, res, maxAge: 60 * 60 * 24, httpOnly: true, sameSite: true });

                res.status(200).json({ status: 200, message: 'Login Berhasil' })
            } catch (e) {
                return error500(res, e.message)
            }
            break
        default:
            return error405(res)
    }
}