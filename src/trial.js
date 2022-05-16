getUserRole("urvik","admin")
function getUserRole(name,role){

    switch (role) {
        case "admin":
            return `${name} is allowed to access all things`
            break;
        case "student":
            return `${name} is allowed to access the content`
            break;
        case "faculty":
            return `${name} is allowed to access create and delete the data`
            break;
        default:
            break;
    }
}
