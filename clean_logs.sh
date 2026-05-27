#!/bin/bash
# Log Cleanup Script - Deletes rotated PM2 logs older than 7 days
LOG_DIR="/home/ubuntu/.pm2/logs"

echo "=== Log Cleanup Run: $(date) ==="
if [ -d "$LOG_DIR" ]; then
    # Find and delete rotated/archived log files older than 7 days
    # This leaves active log files (which are constantly modified) untouched.
    find "$LOG_DIR" -type f -mtime +7 -name "*.log*" -exec echo "Deleting old log: {}" \; -exec rm -f {} \;
else
    echo "PM2 log directory not found."
fi
