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
import Slider from "react-slick"; // Ensure you have react-slick installed

const MAX_CHAR = 1000;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const { handleImageChange, imgUrls, removeImage } = usePreviewImg(); // Updated to use imgUrls
  const imageRef = useRef(null);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
          header: postTitle,
          img: imgUrls, // Changed to imgUrls for multiple images
          category,
          price,
          phoneNumber,
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
      setCategory("");
      setPrice("");
      setPhoneNumber("");
      setLocation("");
      setCondition("");
      setPricePoint("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Slider settings for image preview
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
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
              Description
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
              {/* Image Input and Preview */}
              <Input
                type="file"
                hidden
                ref={imageRef}
                multiple
                accept="image/"
                onChange={handleImageChange}
              />
              <Box display={"flex"} mt={"0.5rem"} mb={"0.5rem"}>
                <Text onClick={() => imageRef.current.click()}>Add Image</Text>
                <BsFillImageFill
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                  size={16}
                  onClick={() => imageRef.current.click()}
                />
              </Box>
              {/* Image Preview */}
              {imgUrls.length > 0 && (
                <Box>
                  {imgUrls.length === 1 ? (
                    // Show single image preview if only one image is uploaded
                    <Box position="relative">
                      <Image src={imgUrls[0]} borderRadius="md" />
                      <CloseButton
                        position="absolute"
                        top="2"
                        right="2"
                        onClick={() => removeImage(0)}
                      />
                    </Box>
                  ) : (
                    // Show slider if more than one image is uploaded
                    <Slider {...settings}>
                      {imgUrls.map((url, index) => (
                        <Box key={index} position="relative">
                          <Image src={url} borderRadius="md" />
                          <CloseButton
                            position="absolute"
                            top="2"
                            right="2"
                            onClick={() => removeImage(index)}
                          />
                        </Box>
                      ))}
                    </Slider>
                  )}
                </Box>
              )}
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
              {/* Phone Number */}
              <Text mt={"0.5rem"} mb={"-0.5rem"}>
                Phone Number
              </Text>
              <Input
                placeholder="Enter phone number"
                type="number"
                mt={4}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {/* Location */}
              <Text mt={"0.5rem"} mb={"-0.5rem"}>
                Location
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
