#!/bin/bash
# Start all services for local development
# Works with monorepo structure

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "===================================="
echo "   HealthAI - Start All Services"
echo "===================================="
echo ""
echo "Starting services in separate terminal windows..."
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Start Frontend
echo -e "${BLUE}[1/3] Starting Frontend (Next.js)${NC}"
open -a Terminal "$PROJECT_ROOT/frontend" || (cd "$PROJECT_ROOT/frontend" && npm run dev &)

sleep 2

# Start Backend
echo -e "${BLUE}[2/3] Starting Backend (Flask)${NC}"
open -a Terminal "$PROJECT_ROOT/backend" || (cd "$PROJECT_ROOT/backend" && python app.py &)

sleep 2

# Start Database
echo -e "${BLUE}[3/3] Starting Database (MongoDB)${NC}"
bash "$SCRIPT_DIR/start-database.sh" &

sleep 2

echo ""
echo "===================================="
echo -e "${GREEN}All services starting...${NC}"
echo "===================================="
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000"
echo "Database:  localhost:27017"
echo ""
echo "Check terminal windows for each service."
echo ""
