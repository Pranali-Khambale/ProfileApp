const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware 
app.use(
  cors({
    origin: [
      
      "http://localhost:5174",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Data file path
const dataPath = path.join(__dirname, "data", "profiles.json");
const dataDir = path.join(__dirname, "data");


if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(" Created data directory");
}

if (!fs.existsSync(dataPath)) {
  const sampleData = [
    {
      id: 1,
      name: "Sarah Johnson",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      description: "Software Engineer passionate about web development and AI",
      address: "1600 Amphitheatre Parkway, Mountain View, CA",
      lat: 37.422,
      lng: -122.0841,
      email: "sarah.j@example.com",
      phone: "+1 (555) 123-4567",
      interests: ["Coding", "Hiking", "Photography"],
    },
    {
      id: 2,
      name: "Michael Chen",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      description: "Product Manager with expertise in SaaS solutions",
      address: "1 Apple Park Way, Cupertino, CA",
      lat: 37.3349,
      lng: -122.009,
      email: "michael.c@example.com",
      phone: "+1 (555) 234-5678",
      interests: ["Product Strategy", "Tennis", "Travel"],
    },
  ];
  fs.writeFileSync(dataPath, JSON.stringify(sampleData, null, 2));
  console.log(" Created profiles.json with sample data");
}


const readProfiles = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(" Error reading profiles:", error.message);
    return [];
  }
};


const writeProfiles = (profiles) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(profiles, null, 2));
    return true;
  } catch (error) {
    console.error(" Error writing profiles:", error.message);
    return false;
  }
};

// Routes

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Profile Management API Server",
    status: "running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// GET all profiles
app.get("/api/profiles", (req, res) => {
  try {
    const profiles = readProfiles();
    console.log(` GET /api/profiles - Returning ${profiles.length} profiles`);
    res.json({ success: true, data: profiles });
  } catch (error) {
    console.error(" GET /api/profiles - Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching profiles",
      error: error.message,
    });
  }
});

// GET single profile
app.get("/api/profiles/:id", (req, res) => {
  try {
    const profiles = readProfiles();
    const profile = profiles.find((p) => p.id === parseInt(req.params.id));

    if (profile) {
      console.log(
        `GET /api/profiles/${req.params.id} - Found: ${profile.name}`
      );
      res.json({ success: true, data: profile });
    } else {
      console.log(`GET /api/profiles/${req.params.id} - Not found`);
      res.status(404).json({ success: false, message: "Profile not found" });
    }
  } catch (error) {
    console.error(" GET /api/profiles/:id - Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
});

// POST create new profile
app.post("/api/profiles", (req, res) => {
  try {
    console.log(
      " POST /api/profiles - Received data:",
      JSON.stringify(req.body, null, 2)
    );

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "description",
      "lat",
      "lng",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      console.log(` Missing required fields: ${missingFields.join(", ")}`);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const profiles = readProfiles();

    const newProfile = {
      id: Date.now(),
      name: req.body.name,
      photo:
        req.body.photo ||
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400",
      description: req.body.description,
      address: req.body.address,
      lat: parseFloat(req.body.lat),
      lng: parseFloat(req.body.lng),
      email: req.body.email,
      phone: req.body.phone,
      interests: Array.isArray(req.body.interests) ? req.body.interests : [],
      createdAt: new Date().toISOString(),
    };

    profiles.push(newProfile);

    if (writeProfiles(profiles)) {
      console.log(
        ` POST /api/profiles - Created: ${newProfile.name} (ID: ${newProfile.id})`
      );
      res.status(201).json({
        success: true,
        data: newProfile,
        message: "Profile created successfully",
      });
    } else {
      console.error(" POST /api/profiles - Failed to save");
      res.status(500).json({
        success: false,
        message: "Error saving profile to file",
      });
    }
  } catch (error) {
    console.error(" POST /api/profiles - Error:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error creating profile",
      error: error.message,
    });
  }
});

// PUT update profile
app.put("/api/profiles/:id", (req, res) => {
  try {
    console.log(` PUT /api/profiles/${req.params.id} - Updating...`);

    const profiles = readProfiles();
    const index = profiles.findIndex((p) => p.id === parseInt(req.params.id));

    if (index !== -1) {
      profiles[index] = {
        ...profiles[index],
        name: req.body.name || profiles[index].name,
        photo: req.body.photo || profiles[index].photo,
        description: req.body.description || profiles[index].description,
        address: req.body.address || profiles[index].address,
        lat:
          req.body.lat !== undefined
            ? parseFloat(req.body.lat)
            : profiles[index].lat,
        lng:
          req.body.lng !== undefined
            ? parseFloat(req.body.lng)
            : profiles[index].lng,
        email: req.body.email || profiles[index].email,
        phone: req.body.phone || profiles[index].phone,
        interests: req.body.interests || profiles[index].interests,
        id: parseInt(req.params.id),
        updatedAt: new Date().toISOString(),
      };

      if (writeProfiles(profiles)) {
        console.log(
          ` PUT /api/profiles/${req.params.id} - Updated: ${profiles[index].name}`
        );
        res.json({
          success: true,
          data: profiles[index],
          message: "Profile updated successfully",
        });
      } else {
        console.error(` PUT /api/profiles/${req.params.id} - Failed to save`);
        res.status(500).json({
          success: false,
          message: "Error updating profile",
        });
      }
    } else {
      console.log(` PUT /api/profiles/${req.params.id} - Not found`);
      res.status(404).json({ success: false, message: "Profile not found" });
    }
  } catch (error) {
    console.error(
      ` PUT /api/profiles/${req.params.id} - Error:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
});

// DELETE profile
app.delete("/api/profiles/:id", (req, res) => {
  try {
    console.log(` DELETE /api/profiles/${req.params.id}`);

    const profiles = readProfiles();
    const initialLength = profiles.length;
    const filteredProfiles = profiles.filter(
      (p) => p.id !== parseInt(req.params.id)
    );

    if (initialLength !== filteredProfiles.length) {
      if (writeProfiles(filteredProfiles)) {
        console.log(
          ` DELETE /api/profiles/${req.params.id} - Deleted successfully`
        );
        res.json({
          success: true,
          message: "Profile deleted successfully",
        });
      } else {
        console.error(
          ` DELETE /api/profiles/${req.params.id} - Failed to save`
        );
        res.status(500).json({
          success: false,
          message: "Error deleting profile",
        });
      }
    } else {
      console.log(` DELETE /api/profiles/${req.params.id} - Not found`);
      res.status(404).json({ success: false, message: "Profile not found" });
    }
  } catch (error) {
    console.error(
      ` DELETE /api/profiles/${req.params.id} - Error:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error deleting profile",
      error: error.message,
    });
  }
});


app.use((req, res) => {
  console.log(` 404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    requestedUrl: req.url,
  });
});


app.use((err, req, res, next) => {
  console.error(" Unhandled Error:", err.message);
  console.error("Stack:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
 
  console.log("Backend Server Started Successfully!");
 
  
  

  
 
});
