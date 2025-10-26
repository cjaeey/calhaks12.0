# Installing Docker Desktop on Mac

## Quick Installation Steps

### 1. Download
✅ Download link opened in your browser
- Click "Download for Mac - Apple Silicon"
- File: Docker.dmg (~500MB)

### 2. Install
```bash
# After download completes:
1. Open Docker.dmg from Downloads folder
2. Drag Docker icon to Applications folder
3. Eject the Docker.dmg disk image
```

### 3. First Launch
```bash
# Open Docker Desktop
1. Open Applications folder (Cmd + Shift + A)
2. Double-click "Docker"
3. Click "Open" if security warning appears
4. Accept license agreement
5. Enter your Mac password when prompted (for privileged access)
```

### 4. Wait for Startup
- Docker icon will appear in menu bar (top right)
- Wait for it to say "Docker Desktop is running"
- This takes 1-2 minutes on first launch

### 5. Verify Installation
Run these commands in terminal:
```bash
docker --version
docker compose version
docker info
```

## Configuration (Recommended)

### Allocate Resources

1. Click Docker icon in menu bar
2. Select "Settings" (gear icon)
3. Go to "Resources"
4. Set:
   - **CPUs**: 4 cores (or half your total)
   - **Memory**: 8 GB (or 6 GB minimum)
   - **Swap**: 1 GB
   - **Disk**: 20 GB minimum

5. Click "Apply & Restart"

## Troubleshooting

### "Docker.dmg can't be opened"
**Solution:** Go to System Settings > Privacy & Security > Allow apps from App Store and identified developers

### "Docker requires privileged access"
**Solution:** This is normal. Enter your Mac password to allow.

### Docker icon not appearing
**Solution:**
1. Quit Docker Desktop completely
2. Relaunch from Applications folder
3. Wait 2 minutes

### "Cannot connect to Docker daemon"
**Solution:**
1. Click Docker icon in menu bar
2. Select "Restart"
3. Wait for "Docker Desktop is running"

## Next Steps

After Docker is installed and running:

```bash
# Navigate to project
cd /Users/carlosescala/calhacks12.0/calhaks12.0

# Start ReNOVA
./start.sh
```

## Need Help?

If you get stuck at any step, let me know which step you're on!
