import {
    AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent,
    AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Box, Button, Flex, IconButton, Text, useDisclosure
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { useRouter } from "next/router";

function Navbar({ onClick }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout');
        await router.push('/admin/login');
    };

    return (
        <Flex
            px={5} py={3}
            bg="white"
            align="center"
            justify="space-between"
            borderBottom="1px solid"
            borderColor="blue.100"
            boxShadow="0 1px 8px rgba(37,99,235,0.07)"
            position="sticky"
            top={0}
            zIndex={100}
        >
            <IconButton
                aria-label="Open Drawer"
                size="md"
                onClick={onClick}
                variant="ghost"
                colorScheme="blue"
                icon={<HamburgerIcon color="blue.500" />}
                borderRadius="10px"
            />
            <Box>
                <Text fontFamily="Inter, sans-serif" fontWeight={600} color="blue.700" fontSize="sm" letterSpacing="0.02em">
                    Admin Panel
                </Text>
            </Box>
            <Button
                variant="solid"
                colorScheme="blue"
                size="sm"
                borderRadius="8px"
                onClick={onOpen}
                fontWeight={600}
            >
                Logout
            </Button>

            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />
                <AlertDialogContent borderRadius="16px">
                    <AlertDialogHeader fontWeight={700}>Konfirmasi Logout</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody color="gray.600">
                        Apakah Kamu Yakin Ingin Logout dari Sistem?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} variant="ghost">Tidak</Button>
                        <Button colorScheme="red" ml={3} onClick={handleLogout} borderRadius="8px">Ya, Logout</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Flex>
    );
}

export default Navbar;