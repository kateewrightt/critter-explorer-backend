# Critter Explorer Backend 🐛

Welcome to the backend of **Critter Explorer**! This backend handles all the important data processing for displaying critters from Animal Crossing, fetching real-world critter images, and more! 🦋✨

## Table of Contents
1. [What Does This Backend Do?](#1-what-does-this-backend-do-)
2. [Available Endpoints](#2-available-endpoints-)
3. [APIs Used](#3-apis-used-)
4. [System Requirements](#4-system-requirements-%EF%B8%8F)
5. [Future Enhancements](#5-future-enhancements-)
6. [Deployment & Hosting](#6-deployment--hosting-)
7. [Links to the App](#7-links-to-the-app-)

---

### 1. What Does This Backend Do? 🚀
The backend of Critter Explorer:
- Fetches city information and real-time date and time using **GeoDB Cities API**.
- Retrieves in-game critter data from the **Nookipedia API**.
- Searches and returns real-life critter images using the **Flickr API**.
- Sends this data to the frontend for display to users.

---

### 2. Available Endpoints 🌐
Below are the key API endpoints for interacting with the Critter Explorer backend:

1. **City Search**  
   - **Purpose**: Search for cities by name.  
   - **Usage**: Replace `brisbane` with the desired city name.  
   - **Example**: [GET /citysearch?query=brisbane](https://critter-explorer-backend.onrender.com/citysearch?query=brisbane)

2. **Get City DateTime**  
   - **Purpose**: Fetch the current date and time for a specific city using its `cityId`.  
   - **Usage**: Use a valid `cityId` from the City Search results.  
   - **Example**: [GET /cityDateTime/5499/dateTime](https://critter-explorer-backend.onrender.com/cityDateTime/5499/dateTime) (Brisbane)

3. **Critter Data**  
   - **Purpose**: Retrieve lists of available critters in Animal Crossing.  
   - **Usage**: Access specific critter types via dedicated endpoints.  
     - 🪲 [GET /bugs](https://critter-explorer-backend.onrender.com/bugs) - All bugs  
     - 🐠 [GET /fish](https://critter-explorer-backend.onrender.com/fish) - All fish  
     - 🪼 [GET /sea-creatures](https://critter-explorer-backend.onrender.com/sea-creatures) - All sea creatures  

4. **Flickr Images**  
   - **Purpose**: Retrieve real-life images of critters by their in-game name.  
   - **Usage**: Replace `butterfly` with the desired critter name.  
   - **Example**: [GET /critterImages?critterName=butterfly](https://critter-explorer-backend.onrender.com/critterImages?critterName=butterfly)

Click on any endpoint link to test it and view the response data.

---

### 3. APIs Used 🌏
- **GeoDB Cities API**: Provides city names, date, and time.
- **Nookipedia API**: For fetching critter data from Animal Crossing.
- **Flickr API**: Used to retrieve real-life critter photos.

---

### 4. System Requirements 🖥️
- **Node.js** version 14 or higher.
- Internet access to make external API requests.
- An `.env` file with API keys for these services:  
**GeoDB Cities API** – [Get key](http://geodb-cities-api.wirefreethought.com/docs/api)  
**Nookipedia API** – [Get key](https://api.nookipedia.com/)  
**Flickr API** – [Get key](https://www.flickr.com/services/api/misc.api_keys.html)  

---

### 5. Future Enhancements 🚀

#### **What's Done**
- **Better Scaling for Users**:
  - Switched to Vercel, which automatically adjusts resources based on traffic. This keeps the app fast and reliable, even with more users ✅
- **Made the App Faster**:
  - Cached city and critter data to avoid repeated API calls and speed up responses ✅
- **Optimized Static Data**:
  - Combined all critter info into one `allCrittersCache.json` file, served by Vercel’s CDN for quick delivery ✅
  - Reduced critter data load times from **500-700ms** to an average of ~**50ms** ✅

#### **What's Next**
- **Simplify API Requests**:
  - Combine `/bugs`, `/fish`, and `/sea-creatures` into a single `/critters` endpoint with filtering options (e.g., `/critters?type=bug`).

- **Improve Flickr Image Search**:
  - Make searches return more accurate images (e.g., no "walking sticks" that aren’t bugs).

- **Better Error Handling**:
  - Add clearer error messages and fallback options when services like Flickr don’t work.

- **Paginate Image Results**:
  - Break large sets of image results into pages for faster loading and better performance.

---

### 6. Deployment & Hosting 🌍

The backend is currently hosted on [**Render**](https://render.com/), which is simple and free for small projects but can sometimes be slow, especially when scaling up. It takes approximately 50 seconds to scale up on the free tier.

Previously, the app used [**AWS**](https://aws.amazon.com/) with **S3** for the frontend and **Docker** on **EC2** for the backend. This setup was scalable but was retired when the university AWS account ended.

---

### 7. Links to the App 🔗
- **Frontend**: [Critter Explorer Frontend](https://critter-explorer.netlify.app/)
- **Backend**: [Critter Explorer Backend](https://critter-explorer-backend.onrender.com/)

Want to see previous versions? Check out the old frontend and backend from 2023:
- **Old Frontend (2023)**: [Critter Explorer Frontend - Old Version](https://critter-explorer-original2023.netlify.app/)
- **Old Backend (2023)**: [Critter Explorer Backend - Old Version](https://critter-explorer-backend-original2023.onrender.com/)

---

Thanks for checking out the Critter Explorer backend! 🦋✨