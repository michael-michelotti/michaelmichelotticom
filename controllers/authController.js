const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let pwHash;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    pwHash = req.headers.authorization.split(' ')[1];
  }

  if (!pwHash) {
    return next(
      new AppError('You are not authorized to access this route!', 403)
    );
  }

  const verified = await bcrypt.compare(process.env.AUTH_PASSWORD, pwHash);

  if (!verified) return next(new AppError('Your password is incorrect!', 401));

  next();
});