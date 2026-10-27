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

### How it's connected (already set up)

No keys or secrets are stored anywhere. The workflow signs in to Google with its GitHub identity
(Workload Identity Federation) and gets short-lived credentials for a read-only account.

- **Google Cloud project:** `sarahtully-site` (no billing needed)
- **Service account:** `photo-sync@sarahtully-site.iam.gserviceaccount.com`, with no project
  roles; it can only read the Drive folder shared with it
- **Drive folder:** `sarahtully.com`, private, shared with `photo-sync` as Viewer
- **Who can use it:** only this repo (ID `90682801`) running on `master`, via the
  `github` pool's `github-actions` provider

To stop syncing, remove `photo-sync` from the folder's sharing, or delete the
`sarahtully-site` project in Google Cloud Console.

### Preview locally

Open `index.html` directly in a browser, or add `?preview-photos` to the URL, to see the grid with
placeholder art. On the live site the section stays hidden until the first photos sync.
