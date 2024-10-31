# Critter Explorer Backend 🐛

Welcome to the backend of **Critter Explorer**! This backend handles all the important data processing for displaying critters from Animal Crossing, fetching real-world critter images, and more! 🦋✨

## Table of Contents
1. **What Does This Backend Do?**
2. **Available Endpoints**
3. **APIs Used**
4. **System Requirements**
5. **Future Enhancements**
6. **Deployment & Hosting**
7. **Links to the App**

---

### 1. What Does This Backend Do? 🚀
The backend of Critter Explorer:
- Fetches city information and real-time date and time using **GeoDB Cities API**.
- Retrieves in-game critter data from the **Nookipedia API**.
- Searches and returns real-life critter images using the **Flickr API**.
- Sends this data to the frontend for display to users.

---

### 2. Available Endpoints 🌐
Here are the key API endpoints for interacting with the Critter Explorer backend:

- **City Search**: Search for cities by name.  
  [GET /citysearch?query=brisbane](https://critter-explorer-backend.onrender.com/citysearch?query=brisbane)

- **Get City DateTime**: Fetch date and time for a specific city.  
  [GET /cityDateTime/{cityId}/dateTime](https://critter-explorer-backend.onrender.com/cityDateTime/{cityId}/dateTime)

- **NEW - Critter Data**: Retrieve lists of available critters in Animal Crossing based on type.  
  [GET /bugs](https://critter-explorer-backend.onrender.com/bugs)
  [GET /fish](https://critter-explorer-backend.onrender.com/fish)
  [GET /sea-creatures](https://critter-explorer-backend.onrender.com/sea-creatures)

- **Flickr Images**: Get real-life images of critters by their in-game name.  
  [GET /critterImages?bugName=butterfly](https://critter-explorer-backend.onrender.com/critterImages?bugName=butterfly)

---

### 3. APIs Used 🌐
- **GeoDB Cities API**: Provides city names, date, and time.
- **Nookipedia API**: For fetching critter data from Animal Crossing.
- **Flickr API**: Used to retrieve real-life critter photos.

---

### 4. System Requirements 🖥️
- **Node.js** version 14 or higher.
- Internet access to make external API requests.

---

### 5. Future Enhancements 🚀
- **[Done] Adding fish and deep-sea creatures** to the critter data. 🌊🐟
- **Improving API response times** by caching city and critter data:
- **Enhanced Search Functionality**: Add search filters for location, critter type, or availability, improving user experience by allowing more specific queries.
- **Image Optimisation**: Preprocess and cache images for faster display, reducing load time for users.

---

### 6. Deployment & Hosting 🌍

The backend is currently hosted on [**Render**](https://render.com/), which is simple and free for small projects but can sometimes be slow, especially when scaling up. Future improvements may include hosting on platforms like [**Vercel**](https://vercel.com/) for faster frontend performance and global edge functions.

Originally, the app was deployed on [**AWS**](https://aws.amazon.com/) using an EC2 instance for the backend and S3 for the frontend. The React app was hosted on **Amazon S3**, and the Express app was containerized using **Docker** and deployed on an **EC2 instance**. This setup ensured scalability and reliability but was transitioned after the university account was no longer available.

---

### 7. Links to the App 🔗
- **FRONTEND**: [Critter Explorer Frontend](https://critter-explorer.netlify.app/)
- **BACKEND**: [Critter Explorer Backend](https://critter-explorer-backend.onrender.com/)

---

Thanks for checking out the Critter Explorer backend! 🦋✨
