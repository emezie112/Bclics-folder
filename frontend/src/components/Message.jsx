import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { selectedConversationAtom } from "../atoms/MessagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          {message.text && (
            <Flex flexDirection={"column"}>
              <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
                <Text color={"white"}> {message.text} </Text>

                <Box
                  alignSelf={"flex-end"}
                  ml={1}
                  color={message.seen ? "blue.400" : ""}
                  fontWeight={"bold"}
                >
                  <BsCheck2All size={16} />
                </Box>
              </Flex>

              <Text
                fontSize={"0.8rem"}
                width={40}
                textAlign={"right"}
                color={"gray.light"}
                alignSelf={"flex-end"}
              >
                {formatDistanceToNow(new Date(message.createdAt))} ago
              </Text>
            </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Flex flexDirection={"column"}>
                <Image src={message.img} alt="message image" borderRadius={4} />
                <Text
                  fontSize={"0.8rem"}
                  width={40}
                  textAlign={"right"}
                  color={"gray.light"}
                  alignSelf={"flex-end"}
                >
                  {formatDistanceToNow(new Date(message.createdAt))} ago
                </Text>
              </Flex>

              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}

          <Avatar src={user.profilePic} w="7" h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedConversation.userProfilePic} w="7" h={7} />
          {message.text && (
            <Flex flexDirection={"column"}>
              <Text
                maxW={"350px"}
                bg={"gray.400"}
                p={1}
                borderRadius={"md"}
                color={"black"}
              >
                {message.text}
              </Text>
              <Text
                fontSize={"0.8rem"}
                width={40}
                textAlign={"left"}
                color={"gray.light"}
                alignSelf={"flex-start"}
              >
                {formatDistanceToNow(new Date(message.createdAt))} ago
              </Text>
            </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {message.img && imgLoaded && (
            <Flex flexDirection={"column"}>
              <Flex mt={5} w={"200px"}>
                <Image src={message.img} alt="message image" borderRadius={4} />
              </Flex>
              <Text
                fontSize={"0.8rem"}
                width={40}
                textAlign={"left"}
                color={"gray.light"}
                alignSelf={"flex-start"}
              >
                {formatDistanceToNow(new Date(message.createdAt))} ago
              </Text>
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default Message;
