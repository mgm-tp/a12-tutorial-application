declare const customerType: string;
declare const execution: ExecutionEntity;

export declare interface ExecutionEntity {
    getVariable(variableName: string): any;
    setVariable(variableName: string, value: any): void
    // If you want to declare more, see org.cibseven.bpm.engine.impl.persistence.entity.ExecutionEntity
}

console.log("Customer type: " + customerType);

let salesRep = undefined;

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
        salesRep = "sales@acme.org"
    }
}

execution.setVariable("salesRep", salesRep);
