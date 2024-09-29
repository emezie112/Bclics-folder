import { DeleteIcon } from "@chakra-ui/icons";
import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";

const Comment = ({ lastReply, reply }) => {
  // const handleDeletePost = async (e) => {
  //   try {
  //     e.preventDefault();
  //     if (!window.confirm("Are you sure you want to delete this comment ? "))
  //       return;

  //     const res = await fetch(`/api/posts/${post._id}`, {
  //       method: "DELETE",
  //     });
  //     const data = await res.json();
  //     if (data.error) {
  //       showToast("Error", data.error, "error");
  //       return;
  //     }
  //     showToast("Success", "comment Deleted", "success");
  //     setPosts(posts.filter((p) => p._id !== post._id));
  //   } catch (error) {
  //     showToast("Error", error.message, "error");
  //   }
  // };

  return (
    <>
      <Flex
        gap={4}
        py={2}
        my={2}
        w="100%" // Ensure it takes up full width of the parent container
        maxW="100%" // Prevents overflowing beyond the screen width
      >
        <Avatar src={reply.userProfilePic} size="sm" />

        <Flex
          gap={1}
          w="100%" // Make the child Flex take up full width of the parent Flex
          flexDirection="column"
        >
          {/* Top row with username and delete icon */}
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Text fontSize="sm" fontWeight="bold" isTruncated>
              {reply.username}
            </Text>
            <DeleteIcon size={20} alignSelf="flex-end" />
          </Flex>

          {/* Reply text */}
          <Text
            w="85%" // Ensure the text block uses full width of the container
            wordBreak="break-word" // Break long words to prevent overflow
            overflowWrap="break-word" // Ensures long unbreakable text breaks properly
            whiteSpace="pre-wrap" // Preserve white spaces and ensure text wraps
            flex={80}
          >
            {reply.text}
          </Text>

          {/* Reply label */}
          <Text size="sm" alignSelf="flex-end">
            Reply
          </Text>
        </Flex>
      </Flex>

      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;
