import { Flex, Text, Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";
import SuggestedUsers from "../components/SuggestedUsers";
import HomePage from "./HomePage";
import ForyouPage from "./ForyouPage";

const HomeSlider = () => {
  const [activeSlide, setActiveSlide] = useState("forYou"); // Initial slide state
  const [showHeader, setShowHeader] = useState(true); // To control visibility of header on scroll
  const navigate = useNavigate(); // To navigate between pages
  const location = useLocation(); // To get the current location

  // Track the last scroll position
  let lastScrollY = window.scrollY;

  // Function to handle swipe left or right
  const handleSwipe = (direction) => {
    if (direction === "left" && activeSlide === "forYou") {
      setActiveSlide("following");
    } else if (direction === "right" && activeSlide === "following") {
      setActiveSlide("forYou");
    }
  };

  // Swipeable handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
  });

  // Function to save the scroll position before navigating to a post
  const handlePostClick = (postId) => {
    const currentScroll = window.scrollY;
    // Save the current scroll position in sessionStorage
    sessionStorage.setItem("scrollPosition", currentScroll);
    navigate(`/post/${postId}`, { state: { fromHome: true } }); // Navigate to the post page
  };

  // When the user comes back, restore the scroll position
  useEffect(() => {
    if (location.state?.fromHome) {
      // Check if the scroll position is saved in sessionStorage
      const savedScrollPosition = sessionStorage.getItem("scrollPosition");
      if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }
    }
  }, [location]);

  // Handle scroll direction to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowHeader(false);
      } else {
        // Scrolling up
        setShowHeader(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box>
        {/* Sticky Header Section */}
        <Box
          position="sticky"
          top="0"
          zIndex="100"
          bg="#101010"
          transition="top 0.3s ease"
          style={{ top: showHeader ? "0" : "-100px" }}
        >
          {/* "Bc" Logo */}
          <Flex justify="center" align="center" py={2}>
            <Text
              fontWeight="extrabold"
              color="blue.400"
              fontSize="1.8rem"
              letterSpacing="widest"
              textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
              textTransform="uppercase"
              fontFamily="'Comic Sans MS', 'cursive', 'sans-serif'"
            >
              Bc
            </Text>
          </Flex>

          {/* Tab Selector (For You / Following) */}
          <Flex w={{ base: "90vw", md: "60vw", lg: "40vw" }} mb={4}>
            {/* For You Tab */}
            <Flex
              flex={1}
              borderBottom={
                activeSlide === "forYou"
                  ? "1.5px solid white"
                  : "1.5px solid gray"
              }
              justifyContent={"center"}
              pb="3"

              cursor={"pointer"}
              onClick={() => setActiveSlide("forYou")}
            >
              <Text>For You</Text>
            </Flex>

            {/* Following Tab */}
            <Flex
              flex={1}
              borderBottom={
                activeSlide === "following"
                  ? "1.5px solid white"
                  : "1.5px solid gray"
              }
              justifyContent={"center"}
              pb="3"
              cursor={"pointer"}
              onClick={() => setActiveSlide("following")}
            >
              <Text>Following</Text>
            </Flex>
          </Flex>
        </Box>

        {/* Swipeable Slide Content */}
        <Flex gap="10" alignItems={"flex-start"}>
          <div {...handlers}>
            <Box>
              {activeSlide === "forYou" ? (
                <Box>
                  <ForyouPage onClickPost={handlePostClick} />
                </Box>
              ) : (
                <Box>
                  <HomePage onClickPost={handlePostClick} />
                </Box>
              )}
            </Box>
          </div>
        </Flex>
      </Box>
      <Box
        position="sticky"
        zIndex="100"
        bg="#101010"
        transition="top 0.3s ease"
        style={{ top: showHeader ? "0" : "-100px" }}
        mt={"4rem"}
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
        maxW={"15rem"}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomeSlider;
