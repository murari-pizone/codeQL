const OutletModel = require('../models/outlet_model');

class OutletService {
  constructor() {
    this.OutletModel = new OutletModel(this);
  }

  // single function for all model calls
  async processOutletModelRequest(action, ...data) {
    try {
      const params = data.length > 0 ? data : [];
      return new Promise((resolve, reject) => {
        this.OutletModel[action](...params, (err, result) => {
          if (err) {
            if (err instanceof Error) {
              reject(err);
            } else if (typeof err === 'object') {
              reject(new Error(err.message));
            } else {
              reject(new Error(err.message));
            }
          } else {
            resolve(result);
          }
        });
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async getOutlets(req, key) {
    return this.processOutletModelRequest('getOutlets', req, key);
  }
  async createOutlet(req, key) {
    return this.processOutletModelRequest('createOutlet', req, key);
  }
  async removeOutlet(req, key) {
    return this.processOutletModelRequest('removeOutlet', req, key);
  }
  async GetBranchRegion(req, key) {
    return this.processOutletModelRequest('getRegion', req, key);
  }

  async storeToggle(body) {
    return this.processOutletModelRequest('storeToggle', body);
  }
}

module.exports = OutletService;

//     return new Promise((resolve, reject) => {
//         outletModel.getOutlets(req,key,(err, result) => {
//             if (err) {
//                 if (err instanceof Error) {
//                     reject(err);
//                 } else if (typeof err === 'object') {
//                     reject(new Error(err.message));
//                 } else {
//                     reject(new Error((err.message)));
//                 }
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// };
// exports.getOutletsByJob = async ( ) => {
//   return new Promise((resolve, reject) => {
//       outletModel.getOutletsByJob((err, result) => {
//         if (err) {
//             if (err instanceof Error) {
//                 reject(err);
//             } else if (typeof err === 'object') {
//                 reject(new Error(err.message));
//             } else {
//                 reject(new Error((err.message)));
//             }
//         } else {
//             resolve(result);
//         }
//       });
//   });
// };
// exports.insertData = async (res ) => {

//   return new Promise((resolve, reject) => {

//       outletModel.insertData(res,(err, result) => {
//         if (err) {
//             if (err instanceof Error) {
//                 reject(err);
//             } else if (typeof err === 'object') {
//                 reject(new Error(err.message));
//             } else {
//                 reject(new Error((err.message)));
//             }
//         } else {
//             resolve(result);
//         }
//       });
//   });
// };
// exports.insertMenu = async (res ) => {

//     return new Promise ((resolve, reject) => {

//         outletModel.insertMenu(res,(err, result) => {
//             if (err) {
//                 if (err instanceof Error) {
//                     reject(err);
//                 } else if (typeof err === 'object') {
//                     reject(new Error(err.message));
//                 } else {
//                     reject(new Error((err.message)));
//                 }
//             } else {
//                 resolve(result);
//             }
//         });
//     });
//  };
