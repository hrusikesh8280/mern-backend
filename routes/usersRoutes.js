const express = require("express")
const userRoute = express.Router()
const{UserModel} = require("../model/model")





userRoute.get('/api/users', (req, res) => {
  const { maxIncome, carBrand, quoteLength, emailDigit, phonePrice, gender, lastName } = req.query;

  let query = {};

  if (maxIncome) {
    query.income = { $lt: `$${maxIncome}` };
  }

  if (carBrand) {
    query.car = { $in: carBrand.split(',') };
  }

  if (quoteLength) {
    query.quote = { $regex: `^.{${quoteLength},}$` };
  }

  if (emailDigit) {
    query.email = { $not: { $regex: /\d/ } };
  }

  if (phonePrice) {
    const parsedPhonePrice = parseInt(phonePrice);
    if (!isNaN(parsedPhonePrice)) {
      query.phone_price = { $gt: parsedPhonePrice };
    }
  }

  if (gender) {
    query.gender = gender;
  }

  if (lastName) {
    query = {
      $and: [
        { last_name: { $regex: `^M` } },
        { quote: { $regex: `^.{15,}$` } },
        
      ]
    };
  }

  UserModel.find(query)
    .exec()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error retrieving data.");
    });
});

userRoute.get("/api/users/top-cities", async (req, res) => {
  try {
    const result = await UserModel.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 }, totalIncome: { $sum: { $toDouble: { $substr: ["$income", 1, -1] } } } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $group: { _id: "$_id", count: { $first: "$count" }, avgIncome: { $avg: { $divide: [ "$totalIncome", "$count" ] } } } },
      { $sort: { count: -1, avgIncome: -1 } }
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// userRoute.get("/users/male-phone-price-greater-than-10000", async (req, res) => {
//     try {
//         const users = await UserModel.find({
//           gender: "Male",
//           phone_price: { $gt: "10000"},
//         }).lean()
//         users.forEach(user => {
//             user.phone_price = parseInt(user.phone_price);
//           });
  
//       res.status(200).json(users);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Server Error" });
//     }
//   });

//   userRoute.get("/users/last-name-starts-with-m-and-quote-length-greater-than-15", async (req, res) => {
//     try {
//       const users = await UserModel.find({
//         last_name: { $regex: /^M/ },
//         quote: { $exists: true, $regex: /^.{15,}$/ },
//         email: { $regex: new RegExp(req.query.last_name) }
//       }).lean()
  
//       res.status(200).json(users);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Server Error" });
//     }
//   });

//   userRoute.get("/users/bmw-mercedes-audi-no-digit-email", async (req, res) => {
//     try {
//       const users = await UserModel.find({
//         car: { $in: ["BMW", "Mercedes", "Audi"] },
//         email: { $not: /\d/ }
//       }).lean();
  
//       res.status(200).json(users);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Server Error" });
//     }
//   });

//   userRoute.get("/users/top-cities", async (req, res) => {
//     try {
//       const result = await UserModel.aggregate([
//         { $group: { _id: "$city", count: { $sum: 1 }, totalIncome: { $sum: { $toDouble: { $substr: ["$income", 1, -1] } } } } },
//         { $sort: { count: -1 } },
//         { $limit: 10 },
//         { $project: { _id: 0, city: "$_id", count: 1, avgIncome: { $divide: [ "$totalIncome", "$count" ] } } }
//       ]);
//       res.status(200).json(result);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Server Error" });
//     }
//   });

module.exports={userRoute}