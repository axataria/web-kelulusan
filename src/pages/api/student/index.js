import {error401, error404, error500} from "@/utility/errorhandler";
import supabase from "@/lib/supabase";
import {getCookie} from "cookies-next";
import {decodeToken} from "@/utility/token";

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                // Verify JWT token
                const token = getCookie('token-key', { req, res });
                const { nisn } = decodeToken(token);

                if (nisn == null) return error401(res)

                // Find student
                const { data: student, error } = await supabase
                    .from('Student')
                    .select('*')
                    .eq('nisn', nisn)
                    .single();

                if (error || !student) return error404(res)

                // Update isOpen and openDate
                await supabase
                    .from('Student')
                    .update({ openDate: new Date().toISOString(), isOpen: 1 })
                    .eq('nisn', nisn);

                res.status(200).json({ status: 200, data: student })
            } catch (e) {
                error500(res, e.message)
            }
            break
        default:
            res.status(405).json({ status: 405, message: 'Method Not Allowed' })
    }
}
