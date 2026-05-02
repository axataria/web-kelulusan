import {decodeToken} from "@/utility/token";
import supabase from "@/lib/supabase";
import {error401, error404, error405} from "@/utility/errorhandler";
import {getCookie} from "cookies-next";

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            const token = getCookie('token-key-adm', { req, res });
            const verify = decodeToken(token);
            if (verify == null) return error401(res)

            const { data: user, error } = await supabase
                .from('User')
                .select('username, name, role')
                .eq('username', verify.username)
                .single();

            if (error || !user) return error404(res)

            res.status(200).json({ status: 200, data: user })
            break
        default:
            return error405(res)
    }
}