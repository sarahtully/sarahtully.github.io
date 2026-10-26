"""Sync the "Off the clock" photos from a private Google Drive folder into photos/.

Runs nightly in GitHub Actions (.github/workflows/sync-photos.yml). For each image in the folder it
writes two web-sized WebP files with all metadata removed (including GPS location) and records them
in photos/photos.json, newest first. Photos deleted from the folder are removed from the site.

Environment:
  GDRIVE_SERVICE_ACCOUNT_JSON  the service account's JSON key (a GitHub secret)
  GDRIVE_FOLDER_ID             the Drive folder's ID (a GitHub secret)
"""

import io
import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageOps

try:  # iPhone photos are often HEIC
    import pillow_heif

    pillow_heif.register_heif_opener()
except ImportError:
    pass

ROOT = Path(__file__).resolve().parent.parent
PHOTO_DIR = ROOT / 'photos'
MANIFEST = PHOTO_DIR / 'photos.json'
SIZES = {'src': 800, 'full': 1800}  # grid tile, full-screen viewer
QUALITY = 80
FIELDS = 'nextPageToken, files(id, name, description, createdTime, modifiedTime, imageMediaMetadata(time))'


def drive_client():
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    info = json.loads(os.environ['GDRIVE_SERVICE_ACCOUNT_JSON'])
    creds = service_account.Credentials.from_service_account_info(
        info, scopes=['https://www.googleapis.com/auth/drive.readonly']
    )
    return build('drive', 'v3', credentials=creds, cache_discovery=False)


def list_images(drive, folder_id):
    query = f"'{folder_id}' in parents and mimeType contains 'image/' and trashed = false"
    files, token = [], None
    while True:
        page = drive.files().list(q=query, fields=FIELDS, pageSize=200, pageToken=token).execute()
        files += page.get('files', [])
        token = page.get('nextPageToken')
        if not token:
            return files


def download(drive, file_id):
    from googleapiclient.http import MediaIoBaseDownload

    buffer = io.BytesIO()
    downloader = MediaIoBaseDownload(buffer, drive.files().get_media(fileId=file_id))
    done = False
    while not done:
        _, done = downloader.next_chunk()
    return buffer.getvalue()


def taken_at(file):
    # Drive reports camera time as "YYYY:MM:DD HH:MM:SS"; fall back to upload time
    camera = (file.get('imageMediaMetadata') or {}).get('time')
    if camera and len(camera) >= 19:
        return camera[:10].replace(':', '-') + 'T' + camera[11:19]
    return file['createdTime'][:19]


def render(data, file_id):
    """Write each size as WebP. Saving without exif= drops all metadata, GPS included."""
    image = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert('RGB')
    paths, size = {}, None
    for key, edge in SIZES.items():
        copy = image.copy()
        copy.thumbnail((edge, edge), Image.LANCZOS)
        path = PHOTO_DIR / f'{file_id}-{edge}.webp'
        copy.save(path, 'WEBP', quality=QUALITY, method=6)
        paths[key] = f'photos/{path.name}'
        if key == 'src':
            size = copy.size
    return paths, size


def sync(drive, folder_id):
    PHOTO_DIR.mkdir(exist_ok=True)
    previous = {p['id']: p for p in json.loads(MANIFEST.read_text())} if MANIFEST.exists() else {}
    photos, added, updated = [], 0, 0

    for file in list_images(drive, folder_id):
        known = previous.get(file['id'])
        unchanged = known and known['modified'] == file['modifiedTime']
        files_exist = known and all((ROOT / known[k]).exists() for k in SIZES)
        if unchanged and files_exist:
            entry = known
        else:
            try:
                paths, (w, h) = render(download(drive, file['id']), file['id'])
            except Exception as error:  # one bad file shouldn't stop the sync
                print(f"Skipping {file['name']}: {error}", file=sys.stderr)
                continue
            entry = {'id': file['id'], **paths, 'w': w, 'h': h, 'modified': file['modifiedTime']}
            added, updated = (added + 1, updated) if not known else (added, updated + 1)
        # captions and dates can change without a new download
        entry['alt'] = (file.get('description') or '').strip()
        entry['taken'] = taken_at(file)
        photos.append(entry)

    keep = {Path(p[k]).name for p in photos for k in SIZES}
    removed = 0
    for path in PHOTO_DIR.glob('*.webp'):
        if path.name not in keep:
            path.unlink()
            removed += 1

    photos.sort(key=lambda p: p['taken'], reverse=True)
    MANIFEST.write_text(json.dumps(photos, indent=2) + '\n')
    print(f'{len(photos)} photos: {added} added, {updated} updated, {removed} files removed')


if __name__ == '__main__':
    sync(drive_client(), os.environ['GDRIVE_FOLDER_ID'])
