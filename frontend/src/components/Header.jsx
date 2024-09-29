import { Box, Button, Flex, Image, useColorMode } from "@chakra-ui/react";
import React from "react";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link, Link as RouterLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { Icon } from "@chakra-ui/react";
import { MdSearch, MdNotifications, MdAdd } from "react-icons/md";
import CreatePost from "./CreatePost";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  return (
    <Flex justifyContent={"space-around"} mt={0} mb="12">
      {user && (
        <>
          <Link as={RouterLink} to="/">
            <AiFillHome size={24} />
          </Link>

          {/* <Image
            cursor={"pointer"}
            alt="logo"
            w={6}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
          /> */}

          <Link as={RouterLink} to={`searchPage`}>
            <Icon as={MdSearch} boxSize={6} size={20} fontWeight={"bolder"} />
          </Link>

          <Link as={RouterLink} to={`notificationPage`}>
            <Icon
              as={MdNotifications}
              boxSize={6}
              size={20}
              fontWeight={"bolder"}
            />
          </Link>

          {/* <Icon as={MdAdd} boxSize={6} size={20} fontWeight={"bolder"} /> */}
          <Box mb={2}>
            <CreatePost />
          </Box>

          <Link as={RouterLink} to={`settings`}>
            <MdOutlineSettings size={20} />
          </Link>

          <Link as={RouterLink} to={`chat`}>
            <BsFillChatQuoteFill size={20} />
          </Link>

          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>

          {/* <Button size={"xm"} onClick={logout}>
            <FiLogOut size={25} />
          </Button> */}
        </>
      )}

      {/* {user && <Flex alignItems={"center"} gap={4}></Flex>} */}
    </Flex>
  );
};

export default Header;
