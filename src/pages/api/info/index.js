import supabase from "@/lib/supabase";

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            const { data, error } = await supabase
                .from('Profile')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) {
                return res.status(500).json({ status: 500, message: error.message });
            }

            res.status(200).json({ status: 200, data })
            break
        default:
            res.status(405).json({ status: 405, message: 'Method Not Allowed' })
    }
}