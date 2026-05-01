import { Text, Flex, Box, SimpleGrid, Th, Tr, Td, Tbody, Thead, Table, TableContainer } from "@chakra-ui/react";
import { useEffect } from "react";
import { MdPeople } from "react-icons/md";
import { AiFillEye } from "react-icons/ai";
import { deleteCookie } from "cookies-next";
import Head from "next/head";
import axios from "axios";
import { ENV } from "@/utility/const";

function StatCard({ label, value, icon, color, bg }) {
    return (
        <Box
            bg="white"
            borderRadius="16px"
            p={6}
            border="1.5px solid"
            borderColor="blue.100"
            boxShadow="0 2px 12px rgba(37,99,235,0.07)"
            transition="all 0.2s"
            _hover={{ boxShadow: "0 8px 24px rgba(37,99,235,0.13)", transform: "translateY(-2px)" }}
        >
            <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Text color="gray.500" fontWeight={600} fontSize="sm" mb={3} fontFamily="Inter, sans-serif" textTransform="uppercase" letterSpacing="0.06em">
                        {label}
                    </Text>
                    <Text color="gray.800" fontWeight={800} fontSize="3xl" fontFamily="Inter, sans-serif">
                        {value ?? 0}
                    </Text>
                </Box>
                <Box bg={bg} p={3} borderRadius="12px">
                    {icon}
                </Box>
            </Flex>
        </Box>
    );
}

const Dashboard = ({ data, setUsername, siswa }) => {
    useEffect(() => { setUsername(data.username); });

    return (
        <>
            <Head><title>Dashboard — Admin Panel</title></Head>

            <Box minH="100vh" bg="#f0f4ff" fontFamily="Inter, sans-serif">
                {/* Page header */}
                <Box bg="white" borderBottom="1px solid" borderColor="blue.100" px={8} py={6} boxShadow="0 1px 4px rgba(37,99,235,0.06)">
                    <Text fontSize="xl" fontWeight={800} color="gray.800" letterSpacing="-0.01em">Dashboard</Text>
                    <Text fontSize="sm" color="gray.400" mt={1}>Selamat datang, {data?.name ?? data?.username}</Text>
                </Box>

                <Box px={8} py={6}>
                    {/* Stat cards */}
                    <SimpleGrid spacing={5} columns={[1, 2, 4]} mb={8}>
                        <StatCard label="Total Siswa"  value={siswa.total}      icon={<MdPeople size={26} color="#2563eb" />} bg="blue.50"  />
                        <StatCard label="Lulus"        value={siswa.lulus}      icon={<MdPeople size={26} color="#16a34a" />} bg="green.50" />
                        <StatCard label="Tidak Lulus"  value={siswa.tidaklulus} icon={<MdPeople size={26} color="#dc2626" />} bg="red.50"   />
                        <StatCard label="Dibuka"       value={siswa.dibuka}     icon={<AiFillEye size={26} color="#d97706" />} bg="orange.50" />
                    </SimpleGrid>

                    {/* Recent activity table */}
                    <Box bg="white" borderRadius="16px" border="1.5px solid" borderColor="blue.100" boxShadow="0 2px 12px rgba(37,99,235,0.06)" overflow="hidden">
                        <Box px={6} py={5} borderBottom="1px solid" borderColor="blue.50">
                            <Text fontWeight={700} color="gray.700" fontSize="md">Riwayat Akses Terbaru</Text>
                        </Box>
                        <TableContainer>
                            <Table variant="simple" size="md">
                                <Thead bg="blue.50">
                                    <Tr>
                                        {["NISN", "Nama", "Status", "Waktu Dibuka"].map(h => (
                                            <Th key={h} color="blue.700" fontFamily="Inter, sans-serif" fontSize="11px" letterSpacing="0.07em" py={4}>{h}</Th>
                                        ))}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {siswa.listsiswa.map((item, index) => (
                                        <Tr key={index} _hover={{ bg: "blue.50" }} transition="background 0.15s">
                                            <Td fontFamily="monospace" fontSize="sm" color="blue.700" fontWeight={600}>{item.nisn}</Td>
                                            <Td fontWeight={500} color="gray.700">{item.name}</Td>
                                            <Td>
                                                <Box
                                                    display="inline-flex" alignItems="center" gap={1.5}
                                                    px={3} py={1} borderRadius="100px" fontSize="12px" fontWeight={600}
                                                    bg={item.status === 1 ? "green.50" : "red.50"}
                                                    color={item.status === 1 ? "green.700" : "red.700"}
                                                    border="1px solid"
                                                    borderColor={item.status === 1 ? "green.200" : "red.200"}
                                                >
                                                    <Box w="6px" h="6px" borderRadius="50%" bg={item.status === 1 ? "green.500" : "red.500"} />
                                                    {item.status !== 1 ? 'Tidak Lulus' : 'Lulus'}
                                                </Box>
                                            </Td>
                                            <Td color="gray.500" fontSize="sm">{item.openDate ?? '-'}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export async function getServerSideProps(context) {
    const { req, res } = context;
    const { headers } = req;
    try {
        const [users, dashboard] = await Promise.all([
            axios.get(`${ENV.base}/api/user`, { credentials: 'same-origin', headers: { cookie: headers.cookie } }),
            axios.get(`${ENV.base}/api/admin/dashboard`, { credentials: 'same-origin', headers: { cookie: headers.cookie } }),
        ]);
        const user = users.data;
        const { data } = dashboard.data;
        if (user.status === 401) {
            deleteCookie('token-key-adm', { req, res });
            return { redirect: { destination: '/admin/login', permanent: false } };
        }
        return { props: { data: user.data, siswa: data } };
    } catch {
        return { redirect: { destination: '/admin/login', permanent: false } };
    }
}

export default Dashboard;
