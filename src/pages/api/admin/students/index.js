import {decodeToken} from "@/utility/token";
import supabase from "@/lib/supabase";
import {error401, error405, error500} from "@/utility/errorhandler";
import {getCookie} from "cookies-next";

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const token = getCookie('token-key-adm', { req, res });
                const verify = decodeToken(token);
                const limit = 10;
                const page = parseInt(req.query.page || 1, 10);

                if (verify == null) return error401(res)

                // Count total students
                const { count: totalStudents, error: countError } = await supabase
                    .from('Student')
                    .select('*', { count: 'exact', head: true });

                if (countError) return error500(res, countError.message)

                const totalPages = Math.ceil(totalStudents / limit);
                const offset = (page - 1) * limit;

                // Fetch paginated students
                const { data: students, error } = await supabase
                    .from('Student')
                    .select('*')
                    .range(offset, offset + limit - 1);

                if (error) return error500(res, error.message)

                res.status(200).json({
                    status: 200,
                    data: students,
                    pagination: {
                        current: page,
                        max: totalPages,
                        total: totalStudents,
                    },
                })
            } catch (err) {
                error500(res, err.message)
            }
            break
        default:
            error405(res)
    }
}