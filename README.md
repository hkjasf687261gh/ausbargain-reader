# AusBargain Reader

```bash
# Install Ionic Globally
npm install -g @ionic/cli
```

# Build

```bash
ionic build
ionic cap copy && ionic cap sync
```

## Apple

```bash
ionic cap open ios

# live-reload
ionic capacitor run ios --consolelogs --serverlogs -l --external
```

## Android

```bash
ionic cap open android
# live-reload
ionic capacitor run android -l --host=YOUR_IP_ADDRESS
```

# Proxy

App requires a proxy to bypass CORS when fetching data.
