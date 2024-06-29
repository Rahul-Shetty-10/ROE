module.exports.engineering_students_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('cache');
    console.log(req.user);

    res.render('user/students/engineering_students');
}

module.exports.placement_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('cache');
    console.log(req.user);
        res.render('user/students/placement');
    
}

module.exports.higher_study_guidance_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('cache');
    console.log(req.user);

        res.render('user/students/higher_study_guidance');
    
}

module.exports.workshops_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('cache');
    console.log(req.user);

        res.render('user/students/workshops');
    
}