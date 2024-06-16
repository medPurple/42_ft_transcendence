import Icookies from "../cookie/cookie.js"

export default class userInfo {
  constructor() {
    this.jwtToken = Icookies.getCookie('token');
    this.csrfToken = Icookies.getCookie('csrftoken');
  }

  async getUsername() {
    try {
      const response = await fetch('/api/profiles/username/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken,
          'Authorization': this.jwtToken
        }
      });
      const data = await response.json();
      if (data.success) {
        return data.user.username;
      } else {
        throw new Error('Failed to get username');
      }
    } catch (error) { }
  }

  async getAllUserInfo() {
    try {
      const response = await fetch('/api/profiles/user-info/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken,
          'Authorization': this.jwtToken,
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        return data
      } else {
        throw new Error('Failed to get user info');
      }
    } catch (error) {
      throw error;
    }
  }

  async getID() {

    try {
      const response = await fetch('/api/token/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken,
          'Authorization': this.jwtToken
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        return data.data.user_id;
      } else {
        throw new Error('Failed to get user info');
      }
    } catch (error) {
      throw error; // share the error
    }
  }

  async getAllUsers() {
    try {
      const response = await fetch('/api/profiles/all-users/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.csrfToken,
          'Authorization': this.jwtToken,
        }
      });
      const data = await response.json();
      if (data.success) {
        return data
      } else {
        throw new Error('Failed to get user info');
      }
    } catch (error) { }

  }
}
