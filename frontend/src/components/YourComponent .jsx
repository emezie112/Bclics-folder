import { useBreakpointValue } from "@chakra-ui/react";
import MessageContainer from "./MessageContainer";

const YourComponent = ({ selectedConversation }) => {
  // Determine if the screen size is "small"
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {/* Conditionally render MessageContainer based on screen size and selectedConversation */}
      {selectedConversation._id && !isSmallScreen && <MessageContainer />}
    </>
  );
};

export default YourComponent;
