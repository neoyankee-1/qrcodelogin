# Login QR Generator

A deployable Next.js app that generates QR codes for keyboard-style login payloads:

```text
username[TAB]password[ENTER]
```

This is designed for QR/barcode scanners that behave like HID keyboard input devices.

## Important security note

The generated QR code contains the password in plain text. Treat each QR image like the password itself. Do not publish real production credentials publicly.

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Run tests

```bash
npm test
```

## Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Create a GitHub repository.
2. Upload this project.
3. Go to Vercel and import the repository.
4. Use the defaults:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: Next.js default
5. Deploy.

## Deploy to Netlify

1. Create a GitHub repository.
2. Upload this project.
3. Import it into Netlify.
4. Use:
   - Build command: `npm run build`
   - Publish directory: `.next`

For the smoothest Netlify setup, install the official Next.js runtime plugin if prompted.
