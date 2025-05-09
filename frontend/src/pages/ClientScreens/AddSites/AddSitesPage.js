import React, { useState, useEffect } from "react";
import TopNavBar from "../../../components/NavBar/TopNavBar";
import {
  Box,
  Card,
  Typography,
  Grid,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import PlusCircle from "../../../assets/icons/pluscircle.png";
import SiteIcon from "../../../assets/icons/siteicon.png";
import WestIcon from "@mui/icons-material/West";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_PATHS from "../../../Config";
import LoadingSpinner from "../../../components/LoadingSpinner";

const AddSitesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sites, setSites] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSites = async () => {
      let CustomerId = sessionStorage.getItem("customer_id");
  
      if (!CustomerId) {
        console.error("Customer ID is not available.");
        setLoading(false);
        return; // No customer ID, stop further execution
      }
  
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL + API_PATHS.GET_SITE_BY_CUSTOMER_ID}/${CustomerId}`
        );
  
        if (response.status === 200 && response.data && response.data.length > 0) {
          const apiSites = response.data.map((site) => ({
            id: site.site_id,
            name: site.site_name,
            description: `No. of Buildings: ${site.buildings_count}`,
            pageLink: "/client-dashboard/buildings",
          }));
          setSites(apiSites);
        } else {
          console.warn("No sites found for the given customer ID.");
          setSites([]); // Clear sites if none are found
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("Customer not found in the database.");
          setSites([]); // Clear the sites list if the customer is not found (404)
        } else {
          console.error("Error fetching sites:", error);
        }
      } finally {
        setLoading(false);
      }
    };
  
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}${API_PATHS.GET_CUSTOMER_LIST}`
        );
        setCustomerList(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
  
    fetchSites();
    fetchCustomers();
  }, [refresh]);
  

  const handleCategoryChange = (event) => {
    const selectedCustomer = customerList.find(
      (customer) => customer.customer_name === event.target.value
    );

    if (selectedCustomer) {
      sessionStorage.setItem("customer_id", selectedCustomer.customer_id);
      setSelectedCategory(event.target.value);
      setRefresh((prev) => !prev); // Trigger refresh to refetch sites
    }
  };

  const handleCardClick = (site) => {
    sessionStorage.setItem("site_id", site.id);
    navigate(site.pageLink);
  };

  const handleBackButtonClick = () => {
    navigate("/client-dashboard");
  };

  return (
    <>
      <TopNavBar />
      <Box sx={{ minHeight: "89vh", background: "#1A1A1D" }}>
        <Box
          sx={{
            minHeight: "27vh",
            display: "flex",
            justifyContent: "center",
            paddingTop: "20px",
          }}
        >
          <Box
            sx={{
              background: "#212125",
              width: "65%",
              borderRadius: "30px",
              padding: "20px 40px",
              borderRadius: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography fontSize="20px" color="#FFFFFF" fontWeight="700" mb={2}>
                All Sites
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <IconButton
                  sx={{ height: "12px", marginRight: "12px", color: "white" }}
                  onClick={handleBackButtonClick}
                >
                  <WestIcon />
                </IconButton>
                <Typography fontSize="12px" color="#FFFFFF" fontWeight="600" mb={2} mr={1}>
                  Choose Clients
                </Typography>

                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                  <Select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    displayEmpty
                    sx={{
                      height: "23px",
                      fontSize: ".7rem",
                      color: "#FFFFFF",
                      background: "#27272C",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#38383d",
                      },
                      ".MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      ".MuiSelect-select": {
                        padding: "10px",
                        display: "flex",
                        alignItems: "center",
                      },
                      ".MuiSvgIcon-root": {
                        color: "#FFFFFF",
                      },
                    }}
                    IconComponent={(props) => (
                      <span {...props} style={{ color: "#FFFFFF" }}>
                        ▼
                      </span>
                    )}
                  >
                    <MenuItem value="">
                      <em>Select Customer</em>
                    </MenuItem>
                    {customerList.map((customer) => (
                      <MenuItem key={customer.customer_id} value={customer.customer_name}>
                        {customer.customer_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <LoadingSpinner />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {sites.map((site) => (
                  <Grid item xs={12} sm={6} md={3} key={site.id}>
                    <Card
                      sx={{
                        background: "#27272C",
                        borderRadius: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCardClick(site)}
                    >
                      <Box padding="20px 15px 7px 12px">
                        <Box
                          component="img"
                          src={SiteIcon}
                          alt={site.name}
                          pl={1}
                          sx={{
                            width: "46%",
                            height: "75px",
                            borderRadius: "10px",
                          }}
                        />
                        <Typography
                          fontSize="13px"
                          color="white"
                          fontWeight="700"
                          pl={1}
                          mt={1.2}
                          mb={0.5}
                          letterSpacing={0.5}
                        >
                          {site.name}
                        </Typography>
                        <Typography
                          fontSize="10px"
                          color="gray"
                          pl={1}
                          pb={1}
                          letterSpacing={0.5}
                        >
                          {site.description}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
   
    </>
  );
};

export default AddSitesPage
