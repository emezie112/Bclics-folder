import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Checkbox,
  VStack,
  Stack,
  FormControl,
  FormLabel,
  Button,
  useRadioGroup,
  Radio,
} from "@chakra-ui/react";

const AdvertisePage = () => {
  const [selectedPlan, setSelectedPlan] = useState("");

  const handlePlanChange = (value) => {
    setSelectedPlan(value);
  };

  // Radio Group for Single Selection of Plans
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "advertisementPlan",
    onChange: handlePlanChange,
  });

  const group = getRootProps();

  return (
    <Box maxWidth="600px" mx="auto" p={6}>
      {/* Page Header */}
      <Heading as="h1" size="xl" textAlign="center" mb={4}>
        Advertisement Page
      </Heading>

      {/* Sub Header and Text */}
      <Text fontSize="lg" textAlign="center" mb={6}>
        Choose an Advertisement Plan
      </Text>

      {/* Advertisement Plans */}
      <VStack spacing={6} align="stretch" {...group}>
        {/* 1-Day Plan */}
        <Box borderWidth={1} borderRadius="md" p={4}>
          <FormControl>
            <Radio value="1-day" {...getRadioProps({ value: "1-day" })}>
              1 Day ₦800
            </Radio>
          </FormControl>
          <Text fontSize="sm" color="gray.500" ml={6}>
            Post will last for 24 hrs before deleting itself.
          </Text>
        </Box>

        {/* 1-Week Plan */}
        <Box borderWidth={1} borderRadius="md" p={4}>
          <FormControl>
            <Radio value="1-week" {...getRadioProps({ value: "1-week" })}>
              1 Week ₦3850
            </Radio>
          </FormControl>
          <Text fontSize="sm" color="gray.500" ml={6}>
            Post will last for 7 days before deleting itself.
          </Text>
        </Box>
      </VStack>

      {/* Description Section */}
      <Box mt={8}>
        <Heading as="h2" size="md" mb={2}>
          Description
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Ads normally show after 3 posts in a constant loop. After payment and
          uploading, your ads will join the loop and continue to display for all
          users on this app.
        </Text>
      </Box>

      {/* Submit Button */}
      <Button
        colorScheme="blue"
        mt={6}
        isDisabled={!selectedPlan}
        onClick={() => alert(`You selected the ${selectedPlan} plan`)}
        width="full"
      >
        Submit
      </Button>
    </Box>
  );
};

export default AdvertisePage;
