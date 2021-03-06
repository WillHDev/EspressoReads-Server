"use strict";

require("dotenv").config();
module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "mongodb://WebUser:shadow8@ds013966.mlab.com:13966/headshuttle",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "mongodb://WebUser:shadow8@ds237563.mlab.com:37563/headshuttletest",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "60m",
  JWT_SECRET: process.env.JWT_SECRET
  // DATABASE_URL:
  //     process.env.DATABASE_URL || 'postgres://localhost/thinkful-backend',
  // TEST_DATABASE_URL:
  //     process.env.TEST_DATABASE_URL ||
  //     'postgres://localhost/thinkful-backend-test'
};
