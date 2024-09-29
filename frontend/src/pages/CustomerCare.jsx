import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Textarea,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";

const CustomerCare = () => {
  const [problemText, setProblemText] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const toast = useToast();

  const handleTextChange = (e) => {
    setProblemText(e.target.value);
  };

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission can go here
    console.log({ problemText, screenshot });

    // Display toast message after submission
    toast({
      title: "Submitted",
      description: "Your request has been submitted successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxWidth="600px" mx="auto" p={6}>
      {/* Page Header */}
      <Heading as="h1" size="xl" textAlign="center" mb={4}>
        Customer Care
      </Heading>

      {/* Sub Header Text */}
      <Text fontSize="lg" textAlign="center" mb={6}>
        How can we help you out?
      </Text>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {/* Problem Text Field */}
          <FormControl isRequired>
            <FormLabel>Describe the problem</FormLabel>
            <Textarea
              placeholder="Describe the issue you're facing"
              value={problemText}
              onChange={handleTextChange}
              size="lg"
            />
          </FormControl>

          {/* Screenshot Upload (Optional) */}
          <FormControl>
            <FormLabel>Post a screenshot of the problem (Optional)</FormLabel>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </FormControl>

          {/* Submit Button */}
          <Button colorScheme="blue" type="submit" width="full">
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CustomerCare;
