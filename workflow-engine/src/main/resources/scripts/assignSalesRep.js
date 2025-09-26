// assignSalesRep.ts
console.log("Customer type: " + customerType);
var salesRep = undefined;
switch (customerType) {
  case "vip": {
    salesRep = "vip@acme.org";
    break;
  }
  case "suspended":
  case "inactive": {
    salesRep = null;
    break;
  }
  default: {
    salesRep = "sales@acme.org";
  }
}
execution.setVariable("salesRep", salesRep);

//# debugId=980A3A310AB7C00F64756E2164756E21
//# sourceMappingURL=assignSalesRep.js.map
