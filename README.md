# 🌱 Daily Habit Tracker App  

[![Made with React Native](https://img.shields.io/badge/Made%20with-React%20Native-blue?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-Framework-black?style=for-the-badge&logo=expo)](https://expo.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![AsyncStorage](https://img.shields.io/badge/Storage-AsyncStorage-orange?style=for-the-badge)](https://react-native-async-storage.github.io/async-storage/)

---

A **React Native (Expo)** mobile app that helps users **build, track, and maintain daily habits** — with persistence, progress tracking, dark mode, and motivational quotes.  
> *Because small habits create big results.*

---

## 🚀 Features : 

### 🧩 Core Functionalities  
- ✅ **Add New Habit:** Add habits like “Drink 8 glasses of water.”  
- ✅ **View Habit List:** Organized list with checkboxes and delete icons.  
- ✅ **Mark as Done:** Toggle completion status for each habit.  
- ✅ **Delete Habit:** Swipe or tap delete to remove habits.  
- ✅ **Persistent Data:** Stored locally using **AsyncStorage** — data never lost.

---

### 🌟 Bonus Enhancements : 
⭐ **Daily Progress Tracker:**  
Visual progress bar (e.g., “3/5 Completed”).  

⭐ **Dark Mode:**  
Switch between light/dark themes, stored in AsyncStorage.  

⭐ **Motivational Quote of the Day:**  
Fetch quotes from [ZenQuotes API](https://zenquotes.io/api/random) with offline fallback support.  

⭐ **Polished UI:**  
Modern, minimalist design using Flexbox and boxShadow for both Android & iOS.  

---

## 🛠️ Tech Stack : 

| Layer | Technology |
|-------|-------------|
| **Frontend** | React Native (Expo) |
| **Navigation** | React Navigation (Stack + Tabs) |
| **Storage** | AsyncStorage |
| **Styling** | StyleSheet + Flexbox + BoxShadow |
| **API** | ZenQuotes API |
| **Icons** | React Native Vector Icons |

---

## 🧱 Folder Structure : 

```bash
HabitTrackerApp/
│
├── App.js
├── components/
│   ├── AddHabit.js
│   └── HabitItem.js
├── screens/
│   ├── HomeScreen.js
│   └── SettingsScreen.js
├── utils/
│   ├── storage.js
│   └── localQuotes.js
└── assets/
    └── icons/
```
## ⚙️ Installation & Setup : 

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/habit-tracker-app.git
cd habit-tracker-app
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Run the App
```bash
npx expo start
```
## Then scan the QR code using the Expo Go App on your Android or iOS device to preview it instantly 🚀

## 🧩 Dependencies :
```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install @react-native-async-storage/async-storage
npm install react-native-vector-icons
expo install expo-linear-gradient expo-status-bar
```
## 💡 How It Works : 

1. **Add Habit:** Type a habit in the input field and press “Add” to include it in your list.  
2. **Mark Done:** Tap the checkbox to mark a habit as completed — the progress bar updates automatically.  
3. **Delete Habit:** Swipe left or tap the delete icon to remove unwanted habits.  
4. **Persistent Storage:** All habit data is stored locally using **AsyncStorage**, even after restarting the app.  
5. **Motivational Quote:** The app fetches a new quote daily from the **ZenQuotes API** or displays a fallback quote offline.  
6. **Dark Mode:** Switch between Light/Dark themes from the Settings screen — your preference is saved automatically.  

---

## 🎨 UI Showcase : 

| 🌞 Light Mode | 🌙 Dark Mode |
|---------------|--------------|
| Minimal and clean interface | Sleek and modern look |
| Progress bar for tracking | Smooth transitions & animations |
| Motivational quotes displayed | Eye-comfort dark theme |

---

## 🧠 Learning Outcomes : 

By completing this project, you’ll learn to:  
- 🧩 Build components using **React Native**  
- ⚙️ Manage state with **React Hooks** (`useState`, `useEffect`)  
- 🧭 Implement multi-screen navigation using **React Navigation**  
- 💾 Store and retrieve persistent data using **AsyncStorage**  
- 🌐 Fetch external data and handle API errors gracefully  
- 🎨 Create responsive and theme-aware UIs with **Flexbox**  
- 🧱 Maintain clean folder structure and reusable components  

---

## 🧰 Troubleshooting  :

### ⚠️ Common Issues and Fixes  

**❌ Issue:**
net::ERR_CERT_DATE_INVALID while fetching quotes

**✅ Fix:**  
- Added **local fallback quotes** for offline mode.  
- Switched to **[ZenQuotes.io](https://zenquotes.io/api/random)** for reliability.  

---

**❌ Warning:**  
shadow* or pointerEvents style props are deprecated

**✅ Fix:**  
- Updated all deprecated styles to use **`boxShadow`**.  
- Replaced `props.pointerEvents` with `style.pointerEvents`.  

---

**💡 Tip:**  
If you face issues with Expo or hot reloading, clear your cache and restart:  
```bash
npx expo start -c
```
## ✨ Future Improvements : 

🚀 Planned updates to make the app even better:  

- [ ] 📆 **Habit Streak Tracker** — Track daily streak consistency and completion rate.  
- [ ] 🔔 **Reminders/Notifications** — Notify users to complete pending habits.  
- [ ] ☁️ **Cloud Sync** — Back up and sync user data using Firebase or Supabase.  
- [ ] 📊 **Calendar View** — Visualize habit progress trends over time.  
- [ ] 🏆 **Leaderboard / Social Sharing** — Encourage friendly habit-building competition.  

> 💡 *Your suggestions for improvements and features are always welcome!*  

---

## 🤝 Contributing : 

We ❤️ open-source contributions!  

To contribute:  
1. **Fork** this repository  
2. **Create a new branch** (`feature/your-feature-name`)  
3. **Commit** your changes with meaningful messages  
4. **Push** to your forked branch  
5. **Open a Pull Request**  

✅ **Contributor Guidelines:**  
- Follow clean and consistent code structure.  
- Ensure that all features are tested before submission.  
- Use clear, descriptive commit messages.  
- Keep commits small and focused on one purpose.  

> ✨ *All contributions, big or small, help make this project better!*  

---


## 👨‍💻 Developed By : 

**👤 Praveen Kumar**  
*Polaris School of Technology*
📍 *Bangalore, India*  
💻 *Software Developer | AI/ML Enthusiast | React Native Learner*  

> 🧠 *“Consistency beats intensity — build habits, not hype.”*

---

⭐ **If you found this project helpful, please give it a star on GitHub!**  

Your support motivates continuous learning and open-source development 💪✨
