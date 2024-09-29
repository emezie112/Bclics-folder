import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Avatar,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";

const notifications = [
  {
    id: 1,
    image: "https://via.placeholder.com/150",
    text: "This is a notification message that contains more than 35 words. You can click display more to read the full message, and then collapse it back by clicking display less. This is the extended part of the message.",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/150",
    text: "A short notification message.",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/150",
    text: "This is another notification message with more than 35 words. You can expand to read more and then collapse the message to the initial state. This feature makes notifications more user-friendly.",
  },
];

const NotificationPage = () => {
  // State to manage which notifications are expanded
  const [expandedNotifications, setExpandedNotifications] = useState({});

  // Toggle expand/collapse for a specific notification
  const toggleExpand = (id) => {
    setExpandedNotifications((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Function to render notification text based on expansion state
  const renderNotificationText = (text, isExpanded) => {
    if (text.split(" ").length > 17) {
      return isExpanded ? text : `${text.split(" ").slice(0, 17).join(" ")}...`;
    }
    return text;
  };

  return (
    <Box p={6} maxWidth="800px" mx="auto">
      <Heading as="h4" size="xl" mb={6} textAlign="center">
        Your Notifications
      </Heading>

      <VStack spacing={6} align="stretch">
        {notifications.map((notification) => {
          const isExpanded = expandedNotifications[notification.id];

          return (
            <HStack key={notification.id} alignItems="flex-start" spacing={4}>
              {/* Notification Image */}
              <Avatar src={notification.image} size="lg" />

              {/* Notification Text */}
              <Box flex="1">
                <Text fontSize="md">
                  {renderNotificationText(notification.text, isExpanded)}
                </Text>

                {notification.text.split(" ").length > 17 && (
                  <Button
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                    mt={2}
                    onClick={() => toggleExpand(notification.id)}
                  >
                    {isExpanded ? "Display Less" : "Display More"}
                  </Button>
                )}
              </Box>
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
};

export default NotificationPage;
