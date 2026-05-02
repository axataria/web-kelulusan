import supabase from "@/lib/supabase";
import {hashPassword} from "@/utility/hash";
import {signToken} from "@/utility/token";
import {error400, error404, error405, error500} from "@/utility/errorhandler";
import {setCookie} from "cookies-next";

export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            if (!req.body.username || !req.body.password) return error400(res)

            try {
                const { data: user, error } = await supabase
                    .from('User')
                    .select('username, name, role')
                    .eq('username', req.body.username)
                    .eq('password', hashPassword(req.body.password))
                    .single();

                if (error || !user) return error404(res)

                setCookie('token-key-adm', signToken({
                    username: user.username,
                }), { req, res, maxAge: 60 * 60 * 24, httpOnly: true, sameSite: true });

                res.status(200).json({ status: 200, message: "Login Berhasil" })
            } catch (e) {
                error500(res, e.message)
            }
            break
        default:
            return error405(res)
    }
}