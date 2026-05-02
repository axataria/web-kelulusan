import {decodeToken} from "@/utility/token";
import {error401, error405, error500} from "@/utility/errorhandler";
import {getCookie} from "cookies-next";
import supabase from "@/lib/supabase";
import {hashPassword} from "@/utility/hash";

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const token = getCookie('token-key-adm', { req, res });
                const verify = decodeToken(token);

                if (verify == null) return error401(res)

                const { data: users, error } = await supabase
                    .from('User')
                    .select('username, name, role, createdAt');

                if (error) return error500(res, error.message)

                const formattedUsers = (users || []).map(user => {
                    const date = new Date(user.createdAt);
                    return {
                        ...user,
                        createdAt: date.toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                        })
                    };
                });

                res.status(200).json({ status: 200, data: formattedUsers })
            } catch (err) {
                error500(res, err.message)
            }
            break

        case 'POST':
            try {
                const token = getCookie('token-key-adm', { req, res });
                const verify = decodeToken(token);

                if (verify == null) return error401(res)

                const data = {
                    username: req.body.username,
                    name: req.body.name,
                    password: hashPassword(req.body.password),
                    role: 'admin'
                };

                const { data: newUser, error } = await supabase
                    .from('User')
                    .insert(data)
                    .select('username, name, role')
                    .single();

                if (error) return error500(res, error.message)

                res.status(200).json({ status: 200, data: newUser })
            } catch (err) {
                error500(res, err.message)
            }
            break

        default:
            error405(res)
    }
}