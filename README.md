# SARAH TULLY

### Technical Lead, Senior Systems Engineer

www.sarahtully.com

## Off the clock photos

The photo grid is filled from a private Google Drive folder. Every night a GitHub Action
(`.github/workflows/sync-photos.yml`) copies new photos into `photos/`, resized for the web with
all metadata (including GPS location) removed. Photos deleted from the folder disappear from the
site on the next sync. The site itself never talks to Google.

- **Add a photo:** drop it in the Drive folder (JPEG, PNG or iPhone HEIC).
- **Caption:** in Drive, right-click the photo → File information → Details → Description. It
  becomes the caption and the text screen readers announce.
- **Order:** newest first, by the date the photo was taken.
- **Sync now:** GitHub → Actions → Sync photos from Google Drive → Run workflow.

### One-time setup

1. In [Google Cloud Console](https://console.cloud.google.com), create a project and enable the
   **Google Drive API** (APIs & Services → Library).
2. APIs & Services → Credentials → Create credentials → **Service account**. Name it
   (e.g. `photo-sync`); it needs no roles.
3. Open the service account → Keys → Add key → Create new key → **JSON**. A file downloads.
4. Share the Drive folder with the service account's email
   (`photo-sync@<project>.iam.gserviceaccount.com`) as **Viewer**. The folder stays private.
5. In this repo: Settings → Secrets and variables → Actions → New repository secret:
   - `GDRIVE_SERVICE_ACCOUNT_JSON`: the entire contents of the JSON key file
   - `GDRIVE_FOLDER_ID`: the ID at the end of the folder's link
     (`https://drive.google.com/drive/folders/<this part>`)
6. Run the workflow once from the Actions tab to pull in the first photos.

Delete the downloaded JSON key file once it's saved as a secret.

### Preview locally

Open `index.html` directly in a browser, or add `?preview-photos` to the URL, to see the grid with
placeholder art. On the live site the section stays hidden until the first photos sync.
