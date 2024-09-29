import {
  Box,
  Heading,
  VStack,
  Textarea,
  Button,
  Link,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

const SettingsPage = () => {
  const showToast = useShowToast();
  const logout = useLogout();

  const freezeAccount = async () => {
    if (!window.confirm("Are you sure you want to freeze your account?"))
      return;

    try {
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        return showToast("Error", data.error, "error");
      }
      if (data.success) {
        await logout();
        showToast("Success", "Your account has been frozen", "success");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <>
      {/* Only if You're the Admin Then You can freeze a User's Account */}
      {/* <Text my={1} fontWeight={"bold"}>
        Freeze Your Account
      </Text>
      <Text my={1}>You can unfreeze your account anytime by logging in.</Text>
      <Button size={"sm"} colorScheme="red" onClick={freezeAccount}>
        Freeze
      </Button> */}

      <Box p={6} maxWidth="600px" mx="auto">
        {/* Page Title */}
        <Heading as="h4" size="lg" mb={6} textAlign="center">
          Bclics Settings
        </Heading>

        {/* Settings Options */}
        <VStack spacing={6} align="stretch">
          {/* Update Profile */}
          <Button as={RouterLink} to="/settings/update" size="lg">
            Update Profile
          </Button>

          {/* Feedback Section */}
          <Box>
            <Text fontWeight="bold" mb={2}>
              Feedback about Bclics
            </Text>
            <Textarea
              placeholder="Write anything, be it complaints, observations or suggestions"
              size="lg"
            />
            <Button color={"gray.100"} bg={"blue.400"}>
              Sumit
            </Button>
          </Box>

          {/* Customer Care */}

          <Button as={RouterLink} to={"/settings/customerCare"} size="lg">
            Customer Care
          </Button>

          {/* Advertise */}

          <Button as={RouterLink} to={"/settings/advertisePage"} size="lg">
            Advertise
          </Button>

          {/* Find Users */}

          <Button as={RouterLink} to={"/settings/exploreUsersPage"} size="lg">
            Find Users
          </Button>

          {/* Delete Account */}
          <Button colorScheme="red" size="lg">
            Delete Account
          </Button>

          {/* Get Verified */}

          <Button as={RouterLink} to={"/settings/verificationPage"} size="lg">
            Get Verified
          </Button>

          {/* Add personal or Business Links */}
          {/* <Button size="lg">Add Personal or Business Links</Button> */}

          {/* Logout */}
          <Button colorScheme="red" size="lg">
            Logout
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default SettingsPage;
