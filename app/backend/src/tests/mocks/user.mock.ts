import User from "../../database/models/User"

const userMock = {
    id: 1,
    username: 'user example',
    password: 'xablaupass',
    role: 'admin',
    email: 'user@email.com'
}

const users = [
    {
      id: 1,
      username: 'Admin',
      role: 'admin',
      email: 'admin@admin.com',
      password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
    },
    {
      id: 2,
      username: 'User',
      role: 'user',
      email: 'user@user.com',
      password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO'
    }
  ]

export default { 
    userMock,
    users
}
