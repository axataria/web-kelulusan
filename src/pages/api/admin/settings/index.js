import {decodeToken} from "@/utility/token";
import {error401, error405, error500} from "@/utility/errorhandler";
import {getCookie} from "cookies-next";
import supabase from "@/lib/supabase";

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const token = getCookie('token-key-adm', { req, res });
                const verify = decodeToken(token);

                if (verify == null) return error401(res)

                const { data: settings, error } = await supabase
                    .from('Profile')
                    .select('*');

                if (error) return error500(res, error.message)

                res.status(200).json({ status: 200, data: settings })
            } catch (err) {
                error500(res, err.message)
            }
            break

        case 'POST':
            try {
                const token = getCookie('token-key-adm', { req, res });
                const verify = decodeToken(token);

                if (verify == null) return error401(res)

                const { error } = await supabase
                    .from('Profile')
                    .update(req.body)
                    .eq('id', 1);

                if (error) return error500(res, error.message)

                res.status(200).json({ status: 200, message: "Sukses" })
            } catch (err) {
                error500(res, err.message)
            }
            break

        default:
            error405(res)
    }
}