import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 1000;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [pricePoint, setPricePoint] = useState("");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          title: postTitle,
          img: imgUrl,
          category,
          price,
          location,
          condition,
          pricePoint,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created successfully", "success");
      if (username === user.username) {
        setPosts([data, ...posts]);
      }

      onClose();
      setPostText("");
      setPostTitle("");
      setImgUrl("");
      setCategory("");
      setPrice("");
      setLocation("");
      setCondition("");
      setPricePoint("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
        bg={useColorModeValue("gray.300", "gray.dark")}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={"0.5rem"} m={"0.5rem"} gap={2}>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Post Description */}
            <FormControl>
              Discription
              <Textarea
                placeholder="Post content goes here..."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign="right"
                m={1}
                color="gray.800"
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              {/* Image Upload */}
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <Box display={"flex"} mt={"0.5rem"} mb={"0.5rem"}>
                <Text>Image</Text>
                <BsFillImageFill
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                  size={16}
                  onClick={() => imageRef.current.click()}
                />
              </Box>
              {/* Post Header */}
              <Text mt={"0.5rem"} mb={"-0.5rem"}>
                Post Header
              </Text>
              <Input
                placeholder="Write the title of your post"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                mt={4}
              />
              <Text fontSize="xs" mt={2}>
                Note: The title will help in the search across other users.
              </Text>
              {/* Image Preview */}
              {imgUrl && (
                <Flex mt={5} w="full" position="relative">
                  <Image src={imgUrl} alt="Selected img" />
                  <CloseButton
                    onClick={() => setImgUrl("")}
                    bg="gray.800"
                    position="absolute"
                    top={2}
                    right={2}
                  />
                </Flex>
              )}
              {/* Categories */}
              <Text mt={"0.5rem"} mb={"-0.5rem"}>
                Category
              </Text>
              <Select
                placeholder="Select category"
                mt={4}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Tech">Tech</option>
                <option value="Fashion">Fashion</option>
                <option value="Sports">Sports</option>
                <option value="Home">Home</option>
              </Select>
              {/* Price */}
              <Text mt={"0.5rem"} mb={"-0.5rem"}>
                Price
              </Text>
              <Input
                placeholder="Input the Price"
                type="number"
                mt={4}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {/* Location */}
              <Text mt={"0.5rem"} mb={"-0.5rem"} 
                >Location
              </Text>
              <Input
                placeholder="Write where this is available in"
                mt={4}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {/* Condition */}
              <Text mt={4}>Condition</Text>
              <Flex gap={4} flexDirection={"flex-wrap"}>
                <Checkbox
                  isChecked={condition === "Brand New"}
                  onChange={() => setCondition("Brand New")}
                >
                  Brand New
                </Checkbox>
                <Checkbox
                  isChecked={condition === "Foreign Used"}
                  onChange={() => setCondition("Foreign Used")}
                >
                  Foreign Used
                </Checkbox>
                <Checkbox
                  isChecked={condition === "Nigerian Used"}
                  onChange={() => setCondition("Nigerian Used")}
                >
                  Nigerian Used
                </Checkbox>
              </Flex>
              {/* Price Point */}
              <Text mt={4}>Price Point</Text>
              <Flex gap={4} flexDirection={"flex-wrap"}>
                <Checkbox
                  isChecked={pricePoint === "Negotiable"}
                  onChange={() => setPricePoint("Negotiable")}
                >
                  Negotiable Price
                </Checkbox>
                <Checkbox
                  isChecked={pricePoint === "Fixed"}
                  onChange={() => setPricePoint("Fixed")}
                >
                  Fixed Price
                </Checkbox>
              </Flex>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
