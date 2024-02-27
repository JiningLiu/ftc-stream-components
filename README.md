
# ftc-stream-components

Designed for the web browser component in OBS @ 4K resolution

## Prerequisite

* [Node.js & NPM](https://nodejs.org/)
* [Bun](https://bun.sh)
* [Git](https://git-scm.com) (Windows Only)

⚠️ **Before building and running**, please go to the ```ftc-api.env``` file in the root directory and add in your FTC API credentials as instructed. Change the file name to ```.env``` after you are done.

## Usage

Stream banner located at ```localhost:4173/banner/match```

Banner contents editor located at ```localhost:4173/banner/editor```

Live label located at ```localhost:4173/live-label?eventCode=EVENT_CODE``` (Replace ```EVENT_CODE``` with actual event code)


**_The following commands automatically opens the default port up to the network (--host)_**


### Unix

```bash
# make executables
sudo chmod 755 ./server.sh
sudo chmod 755 ./ui.sh

# run server (builds server & UI)
# ⚠️ ALWAYS run this command before starting the UI
./server.sh

# run UI
./ui.sh
```

### Windows

```bash

# run server (builds server & UI)
# ⚠️ ALWAYS run this command before starting the UI
sh ./server.sh

# run UI
sh ./ui.sh
```
