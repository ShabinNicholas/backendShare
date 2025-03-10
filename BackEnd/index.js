const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const studentRoutes = require('./routes/admin/studentRoutes/studentRoutes')
const adminAuthRoutes = require('./routes/admin/adminAuthRoutes')
const db = require('./Config/db')
const app = express()
app.use(cors())
app.use(express.json())
// app.use(express.static(`${__dirname}/upload`))

// Serve files from the Upload folder
app.use(
  "/Upload",
  express.static("Upload", {  
    setHeaders: (res, path, stat) => {
      // Remove or modify the restrictive header if present:
      // For example, you might not want to set Cross-Origin-Resource-Policy at all
      res.removeHeader("Cross-Origin-Resource-Policy");
      // Or if you want to allow cross-origin access:
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use('/adminAuth', adminAuthRoutes)
app.use('/admin', studentRoutes)

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})