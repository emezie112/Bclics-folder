import {
  Box,
  Container,
  theme,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/NotificationPage";
import HomeSlider from "./pages/HomeSlider";
import ExploreUsersPage from "./pages/ExploreUsersPage";
import VerificationPage from "./pages/VerificationPage";
import AdvertisePage from "./pages/AdvertisePage";
import CustomerCare from "./pages/CustomerCare";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();

  return (
    <Box position={"relative"} w="full">
      <Container
        maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}
      >
        <Routes>
          

          <Route
            path="/"
            element={user ? <HomeSlider /> : <Navigate to="/auth" />}
          />

          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />

          {/* Special Routes */}
          <Route
            path="/searchPage"
            element={user ? <SearchPage /> : <Navigate to="/auth" />}
          />

          <Route
            path="/notificationPage"
            element={user ? <NotificationPage /> : <Navigate to="/auth" />}
          />

          <Route
            path="/exploreUsersPage"
            element={user ? <ExploreUsersPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/settings/exploreUsersPage"
            element={user ? <ExploreUsersPage /> : <Navigate to="/auth" />}
          />

          <Route
            path="/settings/verificationPage"
            element={user ? <VerificationPage /> : <Navigate to="/auth" />}
          />

          <Route
            path="/settings/advertisePage"
            element={user ? <AdvertisePage /> : <Navigate to="/auth" />}
          />

          <Route
            path="/settings/customerCare"
            element={user ? <CustomerCare /> : <Navigate to="/auth" />}
          />

          <Route
            path="/settings/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />

          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />

          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />

                  <Box
                    position={"fixed"}
                    bottom={20}
                    right={5}

                    // bg={useColorModeValue("gray.300", "gray.dark")}
                  >
                    <CreatePost />
                  </Box>
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to={"/auth"} />}
          />
        </Routes>
        <Box
          position="fixed"
          bottom="0"
          left="0"
          w="100%"
          zIndex="1"
          bg={"#101010"}
          h={"4rem"}
          p={"1rem"}
          maxW={{ base: "620px", md: "620px" }}
        >
          <Header />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
