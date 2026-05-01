import {
    AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent,
    AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Box, Button, Flex, IconButton, Table, TableContainer, Tbody,
    Td, Text, Th, Thead, Tr, useDisclosure, useToast
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { deleteCookie } from "cookies-next";
import Head from "next/head";
import ImportUserModal from "@/components/Modals/ImportUser";
import axios from "axios";
import { ENV } from "@/utility/const";

const Users = ({ data, setUsername, users }) => {
    const [filteredData, setFilteredData] = useState(users);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selected, setSelected] = useState();
    const cancelAlertRef = useRef();
    const toast = useToast();

    useEffect(() => { setUsername(data.username); });

    const deleteHandler = (username) => { setSelected(username); onOpen(); };

    const updateList = async () => {
        const res = await axios.get(`/api/admin/users`, { withCredentials: true });
        setFilteredData(res.data.data);
    };

    const deleteUser = async () => {
        try {
            const res = await axios.delete(`/api/admin/users/${selected}`, { withCredentials: true });
            if (res.status === 200) {
                await updateList();
                toast({ title: "Data Berhasil Dihapus", status: 'success', position: 'top-right', isClosable: true });
            }
        } catch (e) {
            toast({ title: e.message, status: 'error', position: 'top-right', isClosable: true });
        } finally { onClose(); }
    };

    return (
        <>
            <Head><title>Users Admin — Admin Panel</title></Head>
            <Box minH="100vh" bg="#f0f4ff" fontFamily="Inter, sans-serif">

                {/* Page header */}
                <Box bg="white" borderBottom="1px solid" borderColor="blue.100" px={8} py={6} boxShadow="0 1px 4px rgba(37,99,235,0.06)">
                    <Text fontSize="xl" fontWeight={800} color="gray.800" letterSpacing="-0.01em">Users Admin</Text>
                    <Text fontSize="sm" color="gray.400" mt={1}>Kelola akun administrator sistem</Text>
                </Box>

                <Box px={8} py={6}>
                    <Box bg="white" borderRadius="16px" border="1.5px solid" borderColor="blue.100" boxShadow="0 2px 12px rgba(37,99,235,0.06)" overflow="hidden">

                        {/* Toolbar */}
                        <Flex px={6} py={4} justifyContent="flex-start" borderBottom="1px solid" borderColor="blue.50">
                            <ImportUserModal onUpdate={updateList} />
                        </Flex>

                        {/* Table */}
                        <TableContainer>
                            <Table variant="simple" size="md">
                                <Thead bg="blue.50">
                                    <Tr>
                                        {["Username", "Nama", "Dibuat", "Role", ""].map((h, i) => (
                                            <Th key={i} color="blue.700" fontFamily="Inter, sans-serif" fontSize="11px" letterSpacing="0.07em" py={4}>{h}</Th>
                                        ))}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {filteredData.map((item, index) => (
                                        <Tr key={index} _hover={{ bg: "blue.50" }} transition="background 0.15s">
                                            <Td fontFamily="monospace" fontSize="sm" color="blue.700" fontWeight={700}>{item.username}</Td>
                                            <Td fontWeight={500} color="gray.700">{item.name}</Td>
                                            <Td color="gray.500" fontSize="sm">{item.createdAt}</Td>
                                            <Td>
                                                <Box
                                                    display="inline-flex" alignItems="center"
                                                    px={3} py={1} borderRadius="100px" fontSize="12px" fontWeight={600}
                                                    bg={item.role === 'admin' ? "blue.50" : "purple.50"}
                                                    color={item.role === 'admin' ? "blue.700" : "purple.700"}
                                                    border="1px solid"
                                                    borderColor={item.role === 'admin' ? "blue.200" : "purple.200"}
                                                >
                                                    {item.role}
                                                </Box>
                                            </Td>
                                            <Td>
                                                {item.role !== 'super' && (
                                                    <IconButton
                                                        size="sm" variant="ghost" colorScheme="red" borderRadius="8px"
                                                        onClick={() => deleteHandler(item.username)}
                                                        aria-label="Hapus User" icon={<DeleteIcon />}
                                                    />
                                                )}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>

                {/* Delete Confirm */}
                <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelAlertRef} onClose={onClose} isOpen={isOpen} isCentered>
                    <AlertDialogOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
                    <AlertDialogContent borderRadius="16px">
                        <AlertDialogHeader fontWeight={700}>Hapus User?</AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody color="gray.600">Apakah kamu yakin ingin menghapus user ini?</AlertDialogBody>
                        <AlertDialogFooter gap={2}>
                            <Button ref={cancelAlertRef} onClick={onClose} variant="ghost" borderRadius="8px">Tidak</Button>
                            <Button colorScheme="red" onClick={deleteUser} borderRadius="8px">Ya, Hapus</Button>
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
        const [users, datas] = await Promise.all([
            axios.get(`${ENV.base}/api/user`, { credentials: 'same-origin', headers: { cookie: headers.cookie } }),
            axios.get(`${ENV.base}/api/admin/users`, { credentials: 'same-origin', headers: { cookie: headers.cookie } }),
        ]);
        const user = users.data;
        const { data } = datas.data;
        if (user.status === 401) {
            deleteCookie('token-key', { req, res });
            return { redirect: { destination: '/admin/login', permanent: false } };
        }
        return { props: { data: user.data, users: data } };
    } catch {
        return { redirect: { destination: '/admin/login', permanent: false } };
    }
}

export default Users;