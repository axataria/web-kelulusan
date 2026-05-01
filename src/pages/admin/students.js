import {
    AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent,
    AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Box, Button, Flex, FormControl, FormLabel, IconButton, Input,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
    ModalHeader, ModalOverlay, Select, Stack, Table, TableContainer,
    Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { deleteCookie } from "cookies-next";
import Head from "next/head";
import ImportExcelModal from "@/components/Modals/ImportExcel";
import axios from "axios";
import { ENV } from "@/utility/const";
import ToastService from "@/components/Toast";

const Students = ({ data, setUsername, students, pagination }) => {
    const [filteredData, setFilteredData] = useState(students);
    const [value, setValue] = useState(1);
    const [selectedRow, setSelectedRow] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selected, setSelected] = useState();
    const cancelAlertRef = useRef();
    const toast = useToast();

    useEffect(() => {
        setUsername(data.username);
        setValue(pagination.current);
    }, [setUsername, data.username, pagination]);

    const deleteHandler = (nisn) => { setSelected(nisn); onOpen(); };
    const handleEdit = (row) => { setSelectedRow(row); setIsEditOpen(true); };
    const handleChange = (e) => setSelectedRow({ ...selectedRow, [e.target.name]: e.target.value });

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        await axios.post(`/api/admin/students/${selectedRow.nisn}`, selectedRow, { withCredentials: true })
            .then(async () => { await updateList(); ToastService('success', "Siswa Berhasil Diedit", toast); setIsEditOpen(false); })
            .catch(() => {});
    };

    const searchData = async () => {
        if (keyword === '') { setFilteredData(students); return; }
        const res = await axios.get(`/api/admin/students/${keyword}`, { withCredentials: true });
        setFilteredData(res.data.data);
    };

    const updateList = async () => {
        const res = await axios.get(`/api/admin/students`, { withCredentials: true });
        setFilteredData(res.data.data);
    };

    const deleteNisn = async () => {
        try {
            const res = await axios.delete(`/api/admin/students/${selected}`, { withCredentials: true });
            if (res.status === 200) { await updateList(); ToastService('success', "Siswa Berhasil Dihapus", toast); }
        } catch (e) { ToastService('error', e.message, toast); }
        finally { onClose(); }
    };

    const paginate = async (pag) => {
        try {
            const res = await axios.get(`/api/admin/students?page=${pag}`, { credentials: 'same-origin' });
            setFilteredData(res.data.data);
            if (pag <= pagination.max) setValue(pag);
        } catch (e) { ToastService('error', e.message, toast); }
    };

    const inputStyle = {
        borderRadius: '10px', borderColor: 'blue.200',
        _focus: { borderColor: 'blue.500', boxShadow: '0 0 0 3px rgba(59,130,246,0.15)' },
        _hover: { borderColor: 'blue.300' },
    };

    return (
        <>
            <Head><title>Daftar Siswa — Admin Panel</title></Head>
            <Box minH="100vh" bg="#f0f4ff" fontFamily="Inter, sans-serif">

                {/* Page header */}
                <Box bg="white" borderBottom="1px solid" borderColor="blue.100" px={8} py={6} boxShadow="0 1px 4px rgba(37,99,235,0.06)">
                    <Text fontSize="xl" fontWeight={800} color="gray.800" letterSpacing="-0.01em">Data Siswa</Text>
                    <Text fontSize="sm" color="gray.400" mt={1}>Kelola data kelulusan siswa</Text>
                </Box>

                <Box px={8} py={6}>
                    <Box bg="white" borderRadius="16px" border="1.5px solid" borderColor="blue.100" boxShadow="0 2px 12px rgba(37,99,235,0.06)" overflow="hidden">

                        {/* Toolbar */}
                        <Flex px={6} py={4} justifyContent="space-between" alignItems="center" borderBottom="1px solid" borderColor="blue.50" flexWrap="wrap" gap={3}>
                            <ImportExcelModal onUpdate={updateList} />
                            <Flex gap={2} alignItems="center">
                                <Input
                                    placeholder="Cari siswa..."
                                    onChange={(e) => setKeyword(e.target.value)}
                                    w="220px"
                                    size="sm"
                                    borderRadius="10px"
                                    borderColor="blue.200"
                                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 3px rgba(59,130,246,0.15)' }}
                                    _hover={{ borderColor: 'blue.300' }}
                                />
                                <Button onClick={searchData} size="sm" colorScheme="blue" borderRadius="10px" fontWeight={600}>
                                    Cari
                                </Button>
                            </Flex>
                        </Flex>

                        {/* Table */}
                        <TableContainer>
                            <Table variant="simple" size="md">
                                <Thead bg="blue.50">
                                    <Tr>
                                        {["NISN", "Nama", "Kelas", "Jurusan", "Status", ""].map((h, i) => (
                                            <Th key={i} color="blue.700" fontFamily="Inter, sans-serif" fontSize="11px" letterSpacing="0.07em" py={4}>{h}</Th>
                                        ))}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {filteredData.map((item, index) => (
                                        <Tr key={index} _hover={{ bg: "blue.50" }} transition="background 0.15s">
                                            <Td fontFamily="monospace" fontSize="sm" color="blue.700" fontWeight={600}>{item.nisn}</Td>
                                            <Td fontWeight={500} color="gray.700">{item.name}</Td>
                                            <Td color="gray.600">{item.kelas}</Td>
                                            <Td color="gray.600">{item.jurusan}</Td>
                                            <Td>
                                                <Box
                                                    display="inline-flex" alignItems="center" gap={1.5}
                                                    px={3} py={1} borderRadius="100px" fontSize="12px" fontWeight={600}
                                                    bg={item.status === 1 ? "green.50" : "red.50"}
                                                    color={item.status === 1 ? "green.700" : "red.700"}
                                                    border="1px solid"
                                                    borderColor={item.status === 1 ? "green.200" : "red.200"}
                                                >
                                                    <Box w="5px" h="5px" borderRadius="50%" bg={item.status === 1 ? "green.500" : "red.500"} />
                                                    {item.status === 1 ? 'Lulus' : 'Tidak Lulus'}
                                                </Box>
                                            </Td>
                                            <Td>
                                                <Stack direction="row" spacing={2} justifyContent="center">
                                                    <IconButton
                                                        size="sm" variant="ghost" colorScheme="red" borderRadius="8px"
                                                        onClick={() => deleteHandler(item.nisn)}
                                                        aria-label="Hapus Siswa" icon={<DeleteIcon />}
                                                    />
                                                    <IconButton
                                                        size="sm" variant="ghost" colorScheme="blue" borderRadius="8px"
                                                        onClick={() => handleEdit(item)}
                                                        aria-label="Edit Siswa" icon={<EditIcon />}
                                                    />
                                                </Stack>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        <Flex px={6} py={4} alignItems="center" gap={3} borderTop="1px solid" borderColor="blue.50">
                            <Button size="sm" variant="outline" colorScheme="blue" borderRadius="8px"
                                onClick={() => paginate(value - 1)} isDisabled={value <= 1}>‹ Prev</Button>
                            <Text fontSize="sm" color="gray.600" fontWeight={600} minW="60px" textAlign="center">
                                Hal. {value}
                            </Text>
                            <Button size="sm" variant="outline" colorScheme="blue" borderRadius="8px"
                                onClick={() => paginate(value + 1)} isDisabled={value >= parseInt(pagination.max)}>Next ›</Button>
                        </Flex>
                    </Box>
                </Box>

                {/* Edit Modal */}
                <Modal isOpen={isEditOpen} isCentered onClose={() => setIsEditOpen(false)} size="md">
                    <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
                    <ModalContent borderRadius="20px" boxShadow="0 32px 64px rgba(37,99,235,0.15)">
                        <form onSubmit={handleSubmitEdit}>
                            <ModalHeader fontWeight={700} color="gray.800" borderBottom="1px solid" borderColor="blue.50">Edit Data Siswa</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6} pt={4}>
                                <Stack spacing={4}>
                                    {[
                                        { label: 'NISN', name: 'nisn', disabled: true },
                                        { label: 'Nama', name: 'name' },
                                        { label: 'Email', name: 'email' },
                                        { label: 'Kelas', name: 'kelas' },
                                        { label: 'Jurusan', name: 'jurusan' },
                                        { label: 'Nama Orang Tua', name: 'nama_ortu' },
                                    ].map(f => (
                                        <FormControl key={f.name}>
                                            <FormLabel fontSize="sm" fontWeight={600} color="gray.600">{f.label}</FormLabel>
                                            <Input {...inputStyle} onChange={handleChange} name={f.name}
                                                value={selectedRow[f.name] ?? ''} isDisabled={f.disabled} bg={f.disabled ? "gray.50" : "white"} />
                                        </FormControl>
                                    ))}
                                    <FormControl>
                                        <FormLabel fontSize="sm" fontWeight={600} color="gray.600">Status</FormLabel>
                                        <Select {...inputStyle} name="status" value={selectedRow.status ?? ''} onChange={handleChange} placeholder="Pilih status">
                                            <option value={0}>Tidak Lulus</option>
                                            <option value={1}>Lulus</option>
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </ModalBody>
                            <ModalFooter borderTop="1px solid" borderColor="blue.50" gap={2}>
                                <Button type="submit" colorScheme="blue" borderRadius="10px" fontWeight={600}>Simpan</Button>
                                <Button onClick={() => setIsEditOpen(false)} variant="ghost" borderRadius="10px">Batal</Button>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>

                {/* Delete Confirm */}
                <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelAlertRef} onClose={onClose} isOpen={isOpen} isCentered>
                    <AlertDialogOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
                    <AlertDialogContent borderRadius="16px">
                        <AlertDialogHeader fontWeight={700}>Hapus Data Siswa?</AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody color="gray.600">Apakah kamu yakin ingin menghapus data siswa ini?</AlertDialogBody>
                        <AlertDialogFooter gap={2}>
                            <Button ref={cancelAlertRef} onClick={onClose} variant="ghost" borderRadius="8px">Tidak</Button>
                            <Button colorScheme="red" onClick={deleteNisn} borderRadius="8px">Ya, Hapus</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Box>
        </>
    );
};

export async function getServerSideProps(context) {
    const { req, res } = context;
    const { headers } = req;
    try {
        const [users, students] = await Promise.all([
            axios.get(`${ENV.base}/api/user`, { credentials: 'same-origin', headers: { cookie: headers.cookie } }),
            axios.get(`${ENV.base}/api/admin/students`, { credentials: 'same-origin', headers: { cookie: headers.cookie } }),
        ]);
        const user = users.data;
        const { data, pagination } = students.data;
        if (user.status === 401) {
            deleteCookie('token-key', { req, res });
            return { redirect: { destination: '/admin/login', permanent: false } };
        }
        return { props: { data: user.data, students: data, pagination } };
    } catch {
        return { redirect: { destination: '/admin/login', permanent: false } };
    }
}

export default Students;