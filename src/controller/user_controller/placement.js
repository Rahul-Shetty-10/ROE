const db = require('../../db/db');
const path = require('path');
const fs = require('fs');

// Define the path to the upload directory directly
const uploadDir = path.join(__dirname, '..', '..', '..', 'public', 'Payment_Screenshots');

module.exports.placement_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('cache');
    console.log(req.user);

        res.render('user/students/placement');
    
}

module.exports.placement = async (req, res) => {

    console.log(req.file);

    const email = req.user.email;
    const { FirstName, LastName, Phone, DOB, Gender, University, College, Branch, Semester } = req.body;
    
    const Payment_Screenshot = req.file ? req.file.filename : null;

    db.query(
        'INSERT INTO Placement (Email, FirstName, LastName, Phone, DOB, Gender, University, College, Branch, Semester, Payment_Screenshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [email, FirstName, LastName, Phone, DOB, Gender, University, College, Branch, Semester, Payment_Screenshot], 
        function (error, results, fields) {
            if (error) {
                console.error('Error inserting profile:', error);
                
                // Delete the uploaded image file if there is an error
                if (req.file) {
                    const imagePath = path.join(uploadDir, req.file.filename);
                    fs.unlinkSync(imagePath);
                }

                return res.render('user/error500');
            }

            db.query(
                'UPDATE Profile SET FirstName = ?, LastName = ?, Phone = ?, DOB = ?, Gender = ?, University = ?, College = ?, Branch = ?, Semester = ? WHERE Email = ?', 
                [FirstName, LastName, Phone, DOB, Gender, University, College, Branch, Semester, email], 
                function (updateError, updateResults, updateFields) {
                    if (updateError) {
                        console.error('Error updating profile in Profile table:', updateError);
                        return res.status(500).json({ error: "Internal server error" });
                    }

                    res.redirect('/placement');
                });
            
        });
}
