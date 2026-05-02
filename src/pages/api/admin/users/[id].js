import {getCookie} from "cookies-next";
import {decodeToken} from "@/utility/token";
import {error401, error405, error500} from "@/utility/errorhandler";
import supabase from "@/lib/supabase";
import {hashPassword} from "@/utility/hash";

export default async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                const { id } = req.query;

                const token = getCookie('token-key-adm', { req, res });
                const verify = decodeToken(token);

                if (verify == null) return error401(res)

                const { error } = await supabase
                    .from('User')
                    .delete()
                    .eq('username', id);

                if (error) return error500(res, error.message)

                res.status(200).json({ status: 200, message: "Deleted Success" })
            } catch (err) {
                error500(res, err.message)
            }
            break

        case 'GET':
            try {
                const { id } = req.query;

                const token = getCookie('token-key-adm', { req, res });
                const verify = decodeToken(token);

                if (verify == null) return error401(res)

                // Search students by nisn (partial match)
                const { data: students, error } = await supabase
                    .from('Student')
                    .select('*')
                    .ilike('nisn', `%${id}%`)
                    .limit(10);

                if (error) return error500(res, error.message)

                res.status(200).json({ status: 200, data: students })
            } catch (err) {
                error500(res, err.message)
            }
            break

        default:
            error405(res)
    }
}