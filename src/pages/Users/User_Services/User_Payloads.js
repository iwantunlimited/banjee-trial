const customerFilter = {
        "keywords":null,
        "toDate":null,
        "fromDate":null,
        "userType":0,
        "city":null,
        inactive:false
        // domain: this.decodeToken.domain
};

const userInteractionFilter = {
        "userId" :"",
        "objectType": "PRODUCT",
        "interactionType" : "",
        "ageInDays" : "1",
        "startDate" : null,
        "finishDate" : null,
        "objectId" : null,
        "objectCode" : null
};

export {
    customerFilter,
    userInteractionFilter
}