import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Flex,
  Text,
  Button,
  Image,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const [showMore, setShowMore] = useState(false); // For "Show More/Less" text functionality
  const [showNumber, setShowNumber] = useState(false); // Toggle phone number visibility

  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post Deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  // // Slick carousel settings
  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   arrows: true,
  // };

  return (
    <Box mb={"4rem"}>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar size="md" name={user?.name} src={user?.profilePic} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xm"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
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

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Text my={3}>{currentPost.text}</Text>

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

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
          {showNumber ? "08012345678" : "Show Number"}
        </Button>
        <Button
          bg={"blue.400"}
          color={"white"}
          onClick={(e) => e.preventDefault()} // Prevent default behavior
        >
          Message
        </Button>
      </Flex>

      <Divider my={4} />

      {[...currentPost.replies].reverse().map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={reply._id === currentPost.replies[0]._id}
        />
      ))}

      {/* Show more or less for long text */}
      <Text fontSize={"sm"}>
        {currentPost.text.split(" ").length > 20 ? (
          <>
            {showMore
              ? currentPost.text
              : `${currentPost.text.split(" ").slice(0, 20).join(" ")}...`}
            <Text
              color="blue.500"
              onClick={() => setShowMore(!showMore)}
              cursor="pointer"
            >
              {showMore ? "Show Less" : "Show More"}
            </Text>
          </>
        ) : (
          ""
        )}
      </Text>
    </Box>
  );
};

export default PostPage;
