# Critter Explorer Backend - Original 2023 🐛

Welcome to the **Critter Explorer API**! This README serves as the documentation for the original 2023 backend. Below, you'll find the available endpoints, system requirements, and planned enhancements from that time.

---

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
The backend of Critter Explorer is responsible for:
- Fetching city information and real-time date and time using the **GeoDB Cities API**.
- Retrieving in-game critter data from the **Nookipedia API**.
- Searching and returning real-life critter images using the **Flickr API**.
- Sending this data to the frontend for user interaction.

---

### 2. Available Endpoints 🌐
Below are the available API endpoints for interacting with the original Critter Explorer backend.

#### **City Search** 🌍  
**Purpose**: Search for cities by name.  
**How to Use**: Replace "brisbane" with the name of the city you want to search for.  

**Examples**:  
- `GET /citysearch?query=brisbane`  
- `GET /citysearch?query=sydney`  
- `GET /citysearch?query=melbourne`  

---

#### **City Date and Time** ⏰  
**Purpose**: Fetch the current date and time for a specific city using its unique `cityId`.  
**How to Use**: Use the `cityId` retrieved from the City Search endpoint.  

**Examples**:  
- `GET /cityDateTime/5499/dateTime` (Brisbane)  
- `GET /cityDateTime/4935/dateTime` (Sydney)  
- `GET /cityDateTime/4970/dateTime` (Melbourne)  

---

#### **Critter Data** 🐞  
**Purpose**: Retrieve lists of available bugs in Animal Crossing.  
**How to Use**: Use the following endpoint to get data for bugs.  

**Examples**:  
- `GET /crittergrid` - Get all bugs.  

---

#### **Flickr Images** 📸  
**Purpose**: Get real-life images of bugs by their in-game name.  
**How to Use**: Replace "butterfly" with the name of the bug you want to search for.  

**Examples**:  
- `GET /critterImages?bugName=butterfly`  

---

### 3. APIs Used 🌏
- **GeoDB Cities API**: Provides city names, date, and time.  
- **Nookipedia API**: Retrieves critter data from Animal Crossing.  
- **Flickr API**: Returns real-world critter photos based on search terms.  

---

### 4. System Requirements 🖥️
To run the backend, the following requirements must be met:  
- **Node.js** version 14 or higher.  
- Internet access to make external API requests.  
- An `.env` file with API keys for the following services:  
  - **GeoDB Cities API** – [Get API key](http://geodb-cities-api.wirefreethought.com/docs/api)  
  - **Nookipedia API** – [Get API key](https://api.nookipedia.com/)  
  - **Flickr API** – [Get API key](https://www.flickr.com/services/api/misc.api_keys.html)  

---


### 5. Planned Enhancements 🚀

Here are the planned enhancements for the Critter Explorer backend:

1. **Adding More Critter Types**  
   Expand critter data to include fish and deep-sea creatures. Dedicated endpoints will be created for these new critter categories, similar to the existing `/crittergrid` for bugs.

2. **Improving API Performance**  
   Implement caching (e.g., Redis) to reduce response times for frequently requested data, such as city searches and critter availability, while minimizing external API calls.

3. **Flickr Query Enhancements**  
   Refine Flickr queries to ensure more relevant results are returned. For example, prevent unrelated images like mobility aids from appearing in searches for "walking stick."

4. **Error Handling Improvements**  
   Add detailed error messages and fallback responses to ensure the app remains functional during external API disruptions.

5. **Pagination for Large Datasets**  
   Introduce pagination for endpoints like `/crittergrid` to efficiently handle larger datasets and avoid slow responses when fetching all critters at once.

6. **Endpoint Consolidation**  
   Combine `/crittergrid` with planned fish and sea creature endpoints into a single `/critters?type=bug` or `/critters?type=fish` endpoint, making requests simpler and more consistent.

7. **Scaling for More Users**  
   Add support for horizontal scaling with multiple backend instances and load balancing to handle increased traffic effectively.

---

### 6. Deployment & Hosting 🌍

The backend is currently hosted on [**Render**](https://render.com/), which is simple and free for small projects but can sometimes be slow, especially when scaling up. It takes approximately 50 seconds to scale up on the free tier.

Previously, the app used [**AWS**](https://aws.amazon.com/) with **S3** for the frontend and **Docker** on **EC2** for the backend. This setup was scalable but was retired when the university AWS account ended.

---

### 7. Links to the App 🔗
- **Frontend (2023)**: [Critter Explorer Frontend](https://critter-explorer-original2023.netlify.app/)
- **Backend (2023)**: [Critter Explorer Backend](https://critter-explorer-backend-original2023.onrender.com/)


Want to see current version? Check out the NEW frontend and backend:
- **NEW Frontend**: [Critter Explorer Frontend - New Version](https://critter-explorer.netlify.app/)
- **NEW Backend**: [Critter Explorer Backend - New Version](https://critter-explorer-backend.onrender.com/)

---

Thank you for exploring the **Critter Explorer Backend - Original 2023**! 🦋✨