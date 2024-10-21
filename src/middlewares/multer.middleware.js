import multer from "multer"

const storage = multer.diskStorage({ //multer.diskStorage():Configures how files will be stored on the disk.
    destination: function (req, file, cb) { /*destination (function):
        Sets the folder where the uploaded files will be saved.
        In your code:'./public/temp' is used as the upload folder.
        */
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {/*
        filename (function):

        Controls the naming of the uploaded files to ensure uniqueness.
        A timestamp (Date.now()) + a random number (Math.random() * 1E9) are used to create a unique  suffix.
        The file’s original field name is combined with the unique suffix as the final name. */
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname) //just to keep it simple we did this , otherwise for more advance and best approach the above two commented code is preferr
    }
  })
  
  export const upload = multer({ storage, }) /*const upload = multer({ storage: storage }):
  Because we're using ES6 so we can write this "{ storage: storage }" as this "{ storage, }"
  Initializes Multer with the defined storage settings, making it ready to handle file uploads. */