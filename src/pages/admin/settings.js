import { Box, Button, FormControl, FormLabel, Heading, Input, Select, Stack, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { deleteCookie } from "cookies-next";
import Head from "next/head";
import axios from "axios";
import { ENV } from "@/utility/const";
import ToastService from "@/components/Toast";

const Settings = ({ data, setUsername, settings }) => {
    const [selected, setSelected] = useState(settings);
    const [logo, setLogo] = useState(null);
    const [skl, setSkl] = useState(null);
    const toast = useToast();

    useEffect(() => { setUsername(data.username); }, [setUsername, data.username]);

    const handleChange = (e) => setSelected({ ...selected, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post('/api/admin/settings', selected, { withCredentials: true })
            .then(() => ToastService('success', "Update Berhasil", toast))
            .catch(err => ToastService('error', err.message, toast));
    };
    const handleUploadChange = (e) => setLogo(e.target.files[0]);
    const handleUploadChange2 = (e) => setSkl(e.target.files[1]);
    const handleUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('logo', logo);
        formData.append('skl', skl);
        axios.post('/api/admin/settings/upload', formData, { withCredentials: true, headers: { 'content-type': 'multipart/form-data' } })
            .then(() => ToastService('success', "Upload Berhasil", toast));
    };

    const inputStyle = {
        borderRadius: '10px', borderColor: 'blue.200', bg: 'white',
        _focus: { borderColor: 'blue.500', boxShadow: '0 0 0 3px rgba(59,130,246,0.12)' },
        _hover: { borderColor: 'blue.300' },
    };

    const labelStyle = { fontSize: 'sm', fontWeight: 600, color: 'gray.600', mb: 1 };

    return (
        <>
            <Head><title>Pengaturan — Admin Panel</title></Head>
            <Box minH="100vh" bg="#f0f4ff" fontFamily="Inter, sans-serif">

                {/* Page header */}
                <Box bg="white" borderBottom="1px solid" borderColor="blue.100" px={8} py={6} boxShadow="0 1px 4px rgba(37,99,235,0.06)">
                    <Text fontSize="xl" fontWeight={800} color="gray.800" letterSpacing="-0.01em">Pengaturan Web</Text>
                    <Text fontSize="sm" color="gray.400" mt={1}>Konfigurasi profil sekolah dan tampilan website</Text>
                </Box>

                <Box px={8} py={6}>
                    <Stack spacing={6} maxW="680px">

                        {/* Profile Settings Card */}
                        <Box bg="white" borderRadius="16px" border="1.5px solid" borderColor="blue.100" boxShadow="0 2px 12px rgba(37,99,235,0.06)" overflow="hidden">
                            <Box px={6} py={4} borderBottom="1px solid" borderColor="blue.50">
                                <Text fontWeight={700} color="gray.700" fontSize="md">Profil Sekolah</Text>
                                <Text fontSize="sm" color="gray.400">Informasi dasar yang ditampilkan di website</Text>
                            </Box>
                            <Box px={6} py={6}>
                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={5}>
                                        <FormControl isRequired>
                                            <FormLabel {...labelStyle}>NPSN</FormLabel>
                                            <Input {...inputStyle} onChange={handleChange} name="npsn" value={selected?.npsn ?? ''} placeholder="Nomor Pokok Sekolah Nasional" />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel {...labelStyle}>Nama Sekolah</FormLabel>
                                            <Input {...inputStyle} onChange={handleChange} name="nama_sekolah" value={selected?.nama_sekolah ?? ''} placeholder="Nama lengkap sekolah" />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel {...labelStyle}>Judul Website</FormLabel>
                                            <Input {...inputStyle} onChange={handleChange} name="judul_web" value={selected?.judul_web ?? ''} placeholder="Judul yang tampil di halaman utama" />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel {...labelStyle}>Teks Tombol Login Siswa</FormLabel>
                                            <Input {...inputStyle} onChange={handleChange} name="button_label" value={selected?.button_label ?? ''} placeholder="Contoh: Cek Kelulusan" />
                                        </FormControl>
                                        <FormControl isRequired>
                                            <FormLabel {...labelStyle}>Nama Kepala Sekolah</FormLabel>
                                            <Input {...inputStyle} onChange={handleChange} name="kepsek" value={selected?.kepsek ?? ''} placeholder="Nama lengkap kepala sekolah" />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel {...labelStyle}>Status Website</FormLabel>
                                            <Select {...inputStyle} name="isOpen" value={selected?.isOpen ?? ''} onChange={handleChange} placeholder="Pilih status">
                                                <option value={0}>🔒 Tutup</option>
                                                <option value={1}>🟢 Buka</option>
                                            </Select>
                                        </FormControl>
                                        <Button type="submit" colorScheme="blue" borderRadius="10px" fontWeight={700} w="fit-content" px={8}>
                                            Simpan Perubahan
                                        </Button>
                                    </Stack>
                                </form>
                            </Box>
                        </Box>

                        {/* Upload Card */}
                        <Box bg="white" borderRadius="16px" border="1.5px solid" borderColor="blue.100" boxShadow="0 2px 12px rgba(37,99,235,0.06)" overflow="hidden">
                            <Box px={6} py={4} borderBottom="1px solid" borderColor="blue.50">
                                <Text fontWeight={700} color="gray.700" fontSize="md">Upload File</Text>
                                <Text fontSize="sm" color="gray.400">Logo sekolah dan template Surat Keterangan Lulus</Text>
                            </Box>
                            <Box px={6} py={6}>
                                <form onSubmit={handleUpload} encType="multipart/form-data">
                                    <Stack spacing={5}>
                                        <FormControl>
                                            <FormLabel {...labelStyle}>Logo Sekolah</FormLabel>
                                            <Input onChange={handleUploadChange} name="logo" type="file" {...inputStyle}
                                                sx={{ '::file-selector-button': { bg: 'blue.50', border: 'none', color: 'blue.700', fontWeight: 600, borderRadius: '6px', px: 3, py: 1, mr: 3, cursor: 'pointer', fontSize: 'sm' } }}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel {...labelStyle}>Template SKL (.docx)</FormLabel>
                                            <Input onChange={handleUploadChange2} name="skl" type="file" {...inputStyle}
                                                sx={{ '::file-selector-button': { bg: 'blue.50', border: 'none', color: 'blue.700', fontWeight: 600, borderRadius: '6px', px: 3, py: 1, mr: 3, cursor: 'pointer', fontSize: 'sm' } }}
                                            />
                                        </FormControl>
                                        <Button type="submit" colorScheme="blue" variant="outline" borderRadius="10px" fontWeight={700} w="fit-content" px={8}>
                                            Upload File
                                        </Button>
                                    </Stack>
                                </form>
                            </Box>
                        </Box>

                    </Stack>
                </Box>
            </Box>
        </>
    );
};

export async function getServerSideProps(context) {
    const { req, res } = context;
    const { headers } = req;
    try {
        const [users, datas] = await Promise.all([
            axios.get(`${ENV.base}/api/user`, { credentials: 'same-origin', headers: { cookie: headers.cookie } }),
            axios.get(`${ENV.base}/api/admin/settings`, { credentials: 'same-origin', headers: { cookie: headers.cookie } }),
        ]);
        const user = users.data;
        const { data } = datas.data;
        if (user.status === 401) {
            deleteCookie('token-key', { req, res });
            return { redirect: { destination: '/admin/login', permanent: false } };
        }
        return { props: { data: user.data, settings: data[0] } };
    } catch {
        return { redirect: { destination: '/admin/login', permanent: false } };
    }
}

export default Settings;