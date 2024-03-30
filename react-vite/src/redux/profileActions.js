const SET_USER_PROFILE = 'profile/setUserProfile';

export const setUserProfile = (profile) => ({
  type: SET_USER_PROFILE,
  payload: profile
});

export const fetchUserProfile = () => async (dispatch) => {
  try {
    const response = await fetch('/profile/user');
    if (response.ok) {
      const data = await response.json();
      dispatch(setUserProfile(data));
    } else {
      console.error('Error fetching user profile: Response not OK');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};
