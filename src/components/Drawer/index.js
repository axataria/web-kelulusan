import {
    Avatar, Button, Drawer, DrawerBody, DrawerContent,
    DrawerHeader, DrawerOverlay, Flex, List, ListIcon,
    ListItem, Text, WrapItem, Box
} from "@chakra-ui/react";
import { MdOutlineDashboard, MdOutlinePeople, MdOutlinePerson, MdOutlineSettingsInputComposite } from "react-icons/md";
import { useRouter } from "next/router";
import Link from "next/link";

const DrawerAdmin = ({ onClose, placement, isOpen, username }) => {
    const router = useRouter();
    const path = router.pathname;
    const items = [
        { label: "Dashboard",   icon: MdOutlineDashboard,              path: '/admin/dashboard' },
        { label: "Siswa",       icon: MdOutlinePeople,                 path: '/admin/students'  },
        { label: "Users",       icon: MdOutlinePerson,                 path: '/admin/users'     },
        { label: "Pengaturan",  icon: MdOutlineSettingsInputComposite, path: '/admin/settings'  },
    ];

    return (
        <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent bg="white" borderRight="1px solid" borderColor="blue.100" boxShadow="4px 0 24px rgba(37,99,235,0.08)">
                {/* Header */}
                <DrawerHeader borderBottom="1px solid" borderColor="blue.50" bg="blue.600" py={5}>
                    <Flex flexDirection="row" alignItems="center" gap={3}>
                        <WrapItem>
                            <Avatar name={username} size="md" bg="white" color="blue.600" fontWeight={700} />
                        </WrapItem>
                        <Box>
                            <Text fontSize="xs" color="blue.200" fontWeight={600} letterSpacing="0.08em" textTransform="uppercase" mb={0.5}>
                                Selamat Datang
                            </Text>
                            <Text color="white" fontWeight={700} fontFamily="Inter, sans-serif" fontSize="md">
                                {String(username).toUpperCase()}
                            </Text>
                        </Box>
                    </Flex>
                </DrawerHeader>

                <DrawerBody px={4} py={6}>
                    <Flex flexDirection="column" h="full">
                        <List spacing={1}>
                            {items.map((item, index) => {
                                const isActive = item.path === path;
                                return (
                                    <ListItem key={index}>
                                        <Link href={item.path} scroll={false}>
                                            <Flex
                                                flexDirection="row"
                                                alignItems="center"
                                                px={4} py={3}
                                                borderRadius="12px"
                                                bg={isActive ? 'blue.50' : 'transparent'}
                                                color={isActive ? 'blue.700' : 'gray.600'}
                                                fontWeight={isActive ? 700 : 500}
                                                _hover={{ bg: 'blue.50', color: 'blue.700' }}
                                                transition="all 0.15s ease"
                                                cursor="pointer"
                                            >
                                                <ListIcon
                                                    as={item.icon}
                                                    fontSize={22}
                                                    m={0}
                                                    boxSize={5}
                                                    color={isActive ? 'blue.600' : 'gray.400'}
                                                />
                                                <Text
                                                    fontFamily="Inter, sans-serif"
                                                    fontWeight={isActive ? 700 : 500}
                                                    fontSize="sm"
                                                    ml={4}
                                                    letterSpacing="0.01em"
                                                >
                                                    {item.label}
                                                </Text>
                                                {isActive && (
                                                    <Box
                                                        ml="auto"
                                                        w="6px" h="6px"
                                                        borderRadius="50%"
                                                        bg="blue.500"
                                                    />
                                                )}
                                            </Flex>
                                        </Link>
                                    </ListItem>
                                );
                            })}
                        </List>

                        {/* Bottom version badge */}
                        <Box mt="auto" pt={6} borderTop="1px solid" borderColor="blue.50">
                            <Text fontSize="xs" color="gray.400" textAlign="center">
                                Panel Admin © {new Date().getFullYear()}
                            </Text>
                        </Box>
                    </Flex>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default DrawerAdmin;