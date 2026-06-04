import Icookies from "../cookie/cookie.js"
import { API_BASE } from "../../config.js"

export default class userInfo {

  // Les tokens sont lus à chaque requête (pas dans le constructeur)
  // pour garantir que login/logout mettent bien à jour les appels suivants.
  get token() {
    return Icookies.getCookie('token');
  }

  async getUsername() {
    try {
      const response = await fetch(API_BASE + '/api/profiles/username/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token
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
      const response = await fetch(API_BASE + '/api/profiles/user-info/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token,
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        return data;
      } else {
        throw new Error('Failed to get user info');
      }
    } catch (error) {
      throw error;
    }
  }

  async getID() {
    try {
      const response = await fetch(API_BASE + '/api/token/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token
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
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const response = await fetch(API_BASE + '/api/profiles/all-users/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.token,
        }
      });
      const data = await response.json();
      if (data.success) {
        return data;
      } else {
        throw new Error('Failed to get user info');
      }
    } catch (error) { }
  }
}
