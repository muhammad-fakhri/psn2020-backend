let {encrypt, decrypt} = require('./routes/Midleware/PaymentEncription');
let cid = '00298'; //from BNI
let sck = '787b175aeb54a1e133fb71b5d2ebe11d'; //from BNI
let two_hours = new Date(+new Date() + 2 * 3600 * 1000);
let data = {
    // type : "createbilling",
    // trx_amount : 100000,
    // customer_name : "David",
    // customer_email : "david@example.com",
    // customer_phone : "08123456781011",
    // description : "Test Create Billing",
    trx_id : "5d6be8dd88ef6c50d4fb38c6",
    virtual_account : "9880029820660051",
    // billing_type : "c",
    // client_id : cid,
    // datetime_expired : two_hours.toISOString()
};
let encrypted_string = encrypt(data,cid,sck);
let parsed_string = decrypt("TBobGVMZHBtIT0hgBgdcFUBMSUFUCRZ4IlUVdkpVGkdKHlckRBocJkx7Q0xRegNBBWJUCAZeSwZEdUcBCQpPVz8pCiBMIh8VQ1BTHh1BG04fExU6RxFEB1oRWQJ3CUlXdVRPElQDOjRbazIWBl5bdk5GU380EwUPXwxBeAgMVk8KEioJQxomIkFFRBAYM1F4Y1hIBAhPSn9UC1kRNE8FG1MdHRlLGQkRNQEPUll_SxFKWUp-CkhaAVMKVnR1C1hWAl0TKTQSICRORUIXD0UDBURlWHsAXUkIWXYGWDxIERpQHxoJQAxTRgV8D1ZRdkIOSlxQfQljA0wJTxpGS0QaIUEXIBBLFiEaTFdDFQhGC3lCWVESe1RIel11WwQAC1VAf2NfH0gTIQ9LN0YeHUoORyIYE0xoIR5MGEglTkJAEyFWFxgLGA",cid,sck);

console.log({
    "client_id":cid,
    "data":encrypted_string
});
console.log(parsed_string);