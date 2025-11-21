#!/bin/bash
# Project Setup Verification Script
# Run this to verify all files are in place

echo "=== Reading List Application - Project Skeleton Verification ==="
echo ""

# Check directories
echo "Checking directory structure..."
for dir in client server worker; do
  if [ -d "$dir" ]; then
    echo "✓ $dir/ exists"
  else
    echo "✗ $dir/ missing"
  fi
done

# Check client files
echo ""
echo "Checking client files..."
client_files=(
  "client/package.json"
  "client/tsconfig.json"
  "client/app/layout.tsx"
  "client/app/page.tsx"
  "client/components/URLInput.tsx"
  "client/components/SummaryList.tsx"
  "client/services/api.ts"
  "client/.env.local.example"
)

for file in "${client_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file"
  else
    echo "✗ $file missing"
  fi
done

# Check server files
echo ""
echo "Checking server files..."
server_files=(
  "server/package.json"
  "server/server.js"
  "server/routes/tasks.js"
  "server/routes/auth.js"
  "server/models/Article.js"
  "server/.env.example"
)

for file in "${server_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file"
  else
    echo "✗ $file missing"
  fi
done

# Check worker files
echo ""
echo "Checking worker files..."
worker_files=(
  "worker/celery_app.py"
  "worker/tasks.py"
  "worker/requirements.txt"
  "worker/.env.example"
)

for file in "${worker_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file"
  else
    echo "✗ $file missing"
  fi
done

# Check root files
echo ""
echo "Checking root files..."
root_files=(
  "docker-compose.yml"
  "prometheus.yml"
  "README.md"
)

for file in "${root_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file"
  else
    echo "✗ $file missing"
  fi
done

echo ""
echo "=== Verification Complete ==="
echo "All files should be present. Any missing files need to be created."
