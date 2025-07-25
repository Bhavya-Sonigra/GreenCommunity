#!/bin/bash

# Marketplace API Testing Script
# This script tests all the marketplace endpoints with sample data

# Base URL - Update this to match your server
BASE_URL="http://localhost:3000/api/marketplace"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TEST_COUNT=0
PASS_COUNT=0

# Function to run test and display results
run_test() {
    local test_name="$1"
    local curl_command="$2"
    local expected_status="$3"
    
    TEST_COUNT=$((TEST_COUNT + 1))
    echo -e "\n${BLUE}Test $TEST_COUNT: $test_name${NC}"
    echo "Command: $curl_command"
    echo "Expected status: $expected_status"
    echo "----------------------------------------"
    
    # Run the curl command and capture response and status
    response=$(eval "$curl_command" 2>/dev/null)
    status=$?
    
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}✓ Request successful${NC}"
        echo "Response: $response" | head -c 500
        if [ ${#response} -gt 500 ]; then
            echo "... (truncated)"
        fi
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}✗ Request failed${NC}"
    fi
    echo ""
}

# Function to print section header
print_section() {
    echo -e "\n${YELLOW}===========================================${NC}"
    echo -e "${YELLOW} $1 ${NC}"
    echo -e "${YELLOW}===========================================${NC}"
}

# Store JWT token for authenticated requests (you'll need to set this)
JWT_TOKEN=""

echo -e "${GREEN}Marketplace API Testing Script${NC}"
echo "Make sure your server is running on $BASE_URL"
echo "For authenticated endpoints, set JWT_TOKEN variable in this script"

# Wait for user confirmation
read -p "Press Enter to start testing..."

print_section "PUBLIC ENDPOINTS"

# 1. Health Check
run_test "Health Check" \
    "curl -s '$BASE_URL/health'" \
    200

# 2. Get All Products
run_test "Get All Products (Basic)" \
    "curl -s '$BASE_URL/products'" \
    200

# 3. Get Products with Filters
run_test "Get Products with Filters" \
    "curl -s '$BASE_URL/products?page=1&limit=5&category=solar&inStock=true&sortBy=createdAt&sortOrder=-1'" \
    200

# 4. Get Featured Products
run_test "Get Featured Products" \
    "curl -s '$BASE_URL/featured?limit=3'" \
    200

# 5. Get Categories
run_test "Get Categories" \
    "curl -s '$BASE_URL/categories'" \
    200

# 6. Get Product by ID (you'll need a valid product ID)
# Note: This will likely fail unless you have products in your database
run_test "Get Product by ID" \
    "curl -s '$BASE_URL/products/60d21b4667d0d8992e610c85'" \
    200

# 7. Get Seller Products
run_test "Get Seller Products" \
    "curl -s '$BASE_URL/seller/60d21b4667d0d8992e610c85/products'" \
    200

# 8. Search Products
run_test "Search Products" \
    "curl -s -X POST '$BASE_URL/search' \\
     -H 'Content-Type: application/json' \\
     -d '{
       \"query\": \"solar panel\",
       \"category\": \"solar\",
       \"minPrice\": 100,
       \"maxPrice\": 500,
       \"minRating\": 4,
       \"inStock\": true,
       \"sortBy\": \"sustainability.eco_rating\",
       \"sortOrder\": -1,
       \"limit\": 10,
       \"skip\": 0
     }'" \
    200

# 9. Get Sustainable Products
run_test "Get Sustainable Products" \
    "curl -s '$BASE_URL/sustainable?eco_rating=4&certifications=Energy%20Star&carbon_neutral=true'" \
    200

print_section "AUTHENTICATED ENDPOINTS"

if [ -z "$JWT_TOKEN" ]; then
    echo -e "${YELLOW}Warning: JWT_TOKEN not set. Authenticated tests will fail.${NC}"
    echo "Set JWT_TOKEN variable at the top of this script to test authenticated endpoints."
fi

# 10. Create Product
run_test "Create Product" \
    "curl -s -X POST '$BASE_URL/products' \\
     -H 'Content-Type: application/json' \\
     -H 'Authorization: Bearer $JWT_TOKEN' \\
     -d '{
       \"name\": \"Test Eco-Friendly Solar Panel Kit\",
       \"description\": \"High-efficiency solar panel kit for home use - created by test script\",
       \"category\": \"solar\",
       \"subcategory\": \"home solar systems\",
       \"images\": [
         \"https://example.com/solar-panel-1.jpg\",
         \"https://example.com/solar-panel-2.jpg\"
       ],
       \"pricing\": {
         \"base_price\": 299.99,
         \"currency\": \"USD\",
         \"discount_price\": 249.99,
         \"bulk_pricing\": [
           { \"min_quantity\": 5, \"price\": 229.99 },
           { \"min_quantity\": 10, \"price\": 209.99 }
         ]
       },
       \"sustainability\": {
         \"certifications\": [\"Energy Star\", \"Carbon Neutral\"],
         \"eco_rating\": 5,
         \"carbon_footprint\": 0.1,
         \"carbon_offset_included\": true,
         \"recyclable\": true,
         \"renewable_materials\": true,
         \"local_sourced\": false
       },
       \"inventory\": {
         \"stock_quantity\": 100,
         \"weight\": 2500,
         \"dimensions\": { \"length\": 65, \"width\": 35, \"height\": 5, \"unit\": \"cm\" }
       },
       \"shipping\": {
         \"free_shipping_threshold\": 200,
         \"shipping_cost\": 25.99,
         \"international_shipping\": true,
         \"processing_time\": 3,
         \"carbon_neutral_shipping\": true
       },
       \"tags\": [\"solar\", \"renewable\", \"eco-friendly\", \"energy-efficient\"],
       \"featured\": false,
       \"status\": \"active\"
     }'" \
    201

# 11. Get My Products
run_test "Get My Products" \
    "curl -s '$BASE_URL/my-products?page=1&limit=10' \\
     -H 'Authorization: Bearer $JWT_TOKEN'" \
    200

# 12. Update Product (using a sample product ID)
run_test "Update Product" \
    "curl -s -X PUT '$BASE_URL/products/60d21b4667d0d8992e610c85' \\
     -H 'Content-Type: application/json' \\
     -H 'Authorization: Bearer $JWT_TOKEN' \\
     -d '{
       \"description\": \"Updated description for solar panel kit - modified by test script\",
       \"featured\": true,
       \"status\": \"active\"
     }'" \
    200

# 13. Update Product Stock
run_test "Update Product Stock" \
    "curl -s -X PATCH '$BASE_URL/products/60d21b4667d0d8992e610c85/stock' \\
     -H 'Content-Type: application/json' \\
     -H 'Authorization: Bearer $JWT_TOKEN' \\
     -d '{
       \"quantity\": 50,
       \"operation\": \"set\"
     }'" \
    200

# 14. Delete Product
run_test "Delete Product" \
    "curl -s -X DELETE '$BASE_URL/products/60d21b4667d0d8992e610c85' \\
     -H 'Authorization: Bearer $JWT_TOKEN'" \
    200

print_section "ADMIN ONLY ENDPOINTS"

# 15. Toggle Featured Product
run_test "Toggle Featured Product (Admin)" \
    "curl -s -X PATCH '$BASE_URL/products/60d21b4667d0d8992e610c85/featured' \\
     -H 'Authorization: Bearer $JWT_TOKEN'" \
    200

# 16. Get Marketplace Statistics
run_test "Get Marketplace Statistics (Admin)" \
    "curl -s '$BASE_URL/admin/stats' \\
     -H 'Authorization: Bearer $JWT_TOKEN'" \
    200

print_section "RATE LIMITING TESTS"

# Test rate limiting by making multiple requests quickly
echo -e "\n${BLUE}Testing Rate Limiting - Making 5 quick search requests...${NC}"
for i in {1..5}; do
    echo "Search request $i"
    curl -s -X POST "$BASE_URL/search" \
         -H 'Content-Type: application/json' \
         -d '{"query": "test"}' > /dev/null
    sleep 0.1
done

print_section "TEST SUMMARY"

echo -e "Total tests run: ${BLUE}$TEST_COUNT${NC}"
echo -e "Passed: ${GREEN}$PASS_COUNT${NC}"
echo -e "Failed: ${RED}$((TEST_COUNT - PASS_COUNT))${NC}"

if [ $PASS_COUNT -eq $TEST_COUNT ]; then
    echo -e "\n${GREEN}🎉 All tests passed!${NC}"
else
    echo -e "\n${YELLOW}⚠️  Some tests failed. Check the output above for details.${NC}"
fi

echo -e "\n${BLUE}Testing completed!${NC}"
echo ""
echo "Notes:"
echo "- Update BASE_URL if your server runs on a different port"
echo "- Set JWT_TOKEN for authenticated endpoints"
echo "- Replace sample product IDs with actual IDs from your database"
echo "- Some tests may fail if your database is empty"
