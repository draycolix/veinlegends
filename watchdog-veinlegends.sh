#!/bin/bash
# VeinLegends Watchdog — checks port 8004, restarts if dead
LOG="$HOME/AppData/Local/hermes/veinlegends-watchdog.log"
echo "$(date '+%Y-%m-%d %H:%M:%S') CHECK" >> "$LOG"

HTTP=$(curl -s -o NUL -w "%{http_code}" http://localhost:8004/ --max-time 10 2>/dev/null)

if [ "$HTTP" != "200" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') DEAD (HTTP $HTTP) — restarting" >> "$LOG"

  # Kill any stuck process on port 8004
  PID=$(netstat -ano 2>/dev/null | grep ':8004' | grep LISTENING | awk '{print $NF}' | head -1)
  if [ -n "$PID" ] && [ "$PID" != "0" ]; then
    taskkill //F //PID "$PID" 2>/dev/null
    sleep 2
  fi

  # Restart production server
  cd /c/project/veinlegends/web && npx next start -p 8004 >> "$LOG" 2>&1 &
  echo "$(date '+%Y-%m-%d %H:%M:%S') RESTARTED" >> "$LOG"
else
  echo "$(date '+%Y-%m-%d %H:%M:%S') OK" >> "$LOG"
fi
