const requestLogger = (req, res, next) => {
  if ((process.env.NODE_ENV !== "test") && (process.env.NODE_ENV !== "production")) {
    console.log('Method:', req.method);
    console.log('Path:  ', req.path);
    console.log('Body:  ', req.body);
    console.log('Params:  ', req.params);
    console.log('Cookies: ', req.cookies);
    console.log('---');
  }
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ message: "Unknown Endpoint" });
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  
  console.error(err.stack);
  
  const message = err.message || 'Something went wrong. Please try again later.';
  res.status(500).json({ message: message });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};