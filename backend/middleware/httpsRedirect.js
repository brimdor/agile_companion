function httpsRedirect(req, res, next) {
    // Check if the request is not secure
    if (!req.secure) {
      // Redirect to the HTTPS version of the URL
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    // Proceed to the next middleware or route handler
    next();
  }
  
  module.exports = httpsRedirect;
  