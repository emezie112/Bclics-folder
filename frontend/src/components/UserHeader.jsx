import { Box, Flex, Text, VStack, Link } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { CgMoreO } from "react-icons/cg";
import { BsInstagram } from "react-icons/bs";
import { useToast } from "@chakra-ui/toast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom); // logged in user
 
  const {handleFollowUnfollow, following, updating} = useFollowUnfollow(user);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        status: "success",
        description: "profile link copied",
        duration: 3000,
        isClosable: true,
      });
    });
  };

 

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text
            fontSize={"2xl"}
            fontWeight={"bold"}
            size={{
              base: "md",
              md: "xl",
            }}
          >
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text
              fontSize={"sm"}
              size={{
                base: "md",
                md: "xl",
              }}
            >
              {user.username}
            </Text>
            <Text
              fontSize={{
                base: "xm",
                md: "sm",
              }}
              bg={"gray.dark"}
              color={"gray.light"}
              p={0.8}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {/* for media query for phone or other devices */}

          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
                // lg: "2xl",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
                // lg: "2xl",
              }}
            />
          )}
        </Box>
      </Flex>

      <Text
        fontSize={{
          base: "md",
          md: "xl",
        }}
      >
        {" "}
        {user.bio}{" "}
      </Text>
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile </Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {" "}
          {following ? "Unfollow" : "Follow"}{" "}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"spacep-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1.5px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
        >
          <Text> Replies </Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
