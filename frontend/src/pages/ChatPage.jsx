import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  SkeletonCircle,
  Text,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { GiConversation } from "react-icons/gi";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/MessagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  // Determine if it's a small screen
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversations]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        if (selectedConversation.mock) return;
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversation();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  // Handle "Back" button click for small screens
  const handleBack = () => {
    setSelectedConversation({}); // Reset the selected conversation to go back to the conversation list
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        {/* Conversations List - Hide on small screens when a conversation is selected */}
        {!selectedConversation._id || !isSmallScreen ? (
          <Flex
            flex={30}
            gap={2}
            flexDirection={"column"}
            maxW={{
              sm: "250px",
              md: "full",
            }}
            mx={"auto"}
            p={isSmallScreen ? 4 : 2} // Adjust padding for small screens
            height={isSmallScreen ? "100vh" : "auto"} // Full height for small screens
            width={isSmallScreen ? "100%" : "auto"} // Full width for small screens
          >
            <Text
              fontWeight={"center"}
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Your Conversations
            </Text>
            <form onSubmit={handleConversationSearch}>
              <Flex alignItems={"center"} gap={2}>
                <Input
                  placeholder="Search for a user"
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button
                  size={"sm"}
                  onClick={handleConversationSearch}
                  isLoading={searchingUser}
                >
                  <SearchIcon />
                </Button>
              </Flex>
            </form>

            {/* Loading Conversations */}
            {loadingConversations &&
              [0, 1, 2, 3, 4].map((_, i) => (
                <Flex
                  key={i}
                  gap={4}
                  alignItems={"center"}
                  p={"1"}
                  borderRadius={"md"}
                >
                  <Box>
                    <SkeletonCircle size={"10"} />
                  </Box>

                  <Flex w={"full"} flexDirection={"column"} gap={3}>
                    <SkeletonCircle h={"10px"} w={"80px"} />
                    <SkeletonCircle h={"8px"} w={"90%"} />
                  </Flex>
                </Flex>
              ))}

            {/* Display Conversations */}
            {!loadingConversations &&
              conversations.map((conversation) => (
                <Conversation
                  key={conversation._id}
                  isOnline={onlineUsers.includes(
                    conversation.participants[0]._id
                  )}
                  conversation={conversation}
                />
              ))}
          </Flex>
        ) : null}

        {/* Display prompt when no conversation is selected and screen is not small */}
        {!selectedConversation._id && !isSmallScreen && (
          <Flex
            flex={70}
            borderRadius={"md"}
            borderColor="red.500"
            p={2}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} borderColor="red.500" />
            <Text>Select a conversation to start messaging</Text>
          </Flex>
        )}

        {/* Message container - Full screen on small devices */}
        {selectedConversation._id && (
          <Flex
            flex={isSmallScreen ? 100 : 70}
            borderRadius={"md"}
            p={0}
            position={"fixed"}
            overflowY={"auto"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            width={isSmallScreen ? "100%" : "auto"}
            height={isSmallScreen ? "95vh" : "auto"}
          >
            {isSmallScreen && (
              <Button onClick={handleBack} alignSelf={"flex-start"} mt={4}>
                Back
              </Button>
            )}
            <MessageContainer />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default ChatPage;
