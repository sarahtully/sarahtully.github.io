# SARAH TULLY

### Technical Lead, Senior Systems Engineer

www.sarahtully.com

## Off the clock photos

The photo grid is filled from a private Google Drive folder. On every deploy and once a night, a
GitHub Action (`.github/workflows/deploy-site.yml`) fetches the photos, resizes them for the web
with all metadata (including GPS location) removed, and publishes them with the site. Photos are
never committed, so one deleted from the folder is gone from the site and leaves no copy in this
repo's history. The site itself never talks to Google.

Requires **Settings → Pages → Source: GitHub Actions**.

- **Add a photo:** drop it in the Drive folder (JPEG, PNG or iPhone HEIC).
- **Caption:** in Drive, right-click the photo → File information → Details → Description. It
  becomes the caption and the text screen readers announce.
- **Order:** newest first, by the date the photo was taken.
- **Sync now:** GitHub → Actions → Build and deploy site → Run workflow.

Photo sync uses keyless sign-in, so there are no keys or secrets to manage. To stop syncing, remove
the sync account from the Drive folder's sharing.

### Preview locally

Open `index.html` directly in a browser, or add `?preview-photos` to the URL, to see the grid with
placeholder art. On the live site the section stays hidden until the first photos sync.
