import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPost = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPost();
  }, [showToast, setPosts]);

  return (
    <>
      <Flex>
        <Box flex={70}>
          {!loading && posts.length === 0 && (
            <h1>Follow some users to see the feed</h1>
          )}

          {loading && (
            <Flex justify={"center"}>
              <Spinner size="xl" />
            </Flex>
          )}

          <Box mb={"5rem"}>
            {posts.map((post) => (
              <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default HomePage;
