module.exports.engineering_aspirants_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('cache');
    console.log(req.user);

        res.render('user/aspirants/engineering_aspirants');
    
}

module.exports.entrance_exams_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('cache');
    console.log(req.user);

        res.render('user/aspirants/entrance_exams');
    
}

module.exports.college_rankings_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('cache');
    console.log(req.user);

        res.render('user/aspirants/college_rankings');
    
}

module.exports.explore_branches_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('cache');
    console.log(req.user);
    
        res.render('user/aspirants/explore_branches');
    
}