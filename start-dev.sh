#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting GreenCommunity Development Environment${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"

# Function to cleanup processes on exit
cleanup() {
    echo -e "\n${RED}Stopping servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

# Start backend server
echo -e "${GREEN}Starting backend server...${NC}"
cd Server
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start frontend server
echo -e "${GREEN}Starting frontend server...${NC}"
cd ../client
npm run dev &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 3

echo -e "${GREEN}✅ Both servers are running!${NC}"
echo -e "${YELLOW}Backend:  http://localhost:5000${NC}"
echo -e "${YELLOW}Frontend: http://localhost:3000${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
