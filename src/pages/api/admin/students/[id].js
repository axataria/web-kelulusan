import {getCookie} from "cookies-next";
import {decodeToken} from "@/utility/token";
import {error401, error405, error500} from "@/utility/errorhandler";
import supabase from "@/lib/supabase";

export default async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                const { id } = req.query;

                const token = getCookie('token-key-adm', { req, res });
                const verify = decodeToken(token);

                if (verify == null) return error401(res)

                const { error } = await supabase
                    .from('Student')
                    .delete()
                    .eq('nisn', id);

                if (error) return error500(res, error.message)

                res.status(200).json({ status: 200, message: "Deleted Success" })
            } catch (err) {
                error500(res, err.message)
            }
            break

        case 'POST':
            try {
                const { id } = req.query;

                const token = getCookie('token-key-adm', { req, res });
                const verify = decodeToken(token);

                if (verify == null) return error401(res)

                const data = {
                    name: req.body.name,
                    email: req.body.email,
                    kelas: req.body.kelas,
                    jurusan: req.body.jurusan,
                    status: req.body.status,
                    tgl_lahir: req.body.tgl_lahir,
                    nama_ortu: req.body.nama_ortu,
                };

                const { error } = await supabase
                    .from('Student')
                    .update(data)
                    .eq('nisn', id);

                if (error) return error500(res, error.message)

                res.status(200).json({ status: 200, message: "Sukses" })
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

                // Search by exact nisn OR nisn containing the search term
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