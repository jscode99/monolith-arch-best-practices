class UserService {
  async LogIn(userData) {
    const { username, password } = userData;
    return { username, password };
  }
}

module.exports = UserService;