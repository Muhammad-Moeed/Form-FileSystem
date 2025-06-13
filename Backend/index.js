import express from 'express';
import multer from 'multer';
import { v2 as cloudinaryV2 } from 'cloudinary';
import fs from 'fs/promises';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();
const app = express();

// ***********Get directory path************
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, 'data.json');

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

// ***********Initialize Multer for file uploads*******
const storage = multer.memoryStorage();
const upload = multer({
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  },
  storage: storage,
});

// **************Configure Cloudinary*************
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ***********Helper function to initialize data file**********
async function initializeDataFile() {
  try {
    await fs.access(dataFilePath);
    console.log('Data file exists');
  } catch {
    await fs.writeFile(dataFilePath, '[]');
    console.log('Created new data file');
  }
}

// **************Upload image to Cloudinary************
const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      {
        folder: 'user_uploads',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

// ***************Read data from file****************
const readDataFromFile = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
};

// *****************Write data to file******************
const writeDataToFile = async (data) => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    console.log('Data successfully written to file');
  } catch (error) {
    console.error('Error writing to data file:', error);
    throw error;
  }
};

// ********************Create Post API****************
app.post('/api/user/create', upload.single('image'), async (req, res) => {
  try {
    const requiredFields = [
      'country', 'city', 'course', 'proficiency',
      'fullName', 'fatherName', 'email', 'cnic',
      'phone', 'dob', 'gender', 'qualification', 'hasLaptop'
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    const imageResult = await uploadImageToCloudinary(req.file.buffer);
    const newUser = {
      id: Date.now().toString(),
      ...req.body,
      fatherNic: req.body.fatherCnic || null,
      imageUrl: imageResult.secure_url,
      imagePublicId: imageResult.public_id,
      createdAt: new Date().toISOString()
    };

    const existingData = await readDataFromFile();
    existingData.push(newUser);

    await writeDataToFile(existingData);


    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ***********************Create Get API*****************
app.get('/api/user/:cnic', async (req, res) => {
  try {
    const users = await readDataFromFile();
    const user = users.find(u => u.cnic === req.params.cnic);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});


initializeDataFile().then(() => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});