class UserService {}

// exposing a singleton userservice across all controllers and middlewares
export default new UserService()