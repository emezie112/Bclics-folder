import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  useToast,
} from "@chakra-ui/react";

const VerificationPage = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    cacRegistration: null,
    businessName: "",
    phoneNumber: "",
    idDocument: null,
    address: "",
    firstName: "",
    middleName: "",
    surname: "",
    age: "",
    userImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, [name]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission, such as sending data to the backend
    console.log(formData);
    toast({
      title: "Form Submitted",
      description: "Your verification form has been submitted!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxWidth="600px" mx="auto" mb={"4rem"} p={6}>
      {/* Header */}
      <Heading as="h1" size="xl" textAlign="center" mb={4}>
        Verification Page
      </Heading>

      {/* Instruction Text */}
      <Text fontSize="md" fontWeight={"bold"} mb={6} textAlign="center">
        In order to get Verified you need at least 100 customers to prove your
        authenticity.
      </Text>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} mt={"3rem"} align="stretch">
          {/* Header for Document Section */}
          <Heading as="h2" size="md">
            The Following Documents are needed:
          </Heading>

          {/* CAC Registration Image Upload */}
          <FormControl>
            <FormLabel>CAC Registration</FormLabel>
            <Input
              type="file"
              name="cacRegistration"
              accept="image/*"
              onChange={handleFileChange}
            />
          </FormControl>

          {/* Business/Company Name or Username */}
          <FormControl>
            <FormLabel>Business or Company Name or Username</FormLabel>
            <Textarea
              placeholder="Enter your business or company name"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Phone Number Input */}
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <InputGroup>
              <InputLeftAddon children="+234" />
              <Input
                type="number"
                placeholder="Phone number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </InputGroup>
          </FormControl>

          {/* ID Document Upload */}
          <FormControl>
            <FormLabel>
              Drivers License / Voters Card / National Passport
            </FormLabel>
            <Input
              type="file"
              name="idDocument"
              accept="image/*"
              onChange={handleFileChange}
            />
          </FormControl>

          {/* Address Field */}
          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input
              placeholder="Enter your address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* First Name */}
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input
              placeholder="Enter your first name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Middle Name */}
          <FormControl>
            <FormLabel>Middle Name</FormLabel>
            <Input
              placeholder="Enter your middle name"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Surname */}
          <FormControl>
            <FormLabel>Surname</FormLabel>
            <Input
              placeholder="Enter your surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Age or Business/Company Age */}
          <FormControl>
            <FormLabel>Age or Business/Company Age</FormLabel>
            <Input
              placeholder="Enter your age or business/company age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />
          </FormControl>

          {/* Picture of User */}
          <FormControl>
            <FormLabel>Picture of User</FormLabel>
            <Input
              type="file"
              name="userImage"
              accept="image/*"
              onChange={handleFileChange}
            />
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

export default VerificationPage;
