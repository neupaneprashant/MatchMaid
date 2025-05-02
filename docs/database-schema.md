# Firestore Database Schema

## Collection: /profiles/<uid>
```json
{
  "name": "Jane Doe",
  "pay": 25,
  "range": 50,
  "languages": "English, Spanish",
  "specs": {
    "pets": true,
    "kitchen": true,
    "outdoors": false,
    "bathroom": true
  },
  "schedule": {
    "Mon": { "active": true, "start": "08:00", "end": "16:00" },
    "Tue": { "active": false },
    ...
  },
  "photos": [ "base64-encoded strings or image URLs" ]
}
```

## Collection: /users/<uid>
```json
{
  "role": "maid" | "hiree"
}
```