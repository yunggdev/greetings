require("dotenv").config();

const express = require("express");
const cors = require("cors");
const supabase = require("@supabase/supabase-js");
const multer = require("multer");

const app = express();

const upload = multer({
    storage: multer.memoryStorage()
});


// ===============================
// ENVIRONMENT VARIABLES
// ===============================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

const PORT = process.env.PORT || 3211;


// ===============================
// VALIDATE ENV
// ===============================

if (!SUPABASE_URL) {
    throw new Error("SUPABASE_URL belum diatur");
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY belum diatur"
    );
}


// ===============================
// CORS
// ===============================

const allowedOrigins = [
    "http://localhost:4321",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins
    })
);


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());


// ===============================
// SUPABASE
// ===============================

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
);


// ===============================
// GET IMAGE DATA
// ===============================

app.get("/", async (request, response) => {

    try {

        const getData =
            await db
                .from("image")
                .select();

        console.log(getData);

        response.json({
            getData
        });

    } catch (error) {

        console.error(error);

        response.status(500).json({
            error: error.message
        });

    }

});


// ===============================
// UPLOAD IMAGE
// ===============================

app.post(
    "/upload",
    upload.single("image"),
    async (request, response) => {

        try {

            if (!request.file) {

                return response.status(400).json({
                    error: "Image tidak ditemukan"
                });

            }


            const file = request.file;


            const fileName =
                `photobooth-${Date.now()}.jpg`;


            // ===============================
            // UPLOAD TO SUPABASE STORAGE
            // ===============================

            const {
                error: uploadError
            } =
                await db
                    .storage
                    .from("images")
                    .upload(
                        fileName,
                        file.buffer,
                        {
                            contentType: file.mimetype,
                            upsert: false
                        }
                    );


            if (uploadError) {

                console.error(uploadError);

                return response.status(500).json({
                    error: uploadError.message
                });

            }


            // ===============================
            // GET PUBLIC URL
            // ===============================

            const {
                data: publicUrlData
            } =
                db
                    .storage
                    .from("images")
                    .getPublicUrl(fileName);


            const img_url =
                publicUrlData.publicUrl;


            // ===============================
            // INSERT TO DATABASE
            // ===============================

            const {
                data,
                error
            } =
                await db
                    .from("image")
                    .insert({
                        img_url
                    })
                    .select()
                    .single();


            if (error) {

                console.error(error);

                return response.status(500).json({
                    error: error.message
                });

            }


            // ===============================
            // SUCCESS
            // ===============================

            response.status(201).json({

                message:
                    "Image berhasil disimpan",

                data

            });


        } catch (error) {

            console.error(error);

            response.status(500).json({
                error: error.message
            });

        }

    }
);


// ===============================
// LOCAL DEVELOPMENT
// ===============================

if (require.main === module) {

    app.listen(PORT, () => {

        console.log(
            `Server running on port ${PORT}`
        );

    });

}


// ===============================
// EXPORT FOR VERCEL
// ===============================

module.exports = app;










// const express = require("express")
// const cors = require("cors");
// const supabase = require("@supabase/supabase-js")

// const multer = require("multer");

// const upload = multer({
//     storage: multer.memoryStorage()
// });

// const app = express()
// app.use(cors({
//     origin: "http://localhost:4321"
// }));
// app.use(express.json())
// const PORT = 3211


// const SUPABASE_URL = "https://wndcxgfqxgrsgzidzfxk.supabase.co"
// const SUPABASE_SERVICE_ROLL = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZGN4Z2ZxeGdyc2d6aWR6ZnhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzczNjM0MCwiZXhwIjoyMTAzMzEyMzQwfQ.1HsfB9ri-FoB_LuSjdBt1Z65HCYKo_Ebx3cTm-jflRU"

// const db = supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLL)


// app.get("/", async (request, response) => {
//     const getData = await db.from("image").select()
//     console.log(getData)
//     response.json({ getData })
// })

// app.post("/upload", upload.single("image"), async (request, response) => {
//     try {
//         if (!request.file) {
//             return response.status(400).json({
//                 error: "Image tidak ditemukan"
//             });
//         }

//         const file = request.file;

//         const fileName =
//             `photobooth-${Date.now()}.jpg`;

//         const { error: uploadError } =
//             await db.storage
//                 .from("images")
//                 .upload(
//                     fileName,
//                     file.buffer,
//                     {
//                         contentType: file.mimetype,
//                         upsert: false
//                     }
//                 );

//         if (uploadError) {
//             console.error(uploadError);

//             return response.status(500).json({
//                 error: uploadError.message
//             });
//         }

//         const { data: publicUrlData } =
//             db.storage
//                 .from("images")
//                 .getPublicUrl(fileName);

//         const img_url =
//             publicUrlData.publicUrl;

//         const { data, error } =
//             await db
//                 .from("image")
//                 .insert({
//                     img_url
//                 })
//                 .select()
//                 .single();

//         if (error) {
//             console.error(error);

//             return response.status(500).json({
//                 error: error.message
//             });
//         }

//         response.status(201).json({
//             message: "Image berhasil disimpan",
//             data
//         });

//     } catch (error) {

//         console.error(error);

//         response.status(500).json({
//             error: error.message
//         });

//     }
// }
// );


// app.listen(PORT, () => {
//     console.log("server running on port ", PORT)
// })