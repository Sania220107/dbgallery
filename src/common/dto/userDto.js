class userDto {
  constructor(user) {
    this.UserID = user.UserID;
    this.Username = user.Username;
    this.Email = user.Email;
    this.Alamat = user.Alamat;
    this.Profile = user.Profile;
  }
}

module.exports = userDto;
