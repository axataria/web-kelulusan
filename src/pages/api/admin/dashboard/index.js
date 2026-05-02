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

                if (verify == null) return error401(res)

                // Count total students
                const { count: total } = await supabase
                    .from('Student')
                    .select('*', { count: 'exact', head: true });

                // Count lulus (status = 1)
                const { count: lulus } = await supabase
                    .from('Student')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 1);

                // Count tidak lulus (status = 0)
                const { count: tidaklulus } = await supabase
                    .from('Student')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 0);

                // Count opened (isOpen = 1)
                const { count: dibuka } = await supabase
                    .from('Student')
                    .select('*', { count: 'exact', head: true })
                    .eq('isOpen', 1);

                // Recent 10 students who opened, ordered by openDate DESC
                const { data: listsiswa, error } = await supabase
                    .from('Student')
                    .select('*')
                    .order('openDate', { ascending: false })
                    .limit(10);

                if (error) return error500(res, error.message)

                const formattedStudents = (listsiswa || []).map(student => {
                    const date = new Date(student.openDate);
                    return {
                        ...student,
                        openDate: date.toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    };
                });

                res.status(200).json({
                    status: 200,
                    data: {
                        lulus,
                        total,
                        tidaklulus,
                        dibuka,
                        listsiswa: formattedStudents
                    }
                })
            } catch (err) {
                error500(res, err.message)
            }
            break
        default:
            return error405(res)
    }
}