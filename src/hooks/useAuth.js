import React, { useState, useContext, createContext } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import endPoints from '@services/api';

const AuthContext = createContext();

export function ProviderAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const token = Cookie.get('token');
      if (token && !user) {
        axios.defaults.headers.Authorization = `Bearer ${token}`;
        const { data: user } = await axios.get(endPoints.auth.profile);
        setUser(user);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const login = async (email, password) => {
    const config = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    const loginData = {
      email: email,
      password: password,
    };
    const { data: access_token } = await axios.post(endPoints.auth.login, loginData, config);
    const token = access_token.token;
    if (access_token) {
      Cookie.set('token', token, { expires: 5, sameSite: 'Strict' });
      axios.defaults.headers.Authorization = `Bearer ${token}`;
      const { data: user } = await axios.get(endPoints.auth.profile);
      setUser(user);
      // await fetchUser();
    }
  };

  const logout = () => {
    Cookie.remove('token');
    setUser(null);
    delete axios.defaults.headers.Authorization;
    window.location.href = '/login';
  };

  const recoverPassword = async (email) => {
    const config = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post(endPoints.auth.recovery, { email: email }, config);
      return response.status;
    } catch (error) {
      return error.response.status;
    }
  };

  const changePassword = async (token, password) => {
    const config = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    const data = {
      token: token,
      newPassword: password,
    };
    try {
      const response = await axios.post(endPoints.auth.changePassword, data, config);
      return response.status;
    } catch (error) {
      return error.response.status;
    }
  };

  return {
    user,
    fetchUser,
    login,
    logout,
    recoverPassword,
    changePassword,
  };
}
