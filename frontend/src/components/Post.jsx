import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { Image } from "@chakra-ui/image";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const [showMore, setShowMore] = useState(false); // For "show more" functionality
  const [showNumber, setShowNumber] = useState(false); // For toggling phone number visibility
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };
    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post Deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user) return null;

  const handleShowMoreToggle = () => setShowMore(!showMore);

  // Slick carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            size="md"
            name={user?.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Flex>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            >
              {user.username}
            </Text>
            <Image
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
              src="/verified.png"
              w="4"
              h={4}
              ml={4}
            />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xm"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>

          {currentUser?._id === user._id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>

      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"} gap={0.5}>
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
        </Flex>

        <Flex flex={1} flexDirection={"column"} gap={2}>
          {/* Image Carousel using react-slick */}
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
              maxH={{ base: "300px", md: "400px", lg: "500px" }} // Set max height for different screen sizes
            >
              {Array.isArray(post.img) ? (
                <Slider {...settings}>
                  {post.img.map((src, index) => (
                    <Image
                      key={index}
                      src={src}
                      w={"full"}
                      h={"full"}
                      objectFit={"cover"} // Ensures the image covers the container
                    />
                  ))}
                </Slider>
              ) : (
                <Image
                  src={post.img}
                  w={"full"}
                  h={"full"}
                  objectFit={"cover"} // Ensures the image covers the container
                />
              )}
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>

          {/* Header */}
          <Text fontSize={"md"} fontWeight={"bold"}>
            Random Product Header
          </Text>

          {/* Price */}
          <Text fontSize={"md"} color={"green.500"} fontWeight={"bold"}>
            ₦25,000
          </Text>

          {/* Phone Number and Message Button */}
          <Flex alignItems={"center"} gap={2}>
            <Button
              variant={"outline"}
              borderColor={"blue.400"}
              color={"blue.400"}
              onClick={(e) => {
                e.preventDefault(); // Prevent default behavior
                setShowNumber(!showNumber); // Toggle phone number visibility
              }}
            >
              {showNumber ? "08012345678" : "Show Number"}{" "}
              {/* Show the number or "Show Number" */}
            </Button>
            <Button
              bg={"blue.400"}
              color={"white"}
              onClick={(e) => {
                e.preventDefault(); // Prevent default behavior
              }}
            >
              Message
            </Button>
          </Flex>

          {/* Location */}
          <Text fontSize={"sm"} color={"blue.400"}>
            Lagos, Nigeria
          </Text>

          {/* Brand New */}
          <Text fontSize={"sm"}>Brand New</Text>

          {/* Fixed Price */}
          <Text fontSize={"sm"}>Fixed Price</Text>

          {/* Post Text with Show More/Less */}
          <Text
            fontSize={"sm"}
            onClick={(e) => {
              e.preventDefault(); // Prevent default behavior
            }}
          >
            {post.text.split(" ").length > 20 ? (
              <>
                {showMore
                  ? post.text
                  : `${post.text.split(" ").slice(0, 20).join(" ")}...`}
                <Text
                  color="blue.500"
                  onClick={handleShowMoreToggle}
                  cursor="pointer"
                >
                  {showMore ? "Show Less" : "Show More"}
                </Text>
              </>
            ) : (
              post.text
            )}
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
