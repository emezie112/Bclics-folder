import React from "react";
import { Box, Flex, Skeleton, SkeletonCircle, Text, Heading, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "../components/SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const ExploreUsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [exploreUsers, setExploreUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    const getExploreUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/explore"); // Fetching all suggested users from the backend
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setExploreUsers(data); // Set all users received from the API
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getExploreUsers();
  }, [showToast]);

  return (
    <>
      <Heading as="h4" size="lg" mb={6} textAlign="center">
          Suggested Users
        </Heading>
      <Flex direction={"column"} gap={4}>
        {!loading &&
          exploreUsers.map((user) => (
            <SuggestedUser key={user._id} user={user} /> // Mapping all users returned from the API
          ))}
          
        {loading && 
          Array(10) // Show 5 skeletons while loading (you can dynamically change this number as needed)
          .fill("")
          .map((_, idx) => (
            <Flex
              key={idx}
              gap={2}
              alignItems={"center"}
              p={"1"}
              borderRadius={"md"}
            >
              {/* avatar skeleton */}
              <Box>
                <SkeletonCircle size={"10"} />
              </Box>
              {/* username and fullname skeleton */}
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"80px"} />
                <Skeleton h={"8px"} w={"90px"} />
              </Flex>
              {/* follow button skeleton */}
              <Flex>
                <Skeleton h={"20px"} w={"60px"} />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default ExploreUsersPage;
