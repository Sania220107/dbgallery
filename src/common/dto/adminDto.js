class  adminDto{
    constructor(admin) {
        this.UserID = admin.UserID;
        this.Username = admin.Username;
        this.Email = admin.Email;
        this.role = admin.role;
    }
}

module.exports = adminDto;