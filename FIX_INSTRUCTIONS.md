# 🔧 Fix for 500 Internal Server Error

If you're experiencing a 500 error when trying to load the app, follow these steps:

## Step 1: Clear Cache and Reinstall Dependencies

```bash
# Remove node_modules and lock files
rm -rf node_modules package-lock.json yarn.lock

# Clear Expo cache
npx expo start --clear

# Or if that doesn't work, clear Metro cache
rm -rf .expo
rm -rf node_modules/.cache

# Reinstall dependencies
npm install
```

## Step 2: Verify Dependencies

Make sure all dependencies are installed correctly:

```bash
npx expo install --fix
```

This will automatically fix any version mismatches with Expo SDK 54.

## Step 3: Start Fresh

```bash
# Clear everything and restart
npm start -- --reset-cache
```

## Step 4: If Web Platform Has Issues

If you're specifically running on web and getting MIME type errors:

1. Make sure you have `react-dom` and `react-native-web` installed:
   ```bash
   npm install react-dom react-native-web
   ```

2. Clear the browser cache and try again

3. Try accessing the app on mobile (iOS/Android) instead of web first

## Step 5: Check for Errors

Run the Expo doctor to check for issues:

```bash
npx expo-doctor
```

## Common Issues and Solutions

### Issue: "Failed to load resource: 500"
**Solution**: Clear Metro bundler cache and restart:
```bash
npm start -- --reset-cache
```

### Issue: MIME type errors on web
**Solution**: 
1. Make sure `react-dom` and `react-native-web` are in package.json
2. Clear browser cache
3. Try mobile platform first

### Issue: Module not found errors
**Solution**: 
```bash
rm -rf node_modules
npm install
npx expo install --fix
```

## If Nothing Works

1. Delete `.expo` folder
2. Delete `node_modules`
3. Delete `package-lock.json`
4. Run `npm install`
5. Run `npx expo install --fix`
6. Start with `npm start -- --reset-cache`

## Platform-Specific Notes

- **iOS**: Should work without issues
- **Android**: Should work without issues  
- **Web**: May have limited functionality with some React Native components. If issues persist, test on mobile first.

