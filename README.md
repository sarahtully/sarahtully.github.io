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

Photo sync uses keyless sign-in, so there are no keys or secrets to manage. To stop syncing, remove
the sync account from the Drive folder's sharing.

### Preview locally

Open `index.html` directly in a browser, or add `?preview-photos` to the URL, to see the grid with
placeholder art. On the live site the section stays hidden until the first photos sync.
