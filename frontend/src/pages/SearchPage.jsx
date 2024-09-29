import React from "react";
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Heading,
  Link,
  Grid,
  GridItem,
  Text,
  HStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

const categories = [
  { name: "Products", path: "/products" },
  { name: "Services", path: "/services" },
  { name: "Sales", path: "/sales" },
  { name: "Requests", path: "/requests" },
  { name: "More Categories", path: "/more-categories" },
];

const SearchPage = () => {
  return (
    <Box p={6} maxWidth="800px" mx="auto" textAlign="center">
      {/* Search Bar */}
      <VStack spacing={4}>
        <Heading as="h4" size="xl" mb={6}>
          Search for Anything
        </Heading>

        <InputGroup size="lg">
          <Input
            placeholder="Search for products, services, and more..."
            focusBorderColor="blue.500"
            boxShadow="md"
          />
          <InputRightElement>
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              colorScheme="blue"
              size="lg"
              isRound
            />
          </InputRightElement>
        </InputGroup>
      </VStack>

      {/* OnClicking the Search button After search display this */}

      {/* <Box as="header" width="100%" p={4}  boxShadow="md" mt={6}>
        <HStack
          spacing={8}
          justify="space-around"
          fontWeight="bold"
          fontSize="lg"
        >
          <Link
            as={RouterLink}
            to="/users"
          >
            Users
          </Link>
          <Link
            as={RouterLink}
            to="/posts"
          >
            Posts
          </Link>
          <Link
            as={RouterLink}
            to="/based-on-description"
          >
            Description
          </Link>
        </HStack>
      </Box> */}

      {/* Categories */}
      <Box mt={10}>
        <Heading as="h2" size="lg" mb={4}>
          Browse Categories
        </Heading>

        <Grid templateColumns="repeat(2, 4fr)" gap={6}>
          {categories.map((category, index) => (
            <GridItem key={index}>
              <Link
                as={RouterLink}
                to={category.path}
                fontSize="xl"
                fontWeight="bold"
                textDecoration="none"
                _hover={{ textDecoration: "underline", color: "blue.500" }}
                p={4}
                display="block"
                borderRadius="md"
                bg="gray"
                _hover={{ bg: "gray.200", color: "blue.500" }}
                textAlign="center"
              >
                <Text>Categories</Text>
                {/* {category.name} */}
              </Link>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SearchPage;
